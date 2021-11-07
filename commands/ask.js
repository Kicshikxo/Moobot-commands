const sha256 = require('sha256')

module.exports = {
    requiredParams: {
        q: 'Текст вопроса'
    },
    handler: async (params) => {
        const { q: question } = params
        const answer = sha256(question).replace(/[^\d]/g, '').split('').map(parseFloat).reduce((acc, value) => acc + value) % 2 == 0
        return `Ответ на вопрос ${question} - ${(answer) ? 'Да' : 'Нет'}`
    }
}
