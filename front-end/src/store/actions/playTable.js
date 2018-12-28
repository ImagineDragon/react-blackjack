import {FETCH_PLAY_START,
        FETCH_MAKE_BET,
        HAND_SUCCESS,
        WIN_GAME,
        LOSE_GAME,
        DRAW_GAME,
        DEAL_HAND,
        PLAY_HAND,
        DATA_USER,
        ENOUGH_HAND} from './actionType'
// import socketIOClient from "socket.io-client"
import axios from 'axios'


export function fetchMakeBet(bet, cash, isPlay){
    return {
        type: FETCH_MAKE_BET,
        bet, cash, isPlay
    }
}

export function getDataUser(userId){
    return async dispatch =>{
        const data = {
            userId: userId  
        }
        if(localStorage.getItem('cash') == null){
            const respons = await axios.post('http://localhost:3001/play', data);
            if(respons.data){                
                localStorage.setItem('cash', respons.data.bet);
                localStorage.setItem('bet', 0);
                localStorage.setItem('name', respons.data.name);
                localStorage.setItem('playerHand', '');
                localStorage.setItem('dealerHand', '');
                localStorage.setItem('playerHandSum', 0);
                localStorage.setItem('dealerHandSum', 0);
            }
        }
        let isPlay = parseInt(localStorage.getItem('bet')) > 0;
        let setStateUser;
        if(localStorage.getItem('playerHand') == ''){
            setStateUser = {
                bet: parseInt(localStorage.getItem('bet')),
                cash: parseInt(localStorage.getItem('cash')),
                name: localStorage.getItem('name'),
                isPlay: isPlay
            }
        } else{
            setStateUser = {
                playerHand: JSON.parse(localStorage.getItem('playerHand')),
                dealerHand: JSON.parse(localStorage.getItem('dealerHand')),
                playerHandSum: parseInt(localStorage.getItem('playerHandSum')),
                dealerHandSum: parseInt(localStorage.getItem('dealerHandSum')),
                bet: parseInt(localStorage.getItem('bet')),
                cash: parseInt(localStorage.getItem('cash')),
                name: localStorage.getItem('name')
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
        
        localStorage.setItem('playerHand', JSON.stringify(playerHand));
        localStorage.setItem('playerHandSum', playerHandSum);

        const set_state = {
            playerHand,
            playerHandSum,
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
        let playerHand = state.playerHand;
        playerHand.push(getCard(state));
        let playerHandSum = await getSum(playerHand);
        const play_setState = {
            playerHand,
            playerHandSum
        }
        localStorage.setItem('playerHand', JSON.stringify(playerHand));
        localStorage.setItem('playerHandSum', playerHandSum);
        dispatch(playHand(play_setState));
    }
}

export function onEnoughWithUserHandler(){
    return async (dispatch, getState) => {
        const state = getState().playTable;
        const set_state = {
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
        let dealerHand = await [getCard(state)];
        let playerHandSum = await getSum(playerHand);
        let dealerHandSum = await getSum(dealerHand);
        
        localStorage.setItem('playerHand', JSON.stringify(playerHand));
        localStorage.setItem('dealerHand', JSON.stringify(dealerHand));
        localStorage.setItem('playerHandSum', playerHandSum);
        localStorage.setItem('dealerHandSum', dealerHandSum);

        const set_state = {
            playerHand,
            playerHandSum,
            dealerHand,
            dealerHandSum,
            isPlay: false,
            isEnough: true,
            isMore: true
        };

        dispatch(handSuccess(set_state));

        if(playerHandSum === 21){ 
            setTimeout(()=>{
                let cash = state.cash + state.bet*2;
                const win_setState = {
                    playerHandSum: 0,
                    dealerHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    dealerHand:[],
                    isEnough: false,
                    isMore: false
                };
                updateData(cash);
                dispatch(winGame(win_setState)); 
                onDeletDib();  
                alert('У Вас BlackJack!!!!!!!!!!!!!'); 
            }, 600);           
            
        }else if(playerHandSum > 21){
            setTimeout(()=>{
                let cash = state.cash;
                alert('Вы проиграли!!!!!!!');
                onDeletDib();
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    dealerHandSum: 0,
                    playerHand:[],
                    dealerHand:[],
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
        let dealerHand = state.dealerHand;
        await dealerHand.push(getCard(state));
        let dealerHandSum = await getSum(dealerHand);
        const deal_setState_first = {
            dealerHand,
            dealerHandSum
        }
        await dispatch(dealHand(deal_setState_first));
        
        while(dealerHandSum < 17){
            await dealerHand.push(getCard(state));
            dealerHandSum = await getSum(dealerHand);
            const deal_setState = {
                dealerHand,
                dealerHandSum
            }
            await dispatch(dealHand(deal_setState));
        }

        if(dealerHandSum === 21){
            setTimeout(()=>{
                let cash = state.cash;
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    dealerHandSum: 0,
                    playerHand:[],
                    dealerHand:[],
                    isEnough: false,
                    isMore: false
                }; 
                dispatch(loseGame(lose_setState));
                onDeletDib(); 
                updateData(cash); 
                alert('У дилера BlackJack! Вы проиграли((((('); 
            }, 600); 
        }else if(dealerHandSum > 21 || state.playerHandSum > dealerHandSum){
            setTimeout(()=>{
                let cash = state.cash + state.bet*2;
                const win_setState = {
                    playerHandSum: 0,
                    dealerHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    dealerHand:[],
                    isEnough: false,
                    isMore: false
                }; 
                dispatch(winGame(win_setState));
                onDeletDib();  
                updateData(cash);
                alert('Вы выграли!!!!!!!!!!!!!'); 
            }, 600);        
        }else if(dealerHandSum === state.playerHandSum){
            setTimeout(()=>{
                let cash = state.cash + state.bet;
                const draw_setState = {
                    playerHandSum: 0,
                    dealerHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    dealerHand:[],
                    isEnough: false,
                    isMore: false
                }; 
                dispatch(drawGame(draw_setState));
                onDeletDib();  
                updateData(cash);
                alert('Победила дружба!!!!!!!!!!!!!'); 
            }, 600); 
        }else{
            setTimeout(()=>{
                let cash = state.cash;
                alert('Вы проиграли!!!!!!!');
                onDeletDib();
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    dealerHandSum: 0,
                    playerHand:[],
                    dealerHand:[],
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
        let playerHand = state.playerHand;
        playerHand.push(getCard(state));
        let playerHandSum = await getSum(playerHand);
        const play_setState = {
            playerHand,
            playerHandSum
        }
        localStorage.setItem('playerHand', JSON.stringify(playerHand));
        localStorage.setItem('playerHandSum', playerHandSum);
        dispatch(playHand(play_setState));


        if(playerHandSum === 21){ 
            setTimeout(()=>{
                let cash = state.cash + state.bet*2;
                const win_setState = {
                    playerHandSum: 0,
                    dealerHandSum: 0,
                    bet: 0,
                    cash,
                    playerHand:[],
                    dealerHand:[],
                    isEnough: false,
                    isMore: false
                };
                dispatch(winGame(win_setState));
                onDeletDib();  
                updateData(cash);
                alert('У Вас BlackJack!!!!!!!!!!!!!'); 
            }, 600);           
            
        }else if(playerHandSum > 21){
            setTimeout(()=>{
                let cash = state.cash
                alert('Вы проиграли!!!!!!!');
                onDeletDib();
                const lose_setState = {
                    playerHandSum: 0,
                    bet: 0,
                    dealerHandSum: 0,
                    playerHand:[],
                    dealerHand:[],
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

function onDeletDib() {
    return document.getElementById('dibsBet').innerHTML='';
}


async function updateData(cash){
    localStorage.setItem('cash', cash);
    localStorage.setItem('bet', 0);
    localStorage.removeItem('dibsBet');
    localStorage.setItem('playerHand', '');
    localStorage.setItem('dealerHand', '');
    localStorage.setItem('playerHandSum', 0);
    localStorage.setItem('dealerHandSum', 0);
    const userUpdate = localStorage.getItem('userId');
    const dataUpdate ={
        userUpdate, cash
    }
    //await axios.put('http://localhost:3001/playUser', dataUpdate);
    // if(respons.data){
    //     const setStateUser = {
    //         cash: respons.data.bet,
    //         name: respons.data.name
    //     }
    //     dispatch(dataUser(setStateUser));
    // }

}


