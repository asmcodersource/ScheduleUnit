import { useEffect, useState } from 'react';
import './Subject.css';

const Subject = (props) => {
    return (
        <div className="wrapper">
            <a className="name" href="#">{props.name}</a>
            <p className="type">{props.type}</p>
            <p className="class">{props.class}</p>
        </div>
    );
}


export default Subject;
