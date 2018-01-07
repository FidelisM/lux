import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';

import io from 'socket.io-client';
import _ from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import services from 'Services';
import serviceManager from 'ServiceManager';
import Message from 'Components/message/message';

import {fullWhite} from 'material-ui/styles/colors';
import SendIcon from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './messenger.css';

let socket,
    openSockets = [];

class Messenger extends React.Component {
    constructor(props) {
        super(props);

        this.styles = {
            button: {
                color: '#FFFFFF'
            },
            input: {
                width: '85%'
            }
        };
    }

    componentDidMount() {
        if (this.props.roomID) {
            this._getMessages().then(this._initializeSocket.bind(this));
        }
    }

    componentDidUpdate() {
        document.querySelector('.messenger-author .user-input').value = '';
    }

    focusLatestMessage() {
        let element;
    }

    _getMessages() {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.chat.getMessages.replace(':id', this.props.roomID)
            },
            promise = serviceManager.get(options);

        promise.then(function (response) {
            if (response.success) {
                self._handleMessagesLoadSuccess(response);
            } else {
                self._handleMessagesLoadFailure(response);
            }
        }).catch(self._handleMessagesLoadFailure.bind(self));

        return promise;
    }

    _handleMessagesLoadSuccess(response) {
        this.props.dispatch({
            type: 'UPDATE_MESSAGE_LIST',
            messages: response.messages
        });

        this.forceUpdate();

        document.querySelectorAll('.chat-content:last-of-type')[0].scrollIntoView();
    }

    _initializeSocket() {
        let self = this,
            token = localStorage.getItem('token'),
            socketURL = '/spoqn/messenger/' + this.props.roomID,
            socketIndex,
            options = {
                headers: {
                    Authorization: token
                },
                url: services.chat.openConnection.replace(':id', this.props.roomID)
            };

        socketIndex = _.findIndex(openSockets, function (socket) {
            return socket.nsp === socketURL;
        });

        if (socketIndex === -1) {
            socket = io(socketURL, {
                query: 'token=' + token
            });

            socket.on('new-message', function () {
                self._getMessages();
            });

            openSockets.push(socket);
        } else {
            socket = openSockets[socketIndex];
        }

        serviceManager.get(options);
    }

    _handleMessagesLoadFailure() {

    }

    sendMessage() {
        let state = this.context.store.getState().messengerReducer;

        socket.emit('message', {
            message: state.newMessage,
            room: this.props.roomID
        });
    }

    handleNewMessage(e) {
        this.props.dispatch({
            type: 'ADD_NEW_MESSAGE',
            newMessage: e.currentTarget.value
        });
    }

    render() {
        return (
            <Draggable handle=".messenger-component .header">
                <div className={"messenger-component"}>
                    <div className="content">
                        <div className="header">
                            <Subheader>Room: {this.props.roomName}</Subheader>
                        </div>
                        <Divider/>
                        <div className="messenger-view" id="messenger-view">
                            <Message messages={this.context.store.getState().messengerReducer.messages}
                                     username={this.context.store.getState().authReducer.username}/>
                        </div>
                        <div className={"messenger-author"}>
                            <div className="message-author-content">
                                <TextField floatingLabelText="Get Involved" type="text"
                                           className="user-input inline-block" id="user-input"
                                           multiLine={true} rows={3} rowsMax={6} style={this.styles.input}
                                           onChange={this.handleNewMessage.bind(this)}/>
                                <RaisedButton backgroundColor="#A4C639" icon={<SendIcon color={fullWhite}/>}
                                              primary={true}
                                              style={this.styles.button} onClick={this.sendMessage.bind(this)}
                                              label="Send"
                                              labelPosition="before"/>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}

Messenger.propTypes = {
    newMessage: PropTypes.string,
    messages: PropTypes.object
};

Messenger.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        newMessage: state.newMessage,
        messages: state.messages
    };
}

export default connect(mapStateToProps)(Messenger);