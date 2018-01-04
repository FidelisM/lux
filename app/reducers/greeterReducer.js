const defaultState = {
    message: 'spoqn',
    username: '',
    rooms: [],
    room: '',
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
        case 'SET_RM_NAME':
            return {
                ...state,
                room: action.room
            };
        case 'SET_RM_LIST':
            return {
                ...state,
                rooms: action.rooms
            };
        default:
            return state;
    }
}