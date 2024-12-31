async function initializeCountdown() {
    try {
        // 获取访问者时区信息
        const response = await fetch('/api/visitor-location');
        const data = await response.json();
        console.log('Visitor data:', data);
        
        const visitorTimezone = data.timezone.name || 'UTC';
        
        // 更新时区显示
        updateTimezoneDisplay(data.timezone);
        
        // 开始倒计时
        updateCountdown(visitorTimezone);
        setInterval(() => updateCountdown(visitorTimezone), 1000);
    } catch (error) {
        console.error('初始化失败:', error);
        // 使用默认值
        updateCountdown('UTC');
        setInterval(() => updateCountdown('UTC'), 1000);
    }
}

function updatePageLanguage(language) {
    // 更新标题
    const title = getTitle(language);
    document.querySelector('.title').textContent = title;
    document.title = title;

    // 更新时间标签
    const labels = getTimeLabels(language);
    document.querySelectorAll('.label').forEach(element => {
        const type = element.getAttribute('data-type');
        if (type && labels[type]) {
            element.textContent = labels[type];
        }
    });
}

function updateCountdown(timezone) {
    try {
        // 获取目标时区的当前时间
        const now = new Date();
        
        // 设置2025年新年时间点（使用具体的时区）
        const newYear = new Date('2025-01-01T00:00:00');
        
        // 转换为访问者时区的时间
        const userNow = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const userNewYear = new Date(newYear.toLocaleString('en-US', { timeZone: timezone }));
        
        // 计算时差（毫秒）
        const diff = userNewYear.getTime() - userNow.getTime();

        console.log('Debug time info:', {
            now: userNow.toString(),
            newYear: userNewYear.toString(),
            diff: diff,
            timezone: timezone
        });

        // 如果已经过了新年
        if (diff <= 0) {
            document.querySelector('.title').textContent = '新年快乐！';
            updateTimeBlocks(0, 0, 0, 0);
            return;
        }

        // 计算剩余时间
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // 更新显示
        updateTimeBlocks(days, hours, minutes, seconds);

    } catch (error) {
        console.error('倒计时更新失败:', error);
        updateTimeBlocks(0, 0, 0, 0);
    }
}

function updateTimeBlocks(days, hours, minutes, seconds) {
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function updateTimezoneDisplay(timezoneInfo) {
    const timezoneDisplay = document.getElementById('timezone-display');
    if (!timezoneDisplay) return;

    if (timezoneInfo.isUTC) {
        timezoneDisplay.textContent = `(UTC 默认时区)`;
    } else {
        const location = timezoneInfo.location;
        const offset = timezoneInfo.offset;
        timezoneDisplay.textContent = `(${location} UTC${offset})`;
    }
    timezoneDisplay.style.display = 'block';
}

// 页面加载时初始化倒计时
document.addEventListener('DOMContentLoaded', initializeCountdown); 
document.addEventListener('DOMContentLoaded', initializeCountdown); 