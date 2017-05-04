import PropTypes from 'prop-types';
import React, { Component } from 'react';
import View from '../store/View';
import { Route, Switch } from 'react-router-dom';

import Personal from '../screen/Personal';
import Project from '../screen/Project';
import User from '../screen/User';
import NotFound from '../component/NotFound';

export default class Router extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => <Personal viewStore={store} />}
                />
                <Route
                    path="/users"
                    render={() => <User viewStore={store} />}
                />
                <Route
                    path="/projects"
                    render={() => <Project viewStore={store} />}
                />
                <Route render={NotFound} viewStore={() => <NotFound />} />
            </Switch>
        );
    }
}
