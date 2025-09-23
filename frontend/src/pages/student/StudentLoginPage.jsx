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
            const res = await api.post("/auth/student/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("schoolId", res.data.schoolId);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("schoolName", res.data.schoolName);
            localStorage.setItem("userName", res.data.name);
            localStorage.setItem("userId", res.data.id); 
            localStorage.setItem("studentClasses", JSON.stringify(res.data.classes || []));

            navigate("/student/dashboard");
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <main className="page login-page">
            <img src="/design-images/yellow-wave-top-left.png" alt="yellow wave" className="top-left-wave login-page-pattern" />
            <img src="/design-images/book.png" alt="" className="top-right-image login-page-pattern" />
            <SectionTabs />
            <h1 className="student-portal-title">Course Portal</h1>

            <section className="student-login-wrapper form-wrapper login-wrapper">
                <h2 className="login-text">Student Login</h2>
                {error && <p className="login-failed">{error}</p>}
                <form onSubmit={handleSubmit} className="form login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input email-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input password-input"
                        required
                    />
                    <button
                        type="submit"
                        className="base-btn form-submit"
                    >
                        Log In
                    </button>
                </form>
                <div className="form-link-wrap">
                    <Link to="/student/register" className="form-link">
                        Request access
                    </Link>
                </div>
            </section>
            <img src="/design-images/yellow-wave-bottom-left.png" alt="" className="bottom-left-wave login-page-pattern" />
            <img src="/design-images/purple-wave-bottom-right.png" alt="" className="bottom-right-wave login-page-pattern" />
        </main>
    );
};

export default StudentLoginPage;
