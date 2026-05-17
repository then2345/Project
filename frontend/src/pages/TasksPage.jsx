import { useState, useEffect } from 'react';
import { taskAPI } from '../utils/api';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');

    const loadTasks = async () => {
        try {
            const res = await taskAPI.getAll();
            setTasks(res.data);
        } catch (err) { alert(err.message); }
    };

    useEffect(() => { loadTasks(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await taskAPI.create({ title, priority, status: 'todo' });
            setTitle('');
            loadTasks();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if(confirm('Bạn chắc chắn muốn xóa đầu việc này?')) {
            try {
                await taskAPI.delete(id);
                loadTasks();
            } catch (err) { alert(err.message); }
        }
    };

    // Hàm lấy mã màu biểu thị mức độ ưu tiên dựa trên CSS Variables gốc
    const getPriorityColor = (p) => {
        if (p === 'high') return 'var(--color-danger)';
        if (p === 'medium') return 'var(--color-warning)';
        return 'var(--color-success)';
    };

    return (
        <div style={{ padding: 'var(--space-lg)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Quản lý Nhiệm vụ</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <input type="text" placeholder="Thêm đầu việc cần làm..." required value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ flex: 1, padding: 'var(--space-sm)', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }} />
                <select value={priority} onChange={e => setPriority(e.target.value)}
                    style={{ padding: 'var(--space-sm)', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}>
                    <option value="low">Thấp</option>
                    <option value="medium">Vừa</option>
                    <option value="high">Cao</option>
                </select>
                <button type="submit" className="btn-primary">Thêm</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {tasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md)', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', borderLeft: `5px solid ${getPriorityColor(task.priority)}` }}>
                        <span>{task.title}</span>
                        <button onClick={() => handleDelete(task.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Xóa</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksPage;