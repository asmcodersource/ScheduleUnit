import { useEffect, useState } from 'react';
import './DuplexSubject.css';
import Subject from './Subject';

const DuplexSubject = (props) => {
    return (
        <div className="duplex-wrapper">
            <Subject
                id={props.subject1.id}
                name={props.subject1.name}
                type={props.subject1.type}
                class={props.subject1.class}
                subjectDescription={props.subject1.subjectDescription}
                classRoomDescription={props.subject1.classRoomDescription}
            />
            <hr className='duplex-separator' />
            <Subject
                id={props.subject2.id}
                name={props.subject2.name}
                type={props.subject2.type}
                class={props.subject2.class}
                classRoomDescription={props.subject2.classRoomDescription}
                subjectDescription={props.subject2.subjectDescription}
            />
        </div>
    );
};


export default DuplexSubject;