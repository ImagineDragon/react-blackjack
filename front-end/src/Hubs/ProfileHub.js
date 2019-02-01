import {Component} from 'react'

import {history} from '../store/history'

import { hubConnection } from 'signalr-no-jquery';

import {connect} from 'react-redux'

import {getUserProfile,
        onConnected,
        onNewUserConnected,
        onUserDisconnected,
        onUserReady,
        setActivePlayer} from '../store/actions/playTable'

export const connection = hubConnection('http://localhost:3001'), playHubProxy = connection.createHubProxy('playHub');

class ProfileConnection extends Component{
    componentDidMount(){
        const userId = parseInt(localStorage.getItem('userId'));
        
        this.props.getUserProfile(userId);

        playHubProxy.on('onConnected', function(profiles){
            console.log('Connected');
            this.props.onConnected(profiles);
        }.bind(this));

        playHubProxy.on('onNewUserConnected', function(newUser){
            console.log('New user')
            var users = this.props.users;
            var index = users.indexOf(newUser);
            if(index === -1){
                this.props.onNewUserConnected(newUser);
            }
        }.bind(this));

        playHubProxy.on('onUserDisconnected', function(profile){
            if(connection != null){
                console.log('User disconnected')
                this.props.onUserDisconnected(profile);
            }
        }.bind(this));

        playHubProxy.on('onUserReady', function(profile){
            this.props.onUserReady(profile);
        }.bind(this));

        playHubProxy.on('onGameAccept', function(profile){
            localStorage.setItem('enemyId', profile.id);
            this.props.setActivePlayer(profile.id);
            playHubProxy.invoke("ready", localStorage.getItem('userId'), false);
            history.push('/play');
        }.bind(this));
        
        connection.start().done(function(){
            playHubProxy.invoke('connect', userId);
            console.log('userId ', userId);
        });
    }

    componentWillUnmount(){
        playHubProxy.off('onConnected');
        playHubProxy.off('onNewUserConnected');
        playHubProxy.off('onUserDisconnected');
        playHubProxy.off('onUserReady');
        playHubProxy.off('onGameAccept');
    }

    render(){
        return null;
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
        getUserProfile: (userId) => dispatch(getUserProfile(userId)),
        onConnected: (profiles) => dispatch(onConnected(profiles)),
        setActivePlayer: (id) => dispatch(setActivePlayer(id)),
        onNewUserConnected: (newUser) =>dispatch(onNewUserConnected(newUser)),
        onUserDisconnected: (profile) =>dispatch(onUserDisconnected(profile)),
        onUserReady: (profile) =>dispatch(onUserReady(profile))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnection)