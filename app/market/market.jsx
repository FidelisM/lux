import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment/moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Divider, Drawer, List, ListItem, MenuItem, Subheader, TextField} from 'material-ui';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import PromptDialog from 'Widgets/promptDialog/promptDialog';
import Notification from 'Components/notification/notification';

import services from 'Services';
import serviceManager from 'Common/services/service-manager';

class Market extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._getWatchLists();
    }

    _getWatchLists() {
        let self = this,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                url: services.market.watchLists.replace(':email', this.props.email)
            };

        serviceManager.get(options).then(function (response) {
            (response.success) ? self._handleWatchListsFetchSuccess(response) : self._handleWatchListsFetchFailure(response);
        }).catch(self._handleWatchListsFetchFailure.bind(self));
    }

    _handleWatchListsFetchSuccess() {
        debugger
    }

    _handleWatchListsFetchFailure() {
        let container = document.getElementById('snackbar');

        if (response && response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    handleCreateWatchListClick() {
        let self = this,
            props = {
                width: 500,
                title: 'Create A Watchlist',
                successLabel: 'Create',
                proceedCB: self.createWatchlist.bind(self),
                nextDisabled: true,
                content: () => {
                    return (<TextField
                        floatingLabelText="Watchlist Name"
                        onChange={self.handleWatchlistNameChange.bind(self)}
                    />)
                }
            },
            container = document.querySelector('#overlay');

        ReactDOM.unmountComponentAtNode(container);
        ReactDOM.render(<PromptDialog {...props} ref={function (promptDialog) {
            self.promptDialog = promptDialog;
        }.bind(this)}/>, container);
    }

    handleWatchlistNameChange(evt) {
        let watchlistName = evt.currentTarget.value;

        if (watchlistName) {
            this.promptDialog.setState({
                nextDisabled: false
            });

            this.props.dispatch({
                type: 'SET_WL_NAME',
                room: watchlistName
            });
        } else {
            this.promptDialog.setState({
                nextDisabled: true
            });

            this.props.dispatch({
                type: 'SET_WL_NAME',
                room: ''
            });
        }
    }

    openWatchList() {
        debugger
    }

    createWatchlist() {
        let self = this,
            state = this.context.store.getState().marketReducer,
            token = localStorage.getItem('token'),
            options = {
                headers: {
                    Authorization: token
                },
                data: {
                    name: state.watchlistName
                },
                url: services.market.create
            };

        if (state.room) {
            serviceManager.post(options).then(function (response) {
                (response.success) ? self._handleCreateSuccess(response) : self._handleCreateFailure(response);
            }).catch(self._handleCreateFailure.bind(self));
        }
    }

    _handleCreateSuccess(response) {
        let container = document.getElementById('snackbar');

        if (response && response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }

        this._handleWatchListsFetchSuccess(response);
    }

    _handleCreateFailure(response) {
        let container = document.getElementById('snackbar');

        if (response && response.msg) {
            ReactDOM.unmountComponentAtNode(container);
            ReactDOM.render(<Notification open={true} message={response.msg}/>, container);
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="stock-list">
                    {/*for each stock render card*/}
                </div>
                <div className='drawer'>
                    <Drawer open={this.props.drawerOpen} width={350}
                            containerStyle={{height: 'calc(100% - 67px)', top: 66, left: 0}}>
                        <MenuItem onClick={this.handleCreateWatchListClick.bind(this)} rightIcon={<AddIcon/>}>Create
                            Room</MenuItem>
                        <Divider/>
                        <Subheader>Conversations
                            ({this.props.watchLists.length})</Subheader>
                        <List>
                            {this.props.watchLists.map((watchList) =>
                                (<div key={watchList._id}>
                                    <ListItem onClick={this.openWatchList.bind(this, watchList)}
                                              primaryText={watchList.name}
                                              secondaryText={moment(watchList.updatedAt).format('MMM Do YYYY, h:mm a')}/>
                                    <Divider inset={true}/>
                                </div>)
                            )}
                        </List>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}

Market.propTypes = {
    title: PropTypes.string,
    watchLists: PropTypes.array,
    watchlistName: PropTypes.string,
    drawerOpen: PropTypes.bool,
};

Market.contextTypes = {
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        username: state.authReducer.username,
        title: state.marketReducer.title,
        watchlistName: state.marketReducer.watchListName,
        watchLists: state.marketReducer.watchLists,
        drawerOpen: state.marketReducer.drawerOpen
    };
}

export default withRouter(connect(mapStateToProps)(Market))