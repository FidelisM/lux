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
import createHashHistory from 'history/createHashHistory'

import services from 'Services';
import serviceManager from 'ServiceManager';
import Fingerprint2 from "fingerprintjs2";

const history = createHashHistory();
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
                                isAuthentic() ? <Greeter {...props} /> : <Redirect to='/login'/>
                            )}/>
                        </Switch>
                    </HashRouter>
                </ConnectedRouter>
            </MuiThemeProvider>
        </Provider>
    )
};

const isAuthentic = function () {
    let state = store.getState();
    return (!_.isEmpty(state.authReducer.auth))
};

const authenticateUser = function () {
    let token = localStorage.getItem('token'),
        options = {
            headers: {
                Authorization: token
            },
            url: services.refresh.url
        };

    //memory leak?
    new Fingerprint2().get(function (result) {
        options.headers.browser = result;

        serviceManager.get(options).then(function (response) {
            if (response.token) {
                localStorage.setItem('token', response.token);

                store.dispatch({
                    type: 'SET_AUTH',
                    auth: response.token
                });

                store.dispatch({
                    type: 'SET_USER',
                    username: response.username
                });
            }
            renderApplication();
        }).catch(renderApplication);
    });
};

const renderApplication = function () {
    ReactDOM.render(<App/>, document.getElementById('app'));
};

authenticateUser();