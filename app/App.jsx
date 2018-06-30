import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link, IndexRoute, useRouterHistory, hashHistory} from 'react-router';
import {Route} from 'react-router-dom';
import {createHistory} from 'history'

import Core from './components/Core/Core';
import Translate from './components/Translate/Translate';

import StaffMembers from "./components/Member/Members";
import User from './components/User/User';
import CreateServiceRequest from './components/task/CreateTask';
import ListServiceRequest from './components/task/ListTask';

import Landing from "./components/UserDashboard/Landing";
import Dashboard from "./components/UserDashboard/Dashboard";

Translate();

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

            <Route path="user">

                <Route path="create" component={CreateServiceRequest}/>
                <Route path="list" component={CreateServiceRequest}/>
            </Route>

            <Route path="assignedToMe" component={() => <ListServiceRequest status="ASSIGNED"/>}/>
            <Route path="all-requests" component={() => <ListServiceRequest status="ALL"/>}/>


            <Route path="staffMembers" component={StaffMembers.StaffList}/>

            <Route path="profile">
                <Route path="manage" component={StaffMembers.StaffProfile}/>
                <Route path="change-password" component={StaffMembers.StaffProfile}/>
            </Route>


        </Route>

        <Route path="/" component={User.Layout}>
            <Route path="login" component={User.Login}/>
            <Route path="signup" component={User.Signup}/>
            <Route path="recover" component={User.Recover}/>
            <Route path="lock" component={User.Lock}/>
        </Route>

    </Router>,
    document.getElementById('app')
);

browserHistory.listen(function (ev) {
    $('.sidebar-visible').removeClass('sidebar-visible');
});
