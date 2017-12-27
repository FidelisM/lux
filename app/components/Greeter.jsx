import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

export class Greeter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: this.props.message || 'This is a default message'
        };
    }

    render() {
        return (
            <div>
                <AppBar
                    title={this.state.message}
                >
                    <FontIcon
                        className="muidocs-icon-action-home"
                        color={blue500}
                    />
                </AppBar>
            </div>
        );
    }
}