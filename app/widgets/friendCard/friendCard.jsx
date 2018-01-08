import React from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './friendCard.css'

export default class FriendCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: this.props.members,
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

    handleAdd() {
        let self = this;

        if (this.props.handleAdd) {
            this.props.handleAdd().then(function (response) {
                self.setState({
                    members: response.members
                })
            });
        }
    }

    getActions() {
        return [
            <FlatButton label='Remove' onClick={this.handleRemove.bind(this)} key={'fc_action_1'}
                        secondary={true}
                        disabled={(this.state.members.indexOf(this.props.email) === -1)}/>,
            <FlatButton label='Add' onClick={this.handleAdd.bind(this)} key={'fc_action_2'}
                        primary={true}
                        disabled={(this.state.members.indexOf(this.props.email) !== -1)}/>
        ]
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="friend-card">
                    <Card style={{width: 300}}>
                        <CardHeader title={this.props.username} subtitle={this.props.email} style={{objectFit: 'cover'}}
                                    className="friend-card-header"
                                    avatar="https://www.themarysue.com/wp-content/uploads/2015/12/avatar.jpeg"/>
                        <CardActions>
                            {this.getActions()}
                        </CardActions>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}