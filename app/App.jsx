import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link, IndexRoute, useRouterHistory, hashHistory} from 'react-router';
import {Route} from 'react-router-dom';
import {createHistory} from 'history'

import Core from './components/Core/Core';
import Translate from './components/Translate/Translate';

import PremiseDashboard from './components/UserDashboard/Dashboard';
import StaffMembers from "./components/Member/Members";
import User from './components/User/User';
import CreateServiceRequest from './components/task/CreateTask';
import ListServiceRequest from './components/task/ListTask';

import Landing from "./components/UserDashboard/Landing";

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

            <Route path="dashboard" component={PremiseDashboard}/>

            <Route path="service-requests">

                <Route path="create" component={CreateServiceRequest}/>
                <Route path="INITIALIZED" component={() => <ListServiceRequest status="INITIALIZED"/>}/>
                <Route path="ASSIGNED" component={() => <ListServiceRequest status="ASSIGNED"/>}/>
                <Route path="ONGOING" component={() => <ListServiceRequest status="ONGOING"/>}/>
                <Route path="DELIVERED" component={() => <ListServiceRequest status="DELIVERED"/>}/>
                <Route path="CLOSED" component={() => <ListServiceRequest status="CLOSED"/>}/>
                <Route path="REJECTED" component={() => <ListServiceRequest status="REJECTED"/>}/>
                <Route path="INVALID" component={() => <ListServiceRequest status="INVALID"/>}/>
                <Route path="EXPIRED" component={() => <ListServiceRequest status="EXPIRED"/>}/>
                <Route path="ALL" component={() => <ListServiceRequest status="ALL"/>}/>
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
