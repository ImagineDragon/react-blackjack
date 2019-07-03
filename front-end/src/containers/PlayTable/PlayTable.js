import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import './PlayTable.css'
import Dibs from '../../components/Dibs/Dibs'
import DibsBet from '../../components/Dibs/DibsBet'
import Rate from '../../components/Rate/Rate'
import Enemy from '../../components/Enemy/Enemy'
import PlayButton from '../../components/UI/PlayButton/PlayButton'
import Button from '../../components/UI/Button/Button'
import Timer from '../../components/UI/Timer/Timer'
import EnemyHand from '../../components/EnemyHand/EnemyHand'
import PlayerHand from '../../components/PlayerHand/PlayerHand'
import {userBet, 
        onPlayHandler,
        onEnoughHandler,
        onMoreHandler,
        setActivePlayer,
        } from '../../store/actions/playTable'

import Chat from '../../components/UI/Chat/Chat'
import PlayConnection, {connection, playHubProxy} from '../../Hubs/PlayTableHub'

var userId, enemyId;

class PlayTable extends Component {
    state = {
        isLogout: false,
        isFold: false,
        isCheck: false,
        isRaise: false
    }

    isLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.setState({
            isLogout: true
        });
        connection.stop();
    }
    
    onCreateDibHandler = value =>{
        let bet;
        let cash;
        bet = (this.props.bet) + parseInt(value);
        cash = (this.props.cash) - parseInt(value);
        let enableBet = this.props.id === this.props.activePlayerId;
        if(bet !== 0 && cash >= 0 && this.props.playerHandSum === 0 && ((enableBet && bet <= this.props.enemyCash + this.props.enemyBet && this.props.betCount > 0) || 
            enemyId === -1)){            
            var dibs = this.props.dibsBet;
            while(value > 0){
                if(value >= 200){
                    dibs.push(parseInt(200));
                    value -= 200;
                } else if(value >= 100){
                    dibs.push(parseInt(100));
                    value -= 100;
                } else if(value >= 50){
                    dibs.push(parseInt(50));
                    value -= 50;
                } else if(value >= 25){
                    dibs.push(parseInt(25));
                    value -= 25;
                } else if(value >= 5){
                    dibs.push(parseInt(5));
                    value -= 5;
                } else if(value >= 1){
                    dibs.push(parseInt(1));
                    value -= 1;
                }
            }
            this.props.userBet(bet, cash, dibs);
            
            if(localStorage.getItem('enemyId') !== '-1'){
                if(connection.state === 1)
                    playHubProxy.invoke('userBet', cash, bet, dibs);
            }
        }
    }

    componentDidMount(){
        userId = parseInt(localStorage.getItem('userId'));
        enemyId = parseInt(localStorage.getItem('enemyId'));

        if(localStorage.getItem('token') == null){
            this.setState({
                isLogout: true
            });
        } else {
            this.setState({
                isLogout: false
            });
        }
    }

    componentWillUnmount(){
    }

    onSend = (value) =>{
        if(connection.state === 1)
            playHubProxy.invoke('gameChat', userId, value);
    }

    playOffer = (isBet = true) =>{
        if(connection.state === 1){
            let betCount = this.props.betCount;
            if(this.props.bet > 0 && isBet){
                betCount--;
            }
            this.props.setActivePlayer(enemyId, isBet, betCount);
            playHubProxy.invoke('playOffer', userId, isBet);
        }
    }

    onFold = () =>{
        console.log('fold');
    }

    onCheck = () =>{
        if(connection.state === 1){
            var difference = this.props.enemyBet - this.props.bet;
            this.onCreateDibHandler(difference);
            this.playOffer(false);
            this.props.onPlayHandler();
        }
    }

    onRaise = () =>{
        this.playOffer();
    }

    onMore = () =>{
        if(enemyId === -1){
            this.props.onMoreHandler();
        } else if(connection.state === 1){
            this.props.onMoreHandler();
            playHubProxy.invoke('moreCards');
        }
    }

    onEnough = () =>{
        if(enemyId === -1){
            this.props.onEnoughHandler();
        } else if(connection.state === 1){
            this.props.onEnoughHandler();
            playHubProxy.invoke('enoughCards', this.props.playerHand, this.props.playerHandSum);
            this.playOffer(false);
        }
    }

    endGame = () =>{
        if(enemyId !== -1){
            if(connection.state === 1)
                playHubProxy.invoke('stopGame', userId);
        }
    }

    render(){
        if(this.state.isLogout){
            return (<Redirect to='/' />)
        }
        let enableBet = this.props.id === this.props.activePlayerId;
        let difference = this.props.enemyBet - this.props.bet;
        return(
            <div className="PlayTable">
                <div className="Container">
                    <PlayConnection/>
                    <Rate
                        bet={this.props.bet}
                        cash={this.props.cash}
                        name={this.props.name}
                    />
                    {enemyId !== -1 ?
                        <div>
                            <Enemy 
                                bet={this.props.enemyBet}
                                cash={this.props.enemyCash}
                                name={this.props.enemyName}
                            /> 
                            <Chat
                                UserName={this.props.name}
                                Messages={this.props.messages}
                                onSend={this.onSend}
                            />
                        </div> : null
                    }
                    <EnemyHand 
                        enemyCardsCount={this.props.enemyCardsCount}
                        enemyHand={this.props.enemyHand}
                        enemyHandSum={this.props.enemyHandSum}
                    />

                    <DibsBet
                        userDibsBet={this.props.dibsBet}
                        enemyDibsBet={this.props.enemyDibsBet}
                    />

                    <Timer
                        enableBet={enableBet}
                        time={this.props.time}
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
                        onFold={this.onFold}
                        onCheck={this.onCheck}
                        onRaise={this.onRaise}
                        disabledFold={!enableBet}
                        disabledCheck={!(difference <= this.props.cash && difference >= 0 && enableBet)}
                        disabledRaise={!(this.props.bet > this.props.enemyBet && enableBet)}
                        onPlay={this.props.onPlayHandler}
                        onEnough={this.onEnough}
                        onMore={this.onMore}
                        disabledPlay={!this.props.isPlay}
                        disabledEnough={!this.props.isEnough}
                        disabledMore={!this.props.isMore}
                        isBet={this.props.isBet}
                        enemyId={enemyId}
                        enableBet={enableBet}
                    />

                    <div className="PlayTableButton">
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
    localStorage.setItem('user', JSON.stringify(state.playTable.user));
    const { dibs } = state.playTable;
    const { bet, cash, name, time, isBet,
        playerHand, playerHandSum,
        dibsBet, enemyDibsBet,
        enemyName, enemyBet, betCount,
        enemyCash, enemyHand, 
        enemyHandSum, messages, 
        isPlay, isEnough, isMore,
        activePlayerId, id, enemyCardsCount,
        backProfile, isExit } = state.playTable.user;
    return{
        dibs, bet, cash, name, time,
        playerHand, playerHandSum, isBet,
        dibsBet, enemyDibsBet,
        enemyName, enemyBet, betCount,
        enemyCash, enemyHand,
        enemyHandSum, messages,
        isPlay, isEnough, isMore,
        activePlayerId, id, enemyCardsCount,
        backProfile, isExit
    };
}

function mapDispatchToProps(dispatch){
    return{
        userBet: (bet, cash, dibsBet) => dispatch(userBet(bet, cash, dibsBet)),
        setActivePlayer: (id, isBet, betCount) => dispatch(setActivePlayer(id, isBet, betCount)),
        onPlayHandler: () => dispatch(onPlayHandler()),
        onEnoughHandler: () => dispatch(onEnoughHandler()),
        onMoreHandler: () => dispatch(onMoreHandler())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayTable)