const defaultState = {
    message: 'Lux'
};

export default function greeterReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_MESSAGE':
            return {
                ...state,
                message: action.message
            };
        default:
            return state;
    }
}