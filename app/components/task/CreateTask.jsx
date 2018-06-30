import React from 'react';
import pubsub from 'pubsub-js';
import '../Forms/Validation.scss';
import taskRun from './Task.run';
import BasicDetail from "../Common/BasicDetail";

const url = '';

class CreateTask extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            userList: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        pubsub.publish('setPageTitle', "Task");
    }

    componentDidMount() {
        taskRun();

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
            'taskName': this.refs.taskName.value,
            'description': this.refs.description.value,
            'assignedTo': this.refs.assignedTo.value,
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
        });
    }

    render() {



        return (
            <section>

                <div className="container-fluid">
                    <div className="card">
                        <div className="card-body">
                            {/* START row */}
                            <div className="row">
                                <div className="col-md-12">
                                    <fieldset>
                                        <legend>Create Task</legend>
                                    </fieldset>
                                </div>

                                <div className="col-md-12">
                                    <form style={{marginLeft: '25px', marginRight: '25px'}}>
                                        <div className="mda-form-group">
                                            <label className="control-label">Assignee</label>
                                            <select id="select2-1" name="assignedToUUID" ref="assignedToUUID"

                                                    className="form-control">
                                                {this.state.userList.map(item => (
                                                    <option key={item.uuid}
                                                            value={item.uuid}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mda-form-group">
                                            <label className="control-label">Description</label>
                                            <input type="text" name="description" ref="description"
                                                   placeholder="Description"
                                                   className="form-control"/>
                                        </div>

                                        <div className="mda-form-group">
                                            <label className="control-label">Description</label>
                                            <textarea placeholder="" name="description" ref="description"
                                                      className="form-control"/>
                                        </div>
                                        <hr/>
                                        <div className="text-center">
                                            <button type="submit" onClick={this.handleSubmit}
                                                    className="btn btn-primary">Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default CreateTask;
