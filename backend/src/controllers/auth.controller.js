const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. ĐĂNG KÝ (POST /register)
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        // Kiểm tra xem User đã tồn tại chưa
        const [existingUser] = await db.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?', 
            [username, email]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Tên tài khoản hoặc Email đã được sử dụng.' });
        }

        // Băm bảo mật mật khẩu
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Lưu vào MySQL
        await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        next(error);
    }
};

// 2. ĐĂNG NHẬP (POST /login)
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const user = users[0];

        // Xác thực mật khẩu
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo mã định danh JSON Web Token (Hạn dùng 1 ngày)
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

// 3. LẤY THÔNG TIN CÁ NHÂN (GET /me) -> Sử dụng Middleware chặn
const getMe = async (req, res, next) => {
    try {
        // req.user được lấy ra từ Auth Middleware sau khi kiểm tra Token thành công
        const [users] = await db.execute(
            'SELECT id, username, email, created_at FROM users WHERE id = ?', 
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        res.json({ success: true, user: users[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };