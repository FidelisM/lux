import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Messenger from 'Components/messenger/messenger';
import PromptDialog from 'Widgets/promptDialog/promptDialog';
import services from 'Services';
import serviceManager from 'ServiceManager';

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import Person from 'material-ui/svg-icons/social/person';
import PplOutline from 'material-ui/svg-icons/social/people-outline';
import Chat from 'material-ui/svg-icons/communication/chat';
import Add from 'material-ui/svg-icons/content/add-circle-outline';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Help from 'material-ui/svg-icons/action/help';

import greeterStyles from './greeter.css';

const personIconStyles = {
    fill: '#FFFFFF'
};

const flatButtonStyles = {
    color: '#FFFFFF'
};

const iconMenuStyles = {
    marginTop: '5px'
};

class Greeter extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getRooms();
    }

    toggleDrawer() {
        let prevState = this.context.store.getState().greeterReducer.drawerOpen;

        this.props.dispatch({
            type: 'SET_DRAWER',
            drawerOpen: !prevState
        });

        this.forceUpdate();
    }

    handleLogOut() {
        let self = this;

        localStorage.removeItem('token');

        self.props.dispatch({
            type: 'SET_AUTH',
            auth: {}
        });

        self.context.store.dispatch(push('/login'));
    }

    updateRoomName(evt) {
        this.props.dispatch({
            type: 'SET_RM_NAME',
            room: evt.currentTarget.value
        });
    }

    createRoom() {
        let self = this,
            props = {
                width: 500,
                title: 'Create A Room',
                successLabel: 'Create',
                proceedCB: self.handleRoomCreate.bind(self),
                content: () => {
                    return (<TextField
                        floatingLabelText="Room Name"
                        onChange={self.updateRoomName.bind(self)}
                    />)
                }
            };

        ReactDOM.render(<PromptDialog {...props} />, document.getElementById('overlay'));
    }

    handleRoomCreate() {
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

        serviceManager.post(options).then(function (response) {
            (response.success) ? self._handleCreateSuccess(response) : self._handleCreateFailure(response);
        }).catch(self._handleCreateFailure.bind(self));
    }

    _handleCreateSuccess(response) {
        this.props.dispatch({
            type: 'SET_RM_LIST',
            rooms: response.rooms
        });
    }

    _handleCreateFailure(response) {
        console.log(response);
    }

    _handleFetchSuccess(response) {
        this.props.dispatch({
            type: 'SET_RM_LIST',
            rooms: response.rooms
        });
    }

    _handleFetchFailure(response) {
        console.log(response);
    }

    openRoom(room) {
        let container = document.getElementsByClassName('messenger')[0];

        ReactDOM.unmountComponentAtNode(container);
        ReactDOM.render(<Provider store={this.context.store}><MuiThemeProvider><Messenger roomName={room.name}/></MuiThemeProvider>
        </Provider>, container);
    }

    getRooms() {
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

    render() {
        return (
            <div className='greeter-component'>
                <div className='app-bar'>
                    <AppBar title={this.context.store.getState().greeterReducer.message} style={{height: '65px'}}
                            iconElementRight={<Logged label={this.context.store.getState().greeterReducer.username}
                                                      data-logout={this.handleLogOut.bind(this)}/>}
                            onLeftIconButtonClick={this.toggleDrawer.bind(this)}>
                    </AppBar>
                </div>
                <div className='drawer'>
                    <Drawer open={this.context.store.getState().greeterReducer.drawerOpen}
                            containerStyle={{height: 'calc(100% - 74px)', top: 74, left: 8}}>
                        <MenuItem onClick={this.createRoom.bind(this)} rightIcon={<Add/>}>Create Room</MenuItem>
                        <Divider/>
                        {this.context.store.getState().greeterReducer.rooms.map((room) =>
                            (<div key={room._id}><Divider/>
                                <MenuItem onClick={this.openRoom.bind(this, room)} rightIcon={<Chat/>}>
                                    {room.name}</MenuItem>
                            </div>)
                        )}
                    </Drawer>
                </div>
                <div className='messenger'></div>
            </div>
        );
    }
}

const Logged = (props) => (
    <IconMenu {...props} style={iconMenuStyles}
              iconButtonElement={<FlatButton label={props.label} style={flatButtonStyles}
                                             icon={<Person style={personIconStyles}/>}/>}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
        <MenuItem primaryText='Refresh' rightIcon={<Refresh/>}/>
        <MenuItem primaryText='Help' rightIcon={<Help/>}/>
        <MenuItem onClick={props['data-logout']} primaryText='Log Out' rightIcon={<PplOutline/>}/>
    </IconMenu>
);

Greeter.propTypes = {
    message: PropTypes.string,
    drawerOpen: PropTypes.bool,
    rooms: PropTypes.array,
    room: PropTypes.string
};

Greeter.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        message: state.message,
        drawerOpen: state.drawerOpen,
        rooms: state.rooms,
        room: state.room,
    };
}

export default withRouter(connect(mapStateToProps)(Greeter))