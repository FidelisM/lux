const defaultState = {
    message: 'Lux',
    username: 'User'
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
        default:
            return state;
    }
}