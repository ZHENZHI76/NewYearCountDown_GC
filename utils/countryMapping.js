const countryMapping = {
    'CN': {
        name: '中国',
        prefix: '来自',
        suffix: '的朋友',
        language: 'zh'
    },
    'US': {
        name: 'United States',
        prefix: 'Dear friend from',
        suffix: '',
        language: 'en'
    },
    'LU': {
        name: 'Luxembourg',
        prefix: 'Dear friend from',
        suffix: '',
        language: 'en'
    },
    'GB': {
        name: 'UK',
        prefix: 'Dear friend from',
        suffix: '',
        language: 'en'
    },
    'JP': {
        name: '日本',
        prefix: '',
        suffix: 'からの友人',
        language: 'ja'
    },
    'KR': {
        name: '한국',
        prefix: '',
        suffix: '에서 온 친구',
        language: 'ko'
    },
    'FR': {
        name: 'France',
        prefix: 'Cher ami de',
        suffix: '',
        language: 'fr'
    },
    'DE': {
        name: 'Deutschland',
        prefix: 'Lieber Freund aus',
        suffix: '',
        language: 'de'
    },
    // 添加更多国家...
};

const defaultMapping = {
    name: '未知位置',
    prefix: '来自',
    suffix: '的朋友',
    language: 'zh'
};

function formatLocation(countryInfo, city) {
    const { name, prefix, suffix, language } = countryInfo;
    
    // 如果有城市信息，包含城市
    if (city) {
        if (language === 'zh') {
            return `${prefix}${name}${city}${suffix}`;
        } else {
            return `${prefix} ${city}, ${name}`;
        }
    }
    
    // 没有城市信息时
    if (language === 'zh') {
        return `${prefix}${name}${suffix}`;
    } else {
        return `${prefix} ${name}`;
    }
}

function getCountryInfo(countryCode) {
    // 添加日志以便调试
    console.log('Country Code:', countryCode);
    
    if (!countryCode || countryCode === 'UNKNOWN') {
        console.log('Using default mapping due to unknown country code');
        return defaultMapping;
    }

    const countryInfo = countryMapping[countryCode];
    if (!countryInfo) {
        console.log(`No mapping found for country code: ${countryCode}`);
        return defaultMapping;
    }

    return countryInfo;
}

module.exports = {
    getCountryInfo,
    formatLocation
}; 