import { Component } from 'react'

import { history } from '../store/history'

import { hubConnection } from 'signalr-no-jquery';

import { connect } from 'react-redux'

import { scrollDown } from '../components/UI/Chat/Chat'

import { onGameStart,
        onBet,
        onEnemyBet,
        onMessage,
        onTimer,
        setActivePlayer,
        onPlayWithUserHandler,
        enemyDibsBet,
        enemyGetCard,
        gameResult } from '../store/actions/playTable'

export const connection = hubConnection('http://localhost:3001'), playHubProxy = connection.createHubProxy('playHub');

class PlayConnection extends Component{
    componentDidMount(){
        const userId = parseInt(localStorage.getItem('userId'));
        const enemyId = parseInt(localStorage.getItem('enemyId'));

        playHubProxy.on('onGameStart', function(user, enemy, messages){
            this.props.onGameStart(user, enemy, messages);
            scrollDown();
        }.bind(this));

        playHubProxy.on('onEnemyBet', function(enemy, dibsBet){
            this.props.enemyDibsBet(dibsBet);
            this.props.onEnemyBet(enemy);
        }.bind(this));

        playHubProxy.on('onBet', function(user){                  
            this.props.onBet(user);
        }.bind(this));

        playHubProxy.on('onStopGame', function(){
            history.push('/profile');
        });

        playHubProxy.on('onMessage', function(message){
            this.props.onMessage(message);
            scrollDown();
        }.bind(this));

        playHubProxy.on('onPlayOffer', function(isBet){
            if(this.props.user.enoughCards){
                playHubProxy.invoke('gameResult');
            } else {
                this.props.setActivePlayer(userId, isBet);
                if(!isBet && this.props.user.playerHandSum === 0) {
                    this.props.onPlayWithUserHandler();
                }
            }
        }.bind(this));

        playHubProxy.on('onTimer', function(time){
            this.props.onTimer(time);
        }.bind(this));

        playHubProxy.on('onEnemyGetCard', function(){
            this.props.enemyGetCard();
        }.bind(this));

        playHubProxy.on('onGameResult', function(enemyHand, enemyHandSum){
            console.log('gameResult',enemyHand,enemyHandSum);
            this.props.gameResult(enemyHand, enemyHandSum);
        }.bind(this));

        if(enemyId !== -1){
            connection.start().done(function(){
                console.log('start game');
                playHubProxy.invoke('gameStart', userId);
            });
        }
    }

    componentWillUnmount(){
        playHubProxy.off('onGameStart');
        playHubProxy.off('onEnemyBet');
        playHubProxy.off('onBet');
        playHubProxy.off('onStopGame');
        playHubProxy.off('onMessage');
        playHubProxy.off('onPlayOffer');
        playHubProxy.off('onTimer');
        playHubProxy.off('onEnemyGetCard');
        playHubProxy.off('onGameResult');
    }

    render(){
        return null;
    }
}

function mapStateToProps(state) {
    const { user } = state.playTable;
    return {
        user
    };
}

function mapDispatchToProps(dispatch){
    return{
        onGameStart: (user, enemy, messages) => dispatch(onGameStart(user, enemy, messages)),
        onMessage: (message) => dispatch(onMessage(message)),
        setActivePlayer: (id, isBet) => dispatch(setActivePlayer(id, isBet)),
        onPlayWithUserHandler: () => dispatch(onPlayWithUserHandler()),
        onBet: (user) => dispatch(onBet(user)),
        onEnemyBet: (enemy) => dispatch(onEnemyBet(enemy)),
        enemyDibsBet: (value) => dispatch(enemyDibsBet(value)),
        onTimer: (time) => dispatch(onTimer(time)),
        enemyGetCard: () => dispatch(enemyGetCard()),
        gameResult: (enemyHand, enemyHandSum) => dispatch(gameResult(enemyHand, enemyHandSum))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayConnection)