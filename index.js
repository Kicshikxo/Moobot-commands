const http = require('http'),
	  url  = require('url'),
	  mongo = require("mongodb"),
	  texts = require('./texts.js'),
	  commands = require('./commands.js')

function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
Array.prototype.choiceOne = function(){return this[randInt(0, this.length-1)]}
String.prototype.in = function(arr){return arr.indexOf(this.toString()) != -1}

const server = http.createServer(function(request, response) {
	response.writeHeader(200, {"Content-Type": "application/json"})
	
	pathname = url.parse(request.url).pathname
	
	queryArguments = pathname.split('/')
	queryArguments.shift()
	queryArguments = queryArguments.map(function(element){
		if (parseInt(element) == element || parseFloat(element) == element) return element
		return url.domainToUnicode(element.replace('@','').replace('%40',''))
	})
	for (i = 0; i <= 5 - queryArguments.length; i++) queryArguments.push('')
	
	if (queryArguments[0] == 'mine'){
		name   = queryArguments[1]
		action = queryArguments[2].toLowerCase()
		mongo.MongoClient('\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x4B\x69\x63\x73\x68\x69\x6B\x78\x6F\x3A\x75\x61\x33\x77\x69\x6B\x71\x77\x65\x40\x63\x6C\x75\x73\x74\x65\x72\x30\x2D\x38\x68\x75\x6D\x79\x2E\x67\x63\x70\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x6D\x6F\x6F\x62\x6F\x74').connect(
			async function(error, client){
			
			if (error) {
				response.write(` Ошибка подключения к серверу. Ошибка: ${error}`)
				return response.end()
			}
			
			const collection = client.db("Moobot").collection("mine")
			data = await commands.receiveData(collection)
			
			if ((function(){for (_ of data){if (_.name == name) return user = _}})()){
				if (action.in(['инфо','инфа','info','infa'])) 
					commands.info(response, collection, user)
					
				else if (action.in(['инвентарь','инвент','сумка','рюкзак','inventory','inv'])) 
					commands.inventory(response, collection, user)
					
				else if (action.in(['копать','батрачить','dig'])) 
					await commands.dig(response, collection, user)
					
				else if (action.in(['данж','подземелье','dungeon','dunge'])) 
					await commands.dungeon(response, collection, user)
					
				else if (action.in(['продать','сбагрить','sell'])) 
					await commands.sell(response, collection, user)
					
				else if (action.in(['улучшить','купить','прокачать','upgrade','up','buy'])) 
					await commands.upgrade(response, collection, user)
					
				else if (action.in(['пользователи','игроки','люди','users','players'])) 
					commands.users(response, data)
					
				else if (action.in(['удалиться','delete','remove'])) 
					await commands.remove(response, collection, user)
					
				else if (action.in(['передать','перевод','подарить','подарок','give'])) 
					await commands.give(response, collection, user)
					
				else response.write("Доступные команды для бота: 'инфо', 'пользователи', 'копать', 'данж', 'инвентарь', 'продать', 'улучшить', 'передать', 'удалиться'")
			}
			else await commands.create(response, collection, name)
			response.end()
			client.close()
		})
	}
	else if (queryArguments[0] == 'ask') {
		response.write(['Да', 'Нет'].choiceOne())
		response.end()
	}
	else if (queryArguments[0] == 'search') {
		query = queryArguments[1].toLowerCase()
		type = 0
		if (query.in(['анек', 'анекдот', 'анекдоты', 'joke', 'шутка', 'шутку'])) type = 1
		else if (query.in(['рассказ', 'рассказы', 'сказ'])) type = 2
		else if (query.in(['стих', 'стишок', 'стихи', 'стишки'])) type = 3
		else if (query.in(['афоризмы', 'афоризма', 'афоризму'])) type = 4
		else if (query.in(['цитата', 'цитаты', 'цитату'])) type = 5
		else if (query.in(['тост', 'тосты'])) type = 6
		else if (query.in(['статус', 'статусы'])) type = 8
		else {
			response.write(' Доступные категории для поиска: \'анекдот\', \'рассказ\', \'стих\', \'афоризма\', \'цитата\', \'тост\', \'статус\'. Для поиска 18+ (толком не отличается от обычного) после категории напишите \'18+\'. Например: \'!найти анек 18+\'')
			return response.end()
		}
		if (queryArguments[2] && queryArguments[2].in(['18+', '+', '18', '81+'])) type += 10
		commands.search(response, type)
	}
	else if (queryArguments[0] == 'choice'){
		options = queryArguments[1].split('+')
		if (options.length < 2) response.write('Количество вариантов должно быть больше одного. Варианты указываются после команды через пробел.')
		else response.write(options.choiceOne())
		response.end()
	}
	else if (queryArguments[0] == 'rpg'){
		type = queryArguments[1].toLowerCase()
		
		if (type.in(['персонаж','персонажи','перс','герой']))
			response.write(texts.characters.choiceOne())
			
		else if (type.in(['событие','соба','ивент']))
			response.write(texts.events.choiceOne())
			
		else if (type.in(['гачи','gachi']))
			response.write(texts.gachi.choiceOne())
			
		else response.write(' Добро пожаловать в наш волшебный мир! Хочешь поучаствовать и узнать больше информации? Выбери категорию: персонаж (чтобы узнать, кто ты по жизни), событие (что происходит вокруг твоего персонажа). Например "!rpg персонаж"')
		response.end()
	}
	else if (queryArguments[0] == 'eval'){
		if (queryArguments[1].length > 0)
			try {
				command = queryArguments[1]
				command = command.replace(/\+\-\+/g,'м').replace(/\-\+/g,'м').replace(/\+\-/g,'м').replace(/\-/g,'м')
				command = command.replace(/\+\*\*\+/g,'с').replace(/\*\*\+/g,'с').replace(/\+\*\*/g,'с').replace(/\*\*/g,'с')
				command = command.replace(/\+\*\+/g,'у').replace(/\*\+/g,'у').replace(/\+\*/g,'у').replace(/\*/g,'у')
				command = command.replace(/\+\/\+/g,'д').replace(/\/\+/g,'д').replace(/\+\//g,'д').replace(/\//g,'д')
				command = command.replace(/\+\+\+/g,'+').replace(/\+\+/g,'+')
				command = command.replace(/м/g,'-').replace(/у/g,'*').replace(/с/g,'**').replace(/д/g,'/')
				response.write(eval(command).toString().replace('true','').replace('false',''))
			}
			catch (error) {
				response.write(` Ошибка: ${error}`)
			}
		else
			response.write(' Введите аргументы.')
		response.end()
	}
	else {
		response.write(' Проверьте правильность настройки команды.')
		response.end()
	}
})
PORT = process.env.PORT || 3000
server.listen(PORT)
console.log('Server started on port: '+PORT)
