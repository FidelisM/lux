import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactDOM from "react-dom";

class AlertDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customClass: this.props.customClass || ''
        }
    }

    handleClose() {
        if (this.props.closeCB) {
            this.props.closeCB();
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('overlay'));
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="alert-overlay">
                    <Dialog title={this.props.title || ''} contentStyle={{width: this.props.width}}
                            style={this.props.style}
                            actions={<FlatButton label={this.props.label} onClick={this.handleClose.bind(this)}
                                                 primary={true}/>}
                            primary={true} open={true}
                            onClick={this.handleClose.bind(this)}>
                        <div className={"alert-overlay-content " + this.state.customClass}>
                            {this.props.content}
                        </div>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AlertDialog;