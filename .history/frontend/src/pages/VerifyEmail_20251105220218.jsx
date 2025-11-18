




/
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function VerifyEmail() {
    const { token } = useParams();
    const nav = useNavigate();
    const [msg, setMsg] = useState('Verifying...');

    useEffect(() => {
        (async () => {
            try {
                await api.get(`/auth/verify/${token}`);
                setMsg('Email verified. You can login now.');
                setTimeout(() => nav('/login'), 1500);
            } catch (err) {
                setMsg(err.response?.data?.message || 'Verification failed');
            }
        })();
    }, [token]);

    return <div className="max-w-md mx-auto p-8">{msg}</div>
}
*/