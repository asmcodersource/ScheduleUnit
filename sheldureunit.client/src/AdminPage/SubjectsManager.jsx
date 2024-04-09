import { useEffect, useState } from 'react';
import EditDialog from './EditDialog.jsx'
import SureDialog from './SureDialog.jsx';
import CreateDialog from './CreateDialog.jsx';
import './SubjectsManager.css';

function SubjectsManager() {
    // Стейты для данных поиска и нового предмета
    const [dialog, setDialog] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState(subjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [newSubject, setNewSubject] = useState({ subjectName: '', subjectDescription: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/subjects", {
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
                if (response.ok === true) {
                    const data = await response.json();
                    setSubjects(data);
                    setFilteredSubjects(data);
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }
        fetchData();
    }, [dialog]);

    const handleEdit = (subject) => {
        setDialog(
            <EditDialog
                entityName="Subject edit"
                subject={subject}
                cancelHandler={() => setDialog(null)}
                submitHandler={async (editedSubject) => {
                    setDialog(null);
                    await fetch("/subjects", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            type: 'update',
                            subject: editedSubject,
                        })
                    });
                }}
            />
        );
    };

    // Обработчик создания нового предмета
    const handleCreateSubject = () => {
        setDialog(
            <CreateDialog
                entityName="Subject create"
                cancelHandler={() => setDialog(null)}
                submitHandler={async (createdSubject) => {
                    await fetch("/subjects", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            type: 'create',
                            subject: createdSubject,
                        })
                    });
                    setDialog(null);
                }}
            />
        );
    };

    const handleDelete = (id) => {
        setDialog(
            <SureDialog
                cancelHandler={() => setDialog(null)}
                submitHandler={async () => {
                    await fetch("/subjects", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            type: 'delete',
                            id: id,
                        })
                    });
                    setDialog(null)
                }}
                label="Deleting an item from the database will delete all lessons associated with it, including double ones."
            />
        );
    };

    // Обработчик изменения данных поиска
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        const searchString = event.target.value;
        const filteredSubjects = subjects.filter(subject => {
            return (
                subject.SubjectName.toLowerCase().includes(searchString.toLowerCase()) ||
                subject.Id.toString().includes(searchString) ||
                subject.SubjectDescription.toLowerCase().includes(searchString.toLowerCase())
            );
        });
        setFilteredSubjects(filteredSubjects);
    };

    return (
        <div className="subjects-manager-wrapper">
            {dialog}
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
                subjects={filteredSubjects}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}

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
                    <tr key={subject.Id}>
                        <td>{subject.Id}</td>
                        <td>{subject.SubjectName}</td>
                        <td>{subject.SubjectDescription}</td>
                        <td className="actionsColumn">
                            <button className="edit-button" onClick={() => onEdit(subject)}>Edit</button>
                            <button className="delete-button" onClick={() => onDelete(subject.Id)}>Delete</button>
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


export default SubjectsManager;