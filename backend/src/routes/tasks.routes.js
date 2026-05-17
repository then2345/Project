const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authGuard = require('../middleware/auth.middleware');

// Áp dụng lớp bảo mật cho toàn bộ các route trong file này
router.use(authGuard);

// 1. Lấy danh sách tasks của user hiện tại
router.get('/', async (req, res, next) => {
    try {
        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json({ success: true, data: tasks });
    } catch (error) { next(error); }
});

// 2. Tạo task mới
router.post('/', async (req, res, next) => {
    try {
        const { title, description, status, priority } = req.body;
        if (!title) return res.status(400).json({ message: 'Tiêu đề không được để trống' });

        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, description || '', status || 'todo', priority || 'medium']
        );
        res.status(201).json({ success: true, data: { id: result.insertId, title, description, status, priority } });
    } catch (error) { next(error); }
});

// 3. Cập nhật trạng thái hoặc thông tin task
router.put('/:id', async (req, res, next) => {
    try {
        const { title, description, status, priority } = req.body;
        const [result] = await db.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ? AND user_id = ?',
            [title, description, status, priority, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy task' });
        res.json({ success: true, message: 'Cập nhật công việc thành công' });
    } catch (error) { next(error); }
});

// 4. Xóa một công việc
router.delete('/:id', async (req, res, next) => {
    try {
        const [result] = await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy task' });
        res.json({ success: true, message: 'Đã xóa công việc thành công' });
    } catch (error) { next(error); }
});

module.exports = router;
