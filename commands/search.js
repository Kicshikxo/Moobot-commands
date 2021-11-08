const axios = require('axios')
const iconv = require('iconv-lite')

module.exports = {
    requiredParams: {
        q: 'Категория поиска'
    },
    handler: async (params) => {
        const { q: query } = params

        if (['анек', 'анекдот', 'анекдоты', 'joke', 'шутка', 'шутку'].includes(query.toLowerCase())) {
            const response = await axios.get(`http://rzhunemogu.ru/RandJSON.aspx?CType=${1}`, {
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            })

            return iconv.decode(Buffer.from(response.data), 'windows-1251').slice(12, -2)
        }
        else if (['киса', 'кису', 'котика', 'кисика', 'кисулю', 'кисульку', 'кисулькина', 'котэ', 'киську', 'киску', 'котю', 'cat', 'кота', 'кисулю', 'кисика', 'кошку', 'кота', 'кот'].includes(query.toLowerCase())) {
            try {
                const { data: response } = await axios.get('https://some-random-api.ml/img/cat/')
                const { data: shortenedLink } = await axios.get(`https://clck.ru/--?url=${response.link}`)
                return shortenedLink
            } catch (e) {
                return `Ошибка нахождения кисы. Ошибка: ${e}`
            }
        }
        else {
            return 'Доступные категории для поиска: анекдот; киса'
        }
    }
}
