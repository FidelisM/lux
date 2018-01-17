import {combineReducers} from 'redux';
import authReducer from './authReducer';
import greeterReducer from './greeterReducer';
import messengerReducer from './messengerReducer';

import defaultState from 'Common/state/defaults';

const appReducer = combineReducers({
    authReducer,
    greeterReducer,
    messengerReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = defaultState
    }

    return appReducer(state, action)
};

export default rootReducer;