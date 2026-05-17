export const formatSecondsToTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return '00:00:00';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [hrs, mins, secs]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
};