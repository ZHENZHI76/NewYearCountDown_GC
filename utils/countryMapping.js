const countryMapping = {
    'CN': {
        name: '中国',
        prefix: '来自',
        suffix: '的朋友',
        language: 'zh'
    },
    'LU': {
        name: 'Luxembourg',
        prefix: 'Dear friend from',
        suffix: '',
        language: 'en'
    },
    'US': {
        name: 'USA',
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
    name: 'Unknown Location',
    prefix: 'Dear friend from',
    suffix: '',
    language: 'en'
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

module.exports = {
    getCountryInfo: (countryCode) => {
        return countryMapping[countryCode] || defaultMapping;
    },
    formatLocation
}; 