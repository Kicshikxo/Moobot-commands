const http = require('http'),
	  url  = require('url')
const PORT = process.env.PORT || 3000
function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	if (url.parse(req.url).pathname == '/'){
		
	}
	else if (url.parse(req.url).pathname == '/ask'){
		res.write(['Да', 'Нет'][randInt(0, 1)])
	}
	return res.end()
})
server.listen(PORT)
console.log('Server started on port: '+PORT)
