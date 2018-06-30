import React from 'react';
import pubsub from 'pubsub-js';
import '../Forms/Validation.scss';
import serviceRequest from './Task.run';
import BasicDetail from "../Common/BasicDetail";


const url = '';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class CreateTask extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            result: {
                subAmenityList: [],
                staffList: [],
                roomList: []
            },
            formContent: {
                valueLabel: "",
                quantityLabel: "",
                whenToDeliverLabel: "",
                descriptionLabel: "",
                formElement: "",
            },
            dateList: [],
            dateSelected: "",
            showTimePicker: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchDynamicForm = this.fetchDynamicForm.bind(this);
        this.changeDate = this.changeDate.bind(this);
    }

    fetchDynamicForm(event) {

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify({subAmenityId: this.refs.subAmenityUUID.value})
        })
            .then(response => response.json())
            .then(json => {
                this.setState({formContent: json});
            });
    }

    componentWillMount() {
        pubsub.publish('setPageTitle', "Service Request");
    }

    componentDidMount() {
        serviceRequest();

        let jsonObj = {};
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
                jsonObj = json;
                console.log(json);
                this.setState({result: jsonObj});
                this.fetchDynamicForm()
            });

        let today = new Date();

        let dates = [];
        dates.push("ASAP");

        console.log(dates);

        this.setState({dateList: dates})


    }

    changeDate() {

        let val = this.refs.whenToDeliverDate.selectedIndex;
        let today = new Date();

        if (val === 0) {
            this.setState({dateSelected: "", showTimePicker: false})
        } else {
            val--;
            today.setDate(today.getDate() + val);
            let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            this.setCurrentTime(today);
            this.setState({dateSelected: date, showTimePicker: true})
        }
    }

    setCurrentTime(today) {

        let amOrPm = (today.getHours() < 12) ? "AM" : "PM";

        let hours = (today.getHours() < 12) ? today.getHours() : today.getHours() - 12;
        if (hours === 0)
            hours = 12;
        hours = ("0" + hours).slice(-2);        // to format the hours having 2 digits

        let whenToDeliverTimeValue = hours + ":00 " + amOrPm;
        console.log(whenToDeliverTimeValue);

        this.refs.whenToDeliverTime.value = whenToDeliverTimeValue;

        let increaseSelectedIndex = parseInt(today.getMinutes() / 15);
        if (today.getMinutes() % 15 !== 0)
            increaseSelectedIndex = increaseSelectedIndex + 1;
        let selectedIndex = this.refs.whenToDeliverTime.selectedIndex + increaseSelectedIndex;
        if (selectedIndex === 96)
            selectedIndex = 0;
        this.refs.whenToDeliverTime.selectedIndex = selectedIndex;
    }

    handleSubmit(event) {
        event.preventDefault();
        let data = {};
        if (this.refs.value)
            data.value = this.refs.value.value;
        if (this.refs.quantity)
            data.quantity = this.refs.quantity.value;

        if (this.state.dateSelected)
            data.whenToDeliver = this.state.dateSelected + ' ' + this.refs.whenToDeliverTime.value;
        data.description = this.refs.description.value;
        data = Object.assign(data, {
            'roomNo': this.refs.roomNo.value,
            'subAmenityUUID': this.refs.subAmenityUUID.value,
            'assignedToUUID': this.refs.assignedToUUID.value,
        });

        console.log('data----------' + data);
        console.log(data);
        console.log('data----------');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': BasicDetail.getAccessToken()
            },
            body: JSON.stringify(data),
        }).then(response => response.json()).then(json => {
            swal('Message', json.message);
            if (this.refs.value)
                this.refs.value.value = '';
            this.refs.description.value = '';
            this.refs.roomNo.value = '';
            if (this.refs.quantity)
                this.refs.quantity.value = '';
            this.refs.whenToDeliverDate.selectedIndex = 0;
            this.setState({showTimePicker: false})
        });
    }

    render() {

        const {result} = this.state;
        const {formContent} = this.state;

        let descriptionLabel = this.state.descriptionLabel ? this.state.descriptionLabel : "Description";
        let valueField = "";
        let quantityField = "";
        let whenToDeliverDate = "";
        let whenToDeliverTime = "";
        console.log(formContent);
        if (formContent.valueLabel) {

            console.log('inside iff----');
            console.log(formContent.valueLabel);
            console.log(formContent.formElement);
            let valueInputField = "";
            if (formContent.formElement === 'TEXT' || formContent.formElement === 'DATE') {
                console.log('formElement TEXT');
                valueInputField = <input type="text" name="value" ref="value" required=""
                                         className="form-control"/>;
            } else if (formContent.formElement === 'NUMBER') {
                console.log('formElement NUMBER');
                valueInputField = <input type="number" name="value" ref="value" required=""
                                         className="form-control"/>;
            } else if (formContent.formElement === 'SELECT_BOX') {
                console.log('formElement SELECT_BOX');
                valueInputField = <input type="text" name="value" ref="value" required=""
                                         className="form-control"/>;
            } else if (formContent.formElement === 'PHONE_NUMBER') {
                console.log('formElement SELECT_BOX');
                valueInputField = <input type="text" name="value" ref="value" required=""
                                         className="form-control"/>;
            } else if (formContent.formElement === 'AUTO_COMPLETE') {
                console.log('formElement SELECT_BOX');
                valueInputField = <input type="text" name="value" ref="value" required=""
                                         className="form-control"/>;

            }
        }




        return (
            <section>

                <div className="container-fluid">
                    <div className="card">
                        <div className="card-body">
                            {/* START row */}
                            <div className="row">
                                <div className="col-md-12">
                                    <fieldset>
                                        <legend>Create Service Request</legend>
                                    </fieldset>
                                </div>
                                <div className="col-md-12">
                                    <form style={{marginLeft: '25px', marginRight: '25px'}}>

                                        <div className="mda-form-group">
                                            <label className="control-label">Service</label>
                                            <select id="select2-3" name="subAmenityUUID" ref="subAmenityUUID"
                                                    onChange={(e) => this.fetchDynamicForm(e)}
                                                    className="form-control">
                                                {Object.keys(result.subAmenityList).map(item => (
                                                    <optgroup label={item}>
                                                        {result.subAmenityList[item].map(subAmenity => (
                                                            <option key={subAmenity.uuid}
                                                                    value={subAmenity.uuid}>{subAmenity.name}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mda-form-group">
                                            <label className="control-label">Assignee</label>
                                            <select id="select2-1" name="assignedToUUID" ref="assignedToUUID"
                                                    className="form-control">
                                                {result.staffList.map(item => (
                                                    <option key={item.uuid}
                                                            value={item.uuid}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mda-form-group">
                                            <label className="control-label">Room number</label>
                                            <input type="text" name="roomNo" ref="roomNo"
                                                   placeholder="Please enter room number"
                                                   className="form-control"/>
                                        </div>

                                        {valueField}
                                        {quantityField}
                                        {whenToDeliverDate}
                                        {whenToDeliverTime}

                                        <div className="mda-form-group">
                                            <label className="control-label">{descriptionLabel}</label>
                                            <textarea placeholder="" name="description" ref="description"
                                                      className="form-control"/>
                                        </div>

                                        <hr/>
                                        <div className="text-center">
                                            <button type="submit" onClick={this.handleSubmit}
                                                    className="btn btn-primary">Create
                                            </button>
                                        </div>
                                        {/* END panel */}
                                    </form>
                                </div>
                            </div>
                            {/* END row */}
                        </div>
                    </div>
                </div>
            </section>

        );
    }
}

export default CreateTask;