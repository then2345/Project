import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    // Nếu hệ thống đang trong quá trình check token cũ, hiển thị màn hình chờ nhẹ
    if (loading) {
        return <div style={{ color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>Đang xác thực...</div>;
    }

    // Nếu không có token (chưa đăng nhập), ép hướng quay về trang /login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
