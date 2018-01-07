import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';

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

    componentWillUnmount() {
        this.props.socket.emit('leave', this.props.roomID);
    }

    componentDidUpdate() {
        this.focusLatestMessage();
    }

    focusLatestMessage() {
        let element = document.querySelectorAll('.chat-content:last-of-type')[0];

        if (element) {
            element.scrollIntoView();
        }
    }

    _getMessages() {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.room.getMessages.replace(':id', this.props.roomID)
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
    }

    _initializeSocket() {
        let self = this;

        this.props.socket.emit('room', self.props.roomID);
        this.props.socket.on('new-message', self._getMessages.bind(self));
    }

    _handleMessagesLoadFailure() {

    }

    sendMessage() {
        let state = this.context.store.getState().messengerReducer;

        this.props.socket.emit('message', {
            message: state.newMessage,
            room: this.props.roomID
        });

        this.props.dispatch({
            type: 'ADD_NEW_MESSAGE',
            newMessage: ''
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
                            <Message messages={this.props.messages}
                                     username={this.context.store.getState().authReducer.username}/>
                        </div>
                        <div className={"messenger-author"}>
                            <div className="message-author-content">
                                <TextField floatingLabelText="Get Involved" type="text" value={this.props.newMessage}
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
    messages: PropTypes.arrayOf(PropTypes.object)
};

Messenger.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        newMessage: state.messengerReducer.newMessage,
        messages: state.messengerReducer.messages
    };
}

export default connect(mapStateToProps)(Messenger);