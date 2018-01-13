import React from 'react';
import services from 'Services';
import serviceManager from 'ServiceManager';

import PropTypes from 'prop-types';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Notification from 'Components/nofification/notification';

import kute from 'kute.js'
import Fingerprint2 from 'fingerprintjs2'
import './login.css'
import ReactDOM from "react-dom";

class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    toggleLoginRegister(evt) {
        let button = evt.currentTarget,
            activeView = document.querySelector('.form.active'),
            hiddenView = document.querySelector('.form:not(.active)'),
            activeViewTween = kute.fromTo('.form.active', {opacity: 1}, {opacity: 0}),
            hiddenViewTween = kute.fromTo('.form:not(.active)', {opacity: 0}, {opacity: 1});

        if (activeView.classList.contains('login-form')) {
            button.querySelector('.info-tip').innerHTML = 'Login';
        } else {
            button.querySelector('.info-tip').innerHTML = 'Register';
        }
        activeViewTween.start();
        hiddenViewTween.start();

        activeView.classList.remove('active');
        hiddenView.classList.add('active');

        self.props.dispatch({
            type: 'RESET_LOGIN_STATE'
        });
    }

    handleRegisterButtonClick() {
        let self = this,
            state = this.context.store.getState().authReducer,
            options = {
                data: {
                    username: state.username,
                    password: state.password,
                    passwordConfirm: state.passwordConfirm,
                    email: state.email,
                    tel: state.tel
                },
                url: services.register.url
            };

        //memory leak?
        new Fingerprint2().get(function (result) {
            options.data.browser = result;

            serviceManager.post(options).then(function (response) {
                (response.success) ? self._handleAuthSuccess(response) : self._handleAuthFailure(response);
            }).catch(self._handleAuthFailure.bind(self));
        });
    }

    handleLoginButtonClick() {
        let self = this,
            state = this.context.store.getState().authReducer,
            options = {
                data: {
                    username: state.username,
                    password: state.password
                },
                url: services.login.url
            };

        //memory leak?
        new Fingerprint2().get(function (result) {
            options.data.browser = result;

            serviceManager.post(options).then(function (response) {
                (response.success) ? self._handleAuthSuccess(response) : self._handleAuthFailure(response);
            }).catch(self._handleAuthFailure.bind(self));
        });
    }

    validateInput() {

    }

    handleInputChange(evt) {
        let inputField = evt.currentTarget,
            strAction = inputField.getAttribute('data-action'),
            strKey = inputField.getAttribute('data-field'),
            stateObj = {type: 'SET_' + strAction};

        stateObj[strKey] = inputField.value;

        this.props.dispatch(stateObj);
    }

    _handleAuthSuccess(response) {
        let self = this,
            container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }

        localStorage.setItem('token', response.token);

        self.props.dispatch({
            type: 'SET_AUTH',
            auth: response.token
        });

        self.props.dispatch({
            type: 'SET_USERNAME',
            username: response.username
        });

        self.context.store.dispatch(push('/home'));
    }

    _handleAuthFailure(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    render() {
        return (
            <div className="login-component">
                <div className="module form-module">
                    <div className="toggle" onClick={this.toggleLoginRegister}>
                        <div className="info-tip">Register</div>
                    </div>
                    <div className="form active login-form">
                        <h2>Login to your account</h2>
                        <div className="login-info">
                            <TextField type="text" floatingLabelText="Username" className="login-username"
                                       data-action="USERNAME"
                                       data-field="username" onChange={this.handleInputChange.bind(this)}/>
                            <TextField type="password" floatingLabelText="Password" className="login-password"
                                       data-field="password" data-action="PASSWORD"
                                       onChange={this.handleInputChange.bind(this)}/>
                            <FlatButton onClick={this.handleLoginButtonClick.bind(this)} label={"Login"}/>
                        </div>
                    </div>
                    <div className="form register-form">
                        <h2>Create an account</h2>
                        <div className="register-info">
                            <TextField type="text" floatingLabelText="Username" className="register-username"
                                       data-action="USERNAME" data-field="username"
                                       onChange={this.handleInputChange.bind(this)}/>
                            <TextField type="password" floatingLabelText="Password" className="register-password"
                                       data-action="PASSWORD" data-field="password"
                                       onChange={this.handleInputChange.bind(this)}/>
                            <TextField type="password" floatingLabelText="Confirm Password"
                                       className="conf-register-password"
                                       data-action="CONF_PASSWORD" data-field="passwordConfirm"
                                       onChange={this.handleInputChange.bind(this)}/>
                            <TextField type="email" floatingLabelText="Email Address" className="register-email"
                                       data-action="EMAIL" data-field="email"
                                       onChange={this.handleInputChange.bind(this)}
                                       pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                                       required/>
                            <TextField type="tel" floatingLabelText="Phone Number" className="register-tel"
                                       data-action="TEL"
                                       data-field="tel" onChange={this.handleInputChange.bind(this)}/>
                            <FlatButton onClick={this.handleRegisterButtonClick.bind(this)} label={"Register"}/>
                        </div>
                    </div>
                    <div className="cta"><a href="#">Forgot your password?</a></div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
    username: PropTypes.string,
    tel: PropTypes.string,
    auth: PropTypes.string
};

Login.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        email: state.authReducer.email,
        password: state.authReducer.password,
        passwordConfirm: state.authReducer.password,
        username: state.authReducer.password,
        tel: state.authReducer.password,
        auth: state.authReducer.auth
    };
}

export default withRouter(connect(mapStateToProps)(Login));
