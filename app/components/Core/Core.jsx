import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Core.scss';
import './LayoutVariants.scss';

import Header from '../Header/Header';
import HeaderSearch from '../Header/HeaderSearch';
import PremiseSidebar from '../Sidebar/UserSidebar';
import BasicDetail from "../Common/BasicDetail";
import Login from "../User/Login";
import Layout from "../User/Layout";
import {Provider} from 'react-redux'
import ReduxToastr from 'react-redux-toastr'

import {createStore, combineReducers} from 'redux'
import {reducer as toastrReducer} from 'react-redux-toastr'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

const reducers = {
    // ... other reducers ...
    toastr: toastrReducer // <- Mounted at toastr.
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);

class Core extends React.Component {

    componentDidMount() {

        // used for spinner
        require('../../../node_modules/loaders.css/loaders.css.js');
    }

    render() {

        const animationName = 'rag-fadeIn';
        let isLoggedIn = true;

        let leftNav = getSideBar();

        // if (!BasicDetail.getAccessToken())
        //     return (<Layout><Login/></Layout>);
        // else


            return (
            <div className="layout-container">

                <Header/>

                {leftNav}
                <div className="sidebar-layout-obfuscator"></div>

                <ReactCSSTransitionGroup
                    component="main"
                    className="main-container"
                    transitionName={animationName}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    <Provider store={store}>
                        <div className="toastr-left-container">
                            <ReduxToastr
                                timeOut={4000}
                                newestOnTop={false}
                                position="top-right"
                                transitionIn="fadeIn"
                                transitionOut="fadeOut"/>
                        </div>
                    </Provider>
                    {/* Page content */}
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                    })}

                    <div ref="progressBar" className="floating -align-center">
                        <div className="loader-inner ball-clip-rotate-pulse"></div>
                    </div>

                    {/* Page footer */}
                    <footer>
                        <span>2018 - HalloGuest app.</span>
                    </footer>
                </ReactCSSTransitionGroup>

                {/* Search template */}
                <HeaderSearch/>

            </div>
        );
    }
}

function getSideBar() {
    return <PremiseSidebar/>
}

export default Core;
