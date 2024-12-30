const titleTranslations = {
    'zh': '2025新年倒计时',
    'en': '2025 New Year Countdown',
    'ja': '2025年新年カウントダウン',
    'ko': '2025년 새해 카운트다운',
    'fr': 'Compte à rebours du Nouvel An 2025',
    'de': 'Countdown zum Neujahr 2025',
    'es': 'Cuenta atrás para el Año Nuevo 2025',
    'it': 'Conto alla rovescia per il Capodanno 2025',
    'ru': 'Обратный отсчет до Нового 2025 года',
    'pt': 'Contagem regressiva para o Ano Novo 2025',
    'vi': 'Đếm ngược đến Năm mới 2025',
    'th': 'นับถอยหลังสู่ปีใหม่ 2025',
    // 添加更多语言...
};

const timeLabels = {
    'zh': { days: '天', hours: '时', minutes: '分', seconds: '秒' },
    'en': { days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs' },
    'ja': { days: '日', hours: '時', minutes: '分', seconds: '秒' },
    'ko': { days: '일', hours: '시', minutes: '분', seconds: '초' },
    'fr': { days: 'Jours', hours: 'Heures', minutes: 'Mins', seconds: 'Secs' },
    'de': { days: 'Tage', hours: 'Stunden', minutes: 'Min', seconds: 'Sek' },
    'es': { days: 'Días', hours: 'Horas', minutes: 'Mins', seconds: 'Segs' },
    // 添加更多语言...
};

const defaultLanguage = 'en';

module.exports = {
    getTitle: (language) => titleTranslations[language] || titleTranslations[defaultLanguage],
    getTimeLabels: (language) => timeLabels[language] || timeLabels[defaultLanguage]
}; 