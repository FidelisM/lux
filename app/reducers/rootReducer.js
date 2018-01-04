import {combineReducers} from 'redux';
import authReducer from './authReducer'
import greeterReducer from './greeterReducer'
import messengerReducer from './messengerReducer'

export default combineReducers({
    authReducer,
    greeterReducer,
    messengerReducer
})