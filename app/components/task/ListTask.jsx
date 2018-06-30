import React from 'react';
import pubsub from 'pubsub-js';
import {Grid, Row, Col, Table, Modal} from 'react-bootstrap';
import BasicDetail from "../Common/BasicDetail";
import {Pagination} from 'react-bootstrap';
import {activityDetail} from "../Common/ActivityStatusText";

const url = '';

class ListServiceRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModalMsg: false,
            result: {requestlist: []},
            staffList: {
                frontOfficeStaff: [],
                backOfficeStaff: [],
                floorManagerStaff: [],
                staffMember: []
            },
            status: props.status,
            sarActivitiesOfSar: [],
            subAmenityRequest: {},
            activePage: 1,
            totalPages: 1,
            max: 20
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeSubAmenityRequestStatus = this.changeSubAmenityRequestStatus.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentWillMount() {
        pubsub.publish('setPageTitle', 'Service Requests');
    }

    componentDidMount() {

        this.loadData(0);
    }

    loadData(offset) {
        let jsonObj;
        let params = {
            status: this.state.status,
            max: this.state.max,
            offset: offset
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
                jsonObj = json;
                let numberOfPages = Math.trunc((jsonObj.totalCount / this.state.max)) + ((jsonObj.totalCount % this.state.max === 0 ? 0 : 1));
                console.log('numberOfPages---------' + (numberOfPages));
                this.setState({result: jsonObj});
                this.setState({totalPages: numberOfPages});
            });
    }

    closeMsg() {
        this.setState({showModalMsg: false});
    }

    openMsg(subAmenityRequest, index) {
        console.log(subAmenityRequest);
        subAmenityRequest.currentIndex = index;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
        })
            .then(response => response.json())
            .then(json => {
                this.setState({staffList: json});
                this.setState({subAmenityRequest: subAmenityRequest});
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': BasicDetail.getAccessToken()
                    },
                    body: JSON.stringify({"subAmenityRequestId": subAmenityRequest.uuid})
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
            subAmenityRequestId: subAmenityRequest.uuid
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
                let tempList = this.state.result.requestlist;
                this.closeMsg();
                delete tempList[subAmenityRequest.currentIndex];
                // tempList[subAmenityRequest.currentIndex].status = 'CLOSED';     // error occurred here
                // tempList[subAmenityRequest.currentIndex].statusColorCode = "label label-warning";     // error occurred here
                this.setState({requestlist: tempList});
            });
    }

    changeSubAmenityRequestStatus(subAmenityRequest, event) {

        event.preventDefault();
        let subAmenityRequestId = subAmenityRequest.uuid;
        console.log('changeSubAmenityRequestStatus called--------------' + this.refs.statusSubAmenity.value);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({subAmenityRequestId: subAmenityRequestId, status: this.refs.statusSubAmenity.value}),
        }).then(response => response.json()).then(json => {
            let tempList = this.state.result.requestlist;
            if (this.state.status === 'ALL') {
                tempList.splice(subAmenityRequest.currentIndex, 1, json.subAmenityRequest);
            } else {
                delete tempList[subAmenityRequest.currentIndex];
            }
            this.setState({requestlist: tempList});
            this.closeMsg();
        });
    }

    handleSubmit(subAmenityRequest, event) {
        event.preventDefault();
        let subAmenityRequestId = subAmenityRequest.uuid;
        let staffMemberId = this.refs.staffMemberId.value;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({staffMemberId: staffMemberId, subAmenityRequestId: subAmenityRequestId}),
        }).then(response => response.json()).then(json => {
            let tempList = this.state.result.requestlist;
            if (this.state.status === 'ALL') {
                tempList.splice(subAmenityRequest.currentIndex, 1, json.subAmenityRequest);
            } else {
                delete tempList[subAmenityRequest.currentIndex];
            }
            this.setState({requestlist: tempList});
            this.closeMsg();
        });
    }

    handlePageChange(eventKey) {
        console.log('page number------' + eventKey);

        let offset = (eventKey - 1) * this.state.max;
        console.log('offset new =====' + offset);
        this.loadData(offset);
        this.setState({
            activePage: eventKey
        });
    }

    render() {

        const {result} = this.state;
        const {subAmenityRequest} = this.state;
        const {staffList} = this.state;
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
                            <td>{item.price}</td>
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

        let assignToDropdownDisabled = ((subAmenityRequest.status === 'INITIALIZED' || subAmenityRequest.status === 'ASSIGNED' || subAmenityRequest.status === 'ONGOING') ) ? '' : 'disabled';

        return (
            <section>
                <div className="container-fluid">
                    <Row className="container-fluid">
                        <Col lg={12} xs={12}>
                            <div className="card ">

                                <table className="tableCompact table-hover va-middle">
                                    <tbody>

                                    {result.requestlist.map((item, index) => (
                                        <tr className="msg-display clickable">
                                            <td onClick={this.openMsg.bind(this, item, index)} className="wd-xxs">
                                                <div
                                                    className="initial32 bg-indigo-500">{item.subAmenityName.charAt(0)}</div>
                                            </td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis wd-sm">{item.subAmenityName}</td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis wd-sm">
                                                {item.assignedTo}
                                            </td>
                                            {/*<td onClick={this.openMsg.bind(this, item, index)} className="text-ellipsis wd-sm"><span*/}
                                            {/*className="badge badge-xs bg-green-500">15</span></td>*/}
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis wd-sm"><span
                                                className={item.statusColorCode}> {item.status} </span></td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis wd-sm">
                                                {item.roomNumber}
                                            </td>
                                            <td onClick={this.openMsg.bind(this, item, index)}
                                                className="text-ellipsis">{item.subAmenityDescription}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                    <div className="text-center">
                        <Pagination
                            className="pagination-rounded"
                            bsSize="large"
                            items={this.state.totalPages}
                            activePage={this.state.activePage}
                            onSelect={this.handlePageChange.bind(this)}/>
                    </div>
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
                                                <div>
                                                    <select id="staffMemberId" value={subAmenityRequest.assignedToId}
                                                            disabled={assignToDropdownDisabled} name="staffMemberId"
                                                            ref="staffMemberId"
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
                                                           value={subAmenityRequest.amenityName || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Sub-Amenity</label>
                                                <div>
                                                    <input type="text" disabled name="subAmenity" ref="subAmenity"
                                                           className="form-control"
                                                           value={subAmenityRequest.subAmenityName || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <div>

                                                    {/*If status is INITIALIZED or ONGOING, then only ASSIGNED is visible*/}
                                                    {/*If status is DELIVERED, then he can only close the request*/}
                                                    {/*If status is ONGOING, then only DELIVERED is visible*/}
                                                    {/*Only possible visible status are -ASSIGNED, ONGOING, DELIVERED, REJECTED*/}


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
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Room</label>
                                                <div>
                                                    <input type="text" disabled name="roomNumber" ref="roomNumber"
                                                           className="form-control"
                                                           value={subAmenityRequest.roomNumber || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        {valueDiv}
                                        {quantityDiv}
                                        {whenToDeliverDiv}
                                        {descriptionDiv}

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
                                                {activityDetail(item)}

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

export default ListServiceRequest;
