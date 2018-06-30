import React from 'react';
import pubsub from 'pubsub-js';
import {Dropdown, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {Route, Router} from 'react-router';

import './Header.scss';
import './HeaderMenuLinks.scss';
import BasicDetail from "../Common/BasicDetail";
import {BASE_URL} from "../Utils/Constants";

class Header extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            pageTitle: ''
        };
        this.logout = this.logout.bind(this);
        this.performLogout = this.performLogout.bind(this);
    }

    componentWillMount() {
        this.pubsub_token = pubsub.subscribe('setPageTitle', (ev, title) => {
            this.setState({pageTitle: title});
        });
    }

    componentWillUnmount() {
        pubsub.unsubscribe(this.pubsub_token);
    }

    showSearch() {
        pubsub.publish('showsearch');
    }

    showSettings() {
        pubsub.publish('showsettings');
    }

    logout() {

        console.log('logout called');
        // swal({
        //         title: 'Are you sure?',
        //         // text: 'You will not be able to recover this imaginary file!',
        //         type: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#DD6B55',
        //         confirmButtonText: 'Yes',
        //         closeOnConfirm: true
        //     },
        //     this.performLogout);
        this.performLogout();
    }

    performLogout() {
        fetch(BASE_URL + 'api/v1/security/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({})
        }).then(response => {
                BasicDetail.clearAll();
                console.log('logout executed');
                this.context.router.push('/login');
            });
    }

    render() {

        return (
            <header className="header-container">

                <nav>
                    <ul className="visible-xs visible-sm">
                        <li><a id="sidebar-toggler" href="#"
                               className="menu-link menu-link-slide"><span><em></em></span></a></li>
                    </ul>
                    <ul className="hidden-xs">
                        <li><a id="offcanvas-toggler" href="#"
                               className="menu-link menu-link-slide"><span><em></em></span></a></li>
                    </ul>
                    <h2 className="header-title">{this.state.pageTitle}</h2>

                    <ul className="pull-right">

                        <Dropdown id="basic-nav-dropdown" pullRight componentClass="li">
                            <Dropdown.Toggle useAnchor noCaret className="has-badge ripple">
                                <em className="ion-person"></em>
                                {/*<sup className="badge bg-danger">3</sup>*/}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="md-dropdown-menu">
                                <LinkContainer to="pages/profile">
                                    <MenuItem eventKey={3.1}>
                                        <em className="ion-home icon-fw"></em>
                                        Profile
                                    </MenuItem>
                                </LinkContainer>

                                <MenuItem divider/>
                                <LinkContainer to="/login">
                                    <MenuItem eventKey={3.3}><em className="ion-log-out icon-fw"></em>Logout</MenuItem>
                                </LinkContainer>
                            </Dropdown.Menu>
                        </Dropdown>
                        <li>
                            <a href="#" className="ripple" onClick={this.logout}>
                                <em className="ion-log-out"></em>
                            </a>
                        </li>
                    </ul>

                </nav>
            </header>
        );
    }
}

Header.contextTypes = {
    router: React.PropTypes.object
};
export default Header;
