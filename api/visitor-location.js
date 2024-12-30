const express = require('express');
const router = express.Router();

router.get('/visitor-location', (req, res) => {
    // Cloudflare 的 HTTP 请求头
    const country = req.headers['cf-ipcountry'] || '未知';
    const city = req.headers['cf-ipcity'] || '未知';
    const timezone = req.headers['cf-timezone'] || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // 获取真实IP
    const ip = req.headers['cf-connecting-ip'] || 
               req.headers['x-real-ip'] || 
               req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress;

    res.json({
        country,
        city,
        timezone,
        ip
    });
});

module.exports = router; 