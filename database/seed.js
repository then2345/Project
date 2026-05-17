const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../backend/.env' }); // Đọc cấu hình từ file .env của backend

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log('[Seed] Đang kết nối tới cơ sở dữ liệu...');

    try {
        // Dọn dẹp dữ liệu cũ (Xóa theo thứ tự đảo ngược của khóa ngoại)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE scheduled_tasks');
        await connection.query('TRUNCATE TABLE time_entries');
        await connection.query('TRUNCATE TABLE tasks');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 1. Khởi tạo User mẫu
        const salt = await bcrypt.genSalt(10);
        const demoPassword = await bcrypt.hash('smartfocus123', salt);
        
        const [userResult] = await connection.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            ['demo_user', 'demo@smartfocus.com', demoPassword]
        );
        const userId = userResult.insertId;
        console.log(`[Seed] Đã tạo thành công User mẫu ID: ${userId}`);

        // 2. Khởi tạo Danh sách Nhiệm vụ (Tasks) mẫu
        const tasks = [
            ['Thiết kế Schema Database', 'Hoàn thiện cấu trúc 4 bảng cho hệ thống quản lý năng suất.', 'completed', 'high'],
            ['Xây dựng JWT Authentication Backend', 'Viết middleware, mã hóa bcrypt và tích hợp Express.', 'in_progress', 'high'],
            ['Cấu hình UI CSS Variables', 'Setup bảng màu Slate & Indigo tinh chỉnh độ tập trung.', 'todo', 'medium'],
            ['Nghiên cứu thuật toán Phân tích Rhythm', 'Tìm hiểu tích hợp Bayesian Linear Regression đánh giá khung giờ vàng.', 'todo', 'low']
        ];

        for (const task of tasks) {
            const [taskResult] = await connection.query(
                'INSERT INTO tasks (user_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)',
                [userId, task[0], task[1], task[2], task[3]]
            );

            // 3. Nếu task đã xong hoặc đang làm, seed thêm một vài time entries (Nhật ký thời gian)
            if (task[2] === 'completed') {
                await connection.query(
                    "INSERT INTO time_entries (task_id, start_time, end_time) VALUES (?, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR)",
                    [taskResult.insertId]
                );
            }
        }
        console.log('[Seed] Đã tạo thành công danh sách nhiệm vụ mẫu.');
        console.log('>>> Bơm dữ liệu mẫu hoàn tất! Bạn có thể sử dụng tài khoản: demo@smartfocus.com / smartfocus123 để đăng nhập thử.');

    } catch (error) {
        console.error('Lỗi khi seed dữ liệu:', error);
    } finally {
        await connection.end();
    }
}

seed();
