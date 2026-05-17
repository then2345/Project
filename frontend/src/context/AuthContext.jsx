import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Kiểm tra và khôi phục phiên đăng nhập khi F5
    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    const data = await authAPI.getMe();
                    setUser(data.user);
                } catch (error) {
                    console.error('Phiên đăng nhập hết hạn:', error.message);
                    logout();
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, [token]);

    // Hàm xử lý Đăng nhập thành công
    const login = (userData, userToken) => {
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('token', userToken);
    };

    // Hàm Đăng xuất
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tùy biến để gọi nhanh Auth ở các file giao diện
export const useAuth = () => useContext(AuthContext);
