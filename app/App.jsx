import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link, IndexRoute, useRouterHistory, hashHistory} from 'react-router';
import {Route} from 'react-router-dom';
import {createHistory} from 'history'

import Core from './components/Core/Core';

import CreateTask from './components/task/CreateTask';
import ListTask from './components/task/ListTask';

import Landing from "./components/UserDashboard/Landing";
import Dashboard from "./components/UserDashboard/Dashboard";
import Login from "./components/User/Login";
import CreateUser from "./components/User/CreateUser";


$(() => {
    $(document).on('click', '[href=""],[href="#"]', () => {
        return false;
    });

    $(document).on('change', '.mda-form-control > input', function () {
        $(this)[this.value.length ? 'addClass' : 'removeClass']('has-value');
    });

});

const browserHistory = useRouterHistory(createHistory)({basename: REACT_BASE_HREF})

ReactDOM.render(
    <Router history={hashHistory}>

        <Route path="/" component={Core}>

            <IndexRoute component={Landing}/>

            <Route path="dashboard" component={Dashboard}/>
            <Route path="login" component={Login}/>
            <Route path="create-task" component={CreateTask}/>
            <Route path="all-tasks" component={ListTask}/>

            <Route path="user">

                <Route path="create" component={CreateUser}/>
                <Route path="list" component={CreateTask}/>
            </Route>

        </Route>

    </Router>,
    document.getElementById('app')
);

browserHistory.listen(function (ev) {
    $('.sidebar-visible').removeClass('sidebar-visible');
});
