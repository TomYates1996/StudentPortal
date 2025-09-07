import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import SectionTabs from "../../components/SectionTabs";

const StudentRequestAccess = () => {
    const [form, setForm] = useState({ name: "", email: "", schoolId: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/request-access", form);
            setMessage("Request submitted! The school will review it.");
            setTimeout(() => navigate("/login/student"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.msg || "Failed to submit request");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <SectionTabs />
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Request Access</h2>
                {message && <p className="text-center text-blue-600 mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="schoolId"
                        placeholder="School ID (optional)"
                        value={form.schoolId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentRequestAccess;
