import React from 'react';
import pubsub from 'pubsub-js';
import {Col, Modal, Row, Table} from 'react-bootstrap';
import {Link} from 'react-router'
import BasicDetail from "../Common/BasicDetail";
import {toastr} from 'react-redux-toastr'

const url = '';

class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            showModalMsg: false,
            result: {
                taskList: [],
            },
            task: {},
            userList: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeTaskStatus = this.changeTaskStatus.bind(this);
    }

    componentWillMount() {
        pubsub.publish('setPageTitle', 'Dashboard');
    }

    componentDidMount() {

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({"access_token": BasicDetail.getAccessToken()})
        })
            .then(response => response.json())
            .then(json => {
                this.setState({result: json});

            });
    }

    handleSubmit(task, event) {
        event.preventDefault();
        let taskId = task.taskId;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({taskId: taskId}),
        }).then(response => response.json()).then(json => {
            // swal('Message', json.message);
            let tempList = this.state.result.taskList;
            delete tempList[task.currentIndex];
            this.setState({taskList: tempList});
            this.closeMsg();
        });
    }

    changeTaskStatus(task, event) {

        event.preventDefault();
        let taskId = task.taskId;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({
                taskId: taskId,
                isDashboard: true,
                status: this.refs.statusSubAmenity.value
            }),
        }).then(response => response.json()).then(json => {
            let tempList = this.state.result.taskList;
            if (['ASSIGNED'].indexOf(json.task.status) > -1) {
                tempList.splice(task.currentIndex, 1, json.task);
            } else {
                delete tempList[task.currentIndex];
            }
            this.setState({taskList: tempList});
            this.closeMsg();
        });
    }

    closeMsg() {
        this.setState({showModalMsg: false});
    }

    openMsg(task, index) {

        if (index === -1) {
            console.log('index is -1   ========-----------------------------');
            this.state.result.taskList.map((item, index2) => {

                if (item.taskId === task.taskId) {

                    console.log('item ---');
                    console.log(task);
                    index = index2;
                }
            })
        }
        task.currentIndex = index;
        console.log('index------------');
        console.log(index);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(json => {
                this.setState({task: task});
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': BasicDetail.getAccessToken()
                    },
                    body: JSON.stringify({"taskId": task.taskId})
                })
                    .then(response => response.json())
                    .then(json => {
                        this.setState({sarActivitiesOfSar: json})
                    });
            });

        this.setState({showModalMsg: true});
    }

    closeTask(task) {

        let params = {
            taskId: task.taskId
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify(params)
        })
            .then(response => response.json())
            .then(json => {
                swal('Message', json.message);
                this.closeMsg();
            });
    }

    render() {

        const {result} = this.state;
        const {userList} = this.state;
        const {task} = this.state;
        const {sarActivitiesOfSar} = this.state;

        let valueDiv = '';
        let quantityDiv = '';
        let whenToDeliverDiv = '';
        let descriptionDiv = '';

        let grandTotal = 0;


        if (task.descriptionLabel !== null) {
            descriptionDiv = <fieldset>
                <div className="form-group">
                    <label>{task.descriptionLabel}</label>
                    <div>
                                                        <textarea placeholder="" disabled name="description"
                                                                  ref="description"
                                                                  className="form-control"
                                                                  value={task.description || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (task.quantityLabel !== null) {
            quantityDiv = <fieldset>
                <div className="form-group">
                    <label>{task.quantityLabel}</label>
                    <div>
                        <input type="text" disabled name="quantity" ref="quantity"
                               className="form-control"
                               value={task.quantity || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (task.whenToDeliverLabel !== null) {
            whenToDeliverDiv = <fieldset>
                <div className="form-group">
                    <label>{task.whenToDeliverLabel}</label>
                    <div>
                        <input type="text" disabled name="whenToDeliver" ref="whenToDeliver"
                               className="form-control"
                               value={task.whenToDeliver || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (task.valueLabel !== null) {

            valueDiv = <fieldset>
                <div className="form-group">
                    <label>{task.valueLabel}</label>
                    <div>
                        <input type="text" disabled name="value" ref="value"
                               className="form-control"
                               value={task.value || ''}/>
                    </div>
                </div>
            </fieldset>;
        }


        return (
            <section>

                <div className="content-heading bg-white">
                    <Row>
                        <Col sm={8}>
                            <h4 className="m0 text-thin">
                                <span data-localize="WELCOME"></span>
                                {BasicDetail.getFullName()}</h4>
                            <small>Manage all your tasks are here.</small>
                        </Col>
                        <Col sm={4} className="text-right">

                            <Link to="/user/create" className="ripple">
                                <button type="button" className="mt-sm btn btn-warning ripple"><i
                                    className="ion-plus-round"></i> Create User
                                </button>
                            </Link>
                        </Col>
                    </Row>
                </div>

                <div className="container-fluid">

                    <Row>
                        <Col lg={8} xs={12}>

                            <div className="card">
                                <table className="tableCompact table-hover table-fixed va-middle">
                                    <tbody>
                                    {result.taskList.map((item, index) => (
                                        <tr key={index} className="msg-display clickable">
                                            <td onClick={this.openMsg.bind(this, item, index)} className="wd-xxs">
                                                <div className="initial32 bg-indigo-500">E</div>
                                            </td>
                                            {/*<td onClick={this.openMsg.bind(this, item, index)}*/}
                                            {/*className="text-ellipsis wd-sm">{item.amenity}</td>*/}
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis wd-sm">{item.subAmenity}</td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis">{item.dateCreated}</td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis ">{item.room}</td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis">{item.assignedTo}</td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis">
                                                <div className={item.statusColorCode}> {item.status} </div>
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>

                    <Modal show={this.state.showModalMsg} onHide={this.closeMsg.bind(this)}
                           className="modal-right modal-auto-size">
                        <Modal.Header closeButton>
                            <div className="row" style={{marginTop: '20px'}}>
                                <div className="col-lg-8">
                                    <div style={{fontSize: '18px', display: 'inline-block'}}
                                         className={task.statusColorCode}> {task.status || ''} </div>
                                </div>
                                <div className="col-lg-4">
                                    <button
                                        className={"btn btn-warning " + ("DELIVERED" === task.status ? "" : "hidden")}
                                        onClick={this.closeTask.bind(this, task)}>Complete task
                                    </button>
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-6 col-sm-12" style={{paddingLeft: '20px'}}>
                                    <form id="form-example" name="form.formValidate" noValidate
                                          className="form-validate form-horizontal">
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Assign To</label>
                                                <div className="">
                                                    <select id="userId" value={task.assignedToId}
                                                            name="userId" ref="userId"
                                                            onChange={(e) => this.handleSubmit(task, e)}
                                                            className="form-control">
                                                        {userList.map(item => (
                                                            <option value={item.uuid}>{item.name}</option>
                                                        ))}

                                                    </select>
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset>
                                            <div className="form-group">
                                                <label>Amenity</label>
                                                <div>
                                                    <input type="text" disabled placeholder="" name="amenity"
                                                           ref="amenity"
                                                           className="form-control"
                                                           value={task.amenity || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Sub-Amenity</label>
                                                <div>
                                                    <input type="text" disabled name="subAmenity" ref="subAmenity"
                                                           className="form-control"
                                                           value={task.subAmenity || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <div>

                                                    <select
                                                        name="statusSubAmenity" ref="statusSubAmenity"
                                                        value={task.status}
                                                        disabled={['CANCELLED', 'DELIVERED', ''].indexOf(task.status) > -1}
                                                        onChange={(e) => this.changeTaskStatus(task, e)}
                                                        className="form-control">

                                                        <option value="INITIALIZED" hidden>INITIALIZED</option>
                                                        <option value="CLOSED" hidden>CLOSED</option>
                                                        <option value="INVALID" hidden>INVALID</option>
                                                        <option value="CANCELLED" hidden>CANCELLED</option>
                                                        <option value="EXPIRED" hidden>EXPIRED</option>


                                                        <option value="ASSIGNED"
                                                                hidden={(['INITIALIZED', 'ONGOING'].indexOf(task.status) === -1) || task.status === 'ASSIGNED'}>
                                                            ASSIGNED
                                                        </option>
                                                        <option value="ONGOING"
                                                                hidden={task.status === 'ONGOING'}>
                                                            ONGOING
                                                        </option>
                                                        <option value="DELIVERED"
                                                                hidden={(['ONGOING'].indexOf(task.status) === -1) || task.status === 'DELIVERED'}>
                                                            DELIVERED
                                                        </option>
                                                        <option value="REJECTED"
                                                                hidden={task.status === 'REJECTED'}>
                                                            REJECTED
                                                        </option>
                                                    </select>

                                                </div>
                                            </div>
                                        </fieldset>
                                        {valueDiv}
                                        {quantityDiv}
                                        {whenToDeliverDiv}
                                        {descriptionDiv}
                                        {/* END panel */}
                                    </form>
                                    <hr/>

                                </div>


                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {/*Footer*/}
                        </Modal.Footer>
                    </Modal>

                </div>
            </section>
        );
    }
}

export default Dashboard;
