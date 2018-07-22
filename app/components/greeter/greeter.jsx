import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import moment from 'moment';
import io from 'socket.io-client';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Notification from 'Components/nofification/notification';
import Account from 'Components/account/account';
import Messenger from 'Components/messenger/messenger';
import PromptDialog from 'Widgets/promptDialog/promptDialog';
import AlertDialog from 'Widgets/alertDialog/alertDialog';
import Help from 'Components/help/help';
import FriendCard from 'Widgets/friendCard/friendCard';
import services from 'Services';
import serviceManager from 'ServiceManager';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

import GroupAddIcon from 'material-ui/svg-icons/social/group-add';
import AddIcon from 'material-ui/svg-icons/content/add';
import PencilIcon from 'material-ui/svg-icons/content/create';
import BlockIcon from 'material-ui/svg-icons/content/block';
import SettingsIcon from 'material-ui/svg-icons/action/account-circle';
import HelpIcon from 'material-ui/svg-icons/action/help';
import AccountIcon from 'material-ui/svg-icons/action/settings-applications';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';

import './greeter.css';


const groupAddIconStyles = {
    fill: '#FFFFFF',
    height: 30,
    width: 30,
    marginRight: 15,
    verticalAlign: 'middle',
    cursor: 'pointer'
};

const accountIconStyles = {
    fill: '#FFFFFF',
    height: 30,
    width: 30,
    paddingLeft: 10,
    verticalAlign: 'middle',
    cursor: 'pointer',
    'border-left': '1px solid white'
};

const iconMenuStyles = {
    marginTop: '5px'
};

const convoInfoIconStyles = {
    fill: 'rgb(117, 117, 117)',
};

const convoIconMenuStyles = {
    width: 24,
    height: 24,
    padding: 0,
    fill: 'rgb(117, 117, 117)',
};

class Greeter extends React.Component {
    constructor(props) {
        super(props);

        this._initializeSocket();

        this.state = {
            emailErrorText: ''
        }
    }

    componentDidMount() {
        this._getRooms();
    }

    _initializeSocket() {
        let token = localStorage.getItem('token'),
            socketURL = '/spoqn/messenger/chat';

        if (this.socket) {
            this.socket.close();
        }

        this.socket = io(socketURL, {
            query: 'token=' + token
        });
    }

    toggleDrawer() {
        let prevState = this.props.drawerOpen;

        this.props.dispatch({
            type: 'SET_DRAWER',
            drawerOpen: !prevState
        });
    }

    handleLogOut() {
        let self = this;

        localStorage.removeItem('token');

        self.props.dispatch({type: 'USER_LOGOUT'});

        self.context.store.dispatch(push('/login'));

    }

    handleHelp() {
        ReactDOM.render(<Help/>, document.getElementById('overlay'));
    }

    openMyAccount() {
        let container = document.getElementsByClassName('my-account')[0],
            mesengerContainer = document.getElementsByClassName('messenger')[0];

        this.socket.removeAllListeners();

        mesengerContainer.style.display = 'none';
        container.style.display = 'flex';

        ReactDOM.unmountComponentAtNode(document.getElementsByClassName('messenger')[0]);
        ReactDOM.unmountComponentAtNode(container);

        ReactDOM.render(<Provider store={this.context.store}><MuiThemeProvider><Account
            initializeSocket={this._initializeSocket.bind(this)}/></MuiThemeProvider>
        </Provider>, container);
    }

    // Rooms

    handleRoomNameChange(evt) {
        let roomName = evt.currentTarget.value;

        if (roomName) {
            this.promptDialog.setState({
                nextDisabled: false
            });

            this.props.dispatch({
                type: 'SET_RM_NAME',
                room: roomName
            });
        } else {
            this.promptDialog.setState({
                nextDisabled: true
            });

            this.props.dispatch({
                type: 'SET_RM_NAME',
                room: ''
            });
        }
    }

    createRoom() {
        let self = this,
            state = this.context.store.getState().greeterReducer,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                data: {
                    name: state.room
                },
                url: services.room.create
            };

        if (state.room) {
            serviceManager.post(options).then(function (response) {
                (response.success) ? self._handleCreateSuccess(response) : self._handleCreateFailure(response);
            }).catch(self._handleCreateFailure.bind(self));
        }
    }

    handleCreateRoomClick() {
        let self = this,
            props = {
                width: 500,
                title: 'Create A Room',
                successLabel: 'Create',
                proceedCB: self.createRoom.bind(self),
                nextDisabled: true,
                content: () => {
                    return (<TextField
                        floatingLabelText="Room Name"
                        onChange={self.handleRoomNameChange.bind(self)}
                    />)
                }
            },
            container = document.querySelector('#overlay');

        ReactDOM.unmountComponentAtNode(container);
        ReactDOM.render(<PromptDialog {...props} ref={function (promptDialog) {
            self.promptDialog = promptDialog;
        }.bind(this)}/>, container);
    }

    _handleCreateSuccess(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }

        this._handleFetchSuccess(response);
    }

    _handleCreateFailure(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    openRoom(room) {
        let self = this,
            container = document.getElementsByClassName('messenger')[0],
            myAccountContainer = document.getElementsByClassName('my-account')[0];

        this.socket.removeAllListeners();

        myAccountContainer.style.display = 'none';
        container.style.display = 'flex';

        ReactDOM.unmountComponentAtNode(myAccountContainer);
        ReactDOM.unmountComponentAtNode(container);

        this.getMembers(room._id).then(function (resp) {
            ReactDOM.render(<Provider store={self.context.store}><MuiThemeProvider><Messenger
                roomName={room.name} roomID={room._id} socket={self.socket} members={resp.members}/></MuiThemeProvider>
            </Provider>, container);
        });
    }

    _getRooms() {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.room.allRooms
            };

        serviceManager.get(options).then(function (response) {
            (response.success) ? self._handleFetchSuccess(response) : self._handleFetchFailure(response);
        }).catch(self._handleFetchFailure.bind(self));
    }

    _handleFetchSuccess(response) {
        let self = this,
            snackbarEl = document.querySelector('#snackbar'),
            container = document.querySelector('.messenger'),
            roomToRender;

        if (response.rooms.length) {
            roomToRender = response.rooms.reduce(function (prev, curr) {
                return prev.updatedAt < curr.updatedAt ? prev : curr;
            });

            self.props.dispatch({
                type: 'SET_RM_LIST',
                rooms: response.rooms
            });

            self.socket.removeAllListeners();

            self.getMembers(roomToRender._id).then(function (resp) {
                ReactDOM.unmountComponentAtNode(container);
                ReactDOM.render(<Provider store={self.context.store}><MuiThemeProvider><Messenger
                    roomName={roomToRender.name} roomID={roomToRender._id} members={resp.members}
                    socket={self.socket}/></MuiThemeProvider>
                </Provider>, container);

                ReactDOM.render(<Notification open={true} message={roomToRender.name + ' opened.'}/>, snackbarEl);
            });
        } else {
            ReactDOM.render(<Notification open={true} message={'Create a room.'}/>, snackbarEl);

            self.props.dispatch({
                type: 'SET_DRAWER',
                drawerOpen: true
            });

        }
    }

    _handleFetchFailure(response) {
        console.log(response);
    }

    // Members

    handleEditMembersClick(roomID, roomName) {
        let self = this,
            members,
            friends,
            container = document.getElementById('overlay'),
            props = {
                content: () => {
                    return (
                        <div>
                            <div className="header">
                                <div className="header-label">
                                    <Subheader>Friends:</Subheader>
                                </div>
                                <Divider/>
                            </div>
                            <div className={(friends.length) ? "friend-cards-content" : "friend-cards-notification"}>
                                {(friends.length) ? friends.map(function (friend) {
                                    return <FriendCard username={friend.username} email={friend.email} key={friend._id}
                                                       handleAdd={self.addMember.bind(self, friend, roomID)}
                                                       handleRemove={self.removeMember.bind(self, friend, roomID)}
                                                       friends={friends} members={members}/>
                                }) : <div className="info-text">Add some friends and they'll show up here.</div>}
                            </div>
                        </div>
                    )
                },
                closeCB: () => {
                }
            };

        this.getMembers(roomID).then(function (response) {
            members = response.members;

            self._getFriends().then(function (response) {
                friends = response.friends;

                ReactDOM.unmountComponentAtNode(container);
                ReactDOM.render(<AlertDialog {...props} title={'Edit ' + roomName + ' Members'} style={{minWidth: 400}}
                                             label="Done" customClass={'edit-friends'}/>, container);
            });
        });
    }

    addMember(friend, roomID) {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                data: {
                    member: friend,
                    roomID: roomID
                },
                url: services.room.addMember
            },
            promise = serviceManager.post(options);

        promise.then(function (response) {
            (response.success) ? self._handleAddMemberSuccess(response) : self._handleAddMemberFailure(response);
        }).catch(self._handleAddFriendFailure.bind(self));

        return promise;
    }

    _handleAddMemberSuccess(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }

        this.props.dispatch({
            type: 'UPDATE_MEMBER_LIST',
            members: response.members
        });
    }

    _handleAddMemberFailure(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    getMembers(roomID) {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.room.getMembers.replace(':id', roomID)
            },
            promise = serviceManager.get(options);

        promise.then(function (response) {
            if (response.success) {
                self._handleMemberLoadSuccess(response);
            } else {
                self._handleMemberLoadFailure(response);
            }
        }).catch(self._handleMemberLoadFailure.bind(self));

        return promise;
    }

    _handleMemberLoadSuccess(response) {
        this.props.dispatch({
            type: 'UPDATE_MEMBER_LIST',
            members: response.members
        });
    }

    _handleMemberLoadFailure() {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    removeMember(friend, roomID) {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                data: {
                    member: friend,
                    roomID: roomID
                },
                url: services.room.removeMember
            },
            promise = serviceManager.post(options);

        promise.then(function (response) {
            (response.success) ? self._handleRemoveMemberSuccess(response) : self._handleRemoveMemberFailure(response);
        }).catch(self._handleRemoveMemberFailure.bind(self));

        return promise;
    }

    _handleRemoveMemberSuccess(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }

        this.props.dispatch({
            type: 'UPDATE_MEMBER_LIST',
            members: response.members
        });
    }

    _handleRemoveMemberFailure(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    // Friends

    handleAddFriendClick() {
        let self = this,
            props = {
                width: 500,
                title: 'Add Friend',
                successLabel: 'Add',
                proceedCB: self.addFriend.bind(self),
                nextDisabled: true,
                content: () => {
                    return (<TextField
                        ref={function (textField) {
                            self.addFriendEmailTextField = textField;
                        }.bind(this)}
                        floatingLabelText="E-mail Address"
                        errorText={self.state.emailErrorText}
                        onChange={self.handleFriendEmailChange.bind(self)}
                    />)
                }
            },
            container = document.getElementById('overlay');

        ReactDOM.unmountComponentAtNode(container);
        ReactDOM.render(<PromptDialog {...props} ref={function (promptDialog) {
            self.promptDialog = promptDialog;
        }.bind(this)}/>, container);
    }

    handleFriendEmailChange(evt) {
        let email = evt.currentTarget.value,
            re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(email.toLowerCase())) {
            this.addFriendEmailTextField.setState({
                errorText: 'Please enter a valid email address'
            });

            this.promptDialog.setState({
                nextDisabled: true
            });

            return false;
        }

        this.addFriendEmailTextField.setState({
            errorText: ''
        });

        this.promptDialog.setState({
            nextDisabled: false
        });

        this.props.dispatch({
            type: 'ADD_FRIEND',
            friend: email
        });
    }

    addFriend() {
        let self = this,
            state = this.context.store.getState().greeterReducer,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                data: {
                    friend: state.friend
                },
                url: services.friend.add
            };

        let email = state.friend,
            re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(email.toLowerCase())) {
            this.setState({
                emailErrorText: 'Please enter a valid email address'
            });

            return;
        }

        serviceManager.post(options).then(function (response) {
            (response.success) ? self._handleAddFriendSuccess(response) : self._handleAddFriendFailure(response);
        }).catch(self._handleAddFriendFailure.bind(self));
    }

    _handleAddFriendSuccess(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    _handleAddFriendFailure(response) {
        let container = document.getElementById('snackbar');

        if (response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    _getFriends() {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.friend.getAll
            },
            promise = serviceManager.get(options);

        promise.then(function (response) {
            (response.success) ? self._handleFriendsLoadSuccess(response) : self._handleFriendsLoadFailure(response);
        }).catch(self._handleFriendsLoadFailure.bind(self));

        return promise;
    }

    _handleFriendsLoadSuccess(response) {
        this.props.dispatch({
            type: 'SET_FRIENDS_LIST',
            friends: response.friends
        });
    }

    _handleFriendsLoadFailure() {

    }

    render() {
        return (
            <div className='greeter-component'>
                <div className='app-bar'>
                    <AppBar title={this.props.title} style={{height: '65px'}}
                            iconElementRight={
                                <div>
                                    <GroupAddIcon style={groupAddIconStyles} title="Delete"
                                                  onClick={this.handleAddFriendClick.bind(this)}/>
                                    <Logged label={this.props.username}
                                            data-my-account={this.openMyAccount.bind(this)}
                                            data-logout={this.handleLogOut.bind(this)}
                                            data-help={this.handleHelp.bind(this)}/>
                                </div>
                            }
                            onLeftIconButtonClick={this.toggleDrawer.bind(this)}>
                    </AppBar>
                </div>
                <div className='drawer'>
                    <Drawer open={this.props.drawerOpen} width={350}
                            containerStyle={{height: 'calc(100% - 67px)', top: 66, left: 0}}>
                        <MenuItem onClick={this.handleCreateRoomClick.bind(this)} rightIcon={<AddIcon/>}>Create
                            Room</MenuItem>
                        <Divider/>
                        <Subheader>Conversations
                            ({this.props.rooms.length})</Subheader>
                        <List>
                            {this.props.rooms.map((room) =>
                                (<div key={room._id}>
                                    <ListItem onClick={this.openRoom.bind(this, room)}
                                              rightIcon={<ConversationMenu
                                                  data-edit-members={this.handleEditMembersClick.bind(this, room._id, room.name)}/>}
                                              primaryText={room.name}
                                              secondaryText={moment(room.updatedAt).format('MMM Do YYYY, h:mm a')}/>
                                    <Divider inset={true}/>
                                </div>)
                            )}
                        </List>
                    </Drawer>
                </div>
                <div className='messenger'>
                </div>
                <div className='my-account'>
                </div>
            </div>
        );
    }
}

const Logged = (props) => (
    <IconMenu {...props} style={iconMenuStyles}
              iconButtonElement={<AccountIcon title={props.label} style={accountIconStyles}/>}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
        <MenuItem onClick={props['data-my-account']} primaryText='My Account' rightIcon={<SettingsIcon/>}/>
        <MenuItem onClick={props['data-help']} primaryText='Help' rightIcon={<HelpIcon/>}/>
        <MenuItem onClick={props['data-logout']} primaryText='Log Out' rightIcon={<BlockIcon/>}/>
    </IconMenu>
);

const ConversationMenu = (props) => (
    <IconMenu {...props} iconButtonElement={<IconButton style={convoIconMenuStyles} onClick={(evt) => {
        evt.stopPropagation()
    }}>
        <div><InfoIcon style={convoInfoIconStyles}/></div>
    </IconButton>}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}>
        <MenuItem disabled={true} onClick={props['data-rename']} primaryText='Rename Room' rightIcon={<PencilIcon/>}/>
        <MenuItem disabled={true} onClick={props['data-delete']} primaryText='Delete Room' rightIcon={<DeleteIcon/>}/>
        <MenuItem onClick={props['data-edit-members']} primaryText='Edit Members' rightIcon={<GroupAddIcon/>}/>
    </IconMenu>
);

Greeter.propTypes = {
    title: PropTypes.string,
    room: PropTypes.string,
    rooms: PropTypes.array,
    friend: PropTypes.string,
    friends: PropTypes.array,
    members: PropTypes.array,
    drawerOpen: PropTypes.bool
};

Greeter.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        username: state.authReducer.username,
        title: state.greeterReducer.title,
        room: state.greeterReducer.room,
        rooms: state.greeterReducer.rooms,
        friend: state.greeterReducer.friend,
        friends: state.greeterReducer.friends,
        members: state.greeterReducer.members,
        drawerOpen: state.greeterReducer.drawerOpen
    };
}

export default withRouter(connect(mapStateToProps)(Greeter))