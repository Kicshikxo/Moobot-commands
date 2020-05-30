const http = require('http'),
	  url  = require('url')
boxCharacters = [
	{
		text: 'Я всегда хладнокровен, несмотря ни на что. Я никогда не повышаю голоса и не позволяю эмоциям управлять мной.',
		chance: 5
	},{
		text: 'Я часто забиваюсь в узкие закутки, где никто не сможет добраться до меня.',
		chance: 5
	},{
		text: 'Я выполняю приказы, даже если считаю, что они несправедливые.',
		chance: 5
	},{
		text: 'Куда бы я ни пришёл, я начинаю собирать местные слухи и распространять сплетни.',
		chance: 5
	},{
		text: 'Мне всегда нужно знать, как всё вокруг устроено, и как нужно обращаться с другими.',
		chance: 5
	},{
		text: 'Друзья знают, что всегда могут на меня положиться.',
		chance: 5
	},{
		text: 'Превыше всего я ценю совершенство.',
		chance: 5
	},{
		text: 'Однажды я пробежал 40 километров без остановки, чтобы предупредить свой клан о приближающейся орде орков. Если понадобится, я повторю это.',
		chance: 5
	},{
		text: 'Я связываю всё, что происходит со мной, с грандиозным замыслом космического масштаба.',
		chance: 5
	},{
		text: 'Я быстро устаю. Когда уже я найду свою судьбу?',
		chance: 5
	},{
		text: 'Я позволяю жажде победить в споре становиться сильнее дружбы и гармонии.',
		chance: 5
	},{
		text: 'На новом месте я первым делом подмечаю, где находятся различные ценности — или места, где они могут быть спрятаны.',
		chance: 5
	},{
		text: 'Когда я становлюсь перед выбором между друзьями и деньгами, я обычно выбираю деньги.',
		chance: 5
	},{
		text: 'Я могу найти общую позицию даже у самых яростных врагов, сопереживая им, и всегда стремясь к примирению.',
		chance: 5
	},{
		text: 'У меня есть семья, но я не знаю, где она. Надеюсь, когда-нибудь я увижу их вновь.',
		chance: 5
	},{
		text: 'Власть. Я хищник, а другие корабли в море — моя добыча.',
		chance: 5
	},{
		text: 'Я тайно считаю, что было бы хорошо стать тираном, правящим землями.',
		chance: 5
	},{
		text: 'Я работаю над великой философской теорией и люблю тех, кто разделяет мои идеи.',
		chance: 5
	},{
		text: 'У меня проблемы с доверием. Те, кто выглядят самыми порядочными, зачастую скрывают множество грязных секретов.',
		chance: 5
	},{
		text: 'Я сделаю всё что угодно, чтобы заполучить что-то редкое или очень ценное.',
		chance: 5
	}
]
boxCategory = ['персонаж', 'событие']
const PORT = process.env.PORT || 3000
function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	pathname = url.parse(req.url).pathname
	console.log(pathname)
	if (pathname == '/ask'){
		res.write(['Да', 'Нет'][randInt(0, 1)])
	}
	else if (pathname.split('/')[1] == 'box'){
		if (pathname.split('/')[2] == '%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6'){
			for (sum = boxCharacters[0].chance, choice = 0, rand = ~~(Math.random() * 100); sum <= rand; sum += boxCharacters[choice].chance) choice++
			res.write(boxCharacters[choice].text)
		}
		else if (pathname.split('/')[2] == '%D1%81%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B5'){
			res.write('событие')
		}
		else res.write('Доступные категории: '+boxCategory.join(', '))
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
