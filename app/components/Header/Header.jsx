import React from 'react';
import pubsub from 'pubsub-js';

import './Header.scss';
import './HeaderMenuLinks.scss';
import BasicDetail from "../Common/BasicDetail";

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
        this.performLogout();
    }

    performLogout() {
        fetch('', {
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
