import React, { useState } from "react";
import api from "../services/api";

const CreateStudentForm = ({ schoolId, onClose, onStudentCreated }) => {
    const [newStudent, setNewStudent] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

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
            
            
            const createdStudent = res.data.student; 
            
            if (onStudentCreated && createdStudent) {
                onStudentCreated(createdStudent);
            } else {
                // fetchData();
            }
            
            setMessage(res.data.message || "Student created successfully!");
            setNewStudent({ name: "", email: "", password: "" });
            // fetchData();
            if (onClose) onClose();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to add student");
        }
    };

    return (
        <div className="create-student-form list-form-wrapper form-wrapper">
            {message && <p>{message}</p>}
            <h3>Add Student</h3>
            <form className="form" onSubmit={handleAddStudent}>
                <input
                    className="form-input name-input"
                    type="text"
                    placeholder="Name"
                    value={newStudent.name}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    required
                />
                <input
                    className="form-input email-input"
                    type="email"
                    placeholder="Email"
                    value={newStudent.email}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    required
                />
                <input
                    className="form-input password-input"
                    type="password"
                    placeholder="Password"
                    value={newStudent.password}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, password: e.target.value })
                    }
                    required
                />
                <button className="base-btn" type="submit">
                    Add Student
                </button>
            </form>
        </div>
    );
};

export default CreateStudentForm;
