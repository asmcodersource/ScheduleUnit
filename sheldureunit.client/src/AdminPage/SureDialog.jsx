import { useEffect, useState } from 'react';
import './EditDialog.css'
import './SureDialog.css'
import Dialog from './Dialog.jsx'

const SureDialog = (props) => {
    const handleSubmit = async () => {
        props.submitHandler();
    };

    return (
        <Dialog isOpen={true}>
            <div className="edit-dialog">
                <h1>Confirm action</h1>
                <hr />
                <div className="edit-field-wrapper">
                    <label className="confirm-label">{props.label}</label>
                    <div className="buttons-wrapper">
                        <button onClick={props.cancelHandler}>Cancel</button>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default SureDialog;
