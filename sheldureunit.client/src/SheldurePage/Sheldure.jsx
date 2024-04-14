import { useEffect, useState } from 'react';
import './Sheldure.css';
import Subject from './Subject'
import DuplexSubject from './DuplexSubject';


export const Sheldure = (props) => {
    const rows = Array.from({ length: 7 }, (v, i) => i + 1);
    const cols = Array.from({ length: 5 }, (v, i) => i + 1);

    const [subjectTimes, setSubjectTimes] = useState([])


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
    const [scheduleTitle, setScheduleTitle] = useState("")
    const [scheduleMessage, setScheduleMessage] = useState("")
    const [schelduleName, setSchelduleName] = useState("");
    const [schelduleDuration, setSchelduleDuration] = useState("");
    const [scheduleData, setScheduleData] = useState([]);
    const [groupMessage, setGroupMessage] = useState("");
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

    const weeksNames = [
        "first",
        "second",
    ]

    const [weekName, setWeekName] = useState("")

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
                setGroupName(responseData['Scheldule']["Group"])
                setSchelduleName(responseData['Scheldule']["Name"])
                setSchelduleDuration(responseData['Scheldule']["Duration"])
                setGroupMessage(responseData['Scheldule']["Message"])
                setScheduleData(formatScheduleData(responseData['Scheldule']));
                setScheduleTitle(responseData['ScheduleGeneral']['SchedulesTitle'])
                setScheduleMessage(responseData['ScheduleGeneral']['SchedulesDescription'])


                var subjectTimes = JSON.parse(responseData['ScheduleGeneral']['SchedulesLessons']).map(item => {
                    const t1 = `${item.t1.hours}:${item.t1.minutes}`;
                    const t2 = `${item.t2.hours}:${item.t2.minutes}`;
                    return [t1, "-", t2];
                });
                setSubjectTimes(subjectTimes);
                if (responseData['ScheduleGeneral']['ShedulesParity'] == 'odd') {
                    setWeekName(weeksNames[(getDateWeek() + 1) % 2]);
                } else {
                    setWeekName(weeksNames[(getDateWeek() + 0) % 2]);
                }
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

    console.log(subjectTimes);
    return (
        <div className="sheldure-page-wrapper" >
            <div className="sheldure-info">
                <h1 className="info-name-header">{scheduleTitle}</h1>
                <div className="center-wrapper"><p className="scheldule-message">{scheduleMessage}</p></div>
                <br />
                <h2 className="info-group-name">{groupName}</h2>
                <div className="center-wrapper"><p className="scheldule-message">{groupMessage}</p></div>
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
                
                {subjectTimes.map((subjectTime, index) => (
                    <tr key={index}>
                        <td className="sheldure-number">
                            {index + 1}
                            <br />
                            <span className="sheldure-time">{subjectTime[0]}<br/> - <br/>{subjectTime[2]}</span>
                        </td>
                        {cols.map((colNumber, colIndex) => (
                            <td key={`${index}-${colNumber}`} className={(dayOfWeekNumber === colIndex) && (currentTimeRange === index) ? "current-day" : ""}>
                                {scheduleData && scheduleData[colIndex] && scheduleData[colIndex][index] && (
                                    scheduleData[colIndex][index].SecondSubject ? (
                                        <DuplexSubject
                                            subject1={{
                                                name: scheduleData[colIndex][index].FirstSubject.SubjectName,
                                                type: scheduleData[colIndex][index].FirstLessonType,
                                                class: scheduleData[colIndex][index].FirstClassRoom.Name
                                            }}
                                            subject2={{
                                                name: scheduleData[colIndex][index].SecondSubject.SubjectName,
                                                type: scheduleData[colIndex][index].SecondLessonType,
                                                class: scheduleData[colIndex][index].SecondClassRoom.Name
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


// https://www.geeksforgeeks.org/calculate-current-week-number-in-javascript/
function getDateWeek(date) {
    const currentDate =
        (typeof date === 'object') ? date : new Date();
    const januaryFirst =
        new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday =
        (januaryFirst.getDay() === 1) ? 0 :
            (7 - januaryFirst.getDay()) % 7;
    const nextMonday =
        new Date(currentDate.getFullYear(), 0,
            januaryFirst.getDate() + daysToNextMonday);

    return (currentDate < nextMonday) ? 52 :
        (currentDate > nextMonday ? Math.ceil(
            (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}