function updateCountdown() {
    const now = new Date();
    const newYear = new Date('2025-01-01T00:00:00');
    const diff = newYear - now;

    if (diff <= 0) {
        document.querySelector('.title').textContent = '新年快乐！';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 添加动画效果
    updateNumberWithAnimation('days', days);
    updateNumberWithAnimation('hours', hours);
    updateNumberWithAnimation('minutes', minutes);
    updateNumberWithAnimation('seconds', seconds);
}

function updateNumberWithAnimation(elementId, value) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent);
    const newValue = String(value).padStart(2, '0');
    
    if (currentValue !== value) {
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            });
        }, 200);
    }
}

// 添加 CSS 动画
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .number {
            transition: transform 0.3s ease-out, opacity 0.2s ease-out;
        }
    </style>
`);

// 初始化并每秒更新
updateCountdown();
setInterval(updateCountdown, 1000); 