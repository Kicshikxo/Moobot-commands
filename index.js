const http = require('http'),
	  url  = require('url');
const PORT = process.env.PORT || 3000
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	if (url.parse(req.url).pathname == '/'){
		
	}
	else if (url.parse(req.url).pathname == '/ask'){
		res.write((Math.random() > 0.5) ? 'Да' : 'Нет')
	}
	return res.end()
})
server.listen(PORT)
console.log('Server started on port: '+PORT)
