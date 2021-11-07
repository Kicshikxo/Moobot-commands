module.exports = {
    requiredParams: {
        date: 'Дата дня рождения в формате ISO'
    },
    handler: async (params) => {
        const { date } = params

        const today = new Date()
        const birthday = new Date(date)

        if (today > birthday) {
            birthday.setFullYear(today.getFullYear() + 1)
        }

        today.setHours(0, 0, 0, 0)
        birthday.setHours(0, 0, 0, 0)

        if (today === birthday) {
            return 'Сегодня день рождения стримера!'
        } else {
            const days = ~~((birthday - today) / 864e5)
            return `День рождения стримера через: ${days} ${['1'].includes(days.toString().slice(-1)) ? 'день' : ['2', '3', '4'].includes(days.toString().slice(-1)) ? 'дня' : 'дней'}`
        }
    }
}
