import {FETCH_PLAY_START,
        FETCH_MAKE_BET,
        HAND_SUCCESS,
        WIN_GAME,
        LOSE_GAME,
        DRAW_GAME,
        DEAL_HAND,
        PLAY_HAND,
        DATA_USER} from '../actions/actionType'

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
    bet: 0,
    cash: 0,
    nameUser: '',
    playerHand: [],
    playerHandSum: 0,
    dealerHand: [],
    dealerHandSum: 0,
    isPlay: false,
    isEnough: false,
    isMore: false,
    backProfile: false,
    isExit: false
}

export default function playReducer(state = initialState, action){
    switch(action.type){
        case FETCH_PLAY_START:
            return{
                ...state
            }
        case DATA_USER:
            if(action.playerHand == undefined){
                return{
                    ...state,
                    playerHand: [],
                    playerHandSum: 0,
                    dealerHand: [],
                    dealerHandSum: 0,
                    bet: action.bet,
                    cash: action.cash,
                    nameUser: action.name,
                    isPlay: action.isPlay
                }
            } else{
                return{
                    ...state,
                    playerHand: action.playerHand,
                    playerHandSum: action.playerHandSum,
                    dealerHand: action.dealerHand,
                    dealerHandSum: action.dealerHandSum,
                    bet: action.bet,
                    cash: action.cash,
                    nameUser: action.name,
                    isPlay: false,
                    isEnough: true,
                    isMore: true
                }
            }
        case FETCH_MAKE_BET:
            return{
                ...state, 
                bet: action.bet, 
                cash: action.cash,
                isPlay: action.isPlay
            }
        case HAND_SUCCESS:
            return{
                ...state,
                playerHand: action.playerHand,
                playerHandSum: action.playerHandSum,
                dealerHand: action.dealerHand,
                dealerHandSum: action.dealerHandSum,
                isPlay: false,
                isEnough: true,
                isMore: true
            }
        case WIN_GAME:
            return{
                ...state,
                playerHandSum: action.playerHandSum,
                dealerHandSum: action.dealerHandSum,
                bet: action.bet,
                cash: action.cash,
                playerHand: action.playerHand,
                dealerHand: action.dealerHand,
                isEnough: false,
                isMore: false
            }
        case LOSE_GAME:
            return{
                ...state,
                playerHandSum: action.playerHandSum,
                bet: action.bet,
                dealerHandSum: action.dealerHandSum,
                playerHand: action.playerHand,
                dealerHand: action.dealerHand,
                isEnough: false,
                isMore: false
            }
        case DRAW_GAME:
            return{
                ...state,
                playerHandSum: action.playerHandSum,
                dealerHandSum: action.dealerHandSum,
                bet: action.bet,
                cash: action.cash,
                playerHand: action.playerHand,
                dealerHand: action.dealerHand,
                isEnough: false,
                isMore: false
            }
        case DEAL_HAND:
            return{
                ...state,
                dealerHand: action.dealerHand,
                dealerHandSum: action.dealerHandSum
            }
        case PLAY_HAND:
            return{
                ...state,
                playerHand: action.playerHand,
                playerHandSum: action.playerHandSum
            }
        default:
            return state
    }
}