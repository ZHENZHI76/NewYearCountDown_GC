function getNewYearDate() {
    const now = new Date();
    const newYear = new Date(2025, 0, 1); // 2025年1月1日
    return newYear;
}

function updateCountdown() {
    const now = new Date();
    const newYear = getNewYearDate();
    const diff = newYear - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if (diff <= 0) {
        // 新年到达时的处理
        document.querySelector('.countdown-wrapper h1').textContent = '新年快乐！';
        startFireworks();
    }
}

setInterval(updateCountdown, 1000);
updateCountdown(); 