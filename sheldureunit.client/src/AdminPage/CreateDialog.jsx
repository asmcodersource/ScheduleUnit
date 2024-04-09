import { useEffect, useState } from 'react';
import './EditDialog.css'
import Dialog from './Dialog.jsx'

const CreateDialog = (props) => {
    const [editedSubject, setEditedSubject] = useState(props.subject);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setEditedSubject(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        console.log(editedSubject);
        props.submitHandler(editedSubject);
    };

    return (
        <Dialog isOpen={true}>
            <div className="edit-dialog">
                <h1>{props.entityName}</h1>
                <hr />
                <div className="edit-field-wrapper">
                    <label>Name:</label><br />
                    <input id="SubjectName" onChange={handleInputChange} /><br />
                    <label>Description:</label><br />
                    <textarea id="SubjectDescription" onChange={handleInputChange} /><br />
                    <div className="buttons-wrapper">
                        <button onClick={props.cancelHandler}>Cancel</button>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}


export default CreateDialog;