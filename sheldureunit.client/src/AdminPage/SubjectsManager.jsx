import { useEffect, useState } from 'react';
import './SubjectsManager.css';

function SubjectsManager() {
    // Стейты для данных поиска и нового предмета
    const [searchTerm, setSearchTerm] = useState('');
    const [newSubject, setNewSubject] = useState({ subjectName: '', subjectDescription: '' });

    // Обработчик изменения данных поиска
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        // Дополнительная логика для фильтрации данных поиска или обновления списка предметов
    };

    // Обработчик изменения данных нового предмета
    const handleNewSubjectChange = (event) => {
        const { name, value } = event.target;
        setNewSubject(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Обработчик создания нового предмета
    const handleCreateSubject = () => {
        // Логика для создания нового предмета
        console.log('Creating new subject:', newSubject);
        // Сброс данных нового предмета
        setNewSubject({ subjectName: '', subjectDescription: '' });
    };

    return (
        <div className="subjects-manager-wrapper">
            <div className="subjects-manager-header">
                <div className="content-width-limiter">
                    <h1>Subjects manager</h1>
                    <hr />
                    <h2>This section allows you to manage the list of items. In this section you can view, create, edit and delete items.
                        <br />For each item, information about its name and description is available.</h2>
                </div>
            </div>
            <div className="subjects-manager-controls">
                <input
                    type="text"
                    placeholder="Search... [id, or name, or description]"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <button onClick={handleCreateSubject}>Create New</button>
            </div>
            <SubjectTable
                subjects={subjects}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default SubjectsManager;



const SubjectTable = ({ subjects, onEdit, onDelete }) => {
    return (
        <div class="table-wrapper">
        <table className="subjects-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {subjects.map(subject => (
                    <tr key={subject.id}>
                        <td>{subject.id}</td>
                        <td>{subject.subjectName}</td>
                        <td>{subject.subjectDescription}</td>
                        <td className="actionsColumn">
                            <button className="edit-button" onClick={() => onEdit(subject)}>Edit</button>
                            <button className="delete-button" onClick={() => onDelete(subject.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                    <tr class="stretch-row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
            </tbody>
            </table>
        </div>
    );
};


const subjects = [
    { id: 1, subjectName: 'Math', subjectDescription: 'Mathematics subject' },
    { id: 2, subjectName: 'Science', subjectDescription: 'Science subject' },
]

// Функция для редактирования предмета
const handleEdit = (subject) => {
    // Здесь можно реализовать логику редактирования
    console.log('Editing subject:', subject);
};

// Функция для удаления предмета
const handleDelete = (id) => {
    // Здесь можно реализовать логику удаления
    setSubjects(subjects.filter(subject => subject.id !== id));
};