import { useEffect, useState } from 'react';
import './GeneralManager.css'


function GeneralManager() {
    const [isLoading, setLoading] = useState(true);
    const [schelduleTitle, setSchelduleTitle] = useState();
    const [schelduleMessage, setSchelduleMessage] = useState();
    const [parity, setParity] = useState("");
    const parityList = ["odd", "even"]
    const [lessonsDurations, setLessonsDurations] = useState([
        { id: '1', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '2', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '3', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '4', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '5', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '6', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '7', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '8', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
        { id: '9', t1: { hours: '00', minutes: '00' }, t2: { hours: '00', minutes: '00' } },
    ])
    const maxLessons = Array.from({ length: 9 }, (v, i) => i + 1);

    const lessonCountChanged = (event) => {
        setLessonsDurations(prevState => processArray([...prevState], event.target.value));
    }

    function processArray(arr, numRows) {
        const template = {
            t1: { hours: '00', minutes: '00' },
            t2: { hours: '00', minutes: '00' }
        };

        const startingId = arr.length > 0 ? parseInt(arr[arr.length - 1].id) + 1 : 1;

        if (arr.length < numRows) {
            // Дополняем массив шаблонными элементами
            const diff = numRows - arr.length;
            for (let i = 0; i < diff; i++) {
                arr.push({ id: (startingId + i).toString(), ...template });
            }
        } else if (arr.length > numRows) {
            // Урезаем массив до указанного количества строк
            arr = arr.slice(0, numRows);
        }

        return arr;
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/general', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    type:"getGeneralSettings",
                }),
            });
            const responseData = await response.json();
            const lessons = JSON.parse(responseData['SchedulesLessons']);
            setSchelduleTitle(responseData['SchedulesTitle']);
            setSchelduleMessage(responseData['SchedulesDescription'])
            setParity(responseData['ShedulesParity'])
            setLessonsDurations(lessons);
            setLoading(false);
        };

        fetchData();
    }, []);

    async function saveFirstSection(event) {
        const response = await fetch('/general', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                type: "setFirstSection",
                name: schelduleTitle,
                description: schelduleMessage,
            }),
        });
    }

    async function saveSecondSection(event) {
        const response = await fetch('/general', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                type: "setSecondSection",
                lessons: JSON.stringify(lessonsDurations),
                parity: parity
            }),
        });
    }

    if (isLoading == true)
        return (<div></div>)

    return (
        <div className="subjects-manager-wrapper">
            <div className="subjects-manager-header">
                <div className="content-width-limiter">
                    <h1>General manager</h1>
                    <hr />
                    <h2>In this section you can configure basic system parameters.
                        <br />Including notification message, time and number of items, pairing of the week.</h2>
                </div>
            </div>
            <div className='general-manager-content'>
                <div className='content-limiter'>
                    <hr />
                    <label>General schedule title:</label>
                    <input
                        value={schelduleTitle}
                        onChange={(event) => setSchelduleTitle(event.target.value)}
                        placeholder="Here you can enter the title of all schedules." type='text'>
                    </input>
                    <label>General schedule description:</label>
                    <textarea
                        rows='15'
                        value={schelduleMessage}
                        onChange={(event) => setSchelduleMessage(event.target.value)}
                        placeholder="Here you can place a message that will be displayed in all schedules created by this module.">
                    </textarea>
                    <button className="save-button" onClick={saveFirstSection}>save</button>
                </div>
                <div className='content-limiter'>
                    <hr />
                    <div>
                        <p className="justify">Number of cells for lessons in one day:
                            <select className="max-cells" value={lessonsDurations.length} onChange={lessonCountChanged}>
                                {maxLessons.map((lesson, index) => (<option key={index}>{lesson}</option>))}
                            </select>, time and duration of the lessons:
                        </p>
                        <div className="times-container">
                            {console.log(lessonsDurations)}
                            {lessonsDurations.map((lessonDuration, index) =>
                            (<Time
                                onChange={(t1, t2) => { lessonsDurations[index].t1 = t1; lessonsDurations[index].t2 = t2; setLessonsDurations(lessonsDurations) }}
                                key={lessonDuration.id}
                                id={lessonDuration.id}
                                t1={lessonDuration.t1}
                                t2={lessonDuration.t2}
                            />)
                            )}
                        </div>
                    </div>
                    <br />
                    <p className="justify">Parity of weeks starts from:
                        <select className="parity" value={parity} onChange={(event) => setParity(event.target.value)}>
                            {parityList.map((parity, index) => (<option key={index}>{parity}</option>))}
                        </select>
                    </p>
                    <button className="save-button" onClick={saveSecondSection}>save</button>
                </div>
            </div>
        </div>
    );
}

export default GeneralManager;


const Time = (props) => {
    const [t1, setT1] = useState(props.t1);
    const [t2, setT2] = useState(props.t2);

    return (
        <div className="time-wrapper">
            <span>Lesson number {props.id} duration  </span>
            <input className="time first"
                maxLength='2'
                onChange={(event) => { setT1({ hours: event.target.value, minutes: t1.minutes }); props.onChange({hours: event.target.value, minutes: t1.minutes }, t2); }}
                value={t1.hours} pattern="[0-9]*"></input>
            <span className="time-separator">:</span>
            <input className="time second"
                maxLength='2'
                onChange={(event) => { setT1({ hours: t1.hours, minutes: event.target.value }); props.onChange({ hours: t1.hours, minutes: event.target.value }, t2 ); }}
                value={t1.minutes} pattern="[0-9]*"></input>
            <span className="time-separator"> - </span>
            <input className="time third"
                maxLength='2'
                onChange={(event) => { setT2({ hours: event.target.value, minutes: t2.minutes }); props.onChange(t1, { hours: event.target.value, minutes: t2.minutes }); }}
                value={t2.hours} pattern="[0-9]*"></input>
            <span className="time-separator">:</span>
            <input className="time fourth"
                maxLength='2'
                onChange={(event) => { setT2({ hours: t2.hours, minutes: event.target.value }); props.onChange(t1, { hours: t2.hours, minutes: event.target.value }); }}
                value={t2.minutes} pattern="[0-9]*"></input>
        </div>
    )
}