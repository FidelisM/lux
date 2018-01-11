import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';

import './notification.css'

class Notification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customClass: this.props.customClass || '',
            autoHideDuration: 0,
            message: this.props.message,
            open: this.props.open
        }
    }

    handleActionButtonClick() {
        if (this.props.actionCB) {
            this.props.actionCB();
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('snackbar'));
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className={"notification " + this.state.customClass}>
                    <Snackbar
                        open={this.state.open}
                        message={this.state.message}
                        action="OK"
                        autoHideDuration={this.state.autoHideDuration}
                        onActionClick={this.handleActionButtonClick.bind(this)}
                        bodyStyle={{height: 'auto', lineHeight: '35px', padding: 24, whiteSpace: 'pre-line'}}
                        contentStyle={{margin: 0}}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Notification;