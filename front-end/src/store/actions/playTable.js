import {HAND_SUCCESS,
        DEAL_HAND,
        PLAY_HAND,
        USER_PROFILE,
        USER_DATA_UPDATE,
        ENOUGH_HAND,
        USER_CONNECT,
        NEW_USER_CONNECT,
        USER_DISCONNECT,
        USER_READY,
        GAME_START,
        ACTIVE_PLAYER,
        NEW_MESSAGE,
        TIMER,
        USER_BET,
        ENEMY_BET,
        DELETE_DIBS,
        ENEMY_GET_CARD,
        GAME_RESULT,
        GAME_END} from './actionType'
import axios from 'axios'
import {history} from '../history'

export function getUserProfile(){
    return async dispatch =>{
        let setStateUser;
        
        let token = localStorage.getItem('token');
        await axios.get('http://localhost:3001/profile', {headers: {"Authorization": "Bearer " + token}})
        .then(respons => {
            setStateUser = {
                id: respons.data.id,
                cash: respons.data.cash,
                name: respons.data.name,
                email: respons.data.email
            }
            localStorage.setItem('userId', respons.data.id);

            dispatch(userProfile(setStateUser));
        })
        .catch(error => {
            console.log('error');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            // history.push('/');
        });
    }
}

export function userProfile(setStateUser){
    return{
        type: USER_PROFILE,
        ...setStateUser
    }
}

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

export function setActivePlayer(id, isBet = true, betCount){
    return {
        type: ACTIVE_PLAYER,
        id, isBet, betCount
    }
}

export function userBet(bet, cash, dibsBet){
    return {
        type: USER_BET,
        bet, cash, dibsBet
    }
}

export function onEnemyBet(bet, cash, dibsBet){
    return {
        type: ENEMY_BET,
        bet, cash, dibsBet
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

export function enemyGetCard(){
    return {
        type: ENEMY_GET_CARD
    }
}

export function gameResult(enemyHand, enemyHandSum){
    return {
        type: GAME_RESULT,
        enemyHand, enemyHandSum
    }
}

export function gameEnd(winnerId){
    return async (dispatch, getState) => {        
        const state = getState().playTable;
        let cash, enemyCash;
        setTimeout(() => {
            if(winnerId === -1){
                alert('Победила дружба!!!!!!!!!!!!!'); 
                cash = state.user.cash + state.user.bet;
                enemyCash = state.user.enemyCash + state.user.enemyBet;
            }
            else if(winnerId === state.user.id){
                alert('Вы выграли!!!!!!!!!!!!!'); 
                cash = state.user.cash + state.user.bet * 2;
                enemyCash = state.user.enemyCash;
            }
            else{
                alert('Вы проиграли!!!!!!!');
                cash = state.user.cash;
                enemyCash = state.user.enemyCash + state.user.enemyBet * 2;
            }
            const setState = {
                cash,
                enemyCash
            };
            updateData(cash);
            dispatch(endGame(setState));
        }, 600); 
    }
}

export function endGame(setState){
    return{
        type: GAME_END,
        ...setState
    }
}

export function userDataUpdate(setStateUser){
    return{
        type: USER_DATA_UPDATE,
        ...setStateUser
    }
}

export function onPlayHandler (){
    return async (dispatch, getState) => {
        const state = getState().playTable;
        let playerHand = await [getCard(state), getCard(state)];
        let playerHandSum = await getSum(playerHand);
        let enemyHand = await [getCard(state)];
        let enemyHandSum = await getSum(enemyHand);

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
		
		if(localStorage.getItem('enemyId') === '-1'){
			set_state.enemyHand = enemyHand;
			set_state.enemyHandSum = enemyHandSum;
		}

        dispatch(handSuccess(set_state));
    }
}

export function onMoreHandler(){
    return async (dispatch, getState) =>{
        const state = getState().playTable;
        let playerHand = state.user.playerHand;
        await playerHand.push(getCard(state));
        let playerHandSum = await getSum(playerHand);
        const play_setState = {
            playerHand,
            playerHandSum
        }
        dispatch(playHand(play_setState));
    }
}

export function onEnoughHandler(){
    return async (dispatch, getState) => {
        const set_state = {
            enoughCards: true,
            isPlay: false,
            isEnough: false,
            isMore: false
		};

		await dispatch(enoughHand(set_state));
		
		if(localStorage.getItem('enemyId') === '-1'){
			const state = getState().playTable;
			let enemyHand = state.user.enemyHand;
			let enemyHandSum = state.user.enemyHandSum;
			let deal_setState;
			while(enemyHandSum < 17){
				await enemyHand.push(getCard(state));
				enemyHandSum = await getSum(enemyHand);
				deal_setState = {
					enemyHand,
					enemyHandSum
				}
			}		
			await dispatch(dealHand(deal_setState));
			dispatch(checkGameWithBot());
		}
    }
}

export function checkGameWithBot(){
	return async (dispatch, getState) => {
		const state = await getState().playTable.user;
		let cash = state.cash;
		const set_state = {			
			cash,
			enemyCash: 0
		};

		if(state.enemyHandSum === state.playerHandSum){
            setTimeout(()=>{
                cash += state.bet;
                set_state.cash = cash;
                dispatch(endGame(set_state));
                dispatch(onDeletDib());
                alert('Победила дружба!!!!!!!!!!!!!'); 
            }, 600); 
        }else if(state.playerHandSum === 21){
            setTimeout(()=>{
				cash += state.bet * 2;
                set_state.cash = cash;
                dispatch(endGame(set_state));
                dispatch(onDeletDib());
                alert('У Вас BlackJack!!!!!!!!!!!!!'); 
            }, 600); 
        }else if(state.enemyHandSum === 21){
            setTimeout(()=>{
                dispatch(endGame(set_state));
                dispatch(onDeletDib());
                alert('У дилера BlackJack! Вы проиграли((((('); 
            }, 600); 
        }else if((state.enemyHandSum > 21 && state.playerHandSum < state.enemyHandSum) || (state.playerHandSum > state.enemyHandSum && state.playerHandSum < 21)){
            setTimeout(()=>{
                cash += state.bet * 2;
                set_state.cash = cash;
                dispatch(endGame(set_state));
                dispatch(onDeletDib());
                alert('Вы выграли!!!!!!!!!!!!!'); 
            }, 600);        
        }else {
            setTimeout(()=>{
                dispatch(onDeletDib());
                dispatch(endGame(set_state));
                alert('Вы проиграли!!!!!!!');
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
    const dataUpdate = { cash };
    let token = localStorage.getItem('token');
    await axios.put('http://localhost:3001/playUser', dataUpdate, {headers: {"Authorization": "Bearer " + token}});
}


