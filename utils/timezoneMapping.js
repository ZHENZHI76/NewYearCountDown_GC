const cityTimezones = require('city-timezones');
const moment = require('moment-timezone');

// 国家代码到默认时区的映射
const countryTimezones = {
    'CN': 'Asia/Shanghai',
    'US': {
        default: 'America/New_York',
        cities: {
            'Los Angeles': 'America/Los_Angeles',
            'Chicago': 'America/Chicago',
            'New York': 'America/New_York',
            'Houston': 'America/Chicago',
            'Phoenix': 'America/Phoenix',
            // 添加更多美国主要城市
        }
    },
    'JP': 'Asia/Tokyo',
    'KR': 'Asia/Seoul',
    'GB': 'Europe/London',
    'FR': 'Europe/Paris',
    'DE': 'Europe/Berlin',
    'AU': {
        default: 'Australia/Sydney',
        cities: {
            'Perth': 'Australia/Perth',
            'Adelaide': 'Australia/Adelaide',
            'Melbourne': 'Australia/Melbourne',
            'Sydney': 'Australia/Sydney',
            'Brisbane': 'Australia/Brisbane'
        }
    },
    'RU': {
        default: 'Europe/Moscow',
        cities: {
            'Moscow': 'Europe/Moscow',
            'Saint Petersburg': 'Europe/Moscow',
            'Novosibirsk': 'Asia/Novosibirsk',
            'Vladivostok': 'Asia/Vladivostok'
        }
    },
    'IN': 'Asia/Kolkata',
    'BR': {
        default: 'America/Sao_Paulo',
        cities: {
            'Sao Paulo': 'America/Sao_Paulo',
            'Rio de Janeiro': 'America/Sao_Paulo',
            'Brasilia': 'America/Sao_Paulo',
            'Manaus': 'America/Manaus'
        }
    },
    // 添加更多国家...
};

function getTimezone(countryCode, city) {
    try {
        // 1. 如果有具体的城市时区映射
        if (countryTimezones[countryCode]?.cities?.[city]) {
            return countryTimezones[countryCode].cities[city];
        }

        // 2. 尝试使用 city-timezones 库查找
        if (city) {
            const cityLookup = cityTimezones.lookupViaCity(city);
            if (cityLookup && cityLookup.length > 0) {
                return cityLookup[0].timezone;
            }
        }

        // 3. 使用国家默认时区
        if (typeof countryTimezones[countryCode] === 'string') {
            return countryTimezones[countryCode];
        }
        if (countryTimezones[countryCode]?.default) {
            return countryTimezones[countryCode].default;
        }

        // 4. 尝试使用 moment-timezone 推测时区
        const possibleZones = moment.tz.zonesForCountry(countryCode);
        if (possibleZones && possibleZones.length > 0) {
            return possibleZones[0]; // 使用该国家的第一个时区
        }

        // 5. 如果都失败了，返回 UTC
        return 'UTC';
    } catch (error) {
        console.error('时区查找失败:', error);
        return 'UTC';
    }
}

module.exports = { getTimezone }; 