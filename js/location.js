// 添加缓存处理
const CACHE_DURATION = 1000 * 60 * 60; // 1小时缓存

function getLocationFromCache() {
    const cached = localStorage.getItem('visitorLocation');
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }
    }
    return null;
}

function setLocationToCache(locationData) {
    localStorage.setItem('visitorLocation', JSON.stringify({
        data: locationData,
        timestamp: Date.now()
    }));
}

async function getVisitorLocation() {
    try {
        // 从后端API获取 Cloudflare 的地理位置信息
        const response = await fetch('/api/visitor-location');
        const data = await response.json();
        
        return {
            country: data.country,
            city: data.city,
            timezone: data.timezone
        };
    } catch (error) {
        console.error('获取位置信息失败:', error);
        // 降级方案：使用浏览器的时区信息
        return {
            country: '未知',
            city: '未知',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
}

async function getVisitorLocationFallback() {
    try {
        const response = await fetch('https://api.db-ip.com/v2/free/self');
        const data = await response.json();
        return {
            country: data.countryName,
            city: data.city,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    } catch (error) {
        console.error('备用位置服务获取失败:', error);
        return null;
    }
}

async function generateGreeting(locationData) {
    try {
        const response = await fetch('/api/greetings-with-cache', {
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
        return `亲爱的来自${locationData.country}${locationData.city}的朋友，祝您新年快乐，万事如意！`;
    }
}

async function updateGreeting() {
    let locationData = await getVisitorLocation();
    
    if (!locationData) {
        locationData = await getVisitorLocationFallback();
    }
    
    if (!locationData) {
        locationData = {
            country: '世界',
            city: '某个角落',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    try {
        const greeting = await generateGreeting(locationData);
        document.getElementById('greeting').textContent = greeting;
    } catch (error) {
        const defaultGreeting = `亲爱的来自${locationData.country}${locationData.city}的朋友，祝您新年快乐，万事如意！`;
        document.getElementById('greeting').textContent = defaultGreeting;
    }
}

function retryWithDelay(fn, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                if (retries === 0) {
                    reject(error);
                    return;
                }
                setTimeout(() => {
                    retryWithDelay(fn, retries - 1, delay).then(resolve).catch(reject);
                }, delay);
            });
    });
}

retryWithDelay(() => updateGreeting()); 