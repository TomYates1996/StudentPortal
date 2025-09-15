import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import SectionTabs from "../../components/SectionTabs";

const StudentLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            // Redirect To Dashboard
            navigate("/student/dashboard");
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <main className="page">
            <SectionTabs />
            <section className="student-login-wrapper form-wrapper login-wrapper">
                <h2 className="login-text">Student Login</h2>
                {error && <p className="login-failed">{error}</p>}
                <form onSubmit={handleSubmit} className="form login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                    <button
                        type="submit"
                        className="base-btn"
                    >
                        Login
                    </button>
                </form>
                <p className="form-link-wrap">
                    Need access?{" "}
                    <Link to="/student/register" className="form-link">
                        Request Access
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default StudentLoginPage;
