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
                    <input id="username-field" minLength="2" type="text"></input>
                    <label>Password:</label>
                    <input id="password-field" minLength="6" type="password"></input>
                </div>
                <p>Use your account login and password to log into the schedule module administration panel. Make sure the layout and case are correct when entering authorization data.</p>
                <button onClick={submitClickedHandler}>Login</button>
            </div>
        </div>  
    )
}


async function submitClickedHandler(e) {
    e.preventDefault();
    let username = document.querySelector('.login-fields-wrapper #username-field');
    let password = document.querySelector('.login-fields-wrapper #password-field');
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    });
    if (response.ok === true) {
        const data = await response.json();
        sessionStorage.setItem('token', data.access_token);
        window.location.href = '/admin';
    }
}

export default LoginPage;