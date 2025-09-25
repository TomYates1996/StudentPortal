import React, { useState } from "react";
import api from "../services/api";

const ClassItem = ({ passedClass }) => {

    return (
        <div key={passedClass._id} className="class-card">
            <div className="class-name-box">
                <h3 className="class-name">{passedClass.name}</h3>
                <a className="teacher" href={`mailto:${passedClass.educatorId?.email}`}>{passedClass.educatorId?.name}</a>
            </div>
            <h4 className="classmates-title">Students</h4>
            <ul className="class-students-list">
            {passedClass.studentIds.slice(0, 5).map(stu => (
                <li className="class-students-item" key={stu._id}>
                    <img src="/placeholder-profile.png" alt={stu.name} className="student-icon"/>
                </li>
            ))}

            {passedClass.studentIds.length > 5 && (
                <li className="class-students-item more-indicator">
                    <p className="extra-students">+{passedClass.studentIds.length - 5} more</p>
                </li>
            )}
            </ul>

            <h4 className="class-courses">Courses</h4>
            <ul className="class-courses-list">
                {passedClass.courses.length > 0 ? (
                    passedClass.courses.map(course => (
                        <li className="class-courses-item" key={course._id}>{course.title}</li>
                    ))
                    ) : (
                        <p className="class-courses-item">No courses to show.</p>
                    )
                }
            </ul>
        </div>
    );
};

export default ClassItem;
