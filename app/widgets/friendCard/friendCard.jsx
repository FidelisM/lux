import React from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './friendCard.css'
import 'Images/default.jpg'
import services from "Services";

export default class FriendCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: this.props.members,
            image: this.props.image
        }
    }

    componentDidMount() {
        this._getImage();
    }

    _getImage() {
        let self = this,
            token = localStorage.getItem('token'),
            headers = {
                Authorization: token
            };

        fetch(services.user.getImagebyEmail.replace(':email', this.props.email), {headers: new Headers(headers)}).then(function (response) {
            return response.blob();
        }).then(function (imgBlob) {
            if(/image/.test(imgBlob.type)){
                self.setState({
                    image: window.URL.createObjectURL(imgBlob)
                })
            } else{
                self.setState({
                    image: './default.jpg'
                })
            }
        });
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
                                    data-user={this.props.email}
                                    avatar={this.state.image}/>
                        <CardActions>
                            {this.getActions()}
                        </CardActions>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}