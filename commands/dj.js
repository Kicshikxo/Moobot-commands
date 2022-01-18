const axios = require('axios')

module.exports = {
    requiredParams: {
        q: 'Команда',
        c: 'ID канала'
    },
    handler: async (params) => {
        const { q: query, c: channelId, apiKey, url, nickname } = params

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
        else if (['link', 'ссылка'].includes(query.toLowerCase())) {
            return url ? `Ссылка на диджея: ${url}` : 'Не указана ссылка на диджея :('
        }
        else if (['add', 'добавить'].includes(query.toLowerCase().split(' ')[0])) {
            videoUrl = query.split(' ')[1]

            if (!videoUrl?.length) {
                return 'Не указана ютуб ссылка на трек'
            }

            const { data: result } = await axios({
                method: 'POST',
                withCredentials: true,
                url: `https://streamdj.ru/includes/back.php?func=add_track&channel=${channelId}`,
                headers: {
                    'Accept': '*/*',
                    'Connection': 'keep-alive',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                data: `url=${videoUrl}&author=${nickname || 'Moobot'}`,
            })

            if (result.success) {
                return 'Трек успешно добавлен'
            } else if (result.error) {
                return `Ошибка: ${result.error.toLowerCase()}`
            } else {
                return 'Неизвестный ответ сервера'
            }
        }
        else {
            return `Неизвестная команда. Доступные команды: ${url ? 'ссылка - ссылка на диджея, ' : ''}трек - информация о текущем треке, треки - список всех треков в диджее.${url ? ` Ссылка на диджея: ${url}` : ''}`
        }
    }
}
