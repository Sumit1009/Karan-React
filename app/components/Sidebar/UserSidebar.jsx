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
                        className="sidebar-header-logo-text"></span></Link>
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
                                <Link to="/user/list" className="ripple">
                                    <span className="pull-right nav-label">
                                        {/*<span className="badge bg-primary">2</span>*/}
                                    </span><span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Users</span>
                                </Link>
                            </li>
                            <li className={this.routeActive('user/create') ? 'active' : ''}>
                                <Link to="user/create" className="ripple">
                                    <span className="nav-icon">
                                    <img src="" data-svg-replace="img/icons/aperture.svg" alt="MenuItem"
                                         className="hidden"/></span>
                                    <span>Create User</span>
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
