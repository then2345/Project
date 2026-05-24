const db = require('../config/db');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

// 1. ĐĂNG KÝ (POST /api/auth/register)
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: `Dữ liệu không đầy đủ. Nhận được: username=${username}, email=${email}, password=${password ? 'Có' : 'Không'}` 
            });
        }

        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        return res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        next(error); 
    }
};

// 2. ĐĂNG NHẬP (POST /api/auth/login)
const login = async (req, res, next) => {
    try {
        // Log kiểm tra xem dữ liệu Frontend gửi lên hình thù như thế nào
        console.log("📥 [SmartFocus-Backend] Dữ liệu req.body nhận được:", req.body);

        let email = req.body.email;
        let password = req.body.password;

        // BẪY LỖI 1: Nếu Frontend vô tình gửi lên Object lồng dạng { email: { email, password } }
        if (email && typeof email === 'object') {
            password = email.password || password;
            email = email.email;
        }

        // BẪY LỖI 2: Đảm bảo email và password phải là chuỗi ký tự hợp lệ, không được undefined
        const safeEmail = (typeof email === 'string') ? email.trim() : '';
        const safePassword = (typeof password === 'string') ? password : '';

        // Kiểm tra nhanh nếu dữ liệu hoàn toàn trống trống
        if (!safeEmail || !safePassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu tài khoản hoặc mật khẩu hợp lệ.' 
            });
        }

        console.log(`🔍 [SmartFocus-Backend] Đang truy vấn MySQL với Email: "${safeEmail}"`);

        // Truy vấn tìm user theo email từ MySQL với biến đã được chuẩn hóa an toàn
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [safeEmail]);
        
        // Kiểm tra nếu mảng trả về rỗng (Không tìm thấy email)
        if (!rows || rows.length === 0) {
            console.log(`❌ Không tìm thấy user nào có email: ${safeEmail}`);
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const user = Array.isArray(rows) ? rows[0] : rows;

        if (!user || !user.password) {
            return res.status(500).json({ 
                success: false, 
                message: 'Hệ thống lỗi cấu trúc đọc dữ liệu mật khẩu từ Database.' 
            });
        }

        // Tiến hành đối sánh mật khẩu bằng bcrypt
        const isMatch = await bcrypt.compare(safePassword, user.password);
        console.log(`=> Kết quả đối sánh bcrypt: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo mã định danh JSON Web Token (JWT)
        const payload = { id: user.id || 0, username: user.username || 'User' };
        const secretKey = process.env.JWT_SECRET || 'smart_focus_default_secret_key_2026';
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });

        // Trả dữ liệu thành công về Frontend
        return res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("❌ LỖI HỆ THỐNG TẠI HÀM LOGIN:", error.message);
        next(error);
    }
};

// 3. LẤY THÔNG TIN CÁ NHÂN (GET /api/auth/me)
const getMe = async (req, res, next) => {
    try {
        // Kiểm tra token đã giải mã từ Middleware gán vào req.user chưa
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Không có quyền truy cập.' });
        }

        const [users] = await db.execute(
            'SELECT id, username, email, created_at FROM users WHERE id = ?', 
            [req.user.id]
        );
        
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        return res.json({ success: true, user: users[0] });
    } catch (error) {
        next(error);
    }
};

// Xuất bản đầy đủ các hàm
module.exports = { register, login, getMe };