import React from 'react';
import PromptDialog from 'Widgets/promptDialog/promptDialog';

export default class Help extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 500,
            title: 'Help',
            successLabel: 'Ok',
            cancelLabel: 'Close',
            proceedCB: () => {
            },
            content: () => {
                return (<p>
                    <b>Tools:</b>
                    <br/>
                    <br/>
                    Create Room.
                    <br/>
                    <br/>
                    Add Friend.
                    <br/>
                    <br/>
                    Update Profile Picture.
                    <br/>
                    <br/>
                    Chat in real-time.
                </p>)
            }
        }
    }

    render() {
        return (<div>
            <PromptDialog {...this.state} />
        </div>)
    }
}