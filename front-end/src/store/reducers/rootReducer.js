import { combineReducers } from 'redux'
import playReducer from './playTable'

export default combineReducers({
    playTable: playReducer
})