import { useEffect, useState } from 'react';
import '../SheldurePage/Sheldure.css';
import './SchelduleEditor.css'
import Subject from '../SheldurePage/Subject'
import DuplexSubject from '../SheldurePage/DuplexSubject';
import LessonEditDialog from './LessonEditDialog';


const SchelduleEditor = (props) => {
    const [scheldule, setScheldule] = useState({
        id: props.Id,
        name: props.Name,
        group: props.Group,
        duration: props.Duration,
        message: props.Message
    })

    const [remoteGroupName, setRemoteGroupName] = useState(scheldule.group);

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setScheldule(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const saveFirstSection = async () => {
        console.log(JSON.stringify({
            type: 'updateScheldule',
            id: scheldule.id,
            scheldule: { ...scheldule }
        }));
        await fetch("/general", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                type: 'updateScheldule',
                id: scheldule.id,
                scheldule: { ...scheldule }
            })
        });
        setRemoteGroupName(scheldule.group);
    }

    return (
        <div className="scheldule-editor-wrapper">
            <div className="scheldule-editor-info">
                <button className="return-button" onClick={() => props.backHandler()}>back</button>
                <br /><br />
                <h1>Scheldule general options</h1>
                <label>Scheldule name: <input type="text" name="name" placeholder="name of scheldule" value={scheldule.name} onChange={handleInputChange}></input></label>
                <label>Scheldule group: <input type="text" name="group" placeholder="name of group" value={scheldule.group} onChange={handleInputChange}></input></label>
                <label>Scheldule duration: <input type="text" name="duration" placeholder="duration of scheldule" value={scheldule.duration} onChange={handleInputChange}></input></label>
                <label>Scheldule message: <input type="text" name="message" placeholder="scheldule message" value={scheldule.message} onChange={handleInputChange}></input></label>

                <button className="save-button" onClick={saveFirstSection}>save</button>
            </div>
            <br />
            <br />
            <h1>Scheldule lessons</h1>
            <Sheldure groupName={remoteGroupName} />
        </div>
    )
}

export default SchelduleEditor;

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
    const [dialog, setDialog] = useState(null);
    const [scheduleId, setScheduleId] = useState(-1);
    const [groupName, setGroupName] = useState("");
    const [scheduleTitle, setScheduleTitle] = useState("")
    const [scheduleMessage, setScheduleMessage] = useState("")
    const [schelduleName, setSchelduleName] = useState("");
    const [schelduleDuration, setSchelduleDuration] = useState("");
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [subjects, setSubjects] = useState([])
    const [classRooms, setClassRooms] = useState([]);
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

    const fetchSchedule = async () => {
        const url = '/fetchScheldule';
        const requestData = { group: props.groupName };

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

            setScheduleId(responseData['Scheldule']['Id']);
            setGroupName(responseData['Scheldule']["Group"])
            setSchelduleName(responseData['Scheldule']["Name"])
            setSchelduleDuration(responseData['Scheldule']["Duration"])
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
        };

    useEffect(() => {
        const fetchData = async () => {
                await fetchSchedule();

                const response1 = await fetch("/subjects", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        type: 'get',
                    })
                });
                if (response1.ok === true) {
                    const data = await response1.json();
                    setSubjects(data);
                }

                const response2 = await fetch("/classrooms", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        type: 'get',
                    })
                });
                if (response2.ok === true) {
                    const data = await response2.json();
                    setClassRooms(data);
                }

                setIsLoading(false);
        };

        fetchData();
    }, []);

    const editLesson = (day, lessonNumber, currentLesson) => {
        setDialog(
            <LessonEditDialog
                lesson={currentLesson}
                subjects={subjects}
                classRooms={classRooms}
                cancelHandler={() => setDialog(null)}
                submitHandler={async (createdLesson) => {
                    console.log(createdLesson);
                    await fetch("/general", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            type: 'updateLesson',
                            lesson: createdLesson,
                            day: day,
                            lessonNumber: lessonNumber,
                            scheduleId: scheduleId,
                        })
                    });
                    await fetchSchedule();
                    setDialog(null);
                }}
            />
        );
    }

    if (isLoading) {
        return (<div className="loading-message">Loading...</div>)
    }

    return (
        <div className="sheldure-page-wrapper" >
            {dialog}
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
                            <span className="sheldure-time">{subjectTime[0]}<br /> - <br />{subjectTime[2]}</span>
                        </td>
                        {cols.map((colNumber, colIndex) => (
                            <td onClick={() => editLesson(colIndex, index+1,scheduleData && scheduleData[colIndex] && scheduleData[colIndex][index] ? scheduleData[colIndex][index] : null )} key={`${index}-${colNumber}`} className={(dayOfWeekNumber === colIndex) && (currentTimeRange === index) ? "current-day" : ""}>
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