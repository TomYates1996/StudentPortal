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
        <div className='page school-register'>
            <SectionTabs student={false} />
            <section className="school-register-wrapper login-wrapper form-wrapper">
                <h2 className='login-text'>Sign up your school</h2>
                {message && <p style={{ color: 'crimson' }}>{message}</p>}

                <form className="form login-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="schoolName"
                        className="form-input name-input"
                        placeholder="School Name"
                        value={form.schoolName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        className="form-input email-input"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        className="form-input password-input"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <select className='form-select tier-select' name="tier" value={form.tier} onChange={handleChange}>
                        <option className='tier-option form-option' value="Starter">Starter</option>
                        <option className='tier-option form-option' value="Growth">Growth</option>
                        <option className='tier-option form-option' value="Enterprise">Enterprise</option>
                    </select>
                    <button className='base-btn form-submit' type="submit" disabled={submitting}>
                        {submitting ? 'Processing…' : 'Continue to Payment'}
                    </button>
                </form>
            </section>
        </div>
    );
}
