import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class PromptDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true
        }
    }

    handleClose() {
        if (this.props.cancelCB) {
            this.props.cancelCB();
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('overlay'));
    }

    handleNext() {
        if (this.props.proceedCB) {
            this.props.proceedCB();
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('overlay'))
    }

    getActions() {
        return [
            <FlatButton label={this.props.cancelLabel || 'Cancel'} onClick={this.handleClose.bind(this)}/>,
            <FlatButton label={this.props.successLabel || 'Yes'} onClick={this.handleNext.bind(this)}/>
        ]
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="prompt-dialog">
                    <Dialog actions={this.getActions()} primary={true} open={this.state.open} title={this.props.title}
                            contentStyle={{width: this.props.width}} modal={true}>{this.props.content()}</Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}