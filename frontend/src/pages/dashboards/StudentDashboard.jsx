import React, { useEffect, useState } from "react";
import PortalHeader from "../../components/PortalHeader";
import ClassItem from "../../components/ClassItem";

const StudentDashboard = () => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const storedClasses = localStorage.getItem("studentClasses");
        if (storedClasses) {
            setClasses(JSON.parse(storedClasses));
        }
    }, []);

    return (
        <div className="page dashboard student-dashboard">
            <PortalHeader />

            <section className="dashboard-section">
                <h2>Your Classes</h2>
                <ul className="classes-list-container">
                    {classes.length > 0 ? (
                        classes.map(cls => (
                            <ClassItem key={cls._id} passedClass={cls}/>
                        ))
                    ) : (
                        <p>You are not assigned to any classes yet.</p>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default StudentDashboard;
