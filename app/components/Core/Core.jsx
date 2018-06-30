import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Core.scss';
import './LayoutVariants.scss';

import Header from '../Header/Header';
import HeaderSearch from '../Header/HeaderSearch';
import UserSidebar from '../Sidebar/UserSidebar';
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

class ParentComponent extends React.Component {

    componentDidMount() {

        // used for spinner
        require('../../../node_modules/loaders.css/loaders.css.js');
    }

    render() {


        let leftNav = getSideBar();

        if (!BasicDetail.getAccessToken())
            return (<Layout><Login/></Layout>);
        else
            return (
                <div className="layout-container">

                    <Header/>

                    {leftNav}
                    <div className="sidebar-layout-obfuscator"></div>

                    <ReactCSSTransitionGroup
                        component="main"
                        className="main-container"
                        transitionName={'rag-fadeIn'}
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
                        {React.cloneElement(this.props.children, {
                            key: this.props.location.pathname
                        })}

                        <div ref="progressBar" className="floating -align-center">
                            <div className="loader-inner ball-clip-rotate-pulse"></div>
                        </div>

                        <footer>
                            <span>2018 - HalloGuest app.</span>
                        </footer>
                    </ReactCSSTransitionGroup>
                    {/*<HeaderSearch/>*/}
                </div>
            );
    }
}

function getSideBar() {
    return <UserSidebar/>
}

export default ParentComponent;
