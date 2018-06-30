import React from 'react';
import {Link} from 'react-router'

import './Sidebar.scss';

import SidebarRun from './Sidebar.run';
import {initSvgReplace} from '../Utils/Utils';
import BasicDetail from "../Common/BasicDetail";

class UserSidebar extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        SidebarRun();
        initSvgReplace();
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        for (let p in paths) {
            if (this.context.router.isActive('' + paths[p]) === true)
                return 'active';
        }
        return '';
    }

    render() {
        return (

            <aside className="sidebar-container">
                <div className="sidebar-header" style={{padding: '0'}}>
                    <div className="pull-right pt-lg text-muted hidden"><em className="ion-close-round"></em></div>
                    <Link to="/dashboard" className="sidebar-header-logo"><img src="img/logo.png"
                                                                               data-svg-replace="img/logo.svg"
                                                                               alt="Logo"/><span
                        className="sidebar-header-logo-text"><img style={{height: '55px', width: 'auto'}}
                                                                  src="img/theme/HalloGuest_Logo_White.png"/></span></Link>
                </div>
                <div className="sidebar-content">
                    <div className="sidebar-toolbar text-center">
                        <a href=""><img src="img/user/01.jpg" style={{height: '55px', width: 'auto'}} alt="Profile"
                                        className="img-circle thumb64"/></a>
                        <div className="mt">Welcome, {BasicDetail.getFullName()}</div>
                    </div>
                    <nav className="sidebar-nav">
                        <ul>
                            <li className={this.routeActive('/dashboard') ? 'active' : ''}>
                                <Link to="dashboard" className="ripple">
                                    <span className="pull-right nav-label"></span><span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('/user/list') ? 'active' : ''}>
                                <Link to="delivered-requests" className="ripple">
                                    <span className="pull-right nav-label">
                                        {/*<span className="badge bg-primary">2</span>*/}
                                    </span><span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Users</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('all-tasks') ? 'active' : ''}>
                                <Link to="all-requests" className="ripple">
                                    <span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>All tasks</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('/invite-guest') ? 'active' : ''}>
                                <Link to="invite-guest" className="ripple">
                                    <span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Invite Guest</span>
                                </Link>
                            </li>

                            <li className={this.routeActive(['service-requests/create', 'service-requests/list'])}>
                                <a href="#" className="ripple">
                                    <span className="pull-right nav-caret"><em
                                        className="ion-ios-arrow-right"></em></span><span
                                    className="pull-right nav-label"></span><span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/clipboard.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Service Requests</span>
                                </a>
                                <ul className="sidebar-subnav">
                                    <li className={this.routeActive('service-requests/INITIALIZED')}>
                                        <Link to="service-requests/INITIALIZED" className="ripple">
                                            <span className="pull-right nav-label"></span><span>INITIALIZED</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/ASSIGNED')}>
                                        <Link to="service-requests/ASSIGNED" className="ripple">
                                            <span className="pull-right nav-label"></span><span>ASSIGNED</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/ONGOING')}>
                                        <Link to="service-requests/ONGOING" className="ripple">
                                            <span className="pull-right nav-label"></span><span>ONGOING</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/DELIVERED')}>
                                        <Link to="service-requests/DELIVERED" className="ripple">
                                            <span className="pull-right nav-label"></span><span>DELIVERED</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/CLOSED')}>
                                        <Link to="service-requests/CLOSED" className="ripple">
                                            <span className="pull-right nav-label"></span><span>CLOSED</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/REJECTED')}>
                                        <Link to="service-requests/REJECTED" className="ripple">
                                            <span className="pull-right nav-label"></span><span>REJECTED</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/INVALID')}>
                                        <Link to="service-requests/INVALID" className="ripple">
                                            <span className="pull-right nav-label"></span><span>INVALID</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/EXPIRED')}>
                                        <Link to="service-requests/EXPIRED" className="ripple">
                                            <span className="pull-right nav-label"></span><span>EXPIRED</span>
                                        </Link>
                                    </li>
                                    <li className={this.routeActive('service-requests/ALL')}>
                                        <Link to="service-requests/ALL" className="ripple">
                                            <span className="pull-right nav-label"></span><span>ALL</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className={this.routeActive('/assignedToMe') ? 'active' : ''}>
                                <Link to="assignedToMe" className="ripple">
                                    <span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Assigned to me</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('/staffMembers') ? 'active' : ''}>
                                <Link to="staffMembers" className="ripple">
                                    <span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Staff Members</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        );
    }
}

UserSidebar.contextTypes = {
    router: React.PropTypes.object
};

export default UserSidebar;
