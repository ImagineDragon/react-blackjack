import {FETCH_PLAY_START,
        FETCH_MAKE_BET,
        HAND_SUCCESS,
        WIN_GAME,
        LOSE_GAME,
        DRAW_GAME,
        DEAL_HAND,
        PLAY_HAND,
        USER_PROFILE,
        DATA_USER,
        ENOUGH_HAND,
        USER_CONNECT,
        NEW_USER_CONNECT,
        USER_DISCONNECT,
        USER_READY,
        GAME_START,
        ACTIVE_PLAYER,
        NEW_MESSAGE,
        TIMER,
        BET,
        ENEMY_BET,
        USER_DIBS_BET,
        ENEMY_DIBS_BET,
        DELETE_DIBS,
        ENEMY_GET_CARD,
        GAME_RESULT} from './actionType'
import axios from 'axios'

export function onConnected(profiles){
    return {
        type: USER_CONNECT,
        profiles
    }
}

export function onNewUserConnected(newUser){
    return {
        type: NEW_USER_CONNECT,
        newUser
    }
}

export function onUserDisconnected(profile){
    return {
        type: USER_DISCONNECT,
        profile
    }
}

export function onUserReady(profile){
    return {
        type: USER_READY,
        profile
    }
}

export function onGameStart(user, enemy, messages){
    return {
        type: GAME_START,
        user, enemy, messages
    }
}

export function setActivePlayer(id, isBet = true){
    return {
        type: ACTIVE_PLAYER,
        id, isBet
    }
}

export function onBet(user){
    return {
        type: BET,
        user
    }
}

export function onEnemyBet(enemy){
    return {
        type: ENEMY_BET,
        enemy
    }
}

export function userDibsBet(dibsBet){
    return {
        type: USER_DIBS_BET,
        dibsBet
    }
}

export function enemyDibsBet(dibsBet){
    return {
        type: ENEMY_DIBS_BET,
        dibsBet
    }
}

export function onMessage(message){
    return {
        type: NEW_MESSAGE,
        message
    }
}

export function onTimer(time){
    return {
        type: TIMER,
        time
    }
}

export function fetchMakeBet(bet, cash, isPlay){
    return {
        type: FETCH_MAKE_BET,
        bet, cash, isPlay
    }
}

export function enemyGetCard(){
    return {
        type: ENEMY_GET_CARD
    }
}

export function gameResult(enemyHand, enemyHandSum){
    console.log(enemyHand, enemyHandSum);
    return {
        type: GAME_RESULT,
        enemyHand, enemyHandSum
    }
}

export function getUserProfile(userId){
    return async dispatch =>{
        const data = {
            userId: userId  
        }
        let setStateUser;
        const respons = await axios.post('http://localhost:3001/profile', data);
        if(respons.data){
            setStateUser = {
                id: respons.data.id,
                cash: respons.data.bet,
                name: respons.data.name,
                email: respons.data.email
            }
        }

        dispatch(userProfile(setStateUser));
    }
}

export function getDataUser(userId){
    return async dispatch =>{
        const data = {
            userId: userId  
        }
        let setStateUser;
        const respons = await axios.post('http://localhost:3001/play', data);
        if(respons.data){
            setStateUser = {
                bet: 0,
                cash: respons.data.bet,
                name: respons.data.name,
                isPlay: false
            }
        }
        
        dispatch(dataUser(setStateUser));
    }
       
}

export function onPlayWithUserHandler (){
    return async (dispatch, getState) => {
        const state = getState().playTable;
        let playerHand = await [getCard(state), getCard(state)];
        let playerHandSum = await getSum(playerHand);

        const set_state = {
            playerHand,
            playerHandSum,
            enemyHand: [],
            enemyHandSum: 0,
            isBet: false,
            isPlay: false,
            isEnough: true,
            isMore: true
        };

        dispatch(handSuccess(set_state));
    }
}

export function onMoreWithUserHandler(){
    return async (dispatch, getState) =>{
        const state = getState().playTable;
        let playerHand = state.user.playerHand;
        playerHand.push(getCard(state));
        let playerHandSum = await getSum(playerHand);
        const play_setState = {
            playerHand,
            playerHandSum
        }
        dispatch(playHand(play_setState));
    }
}

export function onEnoughWithUserHandler(){
    return async (dispatch) => {
        const set_state = {
            enoughCards: true,
            isPlay: false,
            isEnough: false,
            isMore: false
        };

        dispatch(enoughHand(set_state));
    }
}

export function onPlayHandler (){
    return async (dispatch, getState) => {
        const state = getState().playTable;
        let playerHand = await [getCard(state), getCard(state)];
        let enemyHand = await [getCard(state)];
        let playerHandSum = await getSum(playerHand);
        let enemyHandSum = await getSum(enemyHand);

        const set_state = {
            playerHand,
            playerHandSum,
            enemyHand,
            enemyHandSum,
            isBet: true,
            isPlay: false,
            isEnough: true,
            isMore: true
        };

        dispatch(handSuccess(set_state));

        if(playerHandSum === 21){ 
            setTimeout(()=>{
                let cash = state.user.cash + state.user.bet * 2;
                const win_setState = {
                    playerHandSum: 0,
                    enemyHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                };
                updateData(cash);
                dispatch(winGame(win_setState)); 
                dispatch(onDeletDib());  
                alert('У Вас BlackJack!!!!!!!!!!!!!'); 
            }, 600);           
            
        }else if(playerHandSum > 21){
            setTimeout(()=>{
                let cash = state.user.cash;
                alert('Вы проиграли!!!!!!!');
                dispatch(onDeletDib());
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    enemyHandSum: 0,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                };
                updateData(cash);
                dispatch(loseGame(lose_setState));  
            }, 600);
            
        }   
    }    
}

export function onEnoughHandler(){
    return async (dispatch, getState) => {
        const state = getState().playTable;
        let enemyHand = state.user.enemyHand;
        await enemyHand.push(getCard(state));
        let enemyHandSum = await getSum(enemyHand);
        const deal_setState_first = {
            enemyHand,
            enemyHandSum
        }
        await dispatch(dealHand(deal_setState_first));
        
        while(enemyHandSum < 17){
            await enemyHand.push(getCard(state));
            enemyHandSum = await getSum(enemyHand);
            const deal_setState = {
                enemyHand,
                enemyHandSum
            }
            await dispatch(dealHand(deal_setState));
        }

        if(enemyHandSum === 21){
            setTimeout(()=>{
                let cash = state.user.cash;
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    enemyHandSum: 0,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                }; 
                dispatch(loseGame(lose_setState));
                dispatch(onDeletDib()); 
                updateData(cash); 
                alert('У дилера BlackJack! Вы проиграли((((('); 
            }, 600); 
        }else if(enemyHandSum > 21 || state.user.playerHandSum > enemyHandSum){
            setTimeout(()=>{
                let cash = state.user.cash + state.user.bet * 2;
                const win_setState = {
                    playerHandSum: 0,
                    enemyHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                }; 
                dispatch(winGame(win_setState));
                dispatch(onDeletDib());  
                updateData(cash);
                alert('Вы выграли!!!!!!!!!!!!!'); 
            }, 600);        
        }else if(enemyHandSum === state.user.playerHandSum){
            setTimeout(()=>{
                let cash = state.user.cash + state.user.bet;
                const draw_setState = {
                    playerHandSum: 0,
                    enemyHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                }; 
                dispatch(drawGame(draw_setState));
                dispatch(onDeletDib());  
                updateData(cash);
                alert('Победила дружба!!!!!!!!!!!!!'); 
            }, 600); 
        }else{
            setTimeout(()=>{
                let cash = state.user.cash;
                alert('Вы проиграли!!!!!!!');
                dispatch(onDeletDib());
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    enemyHandSum: 0,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                };
                updateData(cash);
                dispatch(loseGame(lose_setState));
            }, 600);
        }        
    }
}

export function onMoreHandler(){
    return async (dispatch, getState) =>{
        const state = getState().playTable;
        let playerHand = state.user.playerHand;
        playerHand.push(getCard(state));
        let playerHandSum = await getSum(playerHand);
        const play_setState = {
            playerHand,
            playerHandSum
        }
        dispatch(playHand(play_setState));


        if(playerHandSum === 21){ 
            setTimeout(()=>{
                let cash = state.user.cash + state.user.bet * 2;
                const win_setState = {
                    playerHandSum: 0,
                    enemyHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                };
                dispatch(winGame(win_setState));
                dispatch(onDeletDib());
                updateData(cash);
                alert('У Вас BlackJack!!!!!!!!!!!!!'); 
            }, 600);           
            
        }else if(playerHandSum > 21){
            setTimeout(()=>{
                let cash = state.user.cash
                alert('Вы проиграли!!!!!!!');
                dispatch(onDeletDib());
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    enemyHandSum: 0,
                    playerHand:[],
                    enemyHand:[],
                    isEnough: false,
                    isMore: false
                };
                updateData(cash);
                dispatch(loseGame(lose_setState));  
            }, 600);            
        } 
    }
}

export function handSuccess(set_state){
    return{
        type: HAND_SUCCESS,
        ...set_state
    }
}

export function enoughHand(set_state){
    return{
        type: ENOUGH_HAND,
        ...set_state
    }
}

export function userProfile(setStateUser){
    return{
        type: USER_PROFILE,
        ...setStateUser
    }
}

export function dataUser(setStateUser){
    return{
        type: DATA_USER,
        ...setStateUser
    }
}

export function dealHand(deal_setState){
    return{
        type: DEAL_HAND,
        ...deal_setState
    }
}

export function playHand(play_setState){
    return{
        type: PLAY_HAND,
        ...play_setState
    }
}

export function winGame(win_setState){
    return{
        type: WIN_GAME,
        ...win_setState
    }
}

export function loseGame(lose_setState){
    return{
        type: LOSE_GAME,
        ...lose_setState
    }
}

export function drawGame(draw_setState){
    return{
        type: DRAW_GAME,
        ...draw_setState
    }
}

export function fetchPlayStart(){
    return{
        type: FETCH_PLAY_START
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getCard(state){
    return state.deck[getRandomInt(0, state.deck.length - 1)];
}

function getSum (hand){
    let sum = 0;

    for( let i=0; i<hand.length; i++){
        let card = hand[i];
        if(card.name !== 'Ace'){
            sum += card.value;
        }
    }

    for(let i=0; i<hand.length; i++){
        let card = hand[i];
        if(card.name === 'Ace'){
            if(sum > 10){
                sum ++;
            }else{
                sum += card.value;
            }
        }
    }

    return sum;
}

export function onDeletDib() {
    return{
        type: DELETE_DIBS
    }
}


async function updateData(cash){
    //const userUpdate = localStorage.getItem('userId');
    // const dataUpdate ={
    //     userUpdate, cash
    // }
    //await axios.put('http://localhost:3001/playUser', dataUpdate);
    // if(respons.data){
    //     const setStateUser = {
    //         cash: respons.data.bet,
    //         name: respons.data.name
    //     }
    //     dispatch(dataUser(setStateUser));
    // }

}


