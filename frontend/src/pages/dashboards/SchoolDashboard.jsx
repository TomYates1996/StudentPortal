import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';

const SchoolDashboard = () => {
    const [students, setStudents] = useState([]);
    const [newStudents, setNewStudents] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [message, setMessage] = useState('');
    const schoolId = localStorage.getItem('schoolId'); 

    const fetchData = async () => {
        try {
            if (schoolId) {
                const studentRes = await api.get(`/schools/${schoolId}/students`);
                setStudents(studentRes.data);
            }
            const courseRes = await api.get('/courses'); 
            setCourses(courseRes.data.filter(c => c.status === 'active'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddStudents = async (e) => {
        e.preventDefault();
        try {
            const studentIds = newStudents.split(',').map(s => s.trim());
            const res = await api.post('/schools/add-students', { schoolId, studentIds });
            setStudents(res.data.students || []);
            setMessage('Students added successfully!');
            setNewStudents('');
        } catch (err) {
            console.error(err);
            setMessage('Failed to add students.');
        }
    };

    const handlePurchaseCourse = async () => {
        if (!selectedCourse) return;
        try {
            const res = await api.post('/schools/purchase-course', { schoolId, courseId: selectedCourse });
            setMessage('Course purchased and students enrolled!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to purchase course.');
        }
    };

    return (
        <div>
            <LogoutButton />
            <h2>School Admin Dashboard</h2>
            {message && <p>{message}</p>}

            <h3>Add Students (IDs comma separated)</h3>
            <form onSubmit={handleAddStudents}>
                <input
                    type="text"
                    placeholder="Student IDs"
                    value={newStudents}
                    onChange={e => setNewStudents(e.target.value)}
                    required
                />
                <button type="submit">Add Students</button>
            </form>

            <h3>My Students</h3>
            <ul>
                {students.map(student => (
                    <li key={student._id}>{student.name} ({student.email})</li>
                ))}
            </ul>

            <h3>Purchase Course for Students</h3>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="">Select a Course</option>
                {courses.map(course => (
                    <option key={course._id} value={course._id}>
                        {course.title} - ${course.price}
                    </option>
                ))}
            </select>
            <button onClick={handlePurchaseCourse}>Purchase & Enroll</button>
        </div>
    );
};

export default SchoolDashboard;
