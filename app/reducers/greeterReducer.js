const defaultState = {
    title: 'spoqn',
    rooms: [],
    room: '',
    friend: '',
    friends: [],
    drawerOpen: false
};

export default function greeterReducer(state = defaultState, action) {
    switch (action.type) {
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
        case 'ADD_FRIEND':
            return {
                ...state,
                friend: action.friend
            };
        case 'SET_FRIENDS_LIST':
            return {
                ...state,
                friends: action.friends
            };
        default:
            return state;
    }
}