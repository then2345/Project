const BASE_URL = 'http://localhost:5000/api';

// 1. ĐỊNH NGHĨA HÀM fetchWithAuth TRƯỚC
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { ...options, headers };
    const fullUrl = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(fullUrl, config);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Lỗi hệ thống');
        return data;
    } catch (error) {
        console.error("❌ API Error:", error.message);
        throw error;
    }
};

// 2. XUẤT KHẨU authAPI SỬ DỤNG HÀM fetchWithAuth Ở TRÊN
export const authAPI = {
    register: async (payload) => {
        return await fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    login: async (payload) => {
        return await fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getMe: async () => {
        return await fetchWithAuth('/auth/me', {
            method: 'GET',
        });
    },
};