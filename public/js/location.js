// 修改 API 调用路径为相对路径
async function getVisitorLocation() {
    try {
        const response = await fetch('/api/visitor-location');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取位置信息失败:', error);
        return {
            country: '世界',
            city: '某个角落',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
}

async function generateGreeting(locationData) {
    try {
        const response = await fetch('/api/greetings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locationData)
        });
        
        if (!response.ok) {
            throw new Error('API 请求失败');
        }
        
        const data = await response.json();
        return data.greeting;
    } catch (error) {
        console.error('生成祝福语失败:', error);
        return `亲爱的来自${locationData.country}${locationData.city}的朋友，愿新的一年带给您无限希望与喜悦！`;
    }
}

async function updateGreeting() {
    const locationElement = document.getElementById('visitor-location');
    const greetingElement = document.getElementById('greeting');
    
    locationElement.style.opacity = '0';
    greetingElement.style.opacity = '0';
    
    const locationData = await getVisitorLocation();
    const greeting = await generateGreeting(locationData);
    
    setTimeout(() => {
        // 显示位置信息
        locationElement.textContent = `来自 ${locationData.country} ${locationData.city} 的朋友`;
        locationElement.style.opacity = '1';
        
        // 显示祝福语
        greetingElement.textContent = greeting;
        greetingElement.style.opacity = '1';
    }, 300);
}

// 添加淡入效果的CSS
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .visitor-location, .greeting {
            transition: opacity 0.3s ease;
        }
    </style>
`);

// 初始化
updateGreeting(); 