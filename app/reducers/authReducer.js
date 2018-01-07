const defaultState = {
    email: '',
    password: '',
    passwordConfirm: '',
    username: '',
    tel: '',
    auth: ''
};

export default function authReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.email
            };
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.password
            };
        case 'SET_CONF_PASSWORD':
            return {
                ...state,
                passwordConfirm: action.passwordConfirm
            };
        case 'SET_USERNAME':
            return {
                ...state,
                username: action.username
            };
        case 'SET_TEL':
            return {
                ...state,
                tel: action.tel
            };
        case 'SET_AUTH':
            return {
                ...state,
                auth: action.auth
            };
        default:
            return state;
    }
}