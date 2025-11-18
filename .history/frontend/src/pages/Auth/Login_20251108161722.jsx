import { useState, useContext } from 'react';
import { login } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4" required />
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Login</button>
      </form>
    </div>
  );
}
