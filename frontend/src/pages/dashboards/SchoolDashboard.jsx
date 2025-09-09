import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';
import { jwtDecode } from "jwt-decode";

const SchoolDashboard = () => {
    const [students, setStudents] = useState([]);
    const [newStudents, setNewStudents] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [school, setSchool] = useState(null);
    const [newEducator, setNewEducator] = useState({ name: '', email: '', password: '' });
    const [educators, setEducators] = useState([]); 

    const token = localStorage.getItem('token');
    const schoolId = localStorage.getItem("schoolId");
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error('Invalid token', err);
            }
        }
    }, [token]);

    const fetchData = async () => {
        try {
            if (schoolId) {
                // const studentRes = await api.get(`/schools/${schoolId}/students`);
                // setStudents(studentRes.data);

                const schoolRes = await api.get(`/school/${schoolId}`);
                setSchool(schoolRes.data);
                
                const educatorRes = await api.get(`/school/${schoolId}/educators`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setEducators(educatorRes.data);
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

    const handleAddEducator = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/school/${schoolId}/add-educator`, newEducator, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage(res.data.message);
            setNewEducator({ name: '', email: '', password: '' });
            fetchData(); // refresh educator/student list if needed
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to add educator");
        }
    };

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

            {user && school && (
                <p>
                    Logged in as <strong>{user.name}{user.email}{user.role}</strong> ({school.name})
                </p>
            )}

            {message && <p>{message}</p>}

            <h3>Educators</h3>
            <ul>
                {educators.map(edu => (
                    <li key={edu._id}>
                        {edu.name} ({edu.email})
                    </li>
                ))}
            </ul>

            <h3>Add Educator</h3>
            <form onSubmit={handleAddEducator}>
                <input
                    type="text"
                    placeholder="Name"
                    value={newEducator.name}
                    onChange={e => setNewEducator({ ...newEducator, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newEducator.email}
                    onChange={e => setNewEducator({ ...newEducator, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newEducator.password}
                    onChange={e => setNewEducator({ ...newEducator, password: e.target.value })}
                    required
                />
                <button type="submit">Add Educator</button>
            </form>

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
