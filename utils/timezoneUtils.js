const moment = require('moment-timezone');

function getTimezoneOffset(timezone) {
    try {
        if (!timezone) return '+00:00';
        return moment.tz(timezone).format('Z');
    } catch (error) {
        console.error('获取时区偏移失败:', error);
        return '+00:00';
    }
}

function formatTimezoneLocation(countryInfo, city) {
    const location = city ? 
        `${countryInfo.name} - ${city}` : 
        countryInfo.name;
    return location;
}

module.exports = {
    getTimezoneOffset,
    formatTimezoneLocation
}; 