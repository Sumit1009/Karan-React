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
                sarActivityList: [],

            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onTaskAssigned = this.onTaskAssigned.bind(this);
        this.onTaskDelivered = this.onTaskDelivered.bind(this);
        this.onTaskDenied = this.onTaskDenied.bind(this);
        this.onTaskCancelled = this.onTaskCancelled.bind(this);
        this.onActivityAdded = this.onActivityAdded.bind(this);
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
        let staffMemberId = this.refs.staffMemberId.value;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({staffMemberId: staffMemberId, taskId: taskId}),
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
                this.setState({staffList: json});
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

    onTaskAssigned(task) {

        let tempList = this.state.result.taskList;
        tempList.unshift(task);
        this.setState({taskList: tempList});
        toastr.warning('Message', 'A new request has been initialized by guest');
    }

    onTaskDelivered(task) {

        toastr.warning('Message', 'A service request has been delivered');
        let tempList = this.state.result.taskList;
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].taskId === task.taskId) {
                tempList[i] = task;
                break;
            }
        }
        this.setState({taskList: tempList});
    }

    onTaskDenied(task) {

        toastr.warning('Message', 'A service request has been denied and assigned back to you.');
        let tempList = this.state.result.taskList;
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].taskId === task.taskId) {
                tempList[i] = task;
                break;
            }
        }
        this.setState({taskList: tempList});
    }

    onActivityAdded(taskActivity) {

        let tempList = this.state.result.sarActivityList;
        tempList.unshift(taskActivity);
        this.setState({sarActivityList: tempList});


        toastr.warning('Message', 'A new activity has been added');
    }

    onTaskCancelled(taskActivity) {

        let tempList = this.state.result.sarActivityList;
        tempList.unshift(taskActivity);
        this.setState({sarActivityList: tempList});
        toastr.warning('Message', 'A task has been cancelled by guest.');

        this.state.result.taskList.map((item, index) => {

            if (item.taskId === taskActivity.sarId) {

                let temp = this.state.result.taskList;
                delete temp[index];
                this.setState({taskList: temp});
                return true;
            }
        })
    }

    render() {

        const {result} = this.state;
        const {staffList} = this.state;
        const {task} = this.state;
        const {sarActivitiesOfSar} = this.state;

        let valueDiv = '';
        let quantityDiv = '';
        let whenToDeliverDiv = '';
        let descriptionDiv = '';
        let menuItemRequestDiv;

        let grandTotal = 0;

        if (task.menuItemRequests)
            Object.values(task.menuItemRequests).forEach(function (item) {
                grandTotal = grandTotal + item.price * item.quantity
            });

        if (task.menuItemRequests && task.menuItemRequests.length > 0) {

            menuItemRequestDiv = <div>
                <hr/>
                <h5>Menu Items Ordered</h5>

                <Table responsive className="">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {task.menuItemRequests.map((item, index) => (
                        <tr key={index} className="msg-display ">
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>

                        </tr>
                    ))}
                    <tr>
                        <th></th>
                        <th></th>
                        <th>TOTAL:</th>
                    </tr>
                    </tbody>
                </Table>
            </div>
        }


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
                        <Col lg={4} xs={12}>
                            {/* Activity feed */}
                            <div className="card">
                                <div className="card-heading">
                                    <div className="card-title">Activities</div>
                                    <small>What's people doing right now</small>
                                </div>

                                {result.sarActivityList.map(item => (
                                    <div className="card-body bb clickable"
                                         onClick={this.openMsg.bind(this, item.task, -1)}>
                                        <p className="pull-left mr"><a href=""><img src="img/user/04.jpg" alt="User"
                                                                                    className="img-circle thumb32"/></a>
                                        </p>
                                        <div>Type your text here</div>
                                    </div>
                                ))}


                                <a href="" className="card-footer btn btn-flat btn-default">
                                    <small className="text-center text-muted lh1">See more activities</small>
                                </a>
                            </div>
                        </Col></Row>

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
                                        onClick={this.closeTask.bind(this, task)}>Close Service
                                        Request
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
                                                    <select id="staffMemberId" value={task.assignedToId}
                                                            name="staffMemberId" ref="staffMemberId"
                                                            onChange={(e) => this.handleSubmit(task, e)}
                                                            className="form-control">
                                                        <optgroup label="Front Office">
                                                            {staffList.frontOfficeStaff.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Back Office">
                                                            {staffList.backOfficeStaff.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Floor Manager">
                                                            {staffList.floorManagerStaff.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Staff Member">
                                                            {staffList.staffMember.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
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
                                <div className="hidden visible-xs"><h5>Activities</h5></div>
                                <div className="col-md-6 col-sm-12">
                                    {sarActivitiesOfSar.map(item => (
                                        <div className="card-body bb container-fluid">
                                            <p className="pull-left mr"><img src="img/user/04.jpg" alt="User"
                                                                             className="img-circle thumb32"/>
                                            </p>
                                            <div className="oh">
                                                Type your text here

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {menuItemRequestDiv}
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
