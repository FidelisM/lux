import React from 'react';
import _ from 'lodash'
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Login from 'Components/login/login';
import Greeter from 'Components/greeter/greeter';
import reducers from './reducers/rootReducer';

import {createStore, applyMiddleware} from 'redux'
import {ConnectedRouter, routerReducer, routerMiddleware} from 'react-router-redux'
import {Provider} from 'react-redux';
import createHistory from 'history/createHashHistory'

const history = createHistory();
const middleware = routerMiddleware(history);

Object.assign(reducers, routerReducer);

const store = createStore((reducers), applyMiddleware(middleware));

const App = function () {
    return (
        <Provider store={store}>
            <MuiThemeProvider>
                <ConnectedRouter history={history}>
                    <HashRouter>
                        <Switch>
                            <Route exact path='/' component={Login}/>
                            <Route path='/login' component={Login}/>
                            <Route path='/home' render={(props) => (
                                authenticateUser() ? <Greeter {...props} /> : <Redirect to='/login'/>
                            )}/>
                        </Switch>
                    </HashRouter>
                </ConnectedRouter>
            </MuiThemeProvider>
        </Provider>
    )
};

const authenticateUser = function () {
    let state = store.getState();
    return (!_.isEmpty(state.authReducer.auth))
};

ReactDOM.render(<App/>, document.getElementById('app'));