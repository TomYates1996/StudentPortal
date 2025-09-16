import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const PurchaseSuccess = () => {
    const navigate = useNavigate();
    const [school, setSchool] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [course, setCourse] = useState(null);
    const location = useLocation();
    const sessionId = new URLSearchParams(location.search).get('session_id');

    useEffect(() => {
        const fetchData = async () => {
        try {
            const sessionRes = await api.get(`/payments/session/${sessionId}`);
            const { schoolId, courseId } = sessionRes.data.metadata;

            const courseRes = await api.get(`/courses/${courseId}`);
            const schoolRes = await api.get(`/school/${schoolId}`);
            const classesRes = await api.get(`/classes/school/${schoolId}`);

            setCourse(courseRes.data);
            setSchool(schoolRes.data);
            setClasses(classesRes.data);
        } catch (err) {
            console.error(err);
        }
        };
        fetchData();
    }, [sessionId]);

    const handleAssign = async () => {
        try {
        for (const classId of selectedClasses) {
            await api.post(`/classes/${classId}/assign-course`, {
            courseIds: [course._id],
            });
        }
        alert('Course assigned successfully');
        navigate('/school/dashboard'); 
        } catch (err) {
        console.error(err);
        alert('Failed to assign course');
        }
    };

    return (
        <div className="page">
        <h2>Purchase Success!</h2>
        {course && <h3>Purchased: {course.title}</h3>}

        <h4>Assign this course to classes:</h4>
        <ul>
            {classes.map(cls => (
            <li key={cls._id}>
                <label>
                <input
                    type="checkbox"
                    value={cls._id}
                    onChange={e => {
                    if (e.target.checked) {
                        setSelectedClasses([...selectedClasses, cls._id]);
                    } else {
                        setSelectedClasses(selectedClasses.filter(id => id !== cls._id));
                    }
                    }}
                />
                {cls.name}
                </label>
            </li>
            ))}
        </ul>

        <button className='base-btn' onClick={handleAssign}>Assign Course</button>
        </div>
    );
};

export default PurchaseSuccess;
