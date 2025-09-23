import React, { useState } from "react";
import api from "../services/api";

const ClassItem = ({ passedClass }) => {

    return (
        <div key={passedClass._id} className="class-card">
            <h3 className="class-name">{passedClass.name}</h3>
            {/* <p className="teacher-name">Teacher: {passedClass.educatorId?.name} ({passedClass.educatorId?.email})</p> */}
            <h4 className="classmates-title">Classmates</h4>
            <ul className="class-students-list">
                {passedClass.studentIds.map(stu => (
                    <li className="class-students-item" key={stu._id}>
                        <img src="/placeholder-profile.png" alt={stu.name} className="student-icon" />
                    </li>
                ))}
            </ul>

            <h4 className="class-courses">Courses</h4>
            <ul className="class-courses-list">
                {passedClass.courses.map(course => (
                    <li className="class-courses-item" key={course._id}>{course.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClassItem;
