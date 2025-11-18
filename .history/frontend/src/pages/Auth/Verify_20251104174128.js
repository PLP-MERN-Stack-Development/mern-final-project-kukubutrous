import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api/axios.js'


export default function Verify() {
    const [q] = useSearchParams();
    const [msg, setMsg] = useState('Verifying...')
    useEffect(() => {
        (async () => {
            const token = q.get('token');
            try { await api.get(`/auth/verify?token=${token}`); setMsg('Email verified. You may login.') }
            catch (e) { setMsg(e.response?.data?.message || 'Verification failed') }
        })()
    }, [])
    return <div className="max-w-md mx-auto">{msg}</div>
}