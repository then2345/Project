import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await authAPI.register(formData.username, formData.email, formData.password);
            setSuccess('Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', width: '360px', border: '1px solid var(--color-border)' }}>
                <h2 style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-primary)' }}>Tạo Tài Khoản</h2>
                
                {error && <p style={{ color: 'var(--color-danger)', fontSize: '14px', marginBottom: 'var(--space-sm)' }}>{error}</p>}
                {success && <p style={{ color: 'var(--color-success)', fontSize: '14px', marginBottom: 'var(--space-sm)' }}>{success}</p>}

                <input type="text" placeholder="Tên người dùng" required style={{ width: '100%', padding: 'var(--space-sm)', marginBottom: 'var(--space-md)', backgroundColor: 'var(--color-bg-input)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }} 
                    onChange={e => setFormData({...formData, username: e.target.value})} />
                
                <input type="email" placeholder="Email" required style={{ width: '100%', padding: 'var(--space-sm)', marginBottom: 'var(--space-md)', backgroundColor: 'var(--color-bg-input)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}
                    onChange={e => setFormData({...formData, email: e.target.value})} />
                
                <input type="password" placeholder="Mật khẩu" required style={{ width: '100%', padding: 'var(--space-sm)', marginBottom: 'var(--space-lg)', backgroundColor: 'var(--color-bg-input)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}
                    onChange={e => setFormData({...formData, password: e.target.value})} />

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: 'var(--space-sm)' }}>Đăng Ký</button>
                <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center' }}>
                    Đã có tài khoản? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Đăng nhập</Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;
