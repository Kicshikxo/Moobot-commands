const http = require('http')
const PORT = process.env.PORT || 3000
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	res.write((Math.random() > 0.5) ? 'Да' : 'Нет')
	return res.end()
})
server.listen(PORT)
console.log('Server started on port: '+PORT)
