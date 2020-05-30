const http = require('http')
const PORT = process.env.PORT || 3000
const server = http.createServer(function(req, res) {
	if (Math.random() > 0.5) 
		res.writeHead(301, { "Location": "https://dl.dropbox.com/s/cfdkxvy6m1fwltt/answer-yes.json?raw=1" })
	else
		res.writeHead(301, { "Location": "https://dl.dropbox.com/s/7tkxb3dwglhplz3/answer-no.json?raw=1" })
	return res.end()
})
server.listen(PORT)
console.log('Server started on port: '+PORT)
