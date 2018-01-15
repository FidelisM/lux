import React from 'react';
import moment from 'moment';

import Divider from 'material-ui/Divider';

import './message.css';
import services from "Services";

export default class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        this._getImages();
    }

    _getImages() {
        let self = this,
            token = localStorage.getItem('token'),
            headers = {
                Authorization: token
            };

        for (let i = 0; i < this.props.members.length; i++) {
            fetch(services.user.getImagebyEmail.replace(':email', self.props.members[i]), {headers: new Headers(headers)}).then(function (response) {
                return response.blob();
            }).then(function (imgBlob) {
                let images = document.querySelectorAll('[data-author="' + self.props.members[i] + '"]');

                [].forEach.call(images, function (image) {
                        image.src = window.URL.createObjectURL(imgBlob);
                    }
                );
            });
        }
    }

    render() {
        let self = this;

        if (this.props.messages.length) {
            return (
                <div className="message-list">
                    {this.props.messages.map(function (message, index) {
                        if (self.props.username === message.author) {
                            return (
                                <div className="chat-content user" key={index}>
                                    <div className="chat-body inline-block">
                                        <div className="header">
                                            <strong
                                                className={"message-author right"}>{message.author}</strong>
                                            <small
                                                className={"message-timestamp"}>
                                                {moment(new Date(message.timestamp)).format('MMM Do YYYY, h:mm a')}
                                            </small>
                                        </div>
                                        <p className="message-content">{message.text}</p>
                                        <Divider/>
                                    </div>
                                    <div className={"chat-head inline-block right"}>
                                         <span className="chat-img">
                                               <img className={"img-circle user-avatar"}
                                                    data-author={message.authorEmail}/>
                                         </span>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div className="chat-content" key={index}>
                                <div className={"chat-head inline-block"}>
                                     <span className="chat-img">
                                            <img className={"img-circle user-avatar"}
                                                 data-author={message.authorEmail}/>
                                     </span>
                                </div>
                                <div className="chat-body inline-block">
                                    <div className="header">
                                        <strong
                                            className={"message-author"}>{message.author}</strong>
                                        <small
                                            className={"message-timestamp right"}>
                                            {moment(new Date(message.timestamp)).format('MMM Do YYYY, h:mm a')}
                                        </small>
                                    </div>
                                    <p className="message-content">{message.text}</p>
                                    <Divider/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        } else {
            return (<div>
            </div>)
        }
    }
}