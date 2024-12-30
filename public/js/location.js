// 修改 API 调用路径为相对路径
async function getVisitorLocation() {
    try {
        const response = await fetch('/api/visitor-location');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取位置信息失败:', error);
        return {
            countryName: '世界某处',
            city: '',
            prefix: '来自',
            suffix: '的朋友',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
}

async function updateGreeting() {
    const locationElement = document.getElementById('visitor-location');
    const greetingElement = document.getElementById('greeting');
    
    locationElement.style.opacity = '0';
    greetingElement.style.opacity = '0';
    
    const locationData = await getVisitorLocation();
    const response = await fetch('/api/greetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
    });
    
    const data = await response.json();
    
    setTimeout(() => {
        locationElement.textContent = data.locationInfo;
        locationElement.style.opacity = '1';
        
        greetingElement.textContent = data.greeting;
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