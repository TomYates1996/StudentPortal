import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await api.get('/courses/my');
            setCourses(res.data);
        };
        fetchCourses();
    }, []);

    return (
        <div>
            <LogoutButton />
            <h2>My Courses</h2>
            {courses.length === 0 ? (
                <p>No courses enrolled yet.</p>
            ) : (
                <ul>
                    {courses.map(course => (
                        <li key={course._id}>{course.title}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentDashboard;
