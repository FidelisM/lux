import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {push} from "react-router-redux";

class AlertDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClose() {
        this.context.store.dispatch(push('/login'));
    }

    render() {
        return (
            <div>
                <Dialog actions={<FlatButton label="Login" onClick={this.handleClose.bind(this)}/>}
                        primary={true} open={true} onClick={this.handleClose.bind(this)}>{this.props.message}</Dialog>
            </div>
        );
    }
}

AlertDialog.contextTypes = {
    store: PropTypes.object
};

export default connect()(AlertDialog);