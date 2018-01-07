import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class AlertDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClose() {
        if (this.props.closeCB) {
            this.props.closeCB();
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="alert-overlay">
                    <Dialog contentStyle={{width: this.props.width}} style={this.props.style}
                            actions={<FlatButton label={this.props.label} onClick={this.handleClose.bind(this)}/>}
                            primary={true} open={true}
                            onClick={this.handleClose.bind(this)}>{this.props.content}</Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AlertDialog;