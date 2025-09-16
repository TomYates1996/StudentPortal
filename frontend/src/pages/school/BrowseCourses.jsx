import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LogoutButton from '../../components/LogoutButton';
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";

// const courses = [
//     { id : 1, title: "Course 1", shortDescription : 'this is the description for course 1', description : 'this is the full description for course 1this is the full description for course 1this is the full description for course 1', courseLength : 30, price : 400, imageUrl : '/student-portal-logo.png', modules : ['Section 1' , 'Learning 2', 'Learning 3', 'How to 4', 'When You Learn', 'Finishing up'] },
//     { id : 2, title: "Course 2", shortDescription : 'this is 2 the 2 description for course 2', description : 'this is the description for course 2this is the description for course 2this is the description for course 2', courseLength : 25, price : 500, imageUrl : '/student-portal-logo.png', modules : ['Section 1' , 'Learning 2', 'Learning 3', 'How to 4', 'When You Learn', 'Finishing up']  },
//     { id : 3, title: "Course 3", shortDescription : 'this 3 is 3 the description for course 3', description : 'this is the description for course 3this is the description for course 3this is the description for course 3', courseLength : 4, price : 100, imageUrl : '/student-portal-logo.png', modules : ['Modulation' , 'Remish', 'Quantity of lesser graphing variables', 'Forgun Itvic Logre Nepatum']  }
// ];

const BrowseCourses = () => {
    // const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [school, setSchool] = useState(null);
    const [courses, setCourses] = useState([]);

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

    const initialisePayment = async (passedCourse) => {

        const selectedCourse = passedCourse;

        try {
            // if (!schoolId) {
            //     throw new Error('Could not create or find school');
            // }
            if (!selectedCourse) {
                throw new Error('Error selecting course')
            }

            const payRes = await api.post('/school/purchase-course', {
                schoolId,               
                title: selectedCourse.title,  
                courseId: selectedCourse._id,
                userEmail: user.email,
            });

            window.location.href = payRes.data.checkoutUrl;

        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to start payment';
            // setMessage(msg);
            // setSubmitting(false);
        }
    }

    const fetchData = async () => {
        try {
            if (schoolId) {
                // const studentRes = await api.get(`/schools/${schoolId}/students`);
                // setStudents(studentRes.data);

                const coursesRes = await api.get(`/courses/index`);
                setCourses(coursesRes.data);

                const schoolRes = await api.get(`/school/${schoolId}`);
                setSchool(schoolRes.data);
                
                const educatorRes = await api.get(`/school/${schoolId}/educators`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

            }

        
            // const courseRes = await api.get('/courses'); 
            // setCourses(courseRes.data.filter(c => c.status === 'active'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="page browse-courses">
            <div className="dashboard-top-bar">
                <LogoutButton />
                {user && school && (
                    <p>
                        Logged in as <strong>{user.name}{user.email}{user.role}</strong> ({school.name})
                    </p>
                )}
            </div>


            {message && <p>{message}</p>}

            <div className="section-section">
                Courses Page
            </div>

            <section className="courses-wrapper">
                <ul className="courses-list">
                    {courses.map((course) => (
                        <li key={course._id} className="course-item">
                            <div className="image-wrapper">
                                <img src={course.imageUrl || '/student-portal-logo.png'} alt={course.title} />
                                <p className="course-duration" >{course.courseLength} Hours</p>
                            </div>
                            <h3>{course.title}</h3>
                            <p className='description'>{course.shortDescription}</p>
                            <div className="button-row">
                                <button className="base-btn" onClick={ e => setSelectedCourse(course) }>More info</button>
                                <button className="base-btn" onClick={ () => {setSelectedCourse(course); initialisePayment(course);} }>Buy now</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            { selectedCourse ? 
                <section className="course-modal">
                    {/* <img src={selectedCourse.imageUrl} alt={selectedCourse.title} /> */}
                    <button className="close-modal" onClick={ e => setSelectedCourse(null)}>x</button>
                    <div className="title-wrap">
                        <h2 className='title'>{ selectedCourse.title }</h2>
                        <h3 className="price">£{selectedCourse.price/100}</h3>
                    </div>
                    <div className="description-wrap">
                        <h3 className="description-title">Course Description</h3>
                        <p className='description-value'>{ selectedCourse.description }</p>
                    </div>
                    <div className="duration">
                        <h3 className='duration-title'>Duration </h3>
                        <p className="duration-value">{selectedCourse.courseLength} Hours</p>
                    </div>
                    <div className="module-section">
                        <h3>Modules</h3>
                        <ul className="module-list">
                            {selectedCourse.modules && selectedCourse.modules.map((module, idx) => (
                                <li key={idx} className="module-item">
                                    <p className="module-value">{module}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="base-btn" onClick={ () => initialisePayment(selectedCourse) }>Purchase</button>
                </section>
                : null
            }


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

export default BrowseCourses;
