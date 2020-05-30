const http = require('http'),
	  url  = require('url')
	  
function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}

	  
boxCharacters = [
	'Я всегда хладнокровен, несмотря ни на что. Я никогда не повышаю голоса и не позволяю эмоциям управлять мной.',
	'Я часто забиваюсь в узкие закутки, где никто не сможет добраться до меня.',
	'Я выполняю приказы, даже если считаю, что они несправедливые.',
	'Куда бы я ни пришёл, я начинаю собирать местные слухи и распространять сплетни.',
	'Мне всегда нужно знать, как всё вокруг устроено, и как нужно обращаться с другими.',
	'Друзья знают, что всегда могут на меня положиться.',
	'Превыше всего я ценю совершенство.',
	'Однажды я пробежал 40 километров без остановки, чтобы предупредить свой клан о приближающейся орде орков. Если понадобится, я повторю это.',
	'Я связываю всё, что происходит со мной, с грандиозным замыслом космического масштаба.',
	'Я быстро устаю. Когда уже я найду свою судьбу?',
	'Я позволяю жажде победить в споре становиться сильнее дружбы и гармонии.',
	'На новом месте я первым делом подмечаю, где находятся различные ценности — или места, где они могут быть спрятаны.',
	'Когда я становлюсь перед выбором между друзьями и деньгами, я обычно выбираю деньги.',
	'Я могу найти общую позицию даже у самых яростных врагов, сопереживая им, и всегда стремясь к примирению.',
	'У меня есть семья, но я не знаю, где она. Надеюсь, когда-нибудь я увижу их вновь.',
	'Власть. Я хищник, а другие корабли в море — моя добыча.',
	'Я тайно считаю, что было бы хорошо стать тираном, правящим землями.',
	'Я работаю над великой философской теорией и люблю тех, кто разделяет мои идеи.',
	'У меня проблемы с доверием. Те, кто выглядят самыми порядочными, зачастую скрывают множество грязных секретов.',
	'Я сделаю всё что угодно, чтобы заполучить что-то редкое или очень ценное.',
]
boxCategory = ['персонаж', 'событие']
const PORT = process.env.PORT || 3000
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	pathname = url.parse(req.url).pathname
// 	console.log(pathname)
	if (pathname == '/ask'){
		res.write(['Да', 'Нет'][randInt(0, 1)])
	}
	else if (pathname.split('/')[1] == 'box'){
		style = url.domainToUnicode(pathname.split('/')[2]).toLowerCase()
		console.log(style)
		if (style == 'персонаж'){
			res.write(boxCharacters[randInt(0,19)])
		}
		else if (style == 'событие'){
			res.write('событие')
		}
		else res.write('доступные категории: '+boxCategory.join(', '))
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
