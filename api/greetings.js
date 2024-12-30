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
    const timezone = req.headers['cf-timezone'];
    
    const countryInfo = getCountryInfo(countryCode);
    const formattedLocation = formatLocation(countryInfo, city);
    
    res.json({
        countryCode,
        formattedLocation,
        language: countryInfo.language || 'en',
        timezone: {
            name: timezone || 'UTC',
            isUTC: !timezone,
            offset: getTimezoneOffset(timezone),
            location: formatTimezoneLocation(countryInfo, city)
        }
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
            '你是一个新年祝福语生成助手。现在是2024年，请为2025年新年生成温暖人心、富有希望的新年祝福。' :
            'You are a New Year greeting assistant. It is now 2024, please generate warm and hopeful New Year wishes for 2025.';
            
        const userPrompt = language === 'zh' ? 
            `请为${formattedLocation}生成一段2025年新年祝福语，要温暖人心且具有当地特色，不超过50字。请记住这是2024年写给2025年的祝福。` :
            `Please generate a warm New Year greeting for ${formattedLocation} for the year 2025, with local characteristics, no more than 50 words. Remember this is a greeting written in 2024 for 2025.`;

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
        // 根据语言返回不同的默认祝福语
        const defaultGreeting = req.body.language === 'zh' ? 
            `${req.body.formattedLocation}，愿2025年带给您无限希望与喜悦！` :
            `${req.body.formattedLocation}, may 2025 bring you endless hope and joy!`;
            
        res.status(500).json({ 
            greeting: defaultGreeting,
            formattedLocation: req.body.formattedLocation
        });
    }
});

module.exports = router; 