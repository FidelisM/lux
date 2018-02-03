/*global describe, it, beforeEach*/

import React from 'react';
import ReactDOM from 'react-dom';
import Notification from 'Notification';

describe('Notification', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Notification open={true} message={'I rendered without crashing.'}/>, div);
    });
});