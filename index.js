const express = require('express')
const commands = require('./commands/index.js')

const app = express()

app.use((req, res, next) => res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }) && next())

Object.keys(commands).forEach(command =>
    app.get(`/${command}`, async (req, res) => {
        try {
            const specifiedParams = Object.keys(req.query)
            const requiredParams = Object.keys(commands[command].requiredParams)
            if (requiredParams.every(param => specifiedParams.includes(param))) {
                res.end(await commands[command].handler(req.query))
            } else {
                const unspecifiedParams = requiredParams.filter(param => !specifiedParams.includes(param)).map(param => `${param} - ${commands[command].requiredParams[param]}`).join(', ')
                res.end(`Не указаны обязательные параметры для команды: ${unspecifiedParams}. Инструкция по настройке команд: https://github.com/Kicshikxo/Moobot-commands#readme`)
            }
        } catch (e) {
            res.end(`Ошибка во время выполнения команды. Ошибка: ${e.message}`)
        }
    })
)

app.get('/*', (req, res) => {
    res.end('Инструкция по настройке команд: https://github.com/Kicshikxo/Moobot-commands#readme')
})

module.exports = app

if (require.main === module) {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}
