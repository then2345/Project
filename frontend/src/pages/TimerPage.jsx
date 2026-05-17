import { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { formatSecondsToTime } from '../utils/format-time';
import { taskAPI, timeAPI } from '../utils/api';

const TimerPage = () => {
    const { seconds, isActive, startTimer, stopTimer, resetTimer } = useTimer();
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [currentEntryId, setCurrentEntryId] = useState(null);
    const [todayEntries, setTodayEntries] = useState([]);

    useEffect(() => {
        const initData = async () => {
            const taskRes = await taskAPI.getAll();
            setTasks(taskRes.data);
            if(taskRes.data.length > 0) setSelectedTaskId(taskRes.data[0].id);
            
            const timeRes = await timeAPI.getToday();
            setTodayEntries(timeRes.data);
        };
        initData();
    }, []);

    const handleToggleTimer = async () => {
        if (!isActive) {
            if (!selectedTaskId) return alert('Vui lòng tạo và chọn một công việc trước khi bắt đầu bấm giờ.');
            try {
                const res = await timeAPI.start(selectedTaskId);
                setCurrentEntryId(res.data.id);
                startTimer();
            } catch (err) { alert(err.message); }
        } else {
            try {
                if (currentEntryId) {
                    await timeAPI.stop(currentEntryId);
                    stopTimer();
                    resetTimer();
                    // Reload lại nhật ký hôm nay
                    const timeRes = await timeAPI.getToday();
                    setTodayEntries(timeRes.data);
                }
            } catch (err) { alert(err.message); }
        }
    };

    return (
        <div style={{ padding: 'var(--space-lg)', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Thời gian tập trung</h2>
            
            <select value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)} disabled={isActive}
                style={{ padding: 'var(--space-sm)', width: '100%', marginBottom: 'var(--space-lg)', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-main)' }}>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>

            <div style={{ fontSize: '64px', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--color-primary)', margin: 'var(--space-lg) 0' }}>
                {formatSecondsToTime(seconds)}
            </div>

            <button onClick={handleToggleTimer} className="btn-primary" style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: '18px', backgroundColor: isActive ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                {isActive ? 'Dừng tập trung' : 'Bắt đầu tập trung'}
            </button>

            <h3 style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-md)', textAlign: 'left' }}>Nhật ký hôm nay</h3>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {todayEntries.map(entry => (
                    <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm)', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>
                        <span>🎯 {entry.task_title}</span>
                        <span style={{ color: 'var(--color-success)' }}>{entry.duration_minutes || 0} phút</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimerPage;