import React, { useEffect, useState } from "react";
import api from "../services/api";

const OverviewWidget = ({ schoolId }) => {
    const [studentCount, setStudentCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
        try {
            if (!schoolId) return;

            const studentsRes = await api.get(`/student/school/${schoolId}`);
            setStudentCount(studentsRes.data.length);

            const coursesRes = await api.get(`/school/courses/get/${schoolId}`);
            setCourseCount(coursesRes.data.length);
        } catch (err) {
            console.error("Error fetching overview counts:", err);
        }
        };

        fetchCounts();
    }, [schoolId]);

    return (
        <div className="overview-widget" >
            <h3 className="title">Overview</h3>
            <div className="overview-items">
                <div className="course-item overview-item">
                    <p className="count">{courseCount}</p>
                    <p className="text">Total Courses</p>
                </div>
                <div className="student-item overview-item">
                    <p className="count">{studentCount}</p>
                    <p className="text">Total Students</p>
                </div>
            </div>
        </div>
        );
    };

    // Simple inline styling
    const styles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        width: "400px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#f9f9f9",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
    },
    count: {
        fontSize: "24px",
        fontWeight: "bold",
        marginTop: "8px",
    },
};

export default OverviewWidget;
