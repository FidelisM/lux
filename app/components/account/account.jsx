import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import services from 'Services';
import serviceManager from 'ServiceManager';

import AlertDialog from 'Widgets/alertDialog/alertDialog';

import {grey500} from 'material-ui/styles/colors';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import PhotoIcon from 'material-ui/svg-icons/image/add-a-photo';

import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './account.css';

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usernameErrorText: 'Username cannot be changed',
            emailErrorText: '',
            passwordErrorText: '',
            passwordConfirmErrorText: ''
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

        this.props.dispatch(stateObj);
    }

    handleSave() {
    }

    handleClose() {
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
                                    <img src="https://www.themarysue.com/wp-content/uploads/2015/12/avatar.jpeg"
                                         className="img-circle"/>
                                </div>
                                <div className="action-buttons">
                                    <RaisedButton icon={<PhotoIcon/>}
                                                  onClick={this.openCamera.bind(this)}/>
                                    <RaisedButton icon={<UploadIcon/>} style={{marginLeft: 20}}
                                                  onClick={this.handleSave.bind(this)}/>
                                </div>
                            </div>
                            <TextField type="text" floatingLabelText="Username" className="my-account-username"
                                       data-action="USERNAME" data-field="username" readOnly={true}
                                       value={this.props.username} fullWidth={true}
                                       errorStyle={{color: grey500}} floatingLabelStyle={{color: grey500}}
                                       floatingLabelFocusStyle={{color: grey500}}
                                       inputStyle={{color: grey500}}
                                       errorText={this.state.usernameErrorText}/>
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
                            <TextField type="email" floatingLabelText="Email Address" className="my-account-email"
                                       data-action="EMAIL" data-field="email" value={this.props.email}
                                       onChange={this.handleInputChange.bind(this)} fullWidth={true}
                                       errorText={this.state.emailErrorText}/>
                            <TextField type="tel" floatingLabelText="Phone Number" className="my-account-telephone"
                                       data-action="TEL" value={this.props.telephone} fullWidth={true}
                                       data-field="telephone" onChange={this.handleInputChange.bind(this)}/>
                        </div>
                        <div className={"my-account-actions"}>
                            <div className="my-account-buttons right">
                                <RaisedButton label={'Close'}
                                              onClick={this.handleClose.bind(this)}/>
                                <RaisedButton label={'Save'} style={{marginLeft: 10}}
                                              onClick={this.handleSave.bind(this)} primary={true}/>
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
        telephone: state.authReducer.telephone,
        auth: state.authReducer.auth
    };
}

export default connect(mapStateToProps)(Account);