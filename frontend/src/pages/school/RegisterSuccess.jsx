import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function RegisterSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const sessionId = new URLSearchParams(location.search).get('session_id');

    const [msg, setMsg] = useState('Finalizing…');

    useEffect(() => {
        let cancelled = false;

        const complete = async () => {
        try {
            const { data } = await api.post('/school/complete-registration', { sessionId });
            if (cancelled) return;
            if (data?.token) {
                localStorage.setItem('token', data.token);
            }
        } catch (err) {
            if (cancelled) return;
                const m = err.response?.data?.message || 'Failed to complete registration';
            setMsg(m);
        }
        };

        if (sessionId) complete();
        else setMsg('Missing session id');

        return () => { cancelled = true; };
    }, [sessionId, navigate]);

    return (
        <div>
            <h2>Registration Successful</h2>
            <p><Link to="/school/dashboard">Go to School Dashboard</Link></p>
        </div>
    );
}
