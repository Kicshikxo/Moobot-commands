const axios = require('axios')

module.exports = {
    requiredParams: {
        from: 'Идентификатор языка оригинального текста',
        to: 'Идентификатор языка перевода',
        text: 'Текст для перевода'
    },
    handler: async (params) => {
        const { from, to, text } = params

        langsList = ['en', 'ru', 'ar', 'zh', 'fr', 'de', 'it', 'pt', 'es']
        if (!langsList.includes(from.toLowerCase()) || !langsList.includes(to.toLowerCase())) {
            return ` Доступные языки для перевода: 'en' (Английский), 'ru' (Русский), 'ar' (Арабский), 'zh' (Китайский), 'de' (Немецкий), 'it' (Итальянский), 'fr' (Французский), 'pt' (Португальский), 'es' (Испанский). Сначала вводится оригинальный язык перевода, а после желаемый. Примеры: '!transl ru en Привет', '!transl en ru Hello'`
        }

        try {
            result = await axios('https://libretranslate.de/translate', {
                method: 'POST',
                data: JSON.stringify({
                    q: text,
                    source: from.toLowerCase(),
                    target: to.toLowerCase()
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            return result.data.translatedText
        }
        catch (e) {
            return `Ошибка перевода. Ошибка: ${e.message}`
        }
    }
}
