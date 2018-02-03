/*global describe, it, beforeEach, expect*/

import React from 'react';
import ReactDOM from 'react-dom';
import MockRouter from 'react-mock-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from 'redux-mock-store'

import initialState from 'InitialState';
import Messenger from 'Messenger';

describe('Login', () => {
    const mockStore = configureStore();

    let store, container;

    beforeEach(() => {
        store = mockStore(initialState);
        container = document.createElement('div');
    });

    it('renders without crashing', () => {
        ReactDOM.render(<MuiThemeProvider><MockRouter><Messenger store={store} members={[{email: 'test@jest.com'}]}/></MockRouter></MuiThemeProvider>, container);
    });
});