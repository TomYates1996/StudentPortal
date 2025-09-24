import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from "react-router-dom";
import PortalHeader from '../../components/PortalHeader';

const BrowseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [ownedCourses, setOwnedCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [message, setMessage] = useState('');

    // filter states
    const [year, setYear] = useState('');
    const [subject, setSubject] = useState('');
    const [minDuration, setMinDuration] = useState('');
    const [maxDuration, setMaxDuration] = useState('');
    const [includeOwned, setIncludeOwned] = useState(false);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const coursesPerPage = 12;

    const schoolId = localStorage.getItem("schoolId");

    const initialisePayment = async (passedCourse) => {
        try {
            if (!passedCourse) throw new Error('Error selecting course');

            const payRes = await api.post('/school/purchase-course', {
                schoolId,
                title: passedCourse.title,
                courseId: passedCourse._id,
                userEmail: localStorage.getItem("email"),
            });

            window.location.href = payRes.data.checkoutUrl;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to start payment';
            setMessage(msg);
        }
    };

    // fetch courses with backend filters + pagination
    const fetchCourses = async () => {
        try {
            const params = {
                page: currentPage,
                limit: coursesPerPage,
                year: year || undefined,
                subject: subject || undefined,
                minHours: minDuration || undefined,
                maxHours: maxDuration || undefined,
                includeOwned,
                schoolId
            };

            const res = await api.get("/courses", { params });
            setCourses(res.data.courses);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    // fetch owned courses separately so we can check
    const fetchOwnedCourses = async () => {
        try {
            const ownedRes = await api.get(`/school/courses/get/${schoolId}`);
            setOwnedCourses(ownedRes.data);
        } catch (err) {
            console.error("Error fetching owned courses:", err);
        }
    };

    useEffect(() => {
        if (schoolId) {
            fetchCourses();
            fetchOwnedCourses();
        }
    }, [schoolId, year, subject, minDuration, maxDuration, includeOwned, currentPage]);

    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <div className="page browse-courses">
            <PortalHeader />
            {message && <p>{message}</p>}

            <div className="tabs tab-browse-courses">
                <Link to="/school/dashboard" className="tab-btn">Dashboard</Link>
            </div>

            <h2 className="section-section">Browse Courses</h2>

            {/* Filters */}
            <section className="filters">
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">All Years</option>
                    <option value="Year 7">Year 7</option>
                    <option value="Year 8">Year 8</option>
                    <option value="Year 9">Year 9</option>
                    <option value="Year 10">Year 10</option>
                    <option value="Year 11">Year 11</option>
                    <option value="Year 12">Year 12</option>
                    <option value="Year 13">Year 13</option>
                </select>

                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">All Subjects</option>
                    <option value="computer science">Computer Science</option>
                    <option value="maths">Maths</option>
                    <option value="english">English</option>
                    <option value="history">History</option>
                    <option value="other">Other</option>
                </select>

                <input
                    type="number"
                    placeholder="Min hours"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max hours"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={includeOwned}
                        onChange={() => setIncludeOwned(prev => !prev)}
                    />
                    Include purchased courses
                </label>
            </section>

            {/* Courses */}
            <section className="courses-wrapper">
                <ul className="courses-list">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <li key={course._id} className="course-item">
                                <div className="courses-top">
                                    <img src={course.imageUrl || '/student-portal-logo.png'} alt={course.title} />
                                    <div className="course-detail-boxes">
                                        <p className='year detail-box'>{course.year} - {course.subject}</p>
                                        <h3>{course.title}</h3>
                                        <p className='description'>{course.shortDescription}</p>
                                        <p className="course-duration detail-box">Duration - {course.courseLength} Hours</p>
                                    </div>
                                </div>
                                <div className="button-row">
                                    <button className="base-btn" onClick={() => setSelectedCourse(course)}>More info</button>
                                    <button className="base-btn" onClick={() => initialisePayment(course)}>Buy now</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No courses match your filters</p>
                    )}
                </ul>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx + 1}
                            className={currentPage === idx + 1 ? "active" : ""}
                            onClick={() => handlePageChange(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </div>
            )}

            {/* Modal */}
            {selectedCourse && (
                <section className="course-modal">
                    <div className="modal-inner">
                        <button className="close-modal" onClick={() => setSelectedCourse(null)}>x</button>
                        <div className="title-wrap">
                            <p className="year">{selectedCourse.year} - {selectedCourse.subject}</p>
                            <h2 className='title'>{selectedCourse.title}</h2>
                            <h3 className="price">£{selectedCourse.price / 100}</h3>
                        </div>
                        <div className="description-wrap">
                            <h3 className="description-title">Description</h3>
                            <p className='description-value'>{selectedCourse.description}</p>
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
                        <button className="base-btn" onClick={() => initialisePayment(selectedCourse)}>Purchase</button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BrowseCourses;
