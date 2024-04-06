import { useEffect, useState } from 'react';
import './Subject.css';

const Subject = (props) => {
    return (
        <div className="subject-wrapper">
            <a className="subject-name" href="#">{props.name}</a>
            <p className="subject-type">{props.type}</p>
            <p className="subject-class">{props.class}</p>
        </div>
    );
}


export default Subject;
