const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Quyền truy cập bị từ chối. Thiếu Token.' });
    }

    try {
        // Kiểm tra xem secret key có tồn tại không
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("❌ CẢNH BÁO: JWT_SECRET chưa được cấu hình trong file .env");
            return res.status(500).json({ success: false, message: 'Lỗi cấu hình hệ thống.' });
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error("❌ Lỗi giải mã Token:", error.message);
        return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};