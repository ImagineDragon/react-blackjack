import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import classes from './PlayTable.css'
import Dibs from '../../components/Dibs/DIbs'
import Rate from '../../components/Rate/Rate'
import Enemy from '../../components/Enemy/Enemy'
import PlayButton from '../../components/UI/PlayButton/PlayButton'
import BetButton from '../../components/UI/BetButton/BetButton'
import Button from '../../components/UI/Button/Button'
import Timer from '../../components/UI/Timer/Timer'
import DealerHand from '../../components/DealerHand/DealerHand'
import EnemyHand from '../../components/EnemyHand/EnemyHand'
import PlayerHand from '../../components/PlayerHand/PlayerHand'
import {fetchMakeBet, 
        onPlayHandler,
        onEnoughHandler,
        onMoreHandler,
        getDataUser,
        onPlayWithUserHandler,
        onMoreWithUserHandler,
        onEnoughWithUserHandler} from '../../store/actions/playTable'

import Chat, {scrollDown} from '../../components/UI/Chat/Chat'
import {connection, playHubProxy} from '../../Hubs/Hubs'
import { runInThisContext } from 'vm';

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
        enableBet: false,
        timer: false,
        time: 20,
        betCount: 3,
        isFold: false,
        isCheck: false,
        isRaise: false,
        isBet: true,
        firstBet: true
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
        let bet;
        let cash;
        if(localStorage.getItem('enemyId') != -1){
            bet = (this.state.bet) + parseInt(value);
            cash = (this.state.cash) - parseInt(value);
        } else {
            bet = (parseInt(localStorage.getItem('bet'))) + parseInt(value);
            cash = (parseInt(this.props.cash)) - parseInt(value);
        }
        if(bet !== 0 && cash >= 0 && (this.props.playerHandSum === 0 || this.state.enableBet) && (this.state.enableBet && bet <= this.state.enemyCash || localStorage.getItem('enemyId') == -1 )){
            let wrapper = document.createElement('div');
            while(value > 0){
                let div = document.createElement('div');
                let div_enemy = document.createElement('div');
                if(value >= 200){
                    div.className = classes.dib_200 + ' ' + classes.user_dib_200
                    div_enemy.className = classes.dib_200 + ' ' + classes.enemy_dib_200
                    value -= 200;
                    div.innerHTML = 200;
                    div_enemy.innerHTML = 200;
                } else if(value >= 100){
                    div.className = classes.dib_100 + ' ' + classes.user_dib_100
                    div_enemy.className = classes.dib_100 + ' ' + classes.enemy_dib_100
                    value -= 100;
                    div.innerHTML = 100;
                    div_enemy.innerHTML = 100;
                } else if(value >= 50){
                    div.className = classes.dib_50 + ' ' + classes.user_dib_50
                    div_enemy.className = classes.dib_50 + ' ' + classes.enemy_dib_50
                    value -= 50;
                    div.innerHTML = 50;
                    div_enemy.innerHTML = 50;
                } else if(value >= 25){
                    div.className = classes.dib_25 + ' ' + classes.user_dib_25
                    div_enemy.className = classes.dib_25 + ' ' + classes.enemy_dib_25
                    value -= 25;
                    div.innerHTML = 25;
                    div_enemy.innerHTML = 25;
                } else if(value >= 5){
                    div.className = classes.dib_5 + ' ' + classes.user_dib_5
                    div_enemy.className = classes.dib_5 + ' ' + classes.enemy_dib_5
                    value -= 5;
                    div.innerHTML = 5;
                    div_enemy.innerHTML = 5;
                } else{
                    div.className = classes.dib_1 + ' ' + classes.user_dib_1
                    div_enemy.className = classes.dib_1 + ' ' + classes.enemy_dib_1
                    value -= 1;
                    div.innerHTML = 1;
                    div_enemy.innerHTML = 1;
                }
                document.getElementById('dibsBet').appendChild(div);
                wrapper.appendChild(div_enemy);
            }
            localStorage.setItem('bet', bet);
            localStorage.setItem('cash', cash);
            this.setState({
                bet: bet,
                cash: cash
            });
            if(bet > this.state.enemyBet && this.state.betCount > 0){
                this.setState({
                    isCheck: false,
                    isRaise: true
                });
            } else{
                this.setState({
                    isCheck: true,
                    isRaise: false
                });
            }
            this.props.fetchMakeBet(bet, cash, true);
            localStorage.setItem('dibsBet', document.getElementById('dibsBet').innerHTML);
            
            if(localStorage.getItem('enemyId') != -1){
                playHubProxy.invoke('userBet', cash, bet, wrapper.innerHTML);
            }
        }        
    }

    componentDidMount(){
        userId = localStorage.getItem('userId');
        enemyId = localStorage.getItem('enemyId');

        if(localStorage.getItem('isBet') == null){
            localStorage.setItem('isBet', this.state.isBet);
        } else{
            this.setState({
                isBet: localStorage.getItem('isBet') == 'true'
            });
        }

        if(localStorage.getItem('betCount') !== null){
            this.setState({
                betCount: parseInt(localStorage.getItem('betCount'))
            });
        }
        
        if(localStorage.getItem('dibsBet') != null){
            document.getElementById('dibsBet').innerHTML = (localStorage.getItem('dibsBet'));
        }
        
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

        playHubProxy.on('onGameStart', function(user, enemy, messages, firstId){
            this.setState({
                cash: user.cash,
                bet: user.bet,
                enemyName: enemy.name,
                enemyCash: enemy.cash,
                enemyBet: enemy.bet,
                messages: messages
            });
            if(localStorage.getItem('enableBet') == null){
                if(firstId == localStorage.getItem('userId')){
                    this.playOffer();
                }
            } else if(localStorage.getItem('enableBet') == 'true'){
                this.setState({
                    enableBet: true,
                    isFold: true,
                    isCheck: this.state.enemyBet > this.state.bet,
                    isRaise: this.state.enemyBet < this.state.bet && this.state.betCount > 0
                });
            } else{
                this.setState({
                    enableBet: false,
                    isFold: false,
                    isCheck: false,
                    isRaise: false
                });
            }
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

        playHubProxy.on('onPlayOffer', function(userId){
            if(this.state.bet == this.state.enemyBet && this.state.bet > 0 && this.state.firstBet){
                this.setState({
                    isBet: false,
                    firstBet: false,
                    enableBet: false
                });
                localStorage.setItem('enableBet', 'false');
                localStorage.setItem('isBet', 'false');
                localStorage.setItem('firstBet', 'false');
                this.props.onPlayWithUserHandler();
            } else if(userId == localStorage.getItem('userId')){
                this.setState({
                    enableBet: false,
                    isRaise: false,
                    isCheck: false,
                    isFold: false
                });
                localStorage.setItem('enableBet', 'false');
            } else{
                this.setState({
                    enableBet: true,
                    isFold: true,
                    isCheck: this.state.enemyBet > 0
                });
                localStorage.setItem('enableBet', 'true');
            }
            console.log('playOffer ' + localStorage.getItem('enableBet'));
        }.bind(this));

        playHubProxy.on('onTimer', function(time){
            this.setState({
                time: time,
                timer: true
            });
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
        localStorage.removeItem('isBet');
        localStorage.removeItem('enableBet');
        localStorage.removeItem('firstBet');
        localStorage.removeItem('betCount');
        localStorage.removeItem('cash');
        localStorage.removeItem('dibsBet');
        localStorage.removeItem('enemyDibsBet');
        localStorage.removeItem('name');
        playHubProxy.off('onGameStart');
        playHubProxy.off('onEnemyBet');
        playHubProxy.off('onBet');
        playHubProxy.off('onStopGame');
        playHubProxy.off('onMessage');
        playHubProxy.off('onPlayOffer');
        playHubProxy.off('onTimer');

        connection.stop();
    }

    onSend = (value) =>{
        this.setState({
            messages: [...this.state.messages, {userName: this.props.nameUser, message: value}]
        });
        playHubProxy.invoke('gameChat', userId, value);
    }

    playOffer = () =>{
        playHubProxy.invoke('playOffer', userId);
    }

    onFold = () =>{
        console.log('fold');
    }

    onCheck = () =>{
        var difference = this.state.enemyBet - this.state.bet;
        this.onCreateDibHandler(difference);
        this.setState({
            isBet: false,
            firstBet: false
        });
        localStorage.setItem('firstBet', 'false');
        localStorage.setItem('isbet', 'false');
        this.playOffer();
        this.props.onPlayWithUserHandler();
    }

    onRaise = () =>{
        localStorage.setItem('betCount', this.state.betCount - 1);
        this.setState({
            enableBet: false,
            isFold: false,
            isCheck: false,
            isRaise: false,
            betCount: this.state.betCount - 1
        });
        localStorage.setItem('enableBet', 'false');
        this.playOffer();
    }

    onMore = () =>{
        console.log('more');
        this.props.onMoreWithUserHandler();
    }

    onEnough = () =>{
        console.log('enough');
        this.props.onEnoughWithUserHandler();
        this.setState({
            enableBet: false
        });
        this.playOffer();
        console.log(localStorage.getItem('enableBet'));
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
        /*console.log('isBet ' + this.state.isBet);
        console.log('enableBet ' + this.state.enableBet);*/
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
                        enemyHand={0}//----------------------------------------------enemy cards
                    />
                }
                <div id="dibsBet"></div>
                <div id="enemyDibsBet"></div>
                <Timer
                    enableBet={this.state.enableBet}
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
                {this.state.isBet && enemyId != -1 ?
                    <BetButton 
                        onFold={this.onFold}
                        onCheck={this.onCheck}
                        onRaise={this.onRaise}
                        disabledFold={!this.state.isFold}
                        disabledCheck={!this.state.isCheck}
                        disabledRaise={!this.state.isRaise}
                    /> :
                    enemyId != -1 ?
                    <PlayButton
                        onEnough={this.onEnough}
                        onMore={this.onMore}
                        disabledEnough={!this.state.enableBet}
                        disabledMore={!this.state.enableBet}
                        /*disabledEnough={!this.props.isEnough}
                        disabledMore={!this.props.isMore}*/
                    /> :
                    <PlayButton
                        onPlay={this.props.onPlayHandler}
                        onEnough={this.props.onEnoughHandler}
                        onMore={this.props.onMoreHandler}
                        disabledPlay={!this.props.isPlay}
                        disabledEnough={!this.props.isEnough}
                        disabledMore={!this.props.isMore}
                    />
                }

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
        onMoreHandler: () => dispatch(onMoreHandler()),
        onPlayWithUserHandler: () => dispatch(onPlayWithUserHandler()),
        onMoreWithUserHandler: () => dispatch(onMoreWithUserHandler()),
        onEnoughWithUserHandler: () => dispatch(onEnoughWithUserHandler())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayTable)