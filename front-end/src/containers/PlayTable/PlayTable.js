import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink, Redirect} from 'react-router-dom'
import classes from './PlayTable.css'
import Dibs from '../../components/Dibs/Dibs'
import DibsBet from '../../components/Dibs/DibsBet'
import Rate from '../../components/Rate/Rate'
import Enemy from '../../components/Enemy/Enemy'
import PlayButton from '../../components/UI/PlayButton/PlayButton'
import BetButton from '../../components/UI/BetButton/BetButton'
import Button from '../../components/UI/Button/Button'
import Timer from '../../components/UI/Timer/Timer'
import EnemyHand from '../../components/EnemyHand/EnemyHand'
import PlayerHand from '../../components/PlayerHand/PlayerHand'
import {fetchMakeBet, 
        onPlayHandler,
        onEnoughHandler,
        onMoreHandler,
        getDataUser,
        onPlayWithUserHandler,
        onMoreWithUserHandler,
        onEnoughWithUserHandler,
        setActivePlayer,
        userDibsBet} from '../../store/actions/playTable'

import Chat from '../../components/UI/Chat/Chat'
import PlayConnection, {connection, playHubProxy} from '../../Hubs/PlayTableHub'

var userId, enemyId;

class PlayTable extends Component {
    state = {
        isLogout: false,
        betCount: 3,
        isFold: false,
        isCheck: false,
        isRaise: false
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
        bet = (this.props.bet) + parseInt(value);
        cash = (this.props.cash) - parseInt(value);
        let enableBet = this.props.id === this.props.activePlayerId;
        if(bet !== 0 && cash >= 0 && this.props.playerHandSum === 0 && enableBet && bet <= this.props.enemyCash + this.props.enemyBet && this.state.betCount > 0 || 
            localStorage.getItem('enemyId') === '-1' && bet !== 0 && cash >= 0 && this.props.playerHandSum === 0){            
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
            this.props.userDibsBet(dibs);
            this.props.fetchMakeBet(bet, cash, true);
            
            if(localStorage.getItem('enemyId') !== '-1'){
                playHubProxy.invoke('userBet', cash, bet, dibs);
            }
        }
    }

    componentDidMount(){
        userId = parseInt(localStorage.getItem('userId'));
        enemyId = parseInt(localStorage.getItem('enemyId'));

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
    }

    componentWillUnmount(){
    }

    onSend = (value) =>{
        playHubProxy.invoke('gameChat', userId, value);
    }

    playOffer = (isBet = true) =>{
        this.props.setActivePlayer(enemyId, isBet);
        playHubProxy.invoke('playOffer', userId, isBet);
    }

    onFold = () =>{
        console.log('fold');
    }

    onCheck = () =>{
        var difference = this.props.enemyBet - this.props.bet;
        this.onCreateDibHandler(difference);
        this.playOffer(false);
        this.props.onPlayWithUserHandler();
    }

    onRaise = () =>{
        this.setState({
            betCount: this.state.betCount - 1
        });
        this.playOffer();
    }

    onMore = () =>{
        console.log('more');
        this.props.onMoreWithUserHandler();
    }

    onEnough = () =>{
        console.log('enough');
        this.props.onEnoughWithUserHandler();
        this.playOffer(false);
    }

    endGame = () =>{
        if(enemyId !== -1){
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
            <div className={classes.PlayTable}>
            <h1>{this.state.s}</h1>
            <div className={classes.Container}>
                <PlayConnection/>
                <Rate
                    bet={this.props.bet}
                    cash={this.props.cash}
                    name={this.props.name}
                />
                {enemyId !== -1 ?
                    <Enemy 
                        bet={this.props.enemyBet}
                        cash={this.props.enemyCash}
                        name={this.props.enemyName}
                    /> : null
                }
                <EnemyHand 
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
                {this.props.isBet && enemyId !== -1 ?
                    <BetButton 
                        onFold={this.onFold}
                        onCheck={this.onCheck}
                        onRaise={this.onRaise}
                        disabledFold={!enableBet}
                        disabledCheck={!(difference < this.props.cash && difference >= 0 && enableBet)}
                        disabledRaise={!(this.props.bet > this.props.enemyBet && enableBet)}
                    /> :
                    enemyId !== -1 ?
                    <PlayButton
                        onEnough={this.onEnough}
                        onMore={this.onMore}
                        disabledEnough={!enableBet}
                        disabledMore={!enableBet}
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

                {enemyId !== -1 ?
                    <Chat
                        UserName={this.props.name}
                        Messages={this.props.messages}
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
    const { dibs } = state.playTable;
    const { bet, cash, name, time, isBet,
        playerHand, playerHandSum,
        dibsBet, enemyDibsBet,
        enemyName, enemyBet,
        enemyCash, enemyHand, 
        enemyHandSum, messages, 
        isPlay, isEnough, isMore,
        activePlayerId, id,
        backProfile, isExit } = state.playTable.user;
    return{
        dibs, bet, cash, name, time,
        playerHand, playerHandSum, isBet,
        dibsBet, enemyDibsBet,
        enemyName, enemyBet,
        enemyCash, enemyHand,
        enemyHandSum, messages,
        isPlay, isEnough, isMore,
        activePlayerId, id,
        backProfile, isExit
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMakeBet: (bet, cash, isPlay) => dispatch(fetchMakeBet(bet, cash, isPlay)),
        userDibsBet: (bet) => dispatch(userDibsBet(bet)),
        getDataUser: userId => dispatch(getDataUser(userId)),
        setActivePlayer: (id, isBet) => dispatch(setActivePlayer(id, isBet)),
        onPlayHandler: () => dispatch(onPlayHandler()),
        onEnoughHandler: () => dispatch(onEnoughHandler()),
        onMoreHandler: () => dispatch(onMoreHandler()),
        onPlayWithUserHandler: () => dispatch(onPlayWithUserHandler()),
        onMoreWithUserHandler: () => dispatch(onMoreWithUserHandler()),
        onEnoughWithUserHandler: () => dispatch(onEnoughWithUserHandler())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayTable)