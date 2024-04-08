import { useEffect, useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    return (
        <div className="login-page-wrapper">
            <div className="background-overlay"></div>
            <div className="login-form">
                <h1>Authorization</h1>
                <hr />
                <div className="login-fields-wrapper">
                    <label>Login:</label>
                    <input type="text"></input>
                    <label>Password:</label>
                    <input type="password"></input>
                </div>
                <p>Use your account login and password to log into the schedule module administration panel. Make sure the layout and case are correct when entering authorization data.</p>
                <button>Login</button>
            </div>
        </div>
    )
}

export default LoginPage;