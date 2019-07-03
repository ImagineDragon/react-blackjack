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

export const connection = hubConnection('http://localhost:3001/'), playHubProxy = connection.createHubProxy('playHub'); //http://blackjackwebapitest.us-west-2.elasticbeanstalk.com http://localhost:3001

class ProfileConnection extends Component{
    componentDidMount(){
        const userId = parseInt(localStorage.getItem('userId'));
        
        this.props.getUserProfile();

        playHubProxy.on('onConnected', function(profiles){
            this.props.onConnected(profiles);
        }.bind(this));

        playHubProxy.on('onNewUserConnected', function(newUser){
            var users = this.props.users;
            var index = users.indexOf(newUser);
            if(index === -1){
                this.props.onNewUserConnected(newUser);
            }
        }.bind(this));

        playHubProxy.on('onUserDisconnected', function(profile){
            if(connection != null){
                this.props.onUserDisconnected(profile);
            }
        }.bind(this));

        playHubProxy.on('onUserReady', function(profile){
            this.props.onUserReady(profile);
        }.bind(this));

        playHubProxy.on('onGameAccept', function(profile){
            localStorage.setItem('enemyId', profile.id);
            this.props.setActivePlayer(profile.id, true, 3);
            playHubProxy.invoke("ready", localStorage.getItem('userId'), false);
            history.push('/play');
        }.bind(this));
        
        connection.start({ transport: 'serverSentEvents' }).done(function(){
            playHubProxy.invoke('connect', userId);
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
        getUserProfile: () => dispatch(getUserProfile()),
        onConnected: (profiles) => dispatch(onConnected(profiles)),
        setActivePlayer: (id, isBet, betCount) => dispatch(setActivePlayer(id, isBet, betCount)),
        onNewUserConnected: (newUser) =>dispatch(onNewUserConnected(newUser)),
        onUserDisconnected: (profile) =>dispatch(onUserDisconnected(profile)),
        onUserReady: (profile) =>dispatch(onUserReady(profile))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnection)