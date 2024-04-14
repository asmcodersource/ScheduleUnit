import { useRef, useEffect, useState } from 'react';
import './SchedulesManager.css'
import './SubjectsManager.css'
import CreateSchelduleDialog from './CreateSchelduleDialog';
import SchelduleEditor from './SchelduleEditor';
import SureDialog from './SureDialog';


function SchedulesManager() {
    const [innerWindow, setInnerWindow] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialog, setDialog] = useState(null);
    const [isLoading, setLoading] = useState(true);


    const fetchScheldules = async () => {
        setLoading(true);
        const response = await fetch('/general', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                type: "getAllSchedules",
            }),
        });
        const responseData = await response.json();
        console.log(responseData);
        setSchedules(responseData);
        setFilteredSchedules(responseData);
        setLoading(false);
    }

    useEffect(() => {
        fetchScheldules();
        setLoading(false);
    }, []);

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        const searchString = event.target.value;
        const filteredSubjects = schedules.filter(schedule => {
            return (
                schedule.Id.toString().toLowerCase().includes(searchString.toLowerCase()) ||
                schedule.Name.toString().includes(searchString) ||
                schedule.Group.toLowerCase().includes(searchString.toLowerCase())
            );
        });
        setFilteredSchedules(filteredSubjects);
    };

    const handleDeleteScheldule = async (scheldule_id) => {
        setDialog(
            <SureDialog
                cancelHandler={() => setDialog(null)}
                submitHandler={async () => {
                    setLoading(true);
                    const response = await fetch('/general', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            type: "deleteSchedule",
                            id: scheldule_id
                        }),
                    });
                    fetchScheldules();
                    setLoading(false);
                    setDialog(null);
                }
                }
            />);
    }

    const handleEditScheldule = (scheldule) => {
        setInnerWindow(
            <SchelduleEditor
                {...scheldule}
                backHandler={() => setInnerWindow(null)}    
            />
        )
    }

    const handleCreateSubject = () => {
        setDialog(
            <CreateSchelduleDialog
                entityName="Scheldule create"
                cancelHandler={() => setDialog(null)}
                submitHandler={async (scheldule) => {
                    await fetch("/general", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            type: 'createSchedule',
                            scheldule:scheldule,
                        })
                    });
                    setDialog(null);
                    fetchScheldules();
                }}
            />
        );
    };

    if (innerWindow != null) {
        return (
            <div className="subjects-manager-wrapper">
                <div className="subjects-manager-header">
                    <div className="content-width-limiter">
                        <h1>Schedules manager</h1>
                        <hr />
                        <h2>The main panel for setting up routines for all groups that are created in the system.
                            <br />Use this panel to create, delete, change schedules, and also to view existing ones.</h2>
                    </div>
                </div>
                {innerWindow}
            </div>
        )
    }

    return (
        <div className="subjects-manager-wrapper">
            {dialog}
            <div className="subjects-manager-header">
                <div className="content-width-limiter">
                    <h1>Schedules manager</h1>
                    <hr />
                    <h2>The main panel for setting up routines for all groups that are created in the system.
                        <br />Use this panel to create, delete, change schedules, and also to view existing ones.</h2>
                </div>
            </div>
            <div className="subjects-manager-controls">
                <input
                    type="text"
                    placeholder="Search... [id, or name, or group name]"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <button onClick={handleCreateSubject}>Create new</button>
            </div>
            {isLoading ?
                (<div></div>)
                :
                (<div className='subjects-wrapper'>
                {filteredSchedules.map(schedule => (
                    <SchelduleObject
                        Id={schedule.Id}
                        Name={schedule.Name}
                        Group={schedule.Group}
                        Duration={schedule.Duration}
                        Message={schedule.Message}
                        handleDeleteScheldule={handleDeleteScheldule}
                        handleEditScheldule={handleEditScheldule}
                    />
                ))}
            </div>)} 
        </div>
    );
}

export default SchedulesManager;


const SchelduleObject = (props) => {
    return (
        <div className="scheldule-object">
            <div className="name-row">
                <label className="scheldule-id">#{props.Id}</label>
                <h1 className="scheldule-name">{props.Name}</h1>
            </div>
            <div className="scheldule-content">
                <p className="scheldule-group">
                    <label className="header">Group: </label>
                    {props.Group}
                </p>
                <p className="scheldule-duration">
                    <label className="header">Duration: </label>
                    {props.Duration}
                </p>
                <p className="scheldule-description">
                    <label className="header">Message: </label>
                    {props.Message}
                </p>
            </div>
            <div className="vertical-stretch"></div>
            <div className="actions-row">
                <button onClick={() => props.handleDeleteScheldule(props.Id)} class={{ float: 'left' }} >Remove</button>
                <button onClick={() => props.handleEditScheldule(props)} class={{ float: 'right' }} >Edit</button>
            </div>
        </div>
    )
}
