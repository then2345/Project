const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Khai báo các Tuyến đường (Routes)
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');         
const timeEntryRoutes = require('./routes/time-entries.routes'); 

// 1. Khởi tạo đối tượng app trước khi sử dụng các middleware
const app = express();

// 2. Cấu hình các Middleware hệ thống và bảo mật
app.use(helmet());
app.use(cors());
app.use(express.json()); // Phân tích dữ liệu JSON đầu vào

// 3. Gắn các Tuyến đường API vào hệ thống
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);         
app.use('/api/time-entries', timeEntryRoutes); 

// Route kiểm tra nhanh trạng thái Server
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend chạy mượt mà!' });
});

// 4. Centralized Error Handling Middleware (Xử lý lỗi tập trung)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Đã có lỗi xảy ra từ hệ thống nội bộ.'
    });
});

// 5. Khởi chạy Server lắng nghe kết nối
const PORT = process.env.PORT || 3001; // Sử dụng cổng 3001 theo cấu hình thực tế của bạn
app.listen(PORT, () => {
    console.log(`[Server] Đang chạy trên cổng ${PORT}`);
});
// Tìm đoạn này ở gần cuối file backend/src/app.js của bạn
app.use((err, req, res, next) => {
    // SỬA DÒNG NÀY: In toàn bộ chi tiết lỗi ra Terminal
    console.error("❌ PHÁT HIỆN LỖI HỆ THỐNG:");
    console.error(err); 
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Đã có lỗi xảy ra từ hệ thống nội bộ.'
    });
});