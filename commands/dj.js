const axios = require('axios')
const isUrl = require('is-url')
const youtubeSearch = require('ytsr')

module.exports = {
    requiredParams: {
        q: 'Команда',
        c: 'ID канала'
    },
    handler: async (params) => {
        const { q: query, c: channelId, djApiKey, url, nickname } = params

        if (['skip', 'скип', 'далее', 'пропустить', 'пропуск'].includes(query.toLowerCase()) && djApiKey) {
            const { data: response } = await axios.get(`https://streamdj.ru/api/request_skip/${channelId}/${djApiKey}`)

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
                return 'Ничего не играет'
            else
                return `Текущий трек: ${response.title}, прислал - ${response.author}. Ссылка: https://www.youtube.com/watch?v=${response.yid}`
        }
        else if (['count', 'количество', 'колво', 'кол-во'].includes(query.toLowerCase())) {
            const { data: response } = await axios.get(`https://streamdj.ru/api/playlist/${channelId}/c`)
            return `Количество треков: ${Object.keys(response).length}`
        }
        else if (['list', 'список', 'лист', 'треки', 'список треков'].includes(query.toLowerCase())) {
            const { data: response } = await axios.get(`https://streamdj.ru/api/playlist/${channelId}/c`)

            if (response === false)
                return 'Список треков пуст :('
            else {
                return `Количество треков: ${Object.keys(response).length}. ${Object.keys(response).map(index => `${index} - ${response[index].title}; `).join('')}`
            }
        }
        else if (['link', 'ссылка'].includes(query.toLowerCase()) && url) {
            return `Ссылка на диджея: ${url}`
        }
        else if (['add', 'добавить', '+'].includes(query.toLowerCase().split(' ')[0])) {
            addQuery = query.split(' ').slice(1).join(' ')

            if (!addQuery?.length) {
                return `Не указано название трека или ютуб ссылка`
            }

            let videoLink
            if (isUrl(addQuery)) {
                videoLink = addQuery
            } else {
                const { items: videos } = await youtubeSearch(`${addQuery} Official Music Video`, { limit: 1 })
                videoLink = videos[0].url
            }

            const { data: result } = await axios({
                method: 'POST',
                withCredentials: true,
                url: `https://streamdj.ru/includes/back.php?func=add_track&channel=${channelId}`,
                headers: {
                    'Accept': 'application/json',
                    'Connection': 'keep-alive',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                data: `url=${videoLink}&author=${nickname || 'Moobot'}`,
            })

            if (typeof result == 'string') {
                if (result.includes('{"success":1}')) {
                    return 'Трек успешно добавлен'
                } else {
                    return 'Неизвестная ошибка'
                }
            } else {
                if (result.success || !result.error) {
                    return 'Трек успешно добавлен'
                } else {
                    return `Ошибка: ${result?.error?.toLowerCase()}`
                }
            }
        }
        else {
            return `Неизвестная команда. Доступные команды: ${url ? 'ссылка - ссылка на диджея, ' : ''}добавить - добавить трек в плейлист, трек - информация о текущем треке, треки - список всех треков в диджее.${url ? ` Ссылка на диджея: ${url}` : ''}`
        }
    }
}
