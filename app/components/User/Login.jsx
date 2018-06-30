import React from 'react';
import BasicDetail from "../Common/BasicDetail";
import firebase from 'firebase'
import {createHistory} from 'history'
import {useRouterHistory} from 'react-router';

import '../Forms/FormsAdvanced.scss'

let config = {
    apiKey: "AIzaSyCddMlMdUNhWSVkY0gNVL1uujAw1Sintvw",
    authDomain: "api-project-599410676779.firebaseapp.com",
    databaseURL: "https://api-project-599410676779.firebaseio.com",
    projectId: "api-project-599410676779",
    storageBucket: "api-project-599410676779.appspot.com",
    messagingSenderId: "599410676779"
};

const browserHistory = useRouterHistory(createHistory)({basename: REACT_BASE_HREF});
let t;

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.temp = this.temp.bind(this);


    }

    handleSubmit(event) {

        event.preventDefault();

        let data = {
            "username": this.refs.username.value,
            "password": this.refs.password.value
        };

        t = this;
        firebase.auth().signInWithEmailAndPassword(data.username, data.password).then(function (response) {
            console.log(response);
            console.log('success');
            console.log(response.user.h.b);
            t.context.router.push('/dashboard');
            console.log('111');
            BasicDetail.setAccessToken(response.user.h.b);
            console.log('222');
        }).catch(function (error) {
            console.log('error occurred in firebase-------------------------');
            console.log(error);
            swal('Alert', 'Please enter valid credentials')
        })
    }

    temp() {
        this.context.router.push('/dashboard');
    }

    componentDidMount() {

        firebase.initializeApp(config);
    }

    render() {
        return (
            <div className="layout-container">
                <div className="page-container bg-grey-100">
                    <div className="container-full">
                        <div className="container container-xs" style={{backgroundColor: 'white', marginTop: '100px'}}>
                            <form id="user-login" action="" name="loginForm" noValidate
                                  className="card b0 form-validate">
                                <div className="card-heading">
                                    <div className="card-title text-center"><h2>Login</h2></div>
                                </div>
                                <div className="card-body">
                                    <div className="mda-form-group float-label mda-input-group">
                                        <div className="mda-form-control">
                                            <input type="email" ref="username" name="username" required=""
                                                   className="form-control"/>
                                            <div className="mda-form-control-line"></div>
                                            <label>Email address</label>
                                        </div>
                                        <span className="mda-input-group-addon"><em
                                            className="ion-ios-email-outline icon-lg"></em></span>
                                    </div>
                                    <div className="mda-form-group float-label mda-input-group">
                                        <div className="mda-form-control">
                                            <input type="password" ref="password" name="password" required=""
                                                   className="form-control"/>
                                            <div className="mda-form-control-line"></div>
                                            <label>Password</label>
                                        </div>
                                        <span className="mda-input-group-addon"><em
                                            className="ion-ios-locked-outline icon-lg"></em></span>
                                    </div>
                                </div>
                                <button type="submit"
                                        style={{
                                            paddingBottom: '16px',
                                            paddingTop: '6px',
                                            marginBottom: '10px',
                                            color: 'white'
                                        }}
                                        className="btn btn-warning btn-flat-custom form-control"
                                        onClick={(e) => this.handleSubmit(e)}>Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object
};

export default Login;
