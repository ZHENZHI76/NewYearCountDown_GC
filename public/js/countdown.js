async function initializeCountdown() {
    try {
        const response = await fetch('/api/visitor-location');
        const data = await response.json();
        
        updateTimezoneDisplay(data.timezone);
        updateCountdown(data.timezone.name);
        setInterval(() => updateCountdown(data.timezone.name), 1000);
    } catch (error) {
        console.error('获取时区信息失败:', error);
        updateTimezoneDisplay({ isUTC: true, name: 'UTC', offset: '+00:00', location: '默认时区' });
        updateCountdown('UTC');
        setInterval(() => updateCountdown('UTC'), 1000);
    }
}

function updateTimezoneDisplay(timezoneInfo) {
    const timezoneDisplay = document.getElementById('timezone-display');
    if (timezoneInfo.isUTC) {
        timezoneDisplay.textContent = `(UTC 默认时区)`;
    } else {
        const offset = timezoneInfo.offset;
        timezoneDisplay.textContent = `(${timezoneInfo.location} UTC${offset})`;
    }
    timezoneDisplay.style.display = 'block';
}

function updateCountdown(timezone) {
    // 获取访问者时区的当前时间
    const now = new Date();
    
    // 计算访问者时区的2025年新年时间
    const newYear = new Date('2025-01-01T00:00:00');
    
    // 转换为访问者时区
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const targetTime = new Date(newYear.toLocaleString('en-US', { timeZone: timezone }));
    
    // 计算时差
    const diff = targetTime - userTime;

    if (diff <= 0) {
        document.querySelector('.title').textContent = '新年快乐！';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    // 计算天、时、分、秒
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 更新显示
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // 添加数字切换动画
    addTransitionEffect('days');
    addTransitionEffect('hours');
    addTransitionEffect('minutes');
    addTransitionEffect('seconds');
}

function addTransitionEffect(elementId) {
    const element = document.getElementById(elementId);
    element.style.transform = 'translateY(-2px)';
    setTimeout(() => {
        element.style.transform = 'translateY(0)';
    }, 100);
}

// 初始化倒计时
document.addEventListener('DOMContentLoaded', initializeCountdown); 