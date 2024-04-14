import { useEffect, useState } from 'react';
import Dialog from './Dialog.jsx'
import './LessonEditDialog.css'
import './EditDialog.css'

const LessonEditDialog = (props) => {
    const initialLessonCount = props.lesson
        ? props.lesson.SecondSubject
            ? 'two'
            : 'one'
        : 'none';
    const [lessonCount, setLessonCount] = useState(initialLessonCount);

    console.log(props);
    console.log(props.class)

    const handleLessonCountChange = (event) => {
        setLessonCount(event.target.value);
    };

    const handleSubmit = () => {
        let lessonData = {}
        if (lessonCount != 'none') {
            lessonData = {
                FirstLessonLink: document.getElementById('resourceLink1')?.value,
                SecondLessonLink: document.getElementById('resourceLink2')?.value,
                FirstSubjectId: document.getElementById('subject1').value,
                FirstSubject: {
                    Id: document.getElementById('subject1').value,
                    SubjectName: props.subjects.find(subject => subject.Id === document.getElementById('subject1').value),
                    SubjectDescription: props.subjects.find(subject => subject.Id === document.getElementById('subject1').value)
                },
                FirstClassRoomId: document.getElementById('room1').value,
                FirstClassRoom: {
                    Id: document.getElementById('room1').value,
                    Name: props.classRooms.find(room => room.Id === document.getElementById('room1').value),
                    Description: props.classRooms.find(room => room.Id === document.getElementById('room1').value)
                },
                FirstLessonType: document.getElementById('lessonType1').value,
                SecondSubjectId: lessonCount === 'two' ? document.getElementById('subject2').value : null,
                SecondSubject: lessonCount === 'two' ? {
                    Id: document.getElementById('subject2').value,
                    SubjectName: props.subjects.find(subject => subject.Id === document.getElementById('subject2').value),
                    SubjectDescription: props.subjects.find(subject => subject.Id === document.getElementById('subject2').value)
                } : null,
                SecondClassRoomId: lessonCount === 'two' ? document.getElementById('room2').value : null,
                SecondClassRoom: lessonCount === 'two' ? {
                    Id: document.getElementById('room2').value,
                    Name: props.classRooms.find(room => room.Id === document.getElementById('room2').value),
                    Description: props.classRooms.find(room => room.Id === document.getElementById('room2').value)
                } : null,
                SecondLessonType: lessonCount === 'two' ? document.getElementById('lessonType2').value : null,
            };
        }
        props.submitHandler(lessonData)
    };

    return (
        <Dialog isOpen={true}>
            <div className="lesson-edit-form">
                <form className="lesson-edit-radio-buttons">
                    <div>
                        <input
                            type="radio"
                            id="none"
                            value="none"
                            checked={lessonCount === 'none'}
                            onChange={handleLessonCountChange}
                        />
                        <label htmlFor="none">No lesson</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="one"
                            value="one"
                            checked={lessonCount === 'one'}
                            onChange={handleLessonCountChange}
                        />
                        <label htmlFor="one">One lesson</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="two"
                            value="two"
                            checked={lessonCount === 'two'}
                            onChange={handleLessonCountChange}
                        />
                        <label htmlFor="two">Two lessons</label>
                    </div>
                </form>
                {lessonCount !== 'none' && (<hr />)}
                {lessonCount !== 'none' && (
                    <div className="lesson-section">
                        <label htmlFor="subject1">Subject for lesson 1:</label>
                        <select id="subject1" defaultValue={props.lesson?.FirstSubject?.Id}>
                            {props.subjects.map((subject) => (
                                <option value={subject.Id}><span className="entity-id">{subject.Id}</span> {subject.SubjectName}</option>
                            ))}
                        </select>
                        <br />
                        <label htmlFor="room1">Room for lesson 1:</label>
                        <select id="room1" defaultValue={props.lesson?.FirstClassRoom?.Id}>
                            {props.classRooms.map((room) => (
                                <option value={room.Id}><span className="entity-id">{room.Id}</span> {room.Name}</option>
                            ))}
                        </select>
                        <br />
                        <label htmlFor="lessonType1">Lesson type for lesson 1:</label>
                        <input type="text" id="lessonType1" defaultValue={props.lesson?.FirstLessonType} />
                        <br />
                        <label htmlFor="resourceLink1">Resource link for lesson 1:</label>
                        <input type="text" id="resourceLink1" />
                    </div>
                )}
                {lessonCount === 'two' && (<hr />)}
                {lessonCount === 'two' && (
                    <div className="lesson-section">
                        <label htmlFor="subject2">Subject for lesson 2:</label>
                        <select id="subject2" defaultValue={props.lesson?.SecondSubject?.Id}>
                            {props.subjects.map((subject) => (
                                <option value={subject.Id}><span className="entity-id">{subject.Id}</span> {subject.SubjectName}</option>
                            ))}
                        </select>
                        <br />
                        <label htmlFor="room2">Room for lesson 2:</label>
                        <select id="room2" defaultValue={props.lesson?.SecondClassRoom?.Id}>
                            {props.classRooms.map((room) => (
                                <option value={room.Id}><span className="entity-id">{room.Id}</span> {room.Name}</option>
                            ))}
                        </select>
                        <br />
                        <label htmlFor="lessonType2">Lesson type for lesson 2:</label>
                        <input type="text" id="lessonType2" defaultValue={props.lesson?.SecondLessonType} />
                        <br />
                        <label htmlFor="resourceLink2">Resource link for lesson 2:</label>
                        <input type="text" id="resourceLink2" />
                    </div>
                )}
                <div className="buttons-wrapper">
                    <button onClick={props.cancelHandler}>Cancel</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </Dialog>
    );
};


export default LessonEditDialog;