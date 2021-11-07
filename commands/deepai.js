const axios = require('axios')
const deepai = require('deepai')

module.exports = {
    requiredParams: {
        q: 'Текст для преобразования в картинку',
        apiKey: 'API ключ для DeepAI'
    },
    handler: async (params) => {
        const { q: text, apiKey } = params
        if (!text) {
            return 'Введите текст для преобразования его в картинку'
        }

        deepai.setApiKey(apiKey)

        const response = await deepai.callStandardApi('text2img', { text: text.trim() })

        const { data: shortenedLink } = await axios.get(`https://clck.ru/--?url=${response.output_url}`)

        return `Картинка из текста "${text.trim()}": ${shortenedLink}`
    }
}
