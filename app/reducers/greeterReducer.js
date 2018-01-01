const defaultState = {
    message: 'Lux',
    username: 'User',
    drawerOpen: false
};

export default function greeterReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_MESSAGE':
            return {
                ...state,
                message: action.message
            };
        case 'SET_USER':
            return {
                ...state,
                username: action.username
            };
        case 'SET_DRAWER':
            return {
                ...state,
                drawerOpen: action.drawerOpen
            };
        default:
            return state;
    }
}