import React, {Component} from 'react'
import {connect} from 'react-redux'
import classes from './Profile.css'
import {Redirect} from 'react-router-dom'
import Button from '../../components/UI/Button/Button'

import {setActivePlayer} from '../../store/actions/playTable'

import Users from '../../components/UI/UsersList/UsersList'

import ProfileConnection, {connection, playHubProxy} from '../../Hubs/ProfileHub'

class Profile extends Component{
    state = {
        isLogout: false,
        ready: false
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
        if(localStorage.getItem('userId') === null){
            this.isLogout();
        }
        localStorage.setItem('enemyId', -1);
    }

    componentWillUnmount(){
    }

    acceptGame = (e) => {
        localStorage.setItem("enemyId", e.target.id);
        if(this.state.ready){
            this.readyState();
        }
        this.props.setActivePlayer(parseInt(localStorage.getItem('userId')));
        playHubProxy.invoke("acceptGame", localStorage.getItem('userId'), localStorage.getItem("enemyId"));
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
                    <ProfileConnection/>
                    <div>
                        <h1>{this.props.user.name}</h1>
                        <hr />
                        <p>
                            <b>Почта: </b><em>{this.props.user.email}</em><br />
                            <b>Счет: </b><em>{this.props.user.cash}</em><br />
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
                            Count={this.props.count}
                            onClick={this.acceptGame}
                            Users={this.props.users}
                        />
                    </div>
                </div>
            )   
        }
             
    }
}

function mapStateToProps(state) {
    const { count, users, user } = state.playTable;
    return {
        count, users, user
    };
}

function mapDispatchToProps(dispatch){
    return{
        setActivePlayer: (id) => dispatch(setActivePlayer(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)