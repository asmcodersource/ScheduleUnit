import { useEffect, useState } from 'react';
import './Sheldure.css';
import Subject from './Subject'
import DuplexSubject from './DuplexSubject';


export const Sheldure = (props) => {
    const rows = Array.from({ length: 7 }, (v, i) => i + 1);
    const cols = Array.from({ length: 5 }, (v, i) => i + 1);

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


    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    let currentTimeRange = 0;

    for (const timeRange of subjectTimes) {
        const startHourMinute = timeRange[0].split(':');
        const startHour = parseInt(startHourMinute[0]);
        const startMinute = parseInt(startHourMinute[1]);
        const startRangeInMinutes = startHour * 60 + startMinute;

        const endHourMinute = timeRange[2].split(':');
        const endHour = parseInt(endHourMinute[0]);
        const endMinute = parseInt(endHourMinute[1]);
        const endRangeInMinutes = endHour * 60 + endMinute;

        if (currentTimeInMinutes >= startRangeInMinutes && currentTimeInMinutes <= endRangeInMinutes)
            break;
        currentTimeRange = currentTimeRange + 1;
    }

    const [groupName, setGroupName] = useState("");
    const [schelduleName, setSchelduleName] = useState("");
    const [schelduleDuration, setSchelduleDuration] = useState("");
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentDate = new Date();
    const dayOfWeekNumber = currentDate.getDay() - 1;



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

    
    useEffect(() => {
        const fetchData = async () => {
            const url = '/fetchScheldule';
            const requestData = { group: props.groupName };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) {
                    throw new Error('ќшибка запроса: ' + response.statusText);
                }

                const responseData = await response.json();
                setGroupName(responseData["Group"])
                setSchelduleName(responseData["Name"])
                setSchelduleDuration(responseData["Duration"])  
                setScheduleData(formatScheduleData(responseData));
                setIsLoading(false);
            } catch (error) {
                console.error('ќшибка при получении данных:', error);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (<div className="loading-message">Loading...</div>)
    }

    return (
        <div className="sheldure-page-wrapper" >
            <div className="sheldure-info">
                <h1 className="info-name-header">Sheldure</h1>
                <br />
                <h2 className="info-group-name">{groupName}</h2>
                <br />
                <h2 className="info-sheldure-name">{schelduleName}</h2>
                <h3 className="info-sheldure-duration">{schelduleDuration}</h3>
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
                
                {rows.map((rowNumber, index) => (
                    <tr key={rowNumber}>
                        <td className="sheldure-number">
                            {rowNumber}
                            <br />
                            <span className="sheldure-time">{subjectTimes[index][0]} - {subjectTimes[index][2]}</span>
                        </td>
                        {cols.map((colNumber, colIndex) => (
                            <td key={`${rowNumber}-${colNumber}`} className={(dayOfWeekNumber === colIndex) && (currentTimeRange === index) ? "current-day" : ""}>
                                {scheduleData && scheduleData[colIndex] && scheduleData[colIndex][index] && (
                                    scheduleData[colIndex][index].SecondSubject ? (
                                        <DuplexSubject
                                            subject1={{
                                                name: scheduleData[colIndex][index].FirstSubject.SubjectName,
                                                type: scheduleData[colIndex][index].FirstLessonType,
                                                class: scheduleData[colIndex][index].FirstClassRoom.Name
                                            }}
                                            subject2={{
                                                name: scheduleData[colIndex][index].FirstSubject.SubjectName,
                                                type: scheduleData[colIndex][index].FirstLessonType,
                                                class: scheduleData[colIndex][index].FirstClassRoom.Name
                                            }}
                                        />
                                    ) : (
                                            <Subject
                                                name={scheduleData[colIndex][index].FirstSubject.SubjectName}
                                                type={scheduleData[colIndex][index].FirstLessonType}
                                                class={scheduleData[colIndex][index].FirstClassRoom.Name}
                                        />
                                    )
                                )}
                            </td>
                        ))}
                    </tr>
                ))}


            </table>
        </div>
    );
}


const formatScheduleData = (scheduleData) => {
    const formattedData = [];

    scheduleData.Lessons.forEach((lesson) => {
        const { Day, Number, FirstSubject, SecondSubject, FirstLessonType, SecondLessonType, FirstClassRoom, SecondClassRoom } = lesson;

        if (!formattedData[Day]) {
            formattedData[Day] = [];
        }

        formattedData[Day][Number - 1] = {
            FirstSubject: FirstSubject,
            SecondSubject: SecondSubject,
            FirstLessonType: FirstLessonType,
            SecondLessonType: SecondLessonType,
            FirstClassRoom: FirstClassRoom,
            SecondClassRoom: SecondClassRoom,
        };
    });

    return formattedData;
};

export default Sheldure;

