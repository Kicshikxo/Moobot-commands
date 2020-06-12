const http = require('http'),
	  url  = require('url'),
	  mongo = require("mongodb"),
	  texts = require('./texts.js'),
	  commands = require('./commands.js')

function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
Array.prototype.choiceOne = function(){return this[randInt(0, this.length-1)]}

const server = http.createServer(function(request, response) {
	response.writeHeader(200, {"Content-Type": "application/json"})
	
	pathname = url.parse(request.url).pathname
	
	arguments = pathname.split('/')
	arguments.shift()
	arguments = arguments.map(function(element){
		if (parseInt(element) == element || parseFloat(element) == element) return element
		else return url.domainToUnicode(element)
	})
	
	if (arguments[0] == 'mine'){
		name   = arguments[1]
		action = arguments[2].toLowerCase()
		mongo.MongoClient('\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x4B\x69\x63\x73\x68\x69\x6B\x78\x6F\x3A\x75\x61\x33\x77\x69\x6B\x71\x77\x65\x40\x63\x6C\x75\x73\x74\x65\x72\x30\x2D\x38\x68\x75\x6D\x79\x2E\x67\x63\x70\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x6D\x6F\x6F\x62\x6F\x74').connect(
			async function(error, client){
			
			if (error) {
				response.write(' Ошибка подключения к серверу. Ошибка: '+error)
				return response.end()
			}
			
			const collection = client.db("Moobot").collection("mine")
			data = await commands.receiveData(collection)
			
			if ((function(){for (_ of data){if (_.name == name) return user = _}})()){
				if (['инфо','инфа','info','infa'].indexOf(action) != -1) 
					commands.info(response, collection, user)
					
				else if (['инвентарь','инвент','сумка','рюкзак','inventory','inv'].indexOf(action) != -1) 
					commands.inventory(response, collection, user)
					
				else if (['копать','батрачить','dig'].indexOf(action) != -1) 
					await commands.dig(response, collection, user)
					
				else if (['данж','подземелье','dungeon','dunge'].indexOf(action) != -1) 
					await commands.dungeon(response, collection, user)
					
				else if (['продать','сбагрить','sell'].indexOf(action) != -1) 
					await commands.sell(response, collection, user)
					
				else if (['улучшить','купить','прокачать','upgrade','up','buy'].indexOf(action) != -1) 
					await commands.upgrade(response, collection, user)
					
				else if (['пользователи','игроки','люди','users','players'].indexOf(action) != -1) 
					commands.users(response, data)
					
				else if (['удалиться','delete','remove'].indexOf(action) != -1) 
					await commands.remove(response, collection, user)
					
				else if (['передать','перевод','подарить','подарок','give'].indexOf(action) != -1) 
					await commands.give(response, collection, user)
					
				else response.write("Доступные команды для бота: 'инфо', 'пользователи', 'копать', 'данж', 'инвентарь', 'продать', 'улучшить', 'передать', 'удалиться'")
			}
			else await commands.create(response, collection, name)
			response.end()
			client.close()
		})
	}
	else if (arguments[0] == 'ask') {
		response.write(['Да', 'Нет'].choiceOne())
		response.end()
	}
	else if (arguments[0] == 'search') {
		query = arguments[1].toLowerCase()
		type = 0
		if (['анек', 'анекдот', 'анекдоты', 'joke', 'шутка', 'шутку'].indexOf(query) != -1) type = 1
		else if (['рассказ', 'рассказы', 'сказ'].indexOf(query) != -1) type = 2
		else if (['стих', 'стишок', 'стихи', 'стишки'].indexOf(query) != -1) type = 3
		else if (['афоризмы', 'афоризма', 'афоризму'].indexOf(query) != -1) type = 4
		else if (['цитата', 'цитаты', 'цитату'].indexOf(query) != -1) type = 5
		else if (['тост', 'тосты'].indexOf(query) != -1) type = 6
		else if (['статус', 'статусы'].indexOf(query) != -1) type = 8
		if (type == 0){
			response.write(' Доступные категории для поиска: \'анекдот\', \'рассказ\', \'стих\', \'афоризма\', \'цитата\', \'тост\', \'статус\'. Для поиска 18+ (толком не отличается от обычного) после категории напишите \'18+\'. Например: \'!найти анек 18+\'')
			return response.end()
		}
		if (['18+', '+', '18', '81+'].indexOf(pathname.split('/')[3]) != -1) type += 10
		commands.search(response, type)
	}
	else if (arguments[0] == 'choice'){
		options = arguments[1].split('+')
		if (options.length < 2) response.write('Количество вариантов должно быть больше одного. Варианты указываются после команды через пробел.')
		else response.write(options.choiceOne())
		response.end()
	}
	else if (arguments[0] == 'rpg'){
		type = arguments[1].toLowerCase()
		if (['персонаж','персонажи','перс','герой'].indexOf(type) != -1)
			response.write(texts.characters.choiceOne())
		else if (['событие','соба','ивент'].indexOf(type) != -1)
			response.write(texts.events.choiceOne())
		else if (['гачи','gachi'].indexOf(type) != -1)
			response.write(texts.gachi.choiceOne())
		else response.write(' Добро пожаловать в наш волшебный мир! Хочешь поучаствовать и узнать больше информации? Выбери категорию: персонаж (чтобы узнать, кто ты по жизни), событие (что происходит вокруг твоего персонажа). Например "!rpg персонаж"')
		response.end()
	}
	else {
		response.write('Проверьте правильность настройки команды.')
		response.end()
	}
})
PORT = process.env.PORT || 3000
server.listen(PORT)
console.log('Server started on port: '+PORT)
