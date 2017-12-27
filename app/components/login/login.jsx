import React from 'react';
import services from 'Services';
import serviceManager from 'ServiceManager';

import loginStyles from './login.css'

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordConfirm: '',
            email: '',
            tel: ''
        };
    }

    toggleLoginRegister(evt) {
        let button = evt.currentTarget,
            activeView = document.querySelector('.form.active'),
            hiddenView = document.querySelector('.form:not(.active)');

        if (activeView.classList.contains('login-form')) {
            button.querySelector('.info-tip').innerHTML = 'Login';
        } else {
            button.querySelector('.info-tip').innerHTML = 'Register';
        }

        activeView.classList.remove('active');
        hiddenView.classList.add('active');
    }

    handleRegisterButtonClick() {
        let options = {
            data: {
                username: this.state.username,
                password: this.state.password,
                passwordConfirm: this.state.passwordConfirm,
                email: this.state.email,
                tel: this.state.tel
            },
            url: services.register.url
        };

        serviceManager.post(options).then(function (response) {
            debugger
        }).catch(function (response) {
            debugger
        });
    }

    handleLoginButtonClick() {
        let options = {
            data: {
                username: this.state.username,
                password: this.state.password
            },
            url: services.login.url
        };

        serviceManager.post(options).then(function (response) {
            localStorage.setItem('token', JSON.stringify(response.token));
        }).catch(function (response) {
            debugger
        });
    }

    handleInputChange(evt) {
        let inputField = evt.currentTarget,
            key = inputField.getAttribute('data-field'),
            stateObj = {};

        stateObj[key] = inputField.value;

        this.setState(stateObj);
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
                            <input type="text" placeholder="Username" className="login-username" data-field="username"
                                   value={this.state.username} onChange={this.handleInputChange.bind(this)}/>
                            <input type="password" placeholder="Password" className="login-password"
                                   data-field="password" value={this.state.password}
                                   onChange={this.handleInputChange.bind(this)}/>
                            <button onClick={this.handleLoginButtonClick.bind(this)}>Login</button>
                        </div>
                    </div>
                    <div className="form register-form">
                        <h2>Create an account</h2>
                        <div className="register-info">
                            <input type="text" placeholder="Username" className="register-username"
                                   data-field="username" value={this.state.username}
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="password" placeholder="Password" className="register-password"
                                   data-field="password" value={this.state.password}
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="password" placeholder="Confirm Password" className="conf-register-password"
                                   data-field="passwordConfirm" value={this.state.passwordConfirm}
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="email" placeholder="Email Address" className="register-email"
                                   data-field="email" value={this.state.email}
                                   onChange={this.handleInputChange.bind(this)}/>
                            <input type="tel" placeholder="Phone Number" className="register-tel" data-field="tel"
                                   value={this.state.tel} onChange={this.handleInputChange.bind(this)}/>
                            <button onClick={this.handleRegisterButtonClick.bind(this)}>Register</button>
                        </div>
                    </div>
                    <div className="cta"><a href="#">Forgot your password?</a></div>
                </div>
            </div>
        );
    }
}