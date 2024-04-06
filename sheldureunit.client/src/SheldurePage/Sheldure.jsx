import { useEffect, useState } from 'react';
import './Sheldure.css';
import Subject from './Subject'


export const Sheldure = (props) => {
    const rows = Array.from({ length: 7 }, (v, i) => i + 1);

    const subjectTimes = [
        ["9:00","-", "10:20"],
        ["10:30", "-", "11:50"],
        ["12:20", "-", "13:40"],
        ["13:50", "-", "15:10"],
        ["15:20", "-", "16:40"],
        ["16:50", "-", "17:10"],
        ["17:20", "-", "18:40"],
        ["18:50", "-", "19:10"],
    ];


    const currentDate = new Date();

    /*
    const months = [
        "€нвар€", "феврал€", "марта", "апрел€", "ма€", "июн€",
        "июл€", "августа", "сент€бр€", "окт€бр€", "но€бр€", "декабр€"
    ];
    const daysOfWeek = [
        "воскресенье", "понедельник", "вторник",
        "среда", "четверг", "п€тница", "суббота"
    ];
    */

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    const weekName = "first"

    const formattedDate = `${currentDate.getDate()} ${months[currentDate.getMonth()]}`;


    return (
        <div className="sheldure-page-wrapper" >
            <div className="sheldure-info">
                <h1 className="info-name-header">Sheldure</h1>
                <br />
                <h2 className="info-group-name">Group name</h2>
                <br />
                <h2 className="info-sheldure-name">Sheldure name</h2>
                <h3 className="info-sheldure-duration">Sheldure duration</h3>
                <h3 className="info-current-date">Today: {formattedDate}, {weekName} week </h3>
            </div>

            <table className="sheldure-table">
                <tr className="table-header-row">
                    <td></td>
                    <td>Monday</td>
                    <td>Tuesday</td>
                    <td>Wednesday</td>
                    <td>Thursday</td>
                    <td>Friday</td>
                </tr>
                
                {rows.map(rowNumber => (
                    <tr key={rowNumber}>
                        <td className="sheldure-subject-number">
                            {rowNumber}
                            <br></br>
                            <span className="sheldure-subject-time">{subjectTimes[rowNumber-1]}</span>
                        </td>
                        <td>
                            <Subject name="Subject name" type="subject type" class="auditory" />
                        </td>
                        <td>
                            <Subject name="Subject name" type="subject type" class="auditory" />
                        </td>
                        <td>
                            <Subject name="Subject name" type="subject type" class="auditory" />
                        </td>
                        <td>
                            <Subject name="Subject name" type="subject type" class="auditory" />
                        </td>
                        <td>
                            <Subject name="Subject name" type="subject type" class="auditory" />
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
}



export default Sheldure;

