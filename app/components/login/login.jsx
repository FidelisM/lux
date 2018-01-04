import React from 'react';
import services from 'Services';
import serviceManager from 'ServiceManager';

import PropTypes from 'prop-types';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import kute from 'kute.js'
import Fingerprint2 from 'fingerprintjs2'
import './login.css'

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
        new Fingerprint2().get(function(result){
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
        new Fingerprint2().get(function(result){
            options.data.browser = result;

            serviceManager.post(options).then(function (response) {
                (response.success) ? self._handleAuthSuccess(response) : self._handleAuthFailure(response);
            }).catch(self._handleAuthFailure.bind(self));
        });
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
        let self = this;

        localStorage.setItem('token', response.token);

        self.props.dispatch({
            type: 'SET_AUTH',
            auth: response.token
        });

        self.props.dispatch({
            type: 'SET_USER',
            username: response.username
        });

        self.context.store.dispatch(push('/home'));
    }

    _handleAuthFailure() {
        let self = this;

        localStorage.removeItem('token');

        self.props.dispatch({
            type: 'SET_AUTH',
            auth: {}
        });
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
                            <input type="text" placeholder="Username" className="login-username" data-action="USERNAME"
                                   data-field="username" onChange={this.handleInputChange.bind(this)}/>
                            <input type="password" placeholder="Password" className="login-password"
                                   data-field="password" data-action="PASSWORD"
                                   onChange={this.handleInputChange.bind(this)}/>
                            <button onClick={this.handleLoginButtonClick.bind(this)}>Login</button>
                        </div>
                    </div>
                    <div className="form register-form">
                        <h2>Create an account</h2>
                        <div className="register-info">
                            <input type="text" placeholder="Username" className="register-username"
                                   data-action="USERNAME" data-field="username"
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="password" placeholder="Password" className="register-password"
                                   data-action="PASSWORD" data-field="password"
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="password" placeholder="Confirm Password" className="conf-register-password"
                                   data-action="CONF_PASSWORD" data-field="passwordConfirm"
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="email" placeholder="Email Address" className="register-email"
                                   data-action="EMAIL" data-field="email"
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="tel" placeholder="Phone Number" className="register-tel" data-action="TEL"
                                   data-field="tel" onChange={this.handleInputChange.bind(this)}/>
                            <button onClick={this.handleRegisterButtonClick.bind(this)}>Register</button>
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
    auth: PropTypes.object
};

Login.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        email: state.email,
        password: state.password,
        passwordConfirm: state.password,
        username: state.password,
        tel: state.password,
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps)(Login));
