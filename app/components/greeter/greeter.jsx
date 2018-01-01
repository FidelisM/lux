import React from 'react';
import AppBar from 'material-ui/AppBar';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';

import Person from 'material-ui/svg-icons/social/person';
import PplOutline from 'material-ui/svg-icons/social/people-outline';
import Chat from 'material-ui/svg-icons/communication/chat';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Help from 'material-ui/svg-icons/action/help';

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

    toggleDrawer() {
        let prevState = this.context.store.getState().greeterReducer.drawerOpen;

        this.props.dispatch({
            type: 'SET_DRAWER',
            drawerOpen: !prevState
        });

        this.forceUpdate();
    }

    render() {
        return (
            <div className='greeter-component'>
                <AppBar title={this.context.store.getState().greeterReducer.message} style={{height: '65px'}}
                        iconElementRight={<Logged label={this.context.store.getState().greeterReducer.username}/>}
                        onLeftIconButtonClick={this.toggleDrawer.bind(this)}>
                </AppBar>
                <Drawer open={this.context.store.getState().greeterReducer.drawerOpen}
                        containerStyle={{height: 'calc(100% - 74px)', top: 74, left: 8}}>
                    <MenuItem onClick={this.toggleDrawer.bind(this)} leftIcon={<Chat/>}>Menu Item One</MenuItem>
                    <MenuItem onClick={this.toggleDrawer.bind(this)} leftIcon={<Chat/>}>Menu Item Two</MenuItem>
                </Drawer>
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
        <MenuItem primaryText='Log Out' rightIcon={<PplOutline/>}/>
    </IconMenu>
);

Greeter.propTypes = {
    message: PropTypes.string,
    drawerOpen: PropTypes.bool
};

Greeter.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        message: state.message,
        drawerOpen: state.drawerOpen
    };
}


export default withRouter(connect(mapStateToProps)(Greeter))