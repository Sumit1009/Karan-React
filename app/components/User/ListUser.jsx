import React from 'react';
import pubsub from 'pubsub-js';
import {Grid, Row, Col, Table, Modal} from 'react-bootstrap';
import BasicDetail from "../Common/BasicDetail";
import {Pagination} from 'react-bootstrap';
import {activityDetail} from "../Common/ActivityStatusText";

const url = '';

class ListUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
        };
    }

    componentWillMount() {
        pubsub.publish('setPageTitle', 'Users');
    }

    componentDidMount() {

        this.loadData();
    }

    loadData() {
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

            });
    }

    closeMsg() {
        this.setState({showModalMsg: false});
    }

    openMsg(userDetail, index) {
        console.log(userDetail);
        userDetail.currentIndex = index;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
        })
            .then(response => response.json())
            .then(json => {
                this.setState({userList: json});
                this.setState({userDetail: userDetail});
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': BasicDetail.getAccessToken()
                    },
                    body: JSON.stringify({"userDetailId": userDetail.uuid})
                })
                    .then(response => response.json())
                    .then(json => {
                        this.setState({sarActivitiesOfSar: json})
                    });
            });
        this.setState({showModalMsg: true});
    }

    closeTask(userDetail) {

        let params = {
            userDetailId: userDetail.uuid
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
                delete tempList[userDetail.currentIndex];
                // tempList[userDetail.currentIndex].status = 'CLOSED';     // error occurred here
                // tempList[userDetail.currentIndex].statusColorCode = "label label-warning";     // error occurred here
                this.setState({requestlist: tempList});
            });
    }

    changeuserDetailStatus(userDetail, event) {

        event.preventDefault();
        let userDetailId = userDetail.uuid;
        console.log('changeuserDetailStatus called--------------' + this.refs.statusSubAmenity.value);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({userDetailId: userDetailId, status: this.refs.statusSubAmenity.value}),
        }).then(response => response.json()).then(json => {
            let tempList = this.state.result.requestlist;
            if (this.state.status === 'ALL') {
                tempList.splice(userDetail.currentIndex, 1, json.userDetail);
            } else {
                delete tempList[userDetail.currentIndex];
            }
            this.setState({requestlist: tempList});
            this.closeMsg();
        });
    }

    handleSubmit(userDetail, event) {
        event.preventDefault();
        let userDetailId = userDetail.uuid;
        let staffMemberId = this.refs.staffMemberId.value;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({staffMemberId: staffMemberId, userDetailId: userDetailId}),
        }).then(response => response.json()).then(json => {
            let tempList = this.state.result.requestlist;
            if (this.state.status === 'ALL') {
                tempList.splice(userDetail.currentIndex, 1, json.userDetail);
            } else {
                delete tempList[userDetail.currentIndex];
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
        const {userDetail} = this.state;
        const {userList} = this.state;
        const {sarActivitiesOfSar} = this.state;

        let valueDiv = '';
        let quantityDiv = '';
        let whenToDeliverDiv = '';
        let descriptionDiv = '';
        let menuItemRequestDiv;

        let grandTotal = 0;

        if (userDetail.menuItemRequests)
            Object.values(userDetail.menuItemRequests).forEach(function (item) {
                grandTotal = grandTotal + item.price * item.quantity
            });

        if (userDetail.menuItemRequests && userDetail.menuItemRequests.length > 0) {

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
                    {userDetail.menuItemRequests.map((item, index) => (
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

        if (userDetail.descriptionLabel !== null) {
            descriptionDiv = <fieldset>
                <div className="form-group">
                    <label>{userDetail.descriptionLabel}</label>
                    <div>
                                                        <textarea placeholder="" disabled name="description"
                                                                  ref="description"
                                                                  className="form-control"
                                                                  value={userDetail.description || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (userDetail.quantityLabel !== null) {
            quantityDiv = <fieldset>
                <div className="form-group">
                    <label>{userDetail.quantityLabel}</label>
                    <div>
                        <input type="text" disabled name="quantity" ref="quantity"
                               className="form-control"
                               value={userDetail.quantity || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (userDetail.whenToDeliverLabel !== null) {
            whenToDeliverDiv = <fieldset>
                <div className="form-group">
                    <label>{userDetail.whenToDeliverLabel}</label>
                    <div>
                        <input type="text" disabled name="whenToDeliver" ref="whenToDeliver"
                               className="form-control"
                               value={userDetail.whenToDeliver || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        if (userDetail.valueLabel !== null) {

            valueDiv = <fieldset>
                <div className="form-group">
                    <label>{userDetail.valueLabel}</label>
                    <div>
                        <input type="text" disabled name="value" ref="value"
                               className="form-control"
                               value={userDetail.value || ''}/>
                    </div>
                </div>
            </fieldset>;
        }

        let assignToDropdownDisabled = ((userDetail.status === 'INITIALIZED' || userDetail.status === 'ASSIGNED' || userDetail.status === 'ONGOING') ) ? '' : 'disabled';

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
                                         className={userDetail.statusColorCode}> {userDetail.status || ''} </div>
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
                                                    <select id="staffMemberId" value={userDetail.assignedToId}
                                                            disabled={assignToDropdownDisabled} name="staffMemberId"
                                                            ref="staffMemberId"
                                                            onChange={(e) => this.handleSubmit(userDetail, e)}
                                                            className="form-control">
                                                        <optgroup label="Front Office">
                                                            {userList.frontOfficeStaff.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Back Office">
                                                            {userList.backOfficeStaff.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Floor Manager">
                                                            {userList.floorManagerStaff.map(item => (
                                                                <option value={item.uuid}>{item.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Staff Member">
                                                            {userList.staffMember.map(item => (
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
                                                           value={userDetail.amenityName || ''}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <div className="form-group">
                                                <label>Sub-Amenity</label>
                                                <div>
                                                    <input type="text" disabled name="subAmenity" ref="subAmenity"
                                                           className="form-control"
                                                           value={userDetail.subAmenityName || ''}/>
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
                                                        value={userDetail.status}
                                                        disabled={['CANCELLED', 'DELIVERED', ''].indexOf(userDetail.status) > -1}
                                                        onChange={(e) => this.changeuserDetailStatus(userDetail, e)}
                                                        className="form-control">

                                                        <option value="INITIALIZED" hidden>INITIALIZED</option>
                                                        <option value="CLOSED" hidden>CLOSED</option>
                                                        <option value="INVALID" hidden>INVALID</option>
                                                        <option value="CANCELLED" hidden>CANCELLED</option>
                                                        <option value="EXPIRED" hidden>EXPIRED</option>


                                                        <option value="ASSIGNED"
                                                                hidden={(['INITIALIZED', 'ONGOING'].indexOf(userDetail.status) === -1) || userDetail.status === 'ASSIGNED'}>
                                                            ASSIGNED
                                                        </option>
                                                        <option value="ONGOING"
                                                                hidden={userDetail.status === 'ONGOING'}>
                                                            ONGOING
                                                        </option>
                                                        <option value="DELIVERED"
                                                                hidden={(['ONGOING'].indexOf(userDetail.status) === -1) || userDetail.status === 'DELIVERED'}>
                                                            DELIVERED
                                                        </option>
                                                        <option value="REJECTED"
                                                                hidden={userDetail.status === 'REJECTED'}>
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
                                                           value={userDetail.roomNumber || ''}/>
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

export default ListUser;
