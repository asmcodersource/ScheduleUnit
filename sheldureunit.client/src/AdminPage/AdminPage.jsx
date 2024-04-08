import { useEffect, useState } from 'react';
import './AdminPage.css';

function AdminPage() {
    const [authorized, setAuthorized] = useState();

    useEffect(async () => {
        const token = sessionStorage.getItem('token')
        console.log(token);
        const response = await fetch("/tokenvalidation", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        });
        if (response.ok === true) {
            const data = await response.json();
            setAuthorized(true);
        } else {
            setAuthorized(false);
        }
    }, []);

    
    return (
        <div className="page-wrapper">
            {authorized ? (
                <div className="admin-page-wrapper">
                    
                </div>
            ) : (
                <div className="loading-page-wrapper">
                    <div>Authorizing...</div>
                </div>
            )}
        </div>
    )
}

export default AdminPage;