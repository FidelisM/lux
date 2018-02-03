/*global describe, it, beforeEach, expect*/

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from 'redux-mock-store'

import initialState from 'InitialState';
import Account from 'Account';

describe('Account', () => {
    const mockStore = configureStore();

    let store, container;

    beforeEach(() => {
        store = mockStore(initialState);
        container = document.createElement('div');
    });

    it('renders without crashing', () => {
        ReactDOM.render(<MuiThemeProvider><Account store={store}/></MuiThemeProvider>, container);
    });
});