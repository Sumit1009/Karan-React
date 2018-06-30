import React from 'react';
import pubsub from 'pubsub-js';
import {Button, Col, Table, Modal, Row} from 'react-bootstrap';
import {Link} from 'react-router'
import BasicDetail from "../Common/BasicDetail";
// import SockJS from "sockjs-client";
import SockJsClient from 'react-stomp';
import {BASE_URL_STAFF, WEB_SOCKET_STOMP_URL} from "../Utils/Constants";
import {toastr} from 'react-redux-toastr'

const dashboardStaffPremiseUrl = BASE_URL_STAFF + 'dashboardStaffPremise';
const assignRequestToStaffMemberUrl = BASE_URL_STAFF + 'assignRequestToStaffMember';
const listAllStaffUrl = BASE_URL_STAFF + 'listAllStaff';
const fetchSarActivityListUrl = BASE_URL_STAFF + 'fetchSarActivityList';
const closeSubAmenityRequestUrl = BASE_URL_STAFF + 'closeSubAmenityRequest';
const changeSubAmenityRequestStatusUrl = BASE_URL_STAFF + 'changeSubAmenityRequestStatus';

class PremiseDashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            showModalMsg: false,
            result: {
                sarList: [],
                sarActivityList: [],
                newTasksCount: 0,
                assignedTasksCount: 0,
                completedTasksCount: 0,
                delayedTasksCount: 0
            },
            staffList: {
                frontOfficeStaff: [],
                backOfficeStaff: [],
                floorManagerStaff: [],
                staffMember: []
            },
            sarActivitiesOfSar: [],
            subAmenityRequest: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onTaskAssigned = this.onTaskAssigned.bind(this);
        this.onTaskDelivered = this.onTaskDelivered.bind(this);
        this.onTaskDenied = this.onTaskDenied.bind(this);
        this.onTaskCancelled = this.onTaskCancelled.bind(this);
        this.onActivityAdded = this.onActivityAdded.bind(this);
        this.changeSubAmenityRequestStatus = this.changeSubAmenityRequestStatus.bind(this);
    }

    componentWillMount() {
        pubsub.publish('setPageTitle', 'Dashboard');
    }

    componentDidMount() {

        fetch(dashboardStaffPremiseUrl, {
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
                BasicDetail.setCurrencySymbolCode(json.currencySymbolCode);
                BasicDetail.setPremiseId(json.premiseId);
            });
    }

    handleSubmit(subAmenityRequest, event) {
        event.preventDefault();
        let subAmenityRequestId = subAmenityRequest.subAmenityRequestId;
        let staffMemberId = this.refs.staffMemberId.value;

        fetch(assignRequestToStaffMemberUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({staffMemberId: staffMemberId, subAmenityRequestId: subAmenityRequestId}),
        }).then(response => response.json()).then(json => {
            // swal('Message', json.message);
            let tempList = this.state.result.sarList;
            delete tempList[subAmenityRequest.currentIndex];
            this.setState({sarList: tempList});
            this.closeMsg();
        });
    }

    changeSubAmenityRequestStatus(subAmenityRequest, event) {

        event.preventDefault();
        let subAmenityRequestId = subAmenityRequest.subAmenityRequestId;

        fetch(changeSubAmenityRequestStatusUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({
                subAmenityRequestId: subAmenityRequestId,
                isDashboard: true,
                status: this.refs.statusSubAmenity.value
            }),
        }).then(response => response.json()).then(json => {
            let tempList = this.state.result.sarList;
            if (['ASSIGNED'].indexOf(json.subAmenityRequest.status) > -1) {
                tempList.splice(subAmenityRequest.currentIndex, 1, json.subAmenityRequest);
            } else {
                delete tempList[subAmenityRequest.currentIndex];
            }
            this.setState({sarList: tempList});
            this.closeMsg();
        });
    }

    closeMsg() {
        this.setState({showModalMsg: false});
    }

    openMsg(subAmenityRequest, index) {

        if(index === -1) {
            console.log('index is -1   ========-----------------------------');
            this.state.result.sarList.map((item, index2) => {

                if(item.subAmenityRequestId === subAmenityRequest.subAmenityRequestId) {

                    console.log('item ---');
                    console.log(subAmenityRequest);
                    index = index2;
                }
            })
        }
        subAmenityRequest.currentIndex = index;
        console.log('index------------');
        console.log(index);

        fetch(listAllStaffUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({"premiseId": BasicDetail.getPremiseId()})
        })
            .then(response => response.json())
            .then(json => {
                this.setState({staffList: json});
                this.setState({subAmenityRequest: subAmenityRequest});
                fetch(fetchSarActivityListUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': BasicDetail.getAccessToken()
                    },
                    body: JSON.stringify({"subAmenityRequestId": subAmenityRequest.subAmenityRequestId})
                })
                    .then(response => response.json())
                    .then(json => {
                        this.setState({sarActivitiesOfSar: json})
                    });
            });

        this.setState({showModalMsg: true});
    }

    closeTask(subAmenityRequest) {

        let params = {
            subAmenityRequestId: subAmenityRequest.subAmenityRequestId
        };
        fetch(closeSubAmenityRequestUrl, {
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
                // let tempList = this.state.result.sarList;
                // delete tempList[subAmenityRequest.currentIndex];
                // this.setState({sarList: tempList});
                this.closeMsg();
            });
    }

    onTaskAssigned(subAmenityRequest) {

        let tempList = this.state.result.sarList;
        tempList.unshift(subAmenityRequest);
        this.setState({sarList: tempList});
        toastr.warning('Message', 'A new request has been initialized by guest');
    }

    onTaskDelivered(subAmenityRequest) {

        toastr.warning('Message', 'A service request has been delivered');
        let tempList = this.state.result.sarList;
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].subAmenityRequestId === subAmenityRequest.subAmenityRequestId) {
                tempList[i] = subAmenityRequest;
                break;
            }
        }
        this.setState({sarList: tempList});
    }

    onTaskDenied(subAmenityRequest) {

        toastr.warning('Message', 'A service request has been denied and assigned back to you.');
        let tempList = this.state.result.sarList;
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].subAmenityRequestId === subAmenityRequest.subAmenityRequestId) {
                tempList[i] = subAmenityRequest;
                break;
            }
        }
        this.setState({sarList: tempList});
    }

    onActivityAdded(subAmenityRequestActivity) {

        let tempList = this.state.result.sarActivityList;
        tempList.unshift(subAmenityRequestActivity);
        this.setState({sarActivityList: tempList});

        if(subAmenityRequestActivity.subAmenityRequest.assignedToId === BasicDetail.getUserId() && ['ASSIGNED', 'ONGOING'].indexOf(subAmenityRequestActivity.subAmenityRequest.status) > -1) {
            console.log('task assigned to self');
            let tempSarList = this.state.result.sarList;
            tempSarList.unshift(subAmenityRequestActivity.subAmenityRequest);
            this.setState({sarList: tempSarList});
        }
        toastr.warning('Message', 'A new activity has been added');
    }

    onTaskCancelled(subAmenityRequestActivity) {

        let tempList = this.state.result.sarActivityList;
        tempList.unshift(subAmenityRequestActivity);
        this.setState({sarActivityList: tempList});
        toastr.warning('Message', 'A task has been cancelled by guest.');

        this.state.result.sarList.map((item, index) => {

            if (item.subAmenityRequestId === subAmenityRequestActivity.sarId) {

                let temp = this.state.result.sarList;
                delete temp[index];
                this.setState({sarList: temp});
                return true;
            }
        })
    }

    render() {

        const {result} = this.state;
        const {staffList} = this.state;
        const {subAmenityRequest} = this.state;
        const {sarActivitiesOfSar} = this.state;

        let valueDiv = '';
        let quantityDiv = '';
        let whenToDeliverDiv = '';
        let descriptionDiv = '';
        let menuItemRequestDiv;

        let grandTotal = 0;

        if (subAmenityRequest.menuItemRequests)
            Object.values(subAmenityRequest.menuItemRequests).forEach(function (item) {
                grandTotal = grandTotal + item.price * item.quantity
            });

        if (subAmenityRequest.menuItemRequests && subAmenityRequest.menuItemRequests.length > 0) {

            menuItemRequestDiv = <div>
                <hr/>
                <h5>Menu Items Ordered</h5>

                <Table responsive className="">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subAmenityRequest.menuItemRequests.map((item, index) => (
                        <tr key={index} className="msg-display ">
                            <td>{item.name}</td>
                            <td>{BasicDetail.getCurrencySymbolCode()} {item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{BasicDetail.getCurrencySymbolCode()} {item.price * item.quantity}</td>

                        </tr>
                    ))}
                    <tr>
                        <th></th>
                        <th></th>
                        <th>TOTAL:</th>
                        <th>{BasicDetail.getCurrencySymbolCode()} {grandTotal}</th>
                    </tr>
                    </tbody>
                </Table>
            </div>
        }


        if (subAmenityRequest.descriptionLabel !== null) {
            descriptionDiv = <fieldset>
                <div className="form-group">
                    <label>{subAmenityRequest.descriptionLabel}</label>
                    <div>
                                                        <textarea placeholder="" disabled name="description"
                                                                  ref="description"
                                                                  className="form-control"
                                                                  value={subAmenityRequest.description || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (subAmenityRequest.quantityLabel !== null) {
            quantityDiv = <fieldset>
                <div className="form-group">
                    <label>{subAmenityRequest.quantityLabel}</label>
                    <div>
                        <input type="text" disabled name="quantity" ref="quantity"
                               className="form-control"
                               value={subAmenityRequest.quantity || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (subAmenityRequest.whenToDeliverLabel !== null) {
            whenToDeliverDiv = <fieldset>
                <div className="form-group">
                    <label>{subAmenityRequest.whenToDeliverLabel}</label>
                    <div>
                        <input type="text" disabled name="whenToDeliver" ref="whenToDeliver"
                               className="form-control"
                               value={subAmenityRequest.whenToDeliver || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (subAmenityRequest.valueLabel !== null) {

            valueDiv = <fieldset>
                <div className="form-group">
                    <label>{subAmenityRequest.valueLabel}</label>
                    <div>
                        <input type="text" disabled name="value" ref="value"
                               className="form-control"
                               value={subAmenityRequest.value || ''}/>
                    </div>
                </div>
            </fieldset>;
        }


        return (
            <section>
                <SockJsClient url={WEB_SOCKET_STOMP_URL}
                              topics={['/topic/sarAssignedToDeskStaff/' + BasicDetail.getUserId()]}
                              onMessage={(msg) => {
                                  this.onTaskAssigned(msg)
                              }}/>
                <SockJsClient url={WEB_SOCKET_STOMP_URL}
                              topics={['/topic/deskStaff/sarDelivered/' + BasicDetail.getUserId()]}
                              onMessage={(msg) => {
                                  this.onTaskDelivered(msg)
                              }}/>
                <SockJsClient url={WEB_SOCKET_STOMP_URL}
                              topics={['/topic/deskStaff/sarDenied/' + BasicDetail.getUserId()]}
                              onMessage={(msg) => {
                                  this.onTaskDenied(msg)
                              }}/>
                <SockJsClient url={WEB_SOCKET_STOMP_URL}
                              topics={['/topic/deskStaff/sarActivity/' + BasicDetail.getUserId()]}
                              onMessage={(msg) => {
                                  this.onActivityAdded(msg)
                              }}/>
                <SockJsClient url={WEB_SOCKET_STOMP_URL}
                              topics={['/topic/deskStaff/sarCancelled']}
                              onMessage={(msg) => {
                                  this.onTaskCancelled(msg)
                              }}/>
                <div className="content-heading bg-white">
                    <Row>
                        <Col sm={8}>
                            <h4 className="m0 text-thin">
                                <span data-localize="WELCOME">Welcome to </span>
                                {BasicDetail.getPremiseName()}</h4>
                            <small>Manage all your tasks are here.</small>
                        </Col>
                        <Col sm={4} className="text-right">
                            <Link to="/invite-guest" className="ripple">
                                <button type="button" className="mt-sm btn btn-warning ripple"><i
                                    className="ion-plus-round"></i> Invite Guest
                                </button>
                            </Link>
                            &nbsp;
                            <Link to="/service-requests/create" className="ripple">
                                <button type="button" className="mt-sm btn btn-warning ripple"><i
                                    className="ion-plus-round"></i> Create Request
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
                                    {result.sarList.map((item, index) => (
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
                                    <div className="card-body bb clickable" onClick={this.openMsg.bind(this, item.subAmenityRequest, -1)}>
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
                                        className={subAmenityRequest.statusColorCode}> {subAmenityRequest.status || ''} </div>
                                </div>
                                <div className="col-lg-4">
                                    <button
                                        className={"btn btn-warning " + ("DELIVERED" === subAmenityRequest.status ? "" : "hidden")}
                                        onClick={this.closeTask.bind(this, subAmenityRequest)}>Close Service
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
                                                    <select id="staffMemberId" value={subAmenityRequest.assignedToId}
                                                            name="staffMemberId" ref="staffMemberId"
                                                            onChange={(e) => this.handleSubmit(subAmenityRequest, e)}
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
                                                           value={subAmenityRequest.amenity || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Sub-Amenity</label>
                                                <div>
                                                    <input type="text" disabled name="subAmenity" ref="subAmenity"
                                                           className="form-control"
                                                           value={subAmenityRequest.subAmenity || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <div>

                                                    <select
                                                        name="statusSubAmenity" ref="statusSubAmenity"
                                                        value={subAmenityRequest.status}
                                                        disabled={['CANCELLED', 'DELIVERED', ''].indexOf(subAmenityRequest.status) > -1}
                                                        onChange={(e) => this.changeSubAmenityRequestStatus(subAmenityRequest, e)}
                                                        className="form-control">

                                                        <option value="INITIALIZED" hidden>INITIALIZED</option>
                                                        <option value="CLOSED" hidden>CLOSED</option>
                                                        <option value="INVALID" hidden>INVALID</option>
                                                        <option value="CANCELLED" hidden>CANCELLED</option>
                                                        <option value="EXPIRED" hidden>EXPIRED</option>


                                                        <option value="ASSIGNED"
                                                                hidden={(['INITIALIZED', 'ONGOING'].indexOf(subAmenityRequest.status) === -1) || subAmenityRequest.status === 'ASSIGNED'}>
                                                            ASSIGNED
                                                        </option>
                                                        <option value="ONGOING"
                                                                hidden={subAmenityRequest.status === 'ONGOING'}>
                                                            ONGOING
                                                        </option>
                                                        <option value="DELIVERED"
                                                                hidden={(['ONGOING'].indexOf(subAmenityRequest.status) === -1) || subAmenityRequest.status === 'DELIVERED'}>
                                                            DELIVERED
                                                        </option>
                                                        <option value="REJECTED"
                                                                hidden={subAmenityRequest.status === 'REJECTED'}>
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

export default PremiseDashboard;
