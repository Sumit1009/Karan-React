import React from 'react';

import LoginRun from './Login.run';
import BasicDetail from "../Common/BasicDetail";
import {BASE_URL} from "../Utils/Constants";
import firebase from 'firebase'
import { connect } from 'react-firebase'

let config = {
    apiKey: "AIzaSyCddMlMdUNhWSVkY0gNVL1uujAw1Sintvw",
    authDomain: "api-project-599410676779.firebaseapp.com",
    databaseURL: "https://api-project-599410676779.firebaseio.com",
    projectId: "api-project-599410676779",
    storageBucket: "api-project-599410676779.appspot.com",
    messagingSenderId: "599410676779"
};


class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {

        firebase.initializeApp(config);


        LoginRun((form) => {

            let data = {
                "username": this.refs.username.value,
                "password": this.refs.password.value
            };


            fetch(BASE_URL + 'api/login', {
                method: 'post',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status === 200)
                    return response.json();
                else if (response.status === 401)
                    swal('Alert', 'Please enter valid credentials');
                return null
            }).then(json => {
                BasicDetail.setRole(json.roles[0]);
                BasicDetail.setAccessToken(json.access_token);
                BasicDetail.setPremiseName(json.premiseName);
                BasicDetail.setUserId(json.userId);
                BasicDetail.setFullName("" + json.firstName +" "+json.lastName);
                if (BasicDetail.getRole() === 'ROLE_PREMISE_STAFF')
                    this.context.router.push('/staff');
                else if (BasicDetail.getRole() === 'ROLE_PREMISE_FRONT_OFFICE')
                    this.context.router.push('/dashboard');
                else swal('Alert', 'You are not authorized to view this page')
            });
        });
    }

    render() {
        return (
            <div className="container-full">
                <div className="container container-xs"><img src="img/theme/logo.png"
                                                             className="mv-lg block-center img-responsive" style={{height:'64px'}}/>
                    <form id="user-login" action="" name="loginForm" noValidate className="card b0 form-validate">
                        <div className="card-heading">
                            <div className="card-title text-center">Login</div>
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
                        <button type="submit" style={{paddingBottom:'16px',paddingTop:'16px',color:'white'}} className="btn btn-warning btn-flat-custom">Login <span
                            className="btn-label btn-label-right"><i className="ion-arrow-right-c"></i></span></button>
                    </form>
                    {/*<div className="text-center text-sm">*/}
                        {/*<Link to="recover" className="text-inherit">Forgot password?</Link>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object
};

export default Login;
