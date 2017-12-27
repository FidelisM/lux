import React from 'react';
import ReactDOM from 'react-dom';
import {Login} from 'Components/login/login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const message = 'This is boiler-plate code for a react app.',
    App = function () {
        return <MuiThemeProvider>
            <Login message={message}/>
        </MuiThemeProvider>
    };


ReactDOM.render(<App />, document.getElementById('app'));