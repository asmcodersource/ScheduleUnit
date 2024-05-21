import { useEffect, useState } from 'react';
import './Subject.css';

const Subject = (props) => {
    console.log(props);

    function toggle(target) {
        var popup = document.getElementById(target);
        popup.classList.toggle("show");
    }

    return (
        <div className="wrapper">
            <a className="name" href={props.link}>{props.name}</a><br />
            <p className="type popup" onClick={() => toggle(props.id)}>{props.type}
                <span class="popuptext" id={props.id}>{props.subjectDescription}</span>
            </p><br/>
            <p className="class popup" onClick={() => toggle(props.id + (1).toString())}>{props.class}
                <span class="popuptext" id={props.id + (1).toString()}>{props.classRoomDescription}</span>
            </p>
        </div>
    );
}


export default Subject;
