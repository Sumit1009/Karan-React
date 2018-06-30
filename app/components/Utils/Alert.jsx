import {Modal} from 'react-bootstrap';

import React from 'react';


// example -
// <Alert isOpen='true' title="Message" message="Are you sure ?" yesLabel="Yup" noLabel="Nope"  params={[1,2,3]} />



/**
 * <b>Receives following parameters in props -</b>
 * title
 * message
 * isOpen
 * yesClickListener
 * noClickListener          // pending
 * params                   // to be passed as parameter in yesClickListener
 * yesLabel
 * noLabel
 */


class Alert extends React.Component {

    constructor(props) {
        super();
        this.state = {
            yesLabel: props.yesLabel || 'Yes',
            noLabel: props.noLabel || 'No',
        };
        this.onYesClick = this.onYesClick.bind(this);
    }

    onYesClick(){

        this.props.yesClickListener.bind(this,...this.props.params)
    }

    render() {

        let yesButton = '';
        if(this.props.yesClickListener) {
            yesButton = <button type="button" className="mt-sm btn btn-warning ripple"
                    onClick={this.onYesClick}>{this.state.yesLabel}
            </button>
        }
        return (
            <Modal show={this.props.isOpen} onHide={this.props.noClickListener.bind(this)}
                   style={{
                       position: 'absolute',
                       top: '100px',
                       right: '10px',
                       bottom: '0',
                       left: '0',
                       zIndex: '10040',
                       overflow: 'auto',
                       overflowY: 'auto'
                   }}
                   className="modal-dialog modal-auto-size">
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {this.props.message}
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    {yesButton}
                    <button type="button" className="mt-sm btn btn-danger ripple" onClick={this.props.noClickListener.bind(this)}>{this.state.noLabel}
                    </button>
                </Modal.Footer>
            </Modal>)
    }
}

export default Alert;
