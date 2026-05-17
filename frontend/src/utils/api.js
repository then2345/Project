// Thay đổi 1: Chỉ giữ lại gốc chung là /api
const BASE_URL = 'http://localhost:5000/api'; 

// Hàm helper tự động đính kèm Token bảo mật JWT
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Đã xảy ra lỗi hệ thống.');
    }

    return data;
};

// Thay đổi 2: Thêm tiền tố /auth vào trước các endpoint xác thực
export const authAPI = {
    register: (username, email, password) => {
        return fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    },
    login: (email, password) => {
        return fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
    getMe: () => {
        return fetchWithAuth('/auth/me', {
            method: 'GET',
        });
    },
};

// Cụm gọi API cho Nhiệm vụ (Dữ liệu gửi chuẩn sang /api/tasks)
export const taskAPI = {
    getAll: () => fetchWithAuth('/tasks'),
    create: (taskData) => fetchWithAuth('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
    update: (id, taskData) => fetchWithAuth(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),
    delete: (id) => fetchWithAuth(`/tasks/${id}`, { method: 'DELETE' }),
};

// Cụm gọi API cho Đồng hồ (Dữ liệu gửi chuẩn sang /api/time-entries)
export const timeAPI = {
    getToday: () => fetchWithAuth('/time-entries/today'),
    start: (task_id) => fetchWithAuth('/time-entries/start', { method: 'POST', body: JSON.stringify({ task_id }) }),
    stop: (id) => fetchWithAuth(`/time-entries/stop/${id}`, { method: 'PUT' }),
};