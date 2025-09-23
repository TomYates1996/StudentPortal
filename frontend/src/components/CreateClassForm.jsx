import React, { useState } from "react";
import api from "../services/api";

const CreateClassForm = ({ schoolId, educators, fetchData, onClose }) => {
    const [newClassName, setNewClassName] = useState("");
    const [selectedEducator, setSelectedEducator] = useState("");
    const [message, setMessage] = useState("");

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
            if (onClose) onClose();
        } catch (err) {
            console.error(err);
            setMessage("Failed to create class.");
        }
    };

    return (
        <div className="create-class-form list-form-wrapper form-wrapper">
            {message && <p>{message}</p>}
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
        </div>
    );
};

export default CreateClassForm;
