import defaultState from 'Common/state/defaults';

export default function marketReducer(state = defaultState.marketReducer, action) {
    switch (action.type) {
        case 'SET_WL_NAME':
            return Object.assign({}, state, {
                watchListName: action.watchListName
            });
            case 'SET_WATCH_LISTS':
            return Object.assign({}, state, {
                watchLists: action.watchLists
            });
        default:
            return state;
    }
}