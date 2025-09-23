import { Link, useLocation } from "react-router-dom";

const SectionTabs = ({ student = true }) => {
    const location = useLocation();

    return (
        <div className="tabs">
            <Link to="/student/login" className={`tab-btn ${ student || location.pathname.includes("/student") ? "active" : ""}`}>
                Student
            </Link>
            <Link to="/school/login" className={`tab-btn ${ !student || location.pathname.includes("/school") ? "active" : "" }`}>
                School/Teacher
            </Link>
        </div>
    );
};

export default SectionTabs;
