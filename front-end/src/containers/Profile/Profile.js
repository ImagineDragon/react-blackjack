import React, {Component} from 'react'
import classes from './Profile.css'
import {NavLink, Redirect} from 'react-router-dom'
import Button from '../../components/UI/Button/Button'
import axios from 'axios';

//import $ from 'jquery';
import StartConnection, {connection, playHubProxy} from '../../Hubs/Hubs'
//import { hubConnection } from 'signalr-no-jquery';

var renderOutput = [];

var setCount = 0;

class Profile extends Component{
    state = {
        isLogout: false,
        bet: '',
        name: '',
        email: '',
        count: 0,
        ready: false
    }

    UsersList = (props) =>{
        renderOutput = [];
        for( var i = 0; i < props.length; i++ ){
            if(props[i].id === localStorage.getItem('userId')){
                renderOutput.push(<div key = {props[i].id} > <b>{props[i].name}</b> </div>);
            } else {
                renderOutput.push(
                    <div key = {props[i].id} > 
                        {props[i].name} 
                        {props[i].ready ? <Button type='success' id={props[i].id} onClick={this.acceptGame.bind(this)}>Играть</Button> : null}
                    </div>);
            }
        }
    }
    NewUser = (props) =>{
        renderOutput.push(
            <div key = {props.id} > 
                {props.name} 
                {props.ready ? <Button type='success' id={props.id} onClick={this.acceptGame.bind(this)}>Играть</Button> : null}
            </div>);
    }
    UserDisconnect = (props) =>{
        for( var i = 0; i < renderOutput.length; i++){ 
            if ( renderOutput[i].key === props.id ) {
                renderOutput.splice(i, 1); 
            }
        }
    }
    UserReady = (props) =>{
        for( var i = 0; i < renderOutput.length; i++){ 
            if ( renderOutput[i].key === props.id ) {
                renderOutput[i] = 
                    <div key = {props.id} > 
                        {props.name} 
                        {props.ready ? <Button type='success' id={props.id} onClick={this.acceptGame.bind(this)}>Играть</Button> : null}
                    </div>; 
            }
        }
    }

    isLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('enemyId');
        this.setState({
            isLogout: true
        });        
        console.log('Disconnected');
        connection.stop();
    }

    componentDidMount(){
        localStorage.setItem('enemyId', -1);
        const userId = localStorage.getItem('userId');
        this.getDataUser(userId);

        function sss(){
            this.setState({
                count: setCount
            });
        };
        sss = sss.bind(this);

        playHubProxy.on('onConnected', function(profiles){
            console.log('Connected')
            this.UsersList(profiles);
            setCount = profiles.length;
            sss();
        }.bind(this));

        playHubProxy.on('onNewUserConnected', function(newUser){
            console.log('New user')
            setCount++;
            this.NewUser(newUser);
            sss();
        }.bind(this));
        playHubProxy.on('onUserDisconnected', function(profile){
            if(connection != null){
                console.log('User disconnected')
                setCount--;
                this.UserDisconnect(profile);
                sss();
            }
        }.bind(this));
        if(connection.state === 4){
            StartConnection(userId);
        } else {
            sss();
        }

        playHubProxy.on('onUserReady', function(profile){
            this.UserReady(profile);
            sss()
        }.bind(this));

        playHubProxy.on('onGameAccept', function(profile){
            localStorage.setItem('enemyId', profile.id);
            this.readyState();
            //connection.stop();
            this.props.history.push('/play');
        }.bind(this));
    }

    componentWillUnmount(){
        playHubProxy.off('onConnected');
        playHubProxy.off('onNewUserConnected');
        playHubProxy.off('onUserDisconnected');
        playHubProxy.off('onUserReady');
        playHubProxy.off('onGameAccept');
    }

    getDataUser = async (userId)=>{
        const data = {
            userId: userId  
        }
        const respons = await axios.post('http://localhost:3001/profile', data);
        if(respons.data){
            this.setState({
                isLogout: false,
                bet: respons.data.bet,
                name: respons.data.name,
                email: respons.data.email
            })
        } else this.setState({isLogout: true});
    }

    acceptGame = (e) => {
        localStorage.setItem("enemyId", e.target.id);
        if(this.state.ready){
            this.readyState();
        }
        playHubProxy.invoke("acceptGame", localStorage.getItem('userId'), localStorage.getItem("enemyId"));
        //connection.stop();
        this.props.history.push('/play');
    }

    playWithBot = () => {
        if(this.state.ready){
            this.readyState();
        }
        this.props.history.push('/play');
    }

    readyState = () => {
        playHubProxy.invoke("ready", localStorage.getItem('userId'), !this.state.ready);
        this.setState({
            ready: !this.state.ready
        });
    }

    render(){
        if(this.state.isLogout){
            return (<Redirect to='/' />)
        }else{
            return(
                <div className={classes.Profile}>
                    <div>
                        <h1>{this.state.name}</h1>
                        <hr />
                        <p>
                            <b>Почта: </b><em>{this.state.email}</em><br />
                            <b>Счет: </b><em>{this.state.bet}</em><br />
                        </p>
                        <hr />
                        <div className={classes.Buttons}>
                            <Button
                                type="success" 
                                onClick={this.playWithBot} 
                            >Играть с ботом</Button>
                            <Button 
                                type={this.state.ready ? "notReady" : "success"} 
                                onClick={this.readyState} 
                            >{this.state.ready ? "Не готов" : "Готов"}</Button>
                            <Button
                                type="error"
                                onClick={this.isLogout} 
                            >Выход</Button>
                        </div>
                        <hr />
                        <div>
                            Users online: {this.state.count}
                            <div className={classes.UsersList}>                                
                                {renderOutput}
                            </div>
                        </div>                         
                    </div>
                </div>
            )   
        }
             
    }
}

export default Profile