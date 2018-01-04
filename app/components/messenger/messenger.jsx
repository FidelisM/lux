import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import services from 'Services';
import serviceManager from 'ServiceManager';
import Message from 'Components/message/message';

import {fullWhite} from 'material-ui/styles/colors';
import SendIcon from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import messengerStyles from './messenger.css';

class Messenger extends React.Component {
    constructor(props) {
        super(props);

        this.styles = {
            button: {
                color: '#FFFFFF',
                marginLeft: 20
            },
            input: {}
        };
    }

    componentDidMount() {
        this._getMessages();
    }

    componentDidUpdate() {
        document.querySelector('.messenger-author .user-input').value = '';
    }

    focusLatestMessage() {
        let element;
    }

    _getMessages() {
        let self = this,
            state = this.context.store.getState();

        self.props.dispatch({
            type: 'UPDATE_MESSAGE_LIST',
            messages: []
        });
    }

    sendMessage() {
        let self = this,
            state = this.context.store.getState();

        self.props.dispatch({
            type: 'UPDATE_MESSAGE_LIST',
            messages: []
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
            <div className={"messenger-component"}>
                <div className="content">
                    <div className="header">
                        <Subheader>Room: {this.props.roomName}</Subheader>
                    </div>
                    <Divider/>
                    <div className="messenger-view" id="messenger-view">
                        <Message messages={this.context.store.getState().messengerReducer.messages}/>
                    </div>
                    <div className={"messenger-author"}>
                        <div className="message-author-content">
                            <TextField floatingLabelText="Get Involved" type="text"
                                       className="user-input inline-block" id="user-input"
                                       multiLine={true} rows={3} rowsMax={6} style={this.styles.input}
                                       onChange={this.handleNewMessage.bind(this)}/>
                            <RaisedButton backgroundColor="#A4C639" icon={<SendIcon color={fullWhite}/>} primary={true}
                                          style={this.styles.button} onClick={this.sendMessage.bind(this)} label="Send"
                                          labelPosition="before"/>
                        </div>
                    </div>
                </div>
            </div>
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