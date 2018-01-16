import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';
import Fingerprint2 from 'fingerprintjs2';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Notification from 'Components/nofification/notification';
import Badge from 'material-ui/Badge';

import services from 'Services';
import serviceManager from 'ServiceManager';

import AlertDialog from 'Widgets/alertDialog/alertDialog';

import {grey500, pinkA200} from 'material-ui/styles/colors';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import PhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';

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
            initialTelephone: this.props.telephone,
            image: {},
            isFileSelected: false,
            isPictureTaken: false
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
        let token = localStorage.getItem('token'),
            headers = {
                Authorization: token
            };

        fetch(services.user.getMyImage, {headers: new Headers(headers)}).then(function (response) {
            return response.blob();
        }).then(function (imgBlob) {
            let image = document.querySelector('#image-canvas');

            if (/image/.test(imgBlob.type)) {
                image.src = window.URL.createObjectURL(imgBlob);
            } else {
                image.src = './default.jpg';
            }
        });
    }

    handleSave() {
        let self = this,
            token = localStorage.getItem('token'),
            state = this.context.store.getState().authReducer,
            options = {
                headers: {
                    Authorization: token
                },
                data: {
                    username: state.username,
                    password: state.password,
                    passwordConfirm: state.passwordConfirm,
                    currentPassword: state.currentPassword,
                    telephone: state.telephone
                },
                url: services.user.update
            };

        if (self.state.image.name) {
            self._handleImageUpload();
            return;
        }

        if (this._inputIsValid(options.data)) {
            new Fingerprint2().get(function (result) {
                options.headers.browser = result;

                serviceManager.post(options).then(function (response) {
                    (response.success) ? self._handleSaveSuccess(response) : self._handleSaveFailure(response);
                }).catch(self._handleSaveFailure.bind(self));
            });
        }
    }

    _handleImageUpload() {
        let self = this,
            token = localStorage.getItem('token'),
            formData = new FormData(),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.user.image,
                ignoreDefaultHeaders: true,
                ignoreStringify: true
            };

        formData.append('image', self.state.image);
        options.data = formData;

        new Fingerprint2().get(function (result) {
            options.headers.browser = result;

            serviceManager.post(options).then(function (response) {
                (response.success) ? self._handleImageUploadSuccess(response) : self._handleImageUploadFailure(response);
            }).catch(self._handleImageUploadFailure.bind(self));
        });
    }

    _handleImageUploadSuccess(response) {
        this._loadImage();
        this._handleSaveSuccess(response);
    }

    _handleImageUploadFailure() {
    }

    handleFileSelection(evt) {
        this.setState({
            image: evt.target.files[0],
            isFileSelected: true
        });

        let image = document.querySelector('#image-canvas');
        image.src = window.URL.createObjectURL(evt.target.files[0]);
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
                        track = localstream.getTracks()[0],
                        profilePicEl = document.querySelector('#image-canvas'),
                        imageCapture = new ImageCapture(track);

                    /*self.setState({
                        image: localstream,
                        isPictureTaken: true
                    });

                    profilePicEl.src = window.URL.createObjectURL(localstream);*/

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
                                <Badge badgeContent={<IconButton tooltip="Delete"><DeleteIcon/></IconButton>}>
                                    <div className="profile-picture">
                                        <img id="image-canvas" className="img-circle"/>
                                    </div>
                                </Badge>
                                <div className="action-buttons">
                                    <RaisedButton icon={<PhotoIcon/>} primary={this.state.isPictureTaken}
                                                  onClick={this.openCamera.bind(this)}/>
                                    <RaisedButton icon={<UploadIcon/>} style={{marginLeft: 20}}
                                                  containerElement='label' primary={this.state.isFileSelected}>
                                        <input type="file" style={{display: 'none'}}
                                               onChange={this.handleFileSelection.bind(this)}/>
                                    </RaisedButton>
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
                                           value={this.props.currentPassword}
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