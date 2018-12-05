import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import classes from './PlayTable.css'
import Dibs from '../../components/Dibs/DIbs'
import Rate from '../../components/Rate/Rate'
import Enemy from '../../components/Enemy/Enemy'
import PlayButton from '../../components/UI/PlayButton/PlayButton'
import Button from '../../components/UI/Button/Button'
import DealerHand from '../../components/DealerHand/DealerHand'
import PlayerHand from '../../components/PlayerHand/PlayerHand'
import {fetchMakeBet, 
        onPlayHandler,
        onEnoughHandler,
        onMoreHandler,
        getDataUser} from '../../store/actions/playTable'

import Chat, {scrollDown} from '../../components/UI/Chat/Chat'
import {connection, playHubProxy} from '../../Hubs/Hubs'

var userId;
var enemyId;

class PlayTable extends Component {
    state = {
        isLogout: false,
        bet: 0,
        cash: 0,
        enemyName: '',
        enemyBet: 0,
        enemyCash: 0,
        messages: []
    }

    isLogout = () => {
        localStorage.removeItem('userId');
        this.setState({
            isLogout: true
        });
        connection.stop();
        console.log('stop');
    }
    
   onCreateDibHandler = value =>{   
        let div = document.createElement('div');
        switch(value){
            case '1':
                div.className = classes.dib_1 
                break;
            case '5':
                div.className = classes.dib_5
                break;
            case '25':
                div.className = classes.dib_25
                break;
            case '50':
                div.className = classes.dib_50
                break;
            case '100':
                div.className = classes.dib_100
                break;
            default:
                div.className = classes.dib_200
        }        
        div.innerHTML = value;
        let bet = 0;
        let cash;
        if(localStorage.getItem('enemyId') != -1){
            bet = (this.state.bet) + parseInt(value);
            cash = (this.state.cash) - parseInt(value);
            console.log('userBet');
            playHubProxy.invoke('userBet', cash, bet, localStorage.getItem('enemyId'));
        } else {
            if(localStorage.getItem('bet') != null){
                bet = parseInt(localStorage.getItem('bet')) + parseInt(value);
                cash = parseInt(localStorage.getItem('cash')) - parseInt(value);
            } else{
                bet += parseInt(value);
                cash = (parseInt(this.props.cash)) - parseInt(value);
            }
            localStorage.setItem('bet', bet);
            localStorage.setItem('cash', cash);
            this.setState({
                bet: bet,
                cash: cash
            });
        }
        console.log('state bet ' + this.state.bet);
        console.log('props cash ' + this.props.cash);
        console.log('props bet ' + this.props.bet);
        console.log('bet ' + bet);
        if(bet !== 0 && cash >= 0 && this.props.playerHandSum === 0){
            let isPlay = true;
            this.props.fetchMakeBet(bet, cash, isPlay);
            document.getElementById('dibsBet').appendChild(div);
            localStorage.setItem('dibsBet', document.getElementById('dibsBet').innerHTML);
        }
    }

    componentDidMount(){
        userId = localStorage.getItem('userId');
        enemyId = localStorage.getItem('enemyId');
        
        if(localStorage.getItem('dibsBet') != null){
            document.getElementById('dibsBet').innerHTML = (localStorage.getItem('dibsBet'));
        }

        console.log('user = ' + userId + ' enemy = ' + enemyId);

        if(userId == null){
            this.setState({
            isLogout: true
        });
        } else {
            this.setState({
                isLogout: false
            });
        }
        this.props.getDataUser(userId);

        if(localStorage.getItem('bet') != null){
            this.setState({
                bet: localStorage.getItem('bet'),
                cash: localStorage.getItem('cash')
            });
        }

        playHubProxy.on('onGameStart', function(user, enemy){
            this.setState({
                cash: user.cash,
                bet: user.bet,
                enemyName: enemy.name,
                enemyCash: enemy.cash,
                enemyBet: enemy.bet
            });
        }.bind(this));

        playHubProxy.on('onEnemyBet', function(enemy){
            this.setState({
                enemyCash: enemy.cash,
                enemyBet: enemy.bet
            });
        }.bind(this));

        playHubProxy.on('onBet', function(user){                    
            this.setState({                    
                cash: user.cash,
                bet: user.bet
            });
        }.bind(this));

        playHubProxy.on('onStopGame', function(){
            this.props.history.push('/profile');
        }.bind(this));

        playHubProxy.on('onMessage', function(message){
            this.setState({
                messages: [...this.state.messages, message]
            });
            scrollDown();
        }.bind(this));

        if(enemyId != -1){
            connection.start().done(function(){
                console.log('start game');
                playHubProxy.invoke('gameStart', userId, enemyId);
            }.bind(this));
        }
    }

    componentWillUnmount(){
        this.setState({
            bet: 0,
            cash: 0,
            enemyName: '',
            enemyBet: 0,
            enemyCash: 0
        });
        localStorage.removeItem('bet');
        localStorage.removeItem('dibsBet');
        if(enemyId != -1){
            playHubProxy.invoke('stopGame', userId, enemyId);
        }
        playHubProxy.off('onGameStart');
        playHubProxy.off('onEnemyBet');
        playHubProxy.off('onBet');
        playHubProxy.off('onStopGame');
        playHubProxy.off('onMessage');
        connection.stop();
    }

    onSend = (value) =>{
        this.setState({
            messages: [...this.state.messages, {userName: this.props.nameUser, message: value}]
        });
        playHubProxy.invoke('gameChat', this.props.nameUser, value, enemyId);
    }
        
    render(){
        if(this.state.isLogout){
            return (<Redirect to='/' />)
        }
        return(
            <div className={classes.PlayTable}>
            <div className={classes.Container}>
                <Rate
                    bet={this.state.bet}
                    cash={this.state.cash == 0 ? this.props.cash : this.state.cash}
                    name={this.props.nameUser}
                />                
                {enemyId != -1 ?
                    <Enemy 
                        bet={this.state.enemyBet}
                        cash={this.state.enemyCash}
                        name={this.state.enemyName}
                    /> : null
                }
                <DealerHand 
                    dealerHand={this.props.dealerHand}
                    dealerHandSum={this.props.dealerHandSum}
                />
                <div id="dibsBet"></div>
                <PlayerHand 
                    playerHand={this.props.playerHand}
                    playerHandSum={this.props.playerHandSum}
                />
                <Dibs 
                    dibs={this.props.dibs}
                    onDibCLick={this.onCreateDibHandler}
                />
                <PlayButton 
                    onPlay={this.props.onPlayHandler}
                    onEnough={this.props.onEnoughHandler}
                    onMore={this.props.onMoreHandler}
                    disabledPlay={!this.props.isPlay}
                    disabledEnough={!this.props.isEnough}
                    disabledMore={!this.props.isMore}
                />
                <Chat
                    UserName={this.props.nameUser}
                    Messages={this.state.messages}
                    onSend={this.onSend}
                />
                <div className={classes.Button}>
                    <NavLink to="/profile">
                        <Button 
                            type="success" 
                        >Профиль</Button>
                    </NavLink>         
                    <Button 
                        type="error"
                        onClick={this.isLogout}
                    >Выход</Button>
                </div>                   
            </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        deck: state.playTable.deck,
        dibs:state.playTable.dibs,
        bet: state.playTable.bet,
        cash: state.playTable.cash,
        nameUser: state.playTable.nameUser,
        playerHand: state.playTable.playerHand,
        playerHandSum: state.playTable.playerHandSum,
        dealerHand: state.playTable.dealerHand,
        dealerHandSum: state.playTable.dealerHandSum,
        isPlay: state.playTable.isPlay,
        isEnough: state.playTable.isEnough,
        isMore: state.playTable.isMore,
        backProfile: state.playTable.backProfile,
        isExit: state.playTable.isExit
    }
}

function mapDispatchToProps(dispatch){
    return{
        fetchMakeBet: (bet, cash, isPlay)=> dispatch(fetchMakeBet(bet, cash, isPlay)),
        getDataUser: userId => dispatch(getDataUser(userId)),
        onPlayHandler: () => dispatch(onPlayHandler()),
        onEnoughHandler: () => dispatch(onEnoughHandler()),
        onMoreHandler: () => dispatch(onMoreHandler())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayTable)