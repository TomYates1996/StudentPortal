import React, { useEffect, useState } from "react";
import api from "../services/api";
import CreateStudentForm from "./CreateStudentForm";

const StudentListWidget = ({ schoolId, students, onStudentCreated }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [openAddStudent, setOpenAddStudent] = useState(false);

    // const fetchData = async () => {
    //     try {
    //         const res = await api.get(`/student/school/${schoolId}`);
    //         setStudents(res.data);
    //     } catch (err) {
    //         console.error("Error fetching students:", err);
    //     }
    // };

    // useEffect(() => {
    //     if (schoolId) fetchData();
    // }, [schoolId]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedStudentId(prev => (prev === id ? null : id));
    };

    return (
        <div className="student-list-widget list-widget" id="studentList">
            <div className="title-bar">
                <h3>{openAddStudent ? "Add New Student" : "Students"}</h3>
                <button
                    onClick={() => setOpenAddStudent(prev => !prev)}
                    className="base-btn"
                >
                    {openAddStudent ? "Cancel" : "New Student"}
                </button>
            </div>

            {openAddStudent ? null : (
                <input
                    className="input-search"
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            )}

            {openAddStudent ? (
                <CreateStudentForm
                    schoolId={schoolId}
                    onClose={() => setOpenAddStudent(false)}
                    onStudentCreated={onStudentCreated} 
                />
            ) : (
                <ul className="student-list dashboard-list">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <li className="student-item dashboard-list-item" key={student._id}>
                                <div className="student-header item-header">
                                    <p>{student.name}</p>
                                    <button
                                        className="base-btn manage-btn"
                                        onClick={() => toggleExpand(student._id)}
                                    >
                                        {expandedStudentId === student._id
                                            ? "Close"
                                            : "Manage"}
                                    </button>
                                </div>

                                {expandedStudentId === student._id && (
                                    <div className="student-details">
                                        <p><strong>Email:</strong> {student.email}</p>
                                        <p><strong>Name:</strong> {student.name}</p>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="student-item">No students found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default StudentListWidget;
