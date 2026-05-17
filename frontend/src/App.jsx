import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TasksPage from './pages/TasksPage';
import TimerPage from './pages/TimerPage';

// Layout chung tích hợp thanh điều hướng chuẩn phẳng
const MainLayout = ({ children }) => {
    const { logout } = useAuth();
    return (
        <div>
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md)', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <Link to="/" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontWeight: 'bold' }}>⏱️ Đồng hồ</Link>
                    <Link to="/tasks" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontWeight: 'bold' }}>📋 Công việc</Link>
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 'bold' }}>Đăng xuất</button>
            </nav>
            <main>{children}</main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <MainLayout><TimerPage /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/tasks" element={
                        <ProtectedRoute>
                            <MainLayout><TasksPage /></MainLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;