import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentLoginPage from "./pages/student/StudentLoginPage";
import SchoolLoginPage from "./pages/school/SchoolLoginPage";
import StudentRequestAccess from "./pages/student/StudentRequestAccess";
import SchoolRegister from "./pages/school/SchoolRegister";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import EducatorDashboard from "./pages/dashboards/EducatorDashboard";
import SchoolDashboard from "./pages/dashboards/SchoolDashboard";
import PrivateRoute from "./components/PrivateRoute";
import TiersPage from "./pages/school/TiersPage";
import RegisterSuccess from './pages/school/RegisterSuccess';
import BrowseCourses from './pages/school/BrowseCourses';

function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {/* Default landing page */}
                <Route path="/" element={<Navigate to="/student/login"/>} />

                {/* Student login/register */}
                <Route path="/student/login" element={<StudentLoginPage />} />
                <Route path="/student/register" element={<StudentRequestAccess />} />

                {/* School login/register */}
                <Route path="/school/login" element={ token ? <Navigate to="/school/dashboard" /> : <SchoolLoginPage />} />
                <Route path="/school/register" element={<SchoolRegister />} />
                <Route path="/school/success" element={<RegisterSuccess />} />
                <Route path="/explore/tiers" element={<TiersPage />} />

                {/* Protected dashboards */}
                <Route
                    path="/student/dashboard"
                    element={
                        <PrivateRoute>
                            <StudentDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/educator/dashboard"
                    element={
                        <PrivateRoute>
                            <EducatorDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/school/dashboard"
                    element={
                        <PrivateRoute>
                            <SchoolDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/school/browse-courses"
                    element={
                        // <PrivateRoute>
                            <BrowseCourses />
                        // </PrivateRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;
