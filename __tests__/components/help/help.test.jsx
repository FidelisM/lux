/*global describe, it*/

import React from 'react';
import ReactDOM from 'react-dom';
import Help from 'Help';

describe('Help', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Help/>, div);
    });
});