import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import classes from './PlayTable.css'
import Dibs from '../../components/Dibs/DIbs'
import Rate from '../../components/Rate/Rate'
import Enemy from '../../components/Enemy/Enemy'
import PlayButton from '../../components/UI/PlayButton/PlayButton'
import Button from '../../components/UI/Button/Button'
import Timer from '../../components/UI/Timer/Timer'
import DealerHand from '../../components/DealerHand/DealerHand'
import EnemyHand from '../../components/EnemyHand/EnemyHand'
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
        messages: [],
        timer: false,
        time: 20
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
        let div_enemy = document.createElement('div');
        switch(value){
            case '1':
                div.className = classes.dib_1 + ' ' + classes.user_dib_1
                div_enemy.className = classes.dib_1 + ' ' + classes.enemy_dib_1
                break;
            case '5':
                div.className = classes.dib_5 + ' ' + classes.user_dib_5
                div_enemy.className = classes.dib_5 + ' ' + classes.enemy_dib_5
                break;
            case '25':
                div.className = classes.dib_25 + ' ' + classes.user_dib_25
                div_enemy.className = classes.dib_25 + ' ' + classes.enemy_dib_25
                break;
            case '50':
                div.className = classes.dib_50 + ' ' + classes.user_dib_50
                div_enemy.className = classes.dib_50 + ' ' + classes.enemy_dib_50
                break;
            case '100':
                div.className = classes.dib_100 + ' ' + classes.user_dib_100
                div_enemy.className = classes.dib_100 + ' ' + classes.enemy_dib_100
                break;
            default:
                div.className = classes.dib_200 + ' ' + classes.user_dib_200
                div_enemy.className = classes.dib_200 + ' ' + classes.enemy_dib_200
        }        
        div.innerHTML = value;
        div_enemy.innerHTML = value;
        let bet;
        let cash;
        if(localStorage.getItem('enemyId') != -1){
            bet = (this.state.bet) + parseInt(value);
            cash = (this.state.cash) - parseInt(value);
        } else {
            bet = (parseInt(localStorage.getItem('bet'))) + parseInt(value);
            cash = (parseInt(this.props.cash)) - parseInt(value);
        }
        if(bet !== 0 && cash >= 0 && this.props.playerHandSum === 0){            
            localStorage.setItem('bet', bet);
            localStorage.setItem('cash', cash);
            localStorage.setItem('isPlay', 'true');
            this.props.fetchMakeBet(bet, cash, true);
            document.getElementById('dibsBet').appendChild(div);
            localStorage.setItem('dibsBet', document.getElementById('dibsBet').innerHTML);
            var wrapper = document.createElement('div');
            wrapper.appendChild(div_enemy);
            
            if(localStorage.getItem('enemyId') != -1){
                playHubProxy.invoke('userBet', cash, bet, wrapper.innerHTML);
                console.log(localStorage.getItem('enemyDibsBet'));
            }
        }        
    }

    componentDidMount(){
        userId = localStorage.getItem('userId');
        enemyId = localStorage.getItem('enemyId');

        console.log(localStorage.getItem('timer'));
        if(localStorage.getItem('timer') == 'true'){
            this.setState({
                time: parseInt(localStorage.getItem('time')),
                timer: true
            });
            console.log('timer true');
            this.timerHandler();
        }
        
        if(localStorage.getItem('dibsBet') != null){
            document.getElementById('dibsBet').innerHTML = (localStorage.getItem('dibsBet'));
        }
        
        console.log(localStorage.getItem('enemyDibsBet'));
        if(localStorage.getItem('enemyDibsBet') != null){
            document.getElementById('enemyDibsBet').innerHTML = (localStorage.getItem('enemyDibsBet'));
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

        playHubProxy.on('onGameStart', function(user, enemy, messages){
            this.setState({
                cash: user.cash,
                bet: user.bet,
                enemyName: enemy.name,
                enemyCash: enemy.cash,
                enemyBet: enemy.bet,
                messages: messages
            });
            scrollDown();
        }.bind(this));

        playHubProxy.on('onEnemyBet', function(enemy, dibsBet){
            if(localStorage.getItem('enemyDibsBet') == null){
                localStorage.setItem('enemyDibsBet', dibsBet);
            } else{
                localStorage.setItem('enemyDibsBet', localStorage.getItem('enemyDibsBet') + dibsBet);
            }
            var tmp = document.createElement('div');
            tmp.innerHTML = dibsBet;
            document.getElementById('enemyDibsBet').appendChild(tmp);
            console.log(dibsBet);
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

        playHubProxy.on('onPlayOffer', function(){//------------------------------enemy offers play
            localStorage.setItem('timer', true);
            this.setState({
                time: 20,
                timer: true
            });
            this.timerHandler();
        }.bind(this));

        if(enemyId != -1){
            connection.start().done(function(){
                console.log('start game');
                playHubProxy.invoke('gameStart', userId);
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
        localStorage.removeItem('playerHand');
        localStorage.removeItem('dealerHand');
        localStorage.removeItem('playerHandSum');
        localStorage.removeItem('dealerHandSum');

        localStorage.removeItem('bet');
        localStorage.removeItem('cash');
        localStorage.removeItem('dibsBet');
        localStorage.removeItem('enemyDibsBet');
        localStorage.removeItem('isPlay');
        localStorage.removeItem('name');
        playHubProxy.off('onGameStart');
        playHubProxy.off('onEnemyBet');
        playHubProxy.off('onBet');
        playHubProxy.off('onStopGame');
        playHubProxy.off('onMessage');
        playHubProxy.off('onPlayOffer');

        clearInterval(this.timer);
        connection.stop();
    }

    timerHandler = () =>{
        this.timer = setInterval(() => {
            console.log(this.state.time);
            if(this.state.time == 0){
                clearInterval(this.timer);
                localStorage.setItem('timer', false);
                this.endGame();
                this.props.history.push('/profile');
            } else{
                localStorage.setItem('time', this.state.time - 1);
                this.setState({
                    time: this.state.time - 1
                });
            }
        }, 1000);
    }

    onSend = (value) =>{
        this.setState({
            messages: [...this.state.messages, {userName: this.props.nameUser, message: value}]
        });
        playHubProxy.invoke('gameChat', userId, value);
    }

    onPlay = ()=>{
        clearInterval(this.timer);
        localStorage.setItem('isPlay', 'false');
        localStorage.setItem('timer', false);
        this.setState({
            time: 20,
            timer: false
        });
        localStorage.setItem('time', 20);
        playHubProxy.invoke('playOffer');
        //this.props.onPlayHandler();
    }

    endGame = () =>{
        if(enemyId != -1){
            playHubProxy.invoke('stopGame', userId);
        }
    }
        
    render(){
        if(this.state.isLogout){
            return (<Redirect to='/' />)
        }
        return(
            <div className={classes.PlayTable}>
            <div className={classes.Container}>
                {enemyId != -1 ?
                    <Rate
                        bet={this.state.bet}
                        cash={this.state.cash}
                        name={this.props.nameUser}
                    /> :
                    <Rate
                        bet={this.props.bet}
                        cash={this.props.cash}
                        name={this.props.nameUser}
                    />
                }
                {enemyId != -1 ?
                    <Enemy 
                        bet={this.state.enemyBet}
                        cash={this.state.enemyCash}
                        name={this.state.enemyName}
                    /> : null
                }
                {enemyId == -1 ?
                    <DealerHand 
                        dealerHand={this.props.dealerHand}
                        dealerHandSum={this.props.dealerHandSum}
                    /> :
                    <EnemyHand 
                        enemyHand={2}//----------------------------------------------enemy cards
                    />
                }
                <div id="dibsBet"></div>
                <div id="enemyDibsBet"></div>
                <Timer
                    timer={this.state.timer}
                    time={this.state.time}
                />
                <PlayerHand 
                    playerHand={this.props.playerHand}
                    playerHandSum={this.props.playerHandSum}
                />
                <Dibs 
                    dibs={this.props.dibs}
                    onDibCLick={this.onCreateDibHandler}
                />
                <PlayButton 
                    onPlay={enemyId != -1 ? this.onPlay : this.props.onPlayHandler}
                    onEnough={this.props.onEnoughHandler}
                    onMore={this.props.onMoreHandler}
                    disabledPlay={!(localStorage.getItem('isPlay') == 'true')}
                    disabledEnough={!this.props.isEnough}
                    disabledMore={!this.props.isMore}
                />
                {enemyId != -1 ?
                    <Chat
                        UserName={this.props.nameUser}
                        Messages={this.state.messages}
                        onSend={this.onSend}
                    />: null
                }
                <div className={classes.Button}>
                    <NavLink to="/profile">
                        <Button 
                            type="success" 
                            onClick={this.endGame}
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