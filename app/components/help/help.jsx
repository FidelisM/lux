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
                return (<div>
                    <b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Feugiat scelerisque varius morbi enim nunc faucibus a.
                    Id faucibus nisl tincidunt eget nullam non. Porttitor
                    massa id neque aliquam vestibulum morbi blandit cursus risus.
                    Blandit massa enim nec dui nunc mattis enim ut. In arcu cursus euismod quis viverra nibh cras
                    pulvinar.
                    <br/>
                    <br/>
                    Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Sit amet volutpat
                    consequat mauris nunc congue. Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum.
                    In cursus turpis massa tincidunt dui ut ornare lectus sit. Et leo duis ut diam quam nulla porttitor
                    massa id.
                    <br/>
                    <br/>
                    Adipiscing bibendum est ultricies integer quis auctor. Faucibus turpis in eu mi bibendum.
                    Id cursus metus aliquam eleifend mi in nulla posuere. Eget felis eget nunc lobortis mattis aliquam
                    faucibus purus in.
                    Massa sed elementum tempus egestas sed sed risus pretium quam. Massa placerat duis ultricies lacus
                    sed turpis.
                    Sit amet mauris commodo quis imperdiet massa tincidunt.
                </div>)
            }
        }
    }

    render() {
        return (<div>
            <PromptDialog {...this.state} />
        </div>)
    }
}