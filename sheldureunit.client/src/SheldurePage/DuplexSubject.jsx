import { useEffect, useState } from 'react';
import './DuplexSubject.css';
import Subject from './Subject';

const DuplexSubject = (props) => {
    return (
        <div className="duplex-subject-wrapper">
            <Subject name={props.subject1.name} type={props.subject1.type} class={props.subject1.class} />
            <hr className='duplex-separator' />
            <Subject name={props.subject2.name} type={props.subject2.type} class={props.subject2.class} />
        </div>
    );
};


export default DuplexSubject;