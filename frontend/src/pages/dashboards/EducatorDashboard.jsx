import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';   

const EducatorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [schedule, setSchedule] = useState('');
    const [message, setMessage] = useState('');

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses/my-created');
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/courses', { title, description, price, schedule });
            setCourses([...courses, res.data]);
            setMessage('Course created successfully!');
            setTitle(''); setDescription(''); setPrice(''); setSchedule('');
        } catch (err) {
            console.error(err);
            setMessage('Failed to create course.');
        }
    };

    return (
        <div>
            <LogoutButton />
            <h2>Educator Dashboard</h2>
            {message && <p>{message}</p>}

            <h3>Create a New Course</h3>
            <form onSubmit={handleCreateCourse}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Schedule / Time"
                    value={schedule}
                    onChange={e => setSchedule(e.target.value)}
                />
                <button type="submit">Create Course</button>
            </form>

            <h3>My Courses</h3>
            {courses.length === 0 ? (
                <p>No courses yet.</p>
            ) : (
                <ul>
                    {courses.map(course => (
                        <li key={course._id}>
                            {course.title} - £{course.price} - Status: {course.status === 'approved' ? 'Approved' : 'Pending Approval'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EducatorDashboard;
