const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Lấy token từ Header 'Authorization: Bearer <TOKEN>'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Quyền truy cập bị từ chối. Không tìm thấy Token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Đính kèm dữ liệu (id, username) vào request
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};
