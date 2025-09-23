import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";
import PortalHeader from '../../components/PortalHeader';
import OverviewWidget from '../../components/OverviewWidget';
import ClassListWidget from '../../components/ClassListWidget';
import StudentListWidget from '../../components/StudentListWidget';

const SchoolDashboard = () => {
    const [students, setStudents] = useState([]);
    const [ownedCourses, setOwnedCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSection, setSelectedSection] = useState('educators');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [school, setSchool] = useState(null);
    const [newEducator, setNewEducator] = useState({ name: '', email: '', password: '' });
    const [educators, setEducators] = useState([]); 
    const [newClassName, setNewClassName] = useState("");
    const [selectedEducator, setSelectedEducator] = useState("");
    const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "", classId: "" });

    const token = localStorage.getItem('token');
    const schoolId = localStorage.getItem("schoolId");

    // useEffect(() => {
    //     if (token) {
    //         try {
    //             const decoded = jwtDecode(token);
    //             setUser(decoded);
    //             localStorage.setItem('userName', decoded.name);
    //             localStorage.setItem('userEmail', decoded.email);
    //             localStorage.setItem('userRole', decoded);
    //         } catch (err) {
    //             console.error('Invalid token', err);
    //         }
    //     }
    // }, [token]);

    const fetchData = async () => {
        try {
            if (schoolId) {
                const studentRes = await api.get(`/student/school/${schoolId}`);
                setStudents(studentRes.data);

                const schoolRes = await api.get(`/school/${schoolId}`);
                setSchool(schoolRes.data);
                
                const educatorRes = await api.get(`/school/${schoolId}/educators`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEducators(educatorRes.data);

                const classRes = await api.get(`/classes/school/${schoolId}`);
                setClasses(classRes.data);
 
                const ownedCoursesRes = await api.get(`/school/courses/get/${schoolId}`);
                setOwnedCourses(ownedCoursesRes.data);

                localStorage.setItem('schoolName', schoolRes.data.name);
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName || !selectedEducator) return;

        try {
        await api.post("/classes/create", {
            name: newClassName,
            schoolId,
            educatorId: selectedEducator,
        });
        setMessage("Class created successfully!");
        setNewClassName("");
        setSelectedEducator("");
        fetchData();
        } catch (err) {
        console.error(err);
        setMessage("Failed to create class.");
        }
    };

    const handleAddEducator = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/school/${schoolId}/add-educator`, newEducator, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            setNewEducator({ name: '', email: '', password: '' });
            fetchData(); 
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to add educator");
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
            "/student/create",
            { ...newStudent, schoolId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            );
            setMessage(res.data.message);
            setNewStudent({ name: "", email: "", password: "", classId: "" });
            fetchData();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to add student");
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
        <div className="page dashboard school-dashboard">
            <PortalHeader />

            {message && <p>{message}</p>}

            <section className="dashboard-details-top">
                <OverviewWidget schoolId={schoolId} />
                <div className="dashboard-buttons">
                    <Link to="/school/browse-courses" className="button-school light-blue-btn">Buy Courses</Link>
                    <button className="button-school light-green-btn" onClick={() => { document.getElementById("studentList")?.scrollIntoView({ behavior: "smooth" });}}>
                        Add Students
                    </button>
                    
                </div>
            </section>
            <div className="tabs">
                <button onClick={e => setSelectedSection('classes')} className={`tab-btn ${selectedSection === 'classes' ? 'active' : ''}`}>Classes</button>
                <button onClick={e => setSelectedSection('students')} className={`tab-btn ${selectedSection === 'students' ? 'active' : ''}`}>Students</button>
                <button onClick={e => setSelectedSection('educators')} className={`tab-btn ${selectedSection === 'educators' ? 'active' : ''}`}>Teachers</button>
            </div>

            {selectedSection === 'classes' ? 
            <ClassListWidget fetchData={fetchData} educators={educators} schoolId={schoolId} students={students} />
            : selectedSection === 'students' ?
            <StudentListWidget schoolId={schoolId} students={students} onStudentCreated={(student) => setStudents((prev) => [...prev, student])} />
            : selectedSection === 'educators' ?
            <section className="form-wrapper dashboard-section educators-section">
                <h3>Teachers</h3>
                <ul>
                    {educators.length > 0 ? 
                    educators.map(edu => (
                        <li key={edu._id}>
                            {edu.name} ({edu.email})
                        </li>
                    )) : 'No teachers/educators created yet.'}
                </ul>

                <h3>Add Teacher</h3>
                <form className='form' onSubmit={handleAddEducator}>
                    <input
                        className='form-input name-input'
                        type="text"
                        placeholder="Name"
                        value={newEducator.name}
                        onChange={e => setNewEducator({ ...newEducator, name: e.target.value })}
                        required
                    />
                    <input
                        className='form-input email-input'
                        type="email"
                        placeholder="Email"
                        value={newEducator.email}
                        onChange={e => setNewEducator({ ...newEducator, email: e.target.value })}
                        required
                    />
                    <input
                        className='form-input password-input'
                        type="password"
                        placeholder="Password"
                        value={newEducator.password}
                        onChange={e => setNewEducator({ ...newEducator, password: e.target.value })}
                        required
                    />
                    <button className='base-btn' type="submit">Add Educator</button>
                </form>
            </section> 
        : null }
        </div>
    );
};

export default SchoolDashboard;
