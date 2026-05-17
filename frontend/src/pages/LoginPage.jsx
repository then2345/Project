import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await authAPI.login(email, password);
            login(data.user, data.token); // Lưu dữ liệu vào Context toàn cục
            navigate('/'); // Chuyển hướng vào trang chủ Dashboard
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', width: '360px', border: '1px solid var(--color-border)' }}>
                <h2 style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-primary)' }}>SmartFocus Login</h2>
                
                {error && <p style={{ color: 'var(--color-danger)', fontSize: '14px', marginBottom: 'var(--space-sm)' }}>{error}</p>}

                <input type="email" placeholder="Email" required style={{ width: '100%', padding: 'var(--space-sm)', marginBottom: 'var(--space-md)', backgroundColor: 'var(--color-bg-input)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}
                    value={email} onChange={e => setEmail(e.target.value)} />
                
                <input type="password" placeholder="Mật khẩu" required style={{ width: '100%', padding: 'var(--space-sm)', marginBottom: 'var(--space-lg)', backgroundColor: 'var(--color-bg-input)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}
                    value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: 'var(--space-sm)' }}>Đăng Nhập</button>
                <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center' }}>
                    Chưa có tài khoản? <Link to="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Đăng ký ngay</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
