import React, { useEffect, useState } from "react";
import api from "../services/api";
import CreateClassForm from "./CreateClassForm";

const ClassListWidget = ({ fetchData, educators, schoolId, students }) => {
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedClassId, setExpandedClassId] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [openAddStudents, setOpenAddStudents] = useState(false);
    const [openAddClass, setOpenAddClass] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const [classRes, courseRes] = await Promise.all([
            api.get(`/classes/school/${schoolId}`),
            api.get(`/school/courses/get/${schoolId}`),
            ]);
            setClasses(classRes.data);
            setAllCourses(courseRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        };

        if (schoolId) fetchData();
    }, [schoolId]);

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedClassId(prev => (prev === id ? null : id));
        setSelectedStudentIds([]);
    };

    const handleAddStudents = async (classId) => {
        try {
        const res = await api.post(`/classes/${classId}/add-students`, {
            studentIds: selectedStudentIds
        });
        const updatedClass = res.data;

        setClasses(prev =>
            prev.map(cls => (cls._id === updatedClass._id ? updatedClass : cls))
        );

        setSelectedStudentIds([]); 
        } catch (err) {
            console.error("Failed to add students", err);
        }
    };

    const handleRemoveStudent = async (classId, studentId) => {
        try {
        const res = await api.post(`/classes/${classId}/remove-student`, {
            studentId
        });
        const updatedClass = res.data;

        setClasses(prev =>
            prev.map(cls => (cls._id === updatedClass._id ? updatedClass : cls))
        );
        } catch (err) {
        console.error("Failed to remove student", err);
        }
    };

    const handleAddCourse = async (classId, courseId) => {
        if (!courseId) return;
        try {
        const res = await api.post(`/classes/${classId}/assign-course`, {
            courseIds: [courseId]
        });
        const updatedClass = res.data.class;

        setClasses(prev =>
            prev.map(cls => (cls._id === updatedClass._id ? updatedClass : cls))
        );
        } catch (err) {
        console.error("Failed to add course", err);
        }
    };

    const handleRemoveCourse = async (classId, courseId) => {
        try {
        const res = await api.post(`/classes/${classId}/remove-course`, {
            courseIds: [courseId]
        });
        const updatedClass = res.data.class;

        setClasses(prev =>
            prev.map(cls => (cls._id === updatedClass._id ? updatedClass : cls))
        );
        } catch (err) {
        console.error("Failed to remove course", err);
        }
    };

    return (
        <div className="class-list-widget list-widget">
            <div className="title-bar">
                <h3>{openAddClass ? 'Add New Class' : 'Classes'}</h3>
                    <button onClick={() => setOpenAddClass(prev => !prev)} className="base-btn">
                        {openAddClass ? "Cancel" : "Add Class"}
                    </button>
                </div>
                {openAddClass ? null : 
                    <input
                        className="input-search"
                        type="text"
                        placeholder="Search classes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                }
            {openAddClass ? 
                <CreateClassForm
                    schoolId={schoolId}
                    educators={educators}
                    fetchData={fetchData}
                    onClose={() => setOpenAddClass(false)}
                />
                :
                <ul className="class-list dashboard-list">
                    {filteredClasses.length > 0 ? (
                        filteredClasses.map(cls => (
                        <li className="class-item dashboard-list-item" key={cls._id}>
                        <div className="class-header item-header">
                            <p>{cls.name}</p>
                            <button
                            className="base-btn manage-btn"
                            onClick={() => toggleExpand(cls._id)}
                            >
                            {expandedClassId === cls._id ? "Close" : "Manage"}
                            </button>
                        </div>

                        {expandedClassId === cls._id && (
                            <div className="class-details item-details">
                                <h4>Students</h4>
                                <ul className="student-list class-inner-list">
                                    {cls.studentIds.length > 0 ? (
                                    cls.studentIds.map(student => (
                                        <li className="student-item split-item" key={student._id}>
                                            <p>{student.name}</p>
                                            <button onClick={() => handleRemoveStudent(cls._id, student._id)}>Remove</button>
                                        </li>
                                    ))
                                    ) : (
                                    <li>No students yet</li>
                                    )}
                                </ul>

                            <button onClick={() => setOpenAddStudents(prev => !prev)} className="base-btn">{openAddStudents ? 'Close' : 'Add'}</button>
                            {openAddStudents && (
                            <ul>
                                {students
                                .filter(
                                    s => !cls.studentIds.some(cs => cs._id === s._id)
                                )
                                .map(student => (
                                    <li key={student._id}>
                                    <label>
                                        <input
                                        type="checkbox"
                                        value={student._id}
                                        checked={selectedStudentIds.includes(student._id)}
                                        onChange={(e) =>
                                            setSelectedStudentIds(prev =>
                                            e.target.checked
                                                ? [...prev, student._id]
                                                : prev.filter(id => id !== student._id)
                                            )
                                        }
                                        />
                                        {student.name}
                                    </label>
                                    </li>
                                ))}
                            </ul>
    )}
                            {selectedStudentIds.length > 0 && openAddStudents && (
                                <button onClick={() => handleAddStudents(cls._id)}>
                                Add Selected
                                </button>
                            )}
                                <div className="course-details">
                                    <h4>Courses</h4>
                                    <ul className="course-list class-inner-list">
                                        {cls.courses.length > 0 ? (
                                        cls.courses.map(course => (
                                            <li className="course-item split-item" key={course._id}>
                                                <p>{course.title}</p>
                                                <button onClick={() => handleRemoveCourse(cls._id, course._id)}>Remove</button>
                                            </li>
                                        ))
                                        ) : (
                                        <li>No courses assigned</li>
                                        )}
                                    </ul>

                                    <h5>Add a Course</h5>
                                    <select
                                        onChange={(e) => handleAddCourse(cls._id, e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                        Select course...
                                        </option>
                                        {allCourses
                                        .filter(c => !cls.courses.some(sc => sc._id === c._id))
                                        .map(c => (
                                            <option key={c._id} value={c._id}>
                                            {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        </li>
                    ))
                    ) : (
                    <li className="class-item">No classes found</li>
                    )}
                </ul>
            }
        </div>
    );
};

export default ClassListWidget;
