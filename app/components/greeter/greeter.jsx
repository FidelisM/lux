import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {blue500} from 'material-ui/styles/colors';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Greeter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <AppBar title={this.context.store.getState().greeterReducer.message}>
                    <FontIcon className="muidocs-icon-action-home" color={blue500}/>
                </AppBar>
            </div>
        );
    }
}

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