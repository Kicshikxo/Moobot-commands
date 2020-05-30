const http = require('http'),
	  url  = require('url')
boxOptions = [
	{
		text: 'Шанс 1 процент',
		chance: 1
	},{
		text: 'Шанс 4 процента',
		chance: 4
	},{
		text: 'Шанс 5 процентов',
		chance: 5
	},{
		text: 'Шанс 10 процентов вариант 1',
		chance: 10
	},{
		text: 'Шанс 10 процентов вариант 2',
		chance: 10
	},{
		text: 'Шанс 20 процентов',
		chance: 20
	},{
		text: 'Шанс 50 процентов',
		chance: 50
	}
]
const PORT = process.env.PORT || 3000
function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	if (url.parse(req.url).pathname == '/box'){
		for (sum = boxOptions[0].chance, choice = 0, rand = ~~(Math.random() * 100); sum <= rand; sum += boxOptions[choice].chance) choice++
		res.write(boxOptions[choice].text)
	}
	else if (url.parse(req.url).pathname == '/ask'){
		res.write(['Да', 'Нет'][randInt(0, 1)])
	}
	else {
		res.writeHeader(200, {"Content-Type": "text/html"})
		res.write(`
		<style>
			* {
				margin: 0;
				padding:0;
				font-family: Arial;
			}
			body {
				width: 100vw;
				height: 100vh;
				background: #2D2D2D;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			a:visited,
			a:active,
			a:hover,
			a {
				text-decoration: none;
				color: #FFF
			}
			.button {
				background: #4D4D4D;
				color: #FFF;
				border: 2px solid #5D5D5D;
				border-radius: 15px;
				width: 100px;
				height: 30px;
				text-align: center;
				font-size: 24px;
				margin: 30px;
			}
		</style>
		<body>
			<div class = 'button'><a href = "box">box</a></div>
			<div class = 'button'><a href = "ask">ask</a></div>
		</body>
		`)
	}
	return res.end()
})
server.listen(PORT)
console.log('Server started on port: '+PORT)
