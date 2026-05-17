import { useState, useEffect, useRef } from 'react';

export const useTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);

    const startTimer = () => {
        if (!isActive) {
            setIsActive(true);
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (isActive) {
            clearInterval(timerRef.current);
            setIsActive(false);
        }
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setIsActive(false);
        setSeconds(0);
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current); // Dọn dẹp bộ nhớ khi hủy giao diện
    }, []);

    return { seconds, isActive, startTimer, stopTimer, resetTimer };
};
