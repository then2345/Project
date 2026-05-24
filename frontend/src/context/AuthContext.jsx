import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    const data = await authAPI.getMe();
                    if (data && data.user) {
                        setUser(data.user);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Phiên đăng nhập hết hạn:', error.message);
                    logout();
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, [token]);

    // HÀM LOGIN: Nhận 2 tham số rời, đóng gói thành object gửi đi
    const login = async (email, password) => {
        try {
            const data = await authAPI.login({ email, password });
            if (data && data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.user);
                return data;
            }
            throw new Error(data?.message || 'Đăng nhập không thành công.');
        } catch (err) {
            throw err;
        }
    };

    // HÀM REGISTER: Nhận 3 tham số rời, đóng gói thành object gửi đi
    const register = async (username, email, password) => {
        try {
            const data = await authAPI.register({ username, email, password });
            return data;
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
};

export default useAuth;