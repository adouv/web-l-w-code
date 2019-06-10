export function formatDuring(mss: number) {
    const days = mss / (1000 * 60 * 60 * 24);
    const hours = mss % (1000 * 60 * 60 * 24) / (1000 * 60 * 60);
    const minutes = mss % (1000 * 60 * 60) / (1000 * 60);
    const seconds = mss % (1000 * 60) / 1000;
    return (days > 1 ? parseInt(days + '') + ' 天 ' : '') +
        (hours > 1 ? parseInt(hours + '') + ' 小时 ' : '') +
        (minutes > 1 ? parseInt(minutes + '') + ' 分钟 ' : '') + seconds + ' 秒 ';
}
