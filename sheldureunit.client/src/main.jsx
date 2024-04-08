import React from 'react';
import ReactDOM from 'react-dom';
import Sheldure from './SheldurePage/Sheldure.jsx';
import LoginPage from './LoginPage/LoginPage.jsx';
import AdminPage from './AdminPage/AdminPage.jsx';
import './index.css'

const path = window.location.pathname.slice(1);

let componentToRender;
console.log(path);
if (path.toLowerCase() === 'login') {
    componentToRender = <LoginPage />;
} else if (path.toLowerCase() === 'admin') {
    componentToRender = <AdminPage />;
} else if (path.split('/')[0].toLowerCase() === 'schedule' ) {
    const groupName = path.split('/')[1]; 
    componentToRender = <Sheldure groupName={decodeURIComponent(groupName)} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(componentToRender);
