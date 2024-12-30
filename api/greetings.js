require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getCountryInfo, formatLocation } = require('../utils/countryMapping');
const { getTimezone } = require('../utils/timezoneMapping');
const moment = require('moment-timezone');

router.get('/visitor-location', (req, res) => {
    const countryCode = req.headers['cf-ipcountry'] || 'UNKNOWN';
    const city = req.headers['cf-ipcity'] || '';
    let timezone = req.headers['cf-timezone'];
    
    // 如果无法从请求头获取时区，使用备用方案
    if (!timezone || timezone === 'UTC') {
        timezone = getTimezone(countryCode, city);
    }
    
    const countryInfo = getCountryInfo(countryCode);
    const formattedLocation = formatLocation(countryInfo, city);
    
    // 添加时区信息到响应
    const isUTC = timezone === 'UTC';
    const timezoneInfo = {
        name: timezone,
        isUTC,
        offset: moment.tz(timezone).format('Z'), // 获取时区偏移
        location: isUTC ? '默认时区' : `${countryInfo.name}${city ? ` - ${city}` : ''} 时区`
    };
    
    res.json({
        countryCode,
        formattedLocation,
        language: countryInfo.language,
        timezone: timezoneInfo
    });
});

// 添加时区映射函数
function getTimezoneByCountry(countryCode) {
    const timezoneMap = {
        'US': 'America/New_York',
        'CN': 'Asia/Shanghai',
        'JP': 'Asia/Tokyo',
        'KR': 'Asia/Seoul',
        'GB': 'Europe/London',
        'FR': 'Europe/Paris',
        'DE': 'Europe/Berlin',
        'AU': 'Australia/Sydney',
        'RU': 'Europe/Moscow',
        'IN': 'Asia/Kolkata',
        'BR': 'America/Sao_Paulo',
        'CA': 'America/Toronto',
        // 添加更多常用时区
    };
    
    return timezoneMap[countryCode];
}

router.post('/greetings', async (req, res) => {
    try {
        const { countryCode, formattedLocation, language } = req.body;
        
        // 根据语言选择不同的提示语
        const systemPrompt = language === 'zh' ? 
            '你是一个新年祝福语生成助手，请生成温暖人心、富有希望的新年祝福。' :
            'You are a New Year greeting assistant. Please generate warm and hopeful New Year wishes.';
            
        const userPrompt = language === 'zh' ? 
            `请为${formattedLocation}生成一段新年祝福语，要温暖人心且具有当地特色，不超过50字。` :
            `Please generate a warm New Year greeting for ${formattedLocation}, with local characteristics, no more than 50 words.`;

        const completion = await axios.post('https://api.siliconflow.cn/v1/chat/completions', {
            model: 'deepseek-ai/DeepSeek-V2.5',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const greeting = completion.data.choices[0].message.content;
        res.json({ 
            greeting,
            formattedLocation
        });
    } catch (error) {
        console.error('生成祝福语失败:', error);
        const defaultGreeting = req.body.language === 'zh' ? 
            `${req.body.formattedLocation}，愿新的一年带给您无限希望与喜悦！` :
            `${req.body.formattedLocation}, may the New Year bring you endless hope and joy!`;
            
        res.status(500).json({ 
            greeting: defaultGreeting,
            formattedLocation: req.body.formattedLocation
        });
    }
});

module.exports = router; 