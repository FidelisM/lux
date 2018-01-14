const defaultState = {
    email: '',
    password: '',
    passwordConfirm: '',
    username: '',
    telephone: '',
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
                telephone: action.telephone
            };
        case 'SET_AUTH':
            return {
                ...state,
                auth: action.auth
            };
        case 'RESET_LOGIN_STATE':
            return {
                email: '',
                password: '',
                passwordConfirm: '',
                username: '',
                telephone: '',
                auth: state.auth
            };
        case 'SET_LOGGED_IN_USER':
            return {
                ...state,
                email: action.email,
                username: action.username,
                telephone: action.telephone,
            };
        default:
            return state;
    }
}