import React from 'react';
import ReactDOM from 'react-dom';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './friendCard.css'

export default class FriendCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }
    }

    handleRemove() {
        if (this.props.handleRemove) {
            this.props.handleRemove();
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('overlay'));
    }

    handleAdd() {
        if (this.props.handleAdd) {
            this.props.handleAdd();
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('overlay'))
    }

    getActions() {
        return [
            <FlatButton label='Remove' onClick={this.handleRemove.bind(this)} key={'fc_action_1'}/>,
            <FlatButton label='Add' onClick={this.handleAdd.bind(this)} key={'fc_action_2'}/>
        ]
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="friend-card">
                    <Card style={{width: 300}}>
                        <CardHeader title={this.props.username} subtitle={this.props.email}
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