import React from 'react';
import pubsub from 'pubsub-js';
import {Grid, Row, Col, Button} from 'react-bootstrap';


class StaffList extends React.Component {

    componentWillMount() {
        pubsub.publish('setPageTitle', 'Staff Members');
    }

    constructor(props) {
        super(props);
        this.state = {
            staffList: [],
        };
    }

    componentDidMount() {


    }

    render() {
        return (
            <section>
                <Grid fluid>
                    <Row>

                    </Row>
                </Grid>
            </section>
        );
    }
}

export default StaffList;
