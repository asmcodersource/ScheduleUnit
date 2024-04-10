import React, { useEffect, useState } from 'react';
import SubjectsManager from './SubjectsManager';
import ClassRoomsManager from './ClassRoomsManager';
import './AdminPage.css';

function AdminPage() {
    const subjectsManager = <SubjectsManager />
    const classRoomsManager = <ClassRoomsManager />
    const [selectedManager, setSelectedManager] = useState(null);
    const [authorized, setAuthorized] = useState();
    const [currentManager, setCurrentManager] = useState(null);

    useEffect(() => {
        async function checkAuthorization() {
            const token = sessionStorage.getItem('token');
            console.log(token);
            try {
                const response = await fetch("/tokenvalidation", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });
                if (response.ok) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                    window.location.href = '/Login';
                }
            } catch (error) {
                console.error('Error validating token:', error);
                setAuthorized(false);
                window.location.href = '/Login';
            }
        }

        checkAuthorization();
    }, []);

    const logOut = () => {
        sessionStorage.setItem('token', '');
        window.location.href = '/Login';
    };

    return (
        <div className="page-wrapper">
            {authorized ? (
                <div className="admin-page-wrapper">
                    <div className="admin-page-menu">
                        <div className="panel-header">
                            <h1>Schedule module control panel</h1>
                            <hr />
                            <h2>manage your schedule easily and efficiently with our schedule management module </h2>
                        </div>
                        <button className={selectedManager === 1 ? "selected" : ""} onClick={() => { setCurrentManager(subjectsManager); setSelectedManager(1); }}>general manager</button>
                        <button className={selectedManager === 2 ? "selected" : ""} onClick={() => { setCurrentManager(subjectsManager); setSelectedManager(2); }}>schedules manager</button>
                        <button className={selectedManager === 3 ? "selected" : ""} onClick={() => { setCurrentManager(classRoomsManager); setSelectedManager(3); }}>class rooms manager</button>
                        <button className={selectedManager === 4 ? "selected" : ""} onClick={() => { setCurrentManager(subjectsManager); setSelectedManager(4); }}>subjects manager</button>
                        <button onClick={logOut}>log out</button>
                    </div>
                    <div className="working-area-wrapper">{currentManager}</div>
                </div>
            ) : (
                <div className="loading-page-wrapper">
                    <div>Authorizing...</div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;