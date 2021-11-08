const axios = require('axios')

module.exports = {
    requiredParams: {
        q: 'Команда',
        c: 'ID канала'
    },
    handler: async (params) => {
        const { q: query, c: channelId, apiKey } = params

        if (['skip', 'скип', 'далее', 'пропустить', 'пропуск'].includes(query.toLowerCase()) && apiKey) {
            const { data: response } = await axios.get(`https://streamdj.ru/api/request_skip/${channelId}/${apiKey}`)

            if (response.error)
                return `Ошибка: ${response.error}`
            else if (response.success === 1)
                return `Трек пропущен`
            else if (response.success === 0)
                return `Список треков пуст :(`
            else
                return 'Неизвестный ответ сервера'
        }
        else if (['current', 'now', 'track', 'название', 'песня', 'трек', 'текущий', 'текущее', 'чо играет', 'что играет'].includes(query.toLowerCase())) {
            const { data: response } = await axios.get(`https://streamdj.ru/api/get_track/${channelId}`)

            if (response === null)
                return 'Текущий трек не найден'
            else
                return `Текущий трек: ${response.title}, прислал - ${response.author}. Ссылка: https://www.youtube.com/watch?v=${response.yid}`
        }
        else if (['list', 'список', 'лист', 'треки', 'список треков'].includes(query.toLowerCase())) {
            const { data: response } = await axios.get(`https://streamdj.ru/api/playlist/${channelId}/c`)

            if (response === false)
                return 'Список треков пуст :('
            else {
                return `Количество треков: ${Object.keys(response).length}. ${Object.keys(response).map(index => `${index} - ${response[index].title}; `).join('')}`
            }
        }
        else {
            return 'Неизвестная команда. Доступные команды: трек - информация о текущем треке; треки - список всех треков в диджее'
        }
    }
}
