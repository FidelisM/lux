const defaultState = {
    newMessage: '',
    messages: []
};

export default function messengerReducer(state = defaultState, action) {
    switch (action.type) {
        case 'ADD_NEW_MESSAGE':
            return Object.assign({}, state, {
                newMessage: action.newMessage
            });
        case 'UPDATE_MESSAGE_LIST':
            return Object.assign({}, state, {
                messages: action.messages
            });
        default:
            return state;
    }
}