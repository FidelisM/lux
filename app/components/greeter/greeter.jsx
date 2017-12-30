import React from 'react';
import AppBar from 'material-ui/AppBar';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Person from 'material-ui/svg-icons/social/person';

class Greeter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <AppBar title={this.context.store.getState().greeterReducer.message}
                        iconElementRight={<Logged label={this.context.store.getState().greeterReducer.username}/>}>
                </AppBar>
            </div>
        );
    }
}

const Logged = (props) => (
    <IconMenu {...props} style={iconMenuStyles}
              iconButtonElement={<FlatButton label={props.label}
                                             style={flatButtonStyles} icon={<Person style={personIconStyles}/>}/>}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        <MenuItem primaryText='Refresh'/>
        <MenuItem primaryText='Help'/>
        <MenuItem primaryText='Sign out'/>
    </IconMenu>
);

const personIconStyles = {
    fill: '#FFFFFF'
};

const flatButtonStyles = {
    color: '#FFFFFF'
};

const iconMenuStyles = {
    'margin-top': '5px'
};

Greeter.propTypes = {
    message: PropTypes.string,
};

Greeter.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        message: state.message
    };
}


export default withRouter(connect(mapStateToProps)(Greeter))