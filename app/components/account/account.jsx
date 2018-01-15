import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';
import Fingerprint2 from 'fingerprintjs2';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Notification from 'Components/nofification/notification';

import services from 'Services';
import serviceManager from 'ServiceManager';

import AlertDialog from 'Widgets/alertDialog/alertDialog';

import {grey500, pinkA200} from 'material-ui/styles/colors';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import PhotoIcon from 'material-ui/svg-icons/image/add-a-photo';

import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './account.css';

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usernameErrorText: '',
            emailErrorText: 'E-mail cannot be changed',
            passwordErrorText: '',
            passwordConfirmErrorText: '',
            currentPasswordErrorText: '',
            saveDisabled: true,
            initialUsername: this.props.username,
            initialTelephone: this.props.telephone
        }
    }

    handleInputChange(evt) {
        let inputField = evt.currentTarget,
            strAction = inputField.getAttribute('data-action'),
            strKey = inputField.getAttribute('data-field'),
            stateObj = {type: 'SET_' + strAction},
            localStateKey = strKey + 'ErrorText',
            localStateObj = {};

        stateObj[strKey] = inputField.value;
        localStateObj[localStateKey] = '';

        if (this.state.hasOwnProperty(localStateKey)) {
            this.setState(localStateObj);
        }

        if (strKey === 'currentPassword' && inputField.value) {
            this.setState({
                saveDisabled: false
            })
        } else if (strKey === 'currentPassword' && !inputField.value) {
            this.setState({
                saveDisabled: true
            })
        }

        this.props.dispatch(stateObj);
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'SET_DRAWER',
            drawerOpen: false
        });

        this._loadImage();
    }

    componentWillUnmount() {
        let state = this.context.store.getState().authReducer;

        this.props.dispatch({
            type: 'SET_LOGGED_IN_USER',
            username: this.state.initialUsername,
            email: state.email,
            telephone: this.state.initialTelephone
        });

        this.props.initializeSocket();
    }

    _loadImage() {
        fetch('https://www.themarysue.com/wp-content/uploads/2015/12/avatar.jpeg', {
            mode: 'no-cors'
        }).then(function (response) {
            return response.blob();
        }).then(function (imgBlob) {
            let image = document.querySelector('#image-canvas');
            image.src = window.URL.createObjectURL(imgBlob);
        });
    }

    handleSave() {
        let self = this,
            state = this.context.store.getState().authReducer,
            options = {
                headers: {},
                data: {
                    username: state.username,
                    password: state.password,
                    passwordConfirm: state.passwordConfirm,
                    currentPassword: state.currentPassword,
                    telephone: state.telephone
                },
                url: services.user.update
            };

        if (this._inputIsValid(options.data)) {
            new Fingerprint2().get(function (result) {
                options.headers.browser = result;

                serviceManager.post(options).then(function (response) {
                    (response.success) ? self._handleSaveSuccess(response) : self._handleSaveFailure(response);
                }).catch(self._handleSaveFailure.bind(self));
            });
        }
    }

    _handleSaveSuccess(response) {
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
            type: 'SET_LOGGED_IN_USER',
            username: response.user.username,
            email: response.user.email,
            telephone: response.user.telephone
        });

        self.setState({
            initialUsername: self.props.username,
            initialTelephone: self.props.telephone
        })
    }

    _handleSaveFailure(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    _inputIsValid(form) {
        if ((form.password || form.passwordConfirm) && (form.passwordConfirm !== form.password)) {
            this.setState({
                passwordErrorText: 'Passwords do not match.',
                passwordConfirmErrorText: 'Passwords do not match.'
            });

            return false;
        }

        if (!form.username) {
            this.setState({
                usernameErrorText: 'A username is required.',
            });

            return false;
        }

        return (form.username || ((form.password && form.passwordConfirm) && (form.passwordConfirm === form.password))) && form.currentPassword;
    }

    handleClose() {
        let container = document.getElementsByClassName('messenger')[0],
            myAccountContainer = document.getElementsByClassName('my-account')[0];

        this.props.dispatch({
            type: 'SET_DRAWER',
            drawerOpen: true
        });

        myAccountContainer.style.display = 'none';
        container.style.display = 'flex';

        ReactDOM.unmountComponentAtNode(myAccountContainer);
        ReactDOM.unmountComponentAtNode(container);
    }

    openCamera() {
        let self = this,
            localstream,
            props = {
                width: 690,
                label: 'Snap',
                onRenderComplete: function () {
                    let video = document.getElementById('live-photo');

                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
                            video.src = window.URL.createObjectURL(stream);
                            video.play();
                            localstream = stream;
                        });
                    }
                },
                closeCB: () => {
                    let video = document.getElementById('live-photo'),
                        track = localstream.getTracks()[0];

                    video.src = '';
                    video.pause();
                    track.stop();
                },
                nextDisabled: true,
                content: () => {
                    return (<div>
                        <video id="live-photo" width="640" height="480"/>
                    </div>)
                }
            },
            container = document.getElementById('overlay');

        ReactDOM.unmountComponentAtNode(container);
        ReactDOM.render(<AlertDialog {...props} ref={function (alertDialog) {
            self.alertDialog = alertDialog;
        }.bind(this)}/>, container);
    }

    render() {
        return (
            <Draggable handle=".my-account-component .header" bounds={'parent'}>
                <div className={"my-account-component"}>
                    <div className="content">
                        <div className="header">
                            <Subheader>My Account</Subheader>
                        </div>
                        <Divider/>
                        <div className="my-account-view" id="my-account-view">
                            <div className="avatar-actions">
                                <div className="profile-picture">
                                    <img id="image-canvas" className="img-circle"/>
                                </div>
                                <div className="action-buttons">
                                    <RaisedButton icon={<PhotoIcon/>}
                                                  onClick={this.openCamera.bind(this)}/>
                                    <RaisedButton icon={<UploadIcon/>} style={{marginLeft: 20}}
                                                  onClick={this.handleSave.bind(this)}/>
                                </div>
                            </div>
                            <div className="text-fields">
                                <TextField type="text" floatingLabelText="Username" className="my-account-username"
                                           data-action="USERNAME" data-field="username"
                                           value={this.props.username} fullWidth={true}
                                           onChange={this.handleInputChange.bind(this)}
                                           errorText={this.state.usernameErrorText}/>
                                <TextField type="email" floatingLabelText="Email Address" className="my-account-email"
                                           data-action="EMAIL" data-field="email" value={this.props.email}
                                           onChange={this.handleInputChange.bind(this)} fullWidth={true} readOnly={true}
                                           errorStyle={{color: grey500}} floatingLabelStyle={{color: grey500}}
                                           floatingLabelFocusStyle={{color: grey500}}
                                           inputStyle={{color: grey500}}
                                           errorText={this.state.emailErrorText}/>
                                <TextField type="password" floatingLabelText="New Password"
                                           className="my-account-new-password" fullWidth={true}
                                           data-action="PASSWORD" data-field="password"
                                           onChange={this.handleInputChange.bind(this)}
                                           errorText={this.state.passwordErrorText}/>
                                <TextField type="password" floatingLabelText="Confirm New Password"
                                           className="confirm-my-account-password" fullWidth={true}
                                           data-action="CONF_PASSWORD" data-field="passwordConfirm"
                                           onChange={this.handleInputChange.bind(this)}
                                           errorText={this.state.passwordConfirmErrorText}/>
                                <TextField type="tel" floatingLabelText="Phone Number" className="my-account-telephone"
                                           data-action="TEL" value={this.props.telephone} fullWidth={true}
                                           data-field="telephone" onChange={this.handleInputChange.bind(this)}/>
                            </div>
                        </div>
                        <div className={"my-account-actions"}>
                            <div className="password-enable">
                                <TextField type="password" floatingLabelText="Current Password"
                                           className="my-account-curr-password"
                                           data-action="CURR_PASSWORD" data-field="currentPassword"
                                           onChange={this.handleInputChange.bind(this)} errorStyle={{color: pinkA200}}
                                           style={{height: 50, marginLeft: 10}} underlineStyle={{borderColor: pinkA200}}
                                           underlineFocusStyle={{borderColor: pinkA200}} fullWidth={true}
                                           floatingLabelFocusStyle={{color: pinkA200}} inputStyle={{marginTop: 0}}
                                           floatingLabelStyle={{top: 15, color: pinkA200}}
                                           errorText={this.state.currentPasswordErrorText}/>
                            </div>
                            <div className="my-account-buttons">
                                <div className="button-style-wrap right">
                                    <RaisedButton label={'Close'} style={{margin: 5, minWidth: 'auto'}}
                                                  onClick={this.handleClose.bind(this)}/>
                                    <RaisedButton label={'Save'} style={{margin: 5, minWidth: 'auto'}}
                                                  disabled={this.state.saveDisabled}
                                                  onClick={this.handleSave.bind(this)} primary={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        )
    }
}

Account.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        username: state.authReducer.username,
        email: state.authReducer.email,
        password: state.authReducer.password,
        passwordConfirm: state.authReducer.passwordConfirm,
        currentPassword: state.authReducer.currentPassword,
        telephone: state.authReducer.telephone,
        auth: state.authReducer.auth
    };
}

export default connect(mapStateToProps)(Account);