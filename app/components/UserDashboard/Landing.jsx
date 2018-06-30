import React from 'react';
import pubsub from 'pubsub-js';
import BasicDetail from "../Common/BasicDetail";

class Landing extends React.Component {

    componentWillMount() {
        pubsub.publish('setPageTitle', this.constructor.name);
        let alertMsg = 'You are not authorized to view this page';
        if (BasicDetail.getRole() === 'ROLE_PREMISE_FRONT_OFFICE')
            this.context.router.push('/dashboard');
        else{
            swal('Alert', alertMsg);
            this.setState({msg: alertMsg})
        }
    }

    constructor() {
        super();
        this.state = {msg: "Please wait..."}
    }

    render() {

        return (

            <section>

                <div>{this.state.msg}</div>
            </section>

        );
    }
}

Landing.contextTypes = {
    router: React.PropTypes.object
};
export default Landing;
