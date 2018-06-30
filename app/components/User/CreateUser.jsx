import React from 'react';
import { Link } from 'react-router'

class CreateUser extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <section>
                <div className="container-full">
                    <div className="container container-xs" style={{backgroundColor: 'white', marginTop: '15px'}}>
                        <form id="user-signup" action="" name="createForm" noValidate className="card b0 form-validate">
                            <div className="card-heading">
                                <div className="card-title text-center"><h3>Create account</h3></div>
                            </div>
                            <div className="card-body">
                                <div className="mda-form-group float-label mda-input-group">
                                    <div className="mda-form-control">
                                        <label>Email address</label>
                                        <div className="mda-form-control-line"></div>

                                        <input type="email" name="accountName" required="" className="form-control" />

                                    </div><span className="mda-input-group-addon"><em className="ion-ios-email-outline icon-lg"></em></span>
                                </div>
                                <div className="mda-form-group float-label mda-input-group">
                                    <div className="mda-form-control">
                                        <input id="account-password" type="password" name="accountPassword" required="" className="form-control" />
                                        <div className="mda-form-control-line"></div>
                                        <label>Password</label>
                                    </div><span className="mda-input-group-addon"><em className="ion-ios-locked-outline icon-lg"></em></span>
                                </div>
                                <div className="mda-form-group float-label mda-input-group">
                                    <div className="mda-form-control">
                                        <input type="password" name="accountPasswordCheck" required="" className="form-control" />
                                        <div className="mda-form-control-line"></div>
                                        <label>Confirm password</label>
                                    </div><span className="mda-input-group-addon"><em className="ion-ios-locked-outline icon-lg"></em></span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary form-control">Create</button>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}

export default CreateUser;
