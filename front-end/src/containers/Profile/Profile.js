import React, {Component} from 'react'
import classes from './Profile.css'
import {NavLink, Redirect} from 'react-router-dom'
import Button from '../../components/UI/Button/Button'
import axios from 'axios';

import Users from '../../components/UI/UsersList/UsersList'

//import $ from 'jquery';
import StartConnection, {connection, playHubProxy} from '../../Hubs/Hubs'
//import { hubConnection } from 'signalr-no-jquery';

var setCount = 0;

class Profile extends Component{
    state = {
        isLogout: false,
        bet: '',
        name: '',
        email: '',
        count: 0,
        ready: false,
        users: []
    }

    isLogout = () => {
        localStorage.removeItem('userId');
        this.setState({
            isLogout: true
        });
        connection.stop();
        console.log('stop');
    }

    componentDidMount(){
        localStorage.removeItem('playerHand');
        localStorage.removeItem('dealerHand');
        localStorage.removeItem('playerHandSum');
        localStorage.removeItem('dealerHandSum');

        localStorage.removeItem('bet');
        localStorage.removeItem('cash');
        localStorage.removeItem('dibsBet');
        localStorage.removeItem('enemyDibsBet');
        localStorage.removeItem('timer');
        localStorage.removeItem('name');

        localStorage.setItem('enemyId', -1);
        const userId = localStorage.getItem('userId');
        this.getDataUser(userId);

        playHubProxy.on('onConnected', function(profiles){
            console.log('Connected');
            setCount = profiles.length;
            this.setState({
                users: profiles,
                count: setCount
            });
        }.bind(this));

        playHubProxy.on('onNewUserConnected', function(newUser){
            console.log('New user')
            var users = this.state.users;
            var index = users.indexOf(newUser);
            if(index == -1){
                users.push(newUser);
                setCount++;
            }
            this.setState({
                users: users,
                count: setCount
            });
        }.bind(this));

        playHubProxy.on('onUserDisconnected', function(profile){
            if(connection != null){
                console.log('User disconnected')
                setCount--;
                var users = this.state.users;
                for(var i = 0; i < users.length; i++){
                    if(users[i].id === profile.id){
                        users.splice(i, 1);
                        break;
                    }
                }     
                this.setState({
                    users: users,
                    count: setCount
                });
            }
        }.bind(this));

        if(connection.state === 4){
            StartConnection(userId);
        }

        playHubProxy.on('onUserReady', function(profile){
            var users = this.state.users;
            for(var i = 0; i < users.length; i++){
                if(users[i].id === profile.id){
                    users[i] = profile;
                    break;
                }
            }
            this.setState({
                users: users,
                count: setCount
            });
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
                        <Users
                            Count={this.state.count}
                            onClick={this.acceptGame}
                            Users={this.state.users}
                        />
                    </div>
                </div>
            )   
        }
             
    }
}

export default Profile