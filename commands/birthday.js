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
            return `День рождения стримера через: ${~~((birthday - today) / 864e5)} дней`
        }
    }
}
