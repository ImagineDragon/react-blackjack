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
        BET,
        ENEMY_BET,
        TIMER,
        NEW_MESSAGE,
        USER_DIBS_BET,
        ENEMY_DIBS_BET,
        DELETE_DIBS} from '../actions/actionType'

const initialState = {
    deck: [
        {
            name: 'Ace',
            suit: 'Hearts',
            value: 11
        },
        {
            name: 'Two',
            suit: 'Hearts',
            value: 2
        },
        {
            name: 'Three',
            suit: 'Hearts',
            value: 3
        },
        {
            name: 'Four',
            suit: 'Hearts',
            value: 4
        },
        {
            name: 'Five',
            suit: 'Hearts',
            value: 5
        },
        {
            name: 'Six',
            suit: 'Hearts',
            value: 6
        },
        {
            name: 'Seven',
            suit: 'Hearts',
            value: 7
        },
        {
            name: 'Eight',
            suit: 'Hearts',
            value: 8
        },
        {
            name: 'Nine',
            suit: 'Hearts',
            value: 9
        },
        {
            name: 'Ten',
            suit: 'Hearts',
            value: 10
        },
        {
            name: 'Jack',
            suit: 'Hearts',
            value: 10
        },
        {
            name: 'Queen',
            suit: 'Hearts',
            value: 10
        },
        {
            name: 'King',
            suit: 'Hearts',
            value: 10
        },
        {
            name: 'Ace',
            suit: 'Diamonds',
            value: 11
        },
        {
            name: 'Two',
            suit: 'Diamonds',
            value: 2
        },
        {
            name: 'Three',
            suit: 'Diamonds',
            value: 3
        },
        {
            name: 'Four',
            suit: 'Diamonds',
            value: 4
        },
        {
            name: 'Five',
            suit: 'Diamonds',
            value: 5
        },
        {
            name: 'Six',
            suit: 'Diamonds',
            value: 6
        },
        {
            name: 'Seven',
            suit: 'Diamonds',
            value: 7
        },
        {
            name: 'Eight',
            suit: 'Diamonds',
            value: 8
        },
        {
            name: 'Nine',
            suit: 'Diamonds',
            value: 9
        },
        {
            name: 'Ten',
            suit: 'Diamonds',
            value: 10
        },
        {
            name: 'Jack',
            suit: 'Diamonds',
            value: 10
        },
        {
            name: 'Queen',
            suit: 'Diamonds',
            value: 10
        },
        {
            name: 'King',
            suit: 'Diamonds',
            value: 10
        },
        {
            name: 'Ace',
            suit: 'Clubs',
            value: 11
        },
        {
            name: 'Two',
            suit: 'Clubs',
            value: 2
        },
        {
            name: 'Three',
            suit: 'Clubs',
            value: 3
        },
        {
            name: 'Four',
            suit: 'Clubs',
            value: 4
        },
        {
            name: 'Five',
            suit: 'Clubs',
            value: 5
        },
        {
            name: 'Six',
            suit: 'Clubs',
            value: 6
        },
        {
            name: 'Seven',
            suit: 'Clubs',
            value: 7
        },
        {
            name: 'Eight',
            suit: 'Clubs',
            value: 8
        },
        {
            name: 'Nine',
            suit: 'Clubs',
            value: 9
        },
        {
            name: 'Ten',
            suit: 'Clubs',
            value: 10
        },
        {
            name: 'Jack',
            suit: 'Clubs',
            value: 10
        },
        {
            name: 'Queen',
            suit: 'Clubs',
            value: 10
        },
        {
            name: 'King',
            suit: 'Clubs',
            value: 10
        },
        {
            name: 'Ace',
            suit: 'Spades',
            value: 11
        },
        {
            name: 'Two',
            suit: 'Spades',
            value: 2
        },
        {
            name: 'Three',
            suit: 'Spades',
            value: 3
        },
        {
            name: 'Four',
            suit: 'Spades',
            value: 4
        },
        {
            name: 'Five',
            suit: 'Spades',
            value: 5
        },
        {
            name: 'Six',
            suit: 'Spades',
            value: 6
        },
        {
            name: 'Seven',
            suit: 'Spades',
            value: 7
        },
        {
            name: 'Eight',
            suit: 'Spades',
            value: 8
        },
        {
            name: 'Nine',
            suit: 'Spades',
            value: 9
        },
        {
            name: 'Ten',
            suit: 'Spades',
            value: 10
        },
        {
            name: 'Jack',
            suit: 'Spades',
            value: 10
        },
        {
            name: 'Queen',
            suit: 'Spades',
            value: 10
        },
        {
            name: 'King',
            suit: 'Spades',
            value: 10
        }
    ],
    dibs:[
        {
            id: 1,
            value: '1',
            classView: 'blue'
        },
        {
            id: 2,
            value: '5',
            classView: 'blue'
        },
        {
            id: 3,
            value: '25',
            classView: 'yellow'
        },
        {
            id: 4,
            value: '50',
            classView: 'yellow'
        },
        {
            id: 5,
            value: '100',
            classView: 'red'
        },
        {
            id: 6,
            value: '200',
            classView: 'red'
        }
    ],
    count: 0,
    users: [],
    user: {
        id: -1,        
        name: '',
        email: '',
        bet: 0,
        cash: 0,
        playerHand: [],
        playerHandSum: 0,
        dibsBet: [],
        enemyName: '',
        enemyBet: 0,
        enemyCash: 0,
        enemyHand: [],
        enemyHandSum: 0,
        enemyDibsBet: [],
        isBet: true,
        activePlayerId: 0,
        messages: [],
        time: -1,
        isPlay: false,
        isEnough: false,
        isMore: false
    }
}

export default function playReducer(state = initialState, action){
    switch(action.type){
        case USER_PROFILE:
            return{
                ...state,
                    user: {
                        ...state.user,
                        id: action.id,
                        cash: action.cash,
                        name: action.name,
                        email: action.email,
                        playerHand: [],
                        playerHandSum: 0,
                        dibsBet: [],
                        enemyName: '',
                        enemyBet: 0,
                        enemyCash: 0,
                        enemyHand: [],
                        enemyHandSum: 0,
                        enemyDibsBet: [],
                        isBet: true,
                        activePlayerId: 0,
                        messages: [],
                        time: -1,
                    }
            }
        case USER_CONNECT:
            return{
                ...state,
                count: action.profiles.length,
                users: action.profiles
            }
        case NEW_USER_CONNECT:
            return{
                ...state,
                users: [...state.users, action.newUser],
                count: state.count + 1
            }
        case USER_DISCONNECT:
            return{
                ...state,
                users: state.users.filter(user => user.id !== action.profile.id),
                count: state.count - 1
            }
        case USER_READY:
            return{
                ...state,
                users: state.users.map(user => user.id === action.profile.id ? action.profile : user)
            }
        case GAME_START:
            return{
                ...state,
                user:{
                    ...state.user,
                    messages: action.messages,
                    cash: action.user.cash,
                    bet: action.user.bet,
                    enemyName: action.enemy.name,
                    enemyCash: action.enemy.cash,
                    enemyBet: action.enemy.bet
                }
            }
        case ACTIVE_PLAYER:
            return{
                ...state,
                user:{
                    ...state.user,
                    isBet: action.isBet,
                    activePlayerId: action.id
                }
            }
        case BET:
            return{
                ...state,
                user:{
                    ...state.user,
                    cash: action.user.cash,
                    bet: action.user.bet
                }
            }
        case ENEMY_BET:
            return{
                ...state,
                user:{
                    ...state.user,
                    enemyCash: action.enemy.cash,
                    enemyBet: action.enemy.bet
                }
            }
        case USER_DIBS_BET:
            return{
                ...state,
                user:{
                    ...state.user,
                    dibsBet: action.dibsBet
                }
            }
        case ENEMY_DIBS_BET:
            return{
                ...state,
                user:{
                    ...state.user,
                    enemyDibsBet: action.dibsBet
                }
            }
        case DELETE_DIBS:
            return{
                ...state,
                user:{
                    ...state.user,
                    dibsBet: [],
                    enemyDibsBet:[]
                }
            }
        case NEW_MESSAGE:
            return{
                ...state,
                user:{
                    ...state.user,
                    messages: [...state.user.messages, action.message]
                }
            }
        case TIMER:
            return{
                ...state,
                user:{
                    ...state.user,
                    time: action.time
                }
            }
        case FETCH_PLAY_START:
            return{
                ...state
            }
        case DATA_USER:
            if(action.playerHand === undefined){
                return{
                    ...state,
                    user: {
                        ...state.user,
                        playerHand: [],
                        playerHandSum: 0,
                        enemyHand: [],
                        enemyHandSum: 0,
                        bet: action.bet,
                        cash: action.cash,
                        name: action.name,
                        isPlay: action.isPlay
                    }
                }
            } else{
                return{
                    ...state,
                    user: {
                        ...state.user,
                        playerHand: action.playerHand,
                        playerHandSum: action.playerHandSum,
                        enemyHand: action.enemyHand,
                        enemyHandSum: action.enemyHandSum,
                        bet: action.bet,
                        cash: action.cash,
                        name: action.name,
                        isPlay: false,
                        isEnough: true,
                        isMore: true
                    }
                }
            }
        case FETCH_MAKE_BET:
            return{
                ...state, 
                user: {
                    ...state.user,
                    bet: action.bet, 
                    cash: action.cash,
                    isPlay: action.isPlay
                }
            }
        case ENOUGH_HAND:
            return{
                ...state,
                user: {
                    ...state.user,
                    isPlay: action.isPlay,
                    isEnough: action.isEnough,
                    isMore: action.isMore
                }
            }
        case HAND_SUCCESS:
            return{
                ...state,
                user: {
                    ...state.user,
                    playerHand: action.playerHand,
                    playerHandSum: action.playerHandSum,
                    enemyHand: action.enemyHand,
                    enemyHandSum: action.enemyHandSum,
                    isBet: action.isBet,
                    isPlay: false,
                    isEnough: true,
                    isMore: true
                }
            }
        case WIN_GAME:
            return{
                ...state,
                user: {
                    ...state.user,
                    playerHandSum: action.playerHandSum,
                    enemyHandSum: action.enemyHandSum,
                    bet: action.bet,
                    cash: action.cash,
                    playerHand: action.playerHand,
                    enemyHand: action.enemyHand,
                    isEnough: false,
                    isMore: false
                }
            }
        case LOSE_GAME:
            return{
                ...state,
                user: {
                    ...state.user,
                    playerHandSum: action.playerHandSum,
                    bet: action.bet,
                    enemyHandSum: action.enemyHandSum,
                    playerHand: action.playerHand,
                    enemyHand: action.enemyHand,
                    isEnough: false,
                    isMore: false
                }
            }
        case DRAW_GAME:
            return{
                ...state,
                user: {
                    ...state.user,
                    playerHandSum: action.playerHandSum,
                    enemyHandSum: action.enemyHandSum,
                    bet: action.bet,
                    cash: action.cash,
                    playerHand: action.playerHand,
                    enemyHand: action.enemyHand,
                    isEnough: false,
                    isMore: false
                }
            }
        case DEAL_HAND:
            return{
                ...state,
                user: {
                    ...state.user,
                    enemyHand: action.enemyHand,
                    enemyHandSum: action.enemyHandSum
                }
            }
        case PLAY_HAND:
            return{
                ...state,
                user: {
                    ...state.user,
                    playerHand: action.playerHand,
                    playerHandSum: action.playerHandSum
                }
            }
        default:
            return state
    }
}