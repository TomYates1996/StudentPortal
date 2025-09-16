import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";

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

                const classRes = await api.get(`/classes/school/${schoolId}`);
                setClasses(classRes.data);
 
                const ownedCoursesRes = await api.get(`/school/courses/get/${schoolId}`);
                setOwnedCourses(ownedCoursesRes.data);
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
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
            <div className="dashboard-top-bar">
                <LogoutButton />
                {user && school && (
                    <p>
                        Logged in as <strong>{user.name}{user.email}{user.role}</strong> ({school.name})
                    </p>
                )}
            </div>

            {/* <h2>School Admin Dashboard</h2> */}

            {message && <p>{message}</p>}

            <div className="section-section">
                <div className="tabs section-tabs">
                    <button onClick={e => setSelectedSection('educators')} className={`base-btn tab-btn ${selectedSection === 'educators' ? 'active' : ''}`} >Teachers</button>
                    <button onClick={e => setSelectedSection('students')} className={`base-btn tab-btn ${selectedSection === 'students' ? 'active' : ''}`} >Students</button>
                    <button onClick={e => setSelectedSection('classes')} className={`base-btn tab-btn ${selectedSection === 'classes' ? 'active' : ''}`} >Classes</button>
                    <button onClick={e => setSelectedSection('courses')} className={`base-btn tab-btn ${selectedSection === 'courses' ? 'active' : ''}`} >Courses</button>
                </div>

                {selectedSection === 'educators' ? 
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
                                className='form-input'
                                type="text"
                                placeholder="Name"
                                value={newEducator.name}
                                onChange={e => setNewEducator({ ...newEducator, name: e.target.value })}
                                required
                            />
                            <input
                                className='form-input'
                                type="email"
                                placeholder="Email"
                                value={newEducator.email}
                                onChange={e => setNewEducator({ ...newEducator, email: e.target.value })}
                                required
                            />
                            <input
                                className='form-input'
                                type="password"
                                placeholder="Password"
                                value={newEducator.password}
                                onChange={e => setNewEducator({ ...newEducator, password: e.target.value })}
                                required
                            />
                            <button className='base-btn' type="submit">Add Educator</button>
                        </form>
                    </section> 
                : selectedSection === 'students' ? 
                    <section className="form-wrapper dashboard-section student-section">
                        <h3>Students</h3>
                        <ul>
                            {students.length < 1 ?
                            'No students created' :
                            students.map(student => (
                                <li key={student._id}>{student.name} ({student.email})</li>
                            ))}
                        </ul>

                        <h3>Add Student</h3>
                        <form className='form' onSubmit={handleAddStudent}>
                            <input
                                className='form-input'
                                type="text"
                                placeholder="Name"
                                value={newStudent.name}
                                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                required
                            />
                            <input
                            className='form-input'
                                type="email"
                                placeholder="Email"
                                value={newStudent.email}
                                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                required
                            />
                            <input
                                className='form-input'
                                type="password"
                                placeholder="Password"
                                value={newStudent.password}
                                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                                required
                            />
                            <select
                                className='form-select'
                                value={newStudent.classId}
                                onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                            >
                                <option value="">Assign to Class (optional)</option>
                                {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                                ))}
                            </select>
                            <button className='base-btn' type="submit">Add Student</button>
                        </form>
                    </section> 
                : selectedSection === 'classes' ?
                    <section className="form-wrapper dashboard-section class-section">
                        <h3>Classes</h3>
                        <ul>
                            {classes.length < 1 ? 
                            'No classes created'
                            : classes.map((c) => (
                            <li key={c._id}>
                                <strong>{c.name}</strong> — Teacher: {c.educatorId?.name} (
                                {c.educatorId?.email}) <br />
                                Students:{" "}
                                {c.studentIds.length > 0
                                ? c.studentIds.map((s) => s.name).join(", ")
                                : "No students yet"}
                            </li>
                            ))}
                        </ul>
                        <h3>Create a Class</h3>
                        <form className='form' onSubmit={handleCreateClass}>
                            <input
                            className='form-input'
                            type="text"
                            placeholder="Class Name"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            required
                            />
                            <select
                            className='form-select'
                            value={selectedEducator}
                            onChange={(e) => setSelectedEducator(e.target.value)}
                            required
                            >
                            <option value="">Select Teacher</option>
                            {educators.map((ed) => (
                                <option key={ed._id} value={ed._id}>
                                {ed.name} ({ed.email})
                                </option>
                            ))}
                            </select>
                            <button className='base-btn' type="submit">Create Class</button>
                        </form>
                    </section> 
                : selectedSection === "courses" ?
                    <section className="form-wrapper dashboard-section courses-section">
                        <h3>Owned Courses</h3>
                        <ul className="courses-list">
                            {ownedCourses.map((course) => (
                                <li key={course._id} className="course-item">
                                    <div className="image-wrapper">
                                        <img src={course.imageUrl || '/student-portal-logo.png'} alt={course.title} />
                                        <p className="course-duration" >{course.courseLength} Hours</p>
                                    </div>
                                    <h3>{course.title}</h3>
                                    {/* <p className='description'>{course.shortDescription}</p> */}
                                    <div className="button-row">
                                        {/* <button className="base-btn" onClick={ e => setSelectedCourse(course) }>More info</button> */}
                                        {/* <button className="base-btn" onClick={ () => {setSelectedCourse(course); initialisePayment(course);} }>Buy now</button> */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Link to="/school/browse-courses" className="base-btn">
                            Browse Courses
                        </Link>
                    </section>
                : <h2>Welcome</h2> 
                
                }
            </div>


            {/* <h3>Purchase Course for Students</h3>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            <option value="">Select a Course</option>
            {courses.map(course => (
                <option key={course._id} value={course._id}>
                {course.title} - ${course.price}
                </option>
                ))}
                </select>
                <button onClick={handlePurchaseCourse}>Purchase & Enroll</button> */}
        </div>
    );
};

export default SchoolDashboard;
