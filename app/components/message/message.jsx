import React from 'react';
import moment from 'moment';

import Divider from 'material-ui/Divider';

import './message.css';
import services from "Services";

export default class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadedImages: {},
            DEFAULT_IMAGE_PATH: './images/default.jpg'
        };
    }

    componentDidMount() {
        this._loadImages();
    }

    componentDidUpdate() {
        let self = this,
            images = document.querySelectorAll('img[src=""]');

        [].forEach.call(images, function (image) {
                let key = image.getAttribute('data-author');
                if (self.state.loadedImages.hasOwnProperty(key)) {
                    if (typeof self.state.loadedImages[key] === 'string') {
                        image.src = self.state.loadedImages[key];
                        return false;
                    }
                    image.src = window.URL.createObjectURL(self.state.loadedImages[key]);
                }
            }
        );

        this.focusLatestMessage();
    }

    focusLatestMessage() {
        let element = document.querySelectorAll('.chat-content:last-of-type')[0];

        if (element) {
            element.scrollIntoView();
        }
    }

    _loadImages() {
        let self = this;

        for (let i = 0; i < this.props.members.length; i++) {
            (function (email) {
                self._getImage(email).then(function (imgBlob) {
                    if (/image/.test(imgBlob.type)) {
                        self._appendImage(imgBlob, email);
                    } else {
                        self._appendImage(null, email);
                    }
                });
            })(self.props.members[i]);
        }
    }

    _getImage(email) {
        let self = this,
            token = localStorage.getItem('token'),
            headers = {
                Authorization: token
            }, promise;

        promise = fetch(services.user.getImagebyEmail.replace(':email', email), {headers: new Headers(headers)}).then(function (response) {
            return response.blob();
        });

        promise.then(function (imgBlob) {
            if (imgBlob && /image/.test(imgBlob.type)) {
                self.state.loadedImages[email] = imgBlob;
            } else {
                self.state.loadedImages[email] = self.state.DEFAULT_IMAGE_PATH;
            }
        });

        return promise;
    }

    _appendImage(imgBlob, email) {
        let self = this,
            images = document.querySelectorAll('[data-author="' + email + '"]');

        if (imgBlob && /image/.test(imgBlob.type)) {
            [].forEach.call(images, function (image) {
                    image.src = window.URL.createObjectURL(imgBlob);
                }
            );
        } else {
            [].forEach.call(images, function (image) {
                    image.src = self.state.DEFAULT_IMAGE_PATH;
                }
            );
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
                                               <img src={''} className={"img-circle user-avatar"}
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
                                            <img src={''} className={"img-circle user-avatar"}
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