require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/visitor-location', (req, res) => {
    // 从 Cloudflare 头信息获取访客位置
    const country = req.headers['cf-ipcountry'] || '未知';
    const city = req.headers['cf-ipcity'] || '未知';
    const timezone = req.headers['cf-timezone'] || 'Asia/Shanghai';

    res.json({ country, city, timezone });
});

router.post('/greetings', async (req, res) => {
    try {
        const { country, city } = req.body;
        
        const completion = await axios.post('https://api.siliconflow.cn/v1/chat/completions', {
            model: 'deepseek-ai/DeepSeek-V2.5',
            messages: [
                {
                    role: 'system',
                    content: '你是一个新年祝福语生成助手，请生成温暖人心、富有希望的新年祝福。'
                },
                {
                    role: 'user',
                    content: `请为来自${country}${city}的访问者生成一段新年祝福语，要温暖人心且具有当地特色，不超过50字。`
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const greeting = completion.data.choices[0].message.content;
        res.json({ greeting });
    } catch (error) {
        console.error('生成祝福语失败:', error);
        res.status(500).json({ 
            greeting: `亲爱的来自${country}${city}的朋友，愿新的一年带给您无限希望与喜悦！` 
        });
    }
});

module.exports = router; 