/*global describe, it, beforeEach*/

import React from 'react';
import ReactDOM from 'react-dom';
import Message from 'Message';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('Message', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders without crashing', () => {
        ReactDOM.render(<MuiThemeProvider><Message messages={[]} members={[{email: 'test@jest.com'}]}
            username={'Jest'}/></MuiThemeProvider>, container);
    });
});