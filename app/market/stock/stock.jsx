import React from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './friendCard.css'
import 'Images/default.jpg'
import services from "Services";

export default class Market extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: this.props.stocks,
            image: this.props.image
        }
    }

    handleRemove() {
        let self = this;

        if (this.props.handleRemove) {
            this.props.handleRemove().then(function (response) {
                self.setState({
                    members: response.members
                })
            });
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="watchlist">

                </div>
            </MuiThemeProvider>
        );
    }
}