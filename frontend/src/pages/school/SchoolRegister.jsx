import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import SectionTabs from '../../components/SectionTabs';

export default function SchoolRegisterPage() {
    const location = useLocation();
    const defaultTier = useMemo(
        () => new URLSearchParams(location.search).get('tier') || 'Starter',
        [location.search]
    );

    const [form, setForm] = useState({
        schoolName: '',
        email: '',
        password: '',
        tier: defaultTier,
    });
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        console.log(form);
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setMessage('');

        try {
            const regRes = await api.post('/school/register', {
            schoolName: form.schoolName,
            email: form.email,
            password: form.password,
            tier: form.tier,
            });

            const schoolId = regRes.data.schoolId || regRes.data.existingSchoolId;

            if (!schoolId) {
            throw new Error('Could not create or find school');
            }

            const payRes = await api.post('/school/create-payment-session', {
                schoolId,               
                name: form.schoolName,  
                email: form.email,
                tier: form.tier,
            });

            window.location.href = payRes.data.checkoutUrl;

        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to start payment';
            setMessage(msg);
            setSubmitting(false);
        }
    };

    return (
        <div>
        <SectionTabs />
        <h2>School Registration</h2>
        {message && <p style={{ color: 'crimson' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="schoolName"
                placeholder="School Name"
                value={form.schoolName}
                onChange={handleChange}
                required
            /><br />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            /><br />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            /><br />

            <select name="tier" value={form.tier} onChange={handleChange}>
                <option value="Starter">Starter</option>
                <option value="Growth">Growth</option>
                <option value="Enterprise">Enterprise</option>
            </select>
            <br />

            <button type="submit" disabled={submitting}>
            {submitting ? 'Processing…' : 'Continue to Payment'}
            </button>
        </form>
        </div>
    );
}
