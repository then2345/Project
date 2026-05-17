const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authGuard = require('../middleware/auth.middleware');

router.use(authGuard);

// 1. Lấy danh sách nhật ký tập trung của HÔM NAY
router.get('/today', async (req, res, next) => {
    try {
        const [entries] = await db.execute(
            `SELECT te.*, t.title as task_title 
             FROM time_entries te 
             JOIN tasks t ON te.task_id = t.id 
             WHERE t.user_id = ? AND DATE(te.start_time) = CURDATE() 
             ORDER BY te.start_time DESC`,
            [req.user.id]
        );
        res.json({ success: true, data: entries });
    } catch (error) { next(error); }
});

// 2. Ghi nhận BẮT ĐẦU bấm giờ (Tạo một phiên trống chưa có end_time)
router.post('/start', async (req, res, next) => {
    try {
        const { task_id } = req.body;
        if (!task_id) return res.status(400).json({ message: 'Vui lòng chọn công việc cần tập trung' });

        const [result] = await db.execute(
            'INSERT INTO time_entries (task_id, start_time, end_time) VALUES (?, NOW(), NULL)',
            [task_id]
        );
        res.status(201).json({ success: true, data: { id: result.insertId, task_id } });
    } catch (error) { next(error); }
});

// 3. Ghi nhận KẾT THÚC bấm giờ (Cập nhật end_time cho phiên)
router.put('/stop/:id', async (req, res, next) => {
    try {
        const [result] = await db.execute(
            'UPDATE time_entries SET end_time = NOW() WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy phiên bấm giờ' });
        res.json({ success: true, message: 'Đã lưu lại phiên tập trung' });
    } catch (error) { next(error); }
});

module.exports = router;