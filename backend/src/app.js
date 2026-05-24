const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Khai báo các Tuyến đường (Routes)
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');         
const timeEntryRoutes = require('./routes/time-entries.routes'); 

// 1. Khởi tạo đối tượng app
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
    console.error("❌ PHÁT HIỆN LỖI HỆ THỐNG:");
    console.error(err.stack || err); 
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Đã có lỗi xảy ra từ hệ thống nội bộ.'
    });
});

// 5. Khởi chạy Server lắng nghe kết nối
const PORT = process.env.PORT || 5000; // Đặt cứng mặc định 5000 cho khớp với cổng bạn mong muốn
app.listen(PORT, () => {
    console.log(`🚀 [SmartFocus-Server] Đang chạy chính xác trên cổng ${PORT}`);
});