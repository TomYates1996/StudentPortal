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
        <div className="page student-access-request">
            <SectionTabs />
            <div className="form-wrapper">
                <h2 className="">Request Access</h2>
                {message && <p className="">{message}</p>}
                Please speak to your teacher to recieve access.
            </div>
        </div>
    );
};

export default StudentRequestAccess;
