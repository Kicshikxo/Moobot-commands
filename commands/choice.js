const { randInt } = require('../utils')

module.exports = {
    requiredParams: {
        q: 'Список вариантов для выбора'
    },
    handler: async (params) => {
        const options = params.q.split(' ')
        if (options.length < 2) {
            return 'Количество вариантов должно быть больше одного. Варианты указываются после команды через пробел'
        }
        else {
            return options[randInt(0, options.length - 1)]
        }
    }
}
