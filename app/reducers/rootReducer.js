import {combineReducers} from 'redux';
import authReducer from './authReducer'
import greeterReducer from './greeterReducer'

export default combineReducers({
    authReducer,
    greeterReducer
})