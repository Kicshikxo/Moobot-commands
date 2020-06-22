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
	
	queryArguments = decodeURIComponent(pathname).split('/').slice(1).concat([''])
	
	if (queryArguments[0] == 'mine'){
		name   = queryArguments[1]
		action = queryArguments[2].toLowerCase()
		mongo.MongoClient('\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x4B\x69\x63\x73\x68\x69\x6B\x78\x6F\x3A\x75\x61\x33\x77\x69\x6B\x71\x77\x65\x40\x63\x6C\x75\x73\x74\x65\x72\x30\x2D\x38\x68\x75\x6D\x79\x2E\x67\x63\x70\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x6D\x6F\x6F\x62\x6F\x74').connect(
			async function(error, client){
			
			if (error) {
				response.write(` Ошибка подключения к базе данных. Ошибка: ${error}`)
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
	else if (queryArguments[0] == 'ask'){
		if (!queryArguments[1]){
			response.write(' Введите вопрос после команды.')
			response.end()
		}
		sha256 = require('sha256')
		
		question = queryArguments[1].replace(/\+/g, ' ').toLowerCase()
		answer = sha256(question).replace(/[^\d]/g, '').split('').map(parseFloat).reduce((a, b) => a + b) % 2 == 0
		response.write(` Ответ на вопрос ${question} - ${(answer) ? 'Да' : 'Нет'}`)
		response.end()
	}
	else if (queryArguments[0] == 'search'){
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
		if (options.length < 2) response.write(' Количество вариантов должно быть больше одного. Варианты указываются после команды через пробел.')
		else response.write(options.choiceOne())
		response.end()
	}
	else if (queryArguments[0] == 'hug'){
		if (!queryArguments[2]){
			return response.end(', Введите имя пользователя которого хотите обнять.')
		}
		response.end(`обнимает ${queryArguments[2].replace(/@/g,'')} <3 `)
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
	else if (queryArguments[0] == 'base64'){
		base64 = require('nodejs-base64')
		query = queryArguments[1].split('+')
		type = query.shift()
		if (type.in(['encode']) && query.length > 0){
			response.write(base64.base64encode(query.join(' ')))
		}
		else if (type.in(['decode']) && query.length > 0){
			response.write(base64.base64decode(queryArguments.slice(1).join('/').slice(7, -1)))
		}
		else response.write(` Введите действие. Доступные варианты 'decode' 'encode'. Например '!base64 encode Всем привет' или '!base64 decode 0JLRgdC10Lwg0L/RgNC40LLQtdGC'`)
		response.end()
	}
	else if (queryArguments[0] == 'translate'){
		query = queryArguments[1].split('+')
		lang = query.shift()

		text = encodeURIComponent(query.join(' '))
		
		if (!lang.in(['en', 'ru', 'uk', 'tt', 'de', 'fr'])){
			response.write(` Доступные языки для перевода: 'en' (Английский), 'ru' (Русский), 'uk' (Украинский), 'tt' (Татарский), 'de' (Немецкий), 'fr' (Французский). Язык ввода определяется автоматически. Примеры: '!transl en Привет', '!transl ru Hello'`)
			return response.end()
		}
		
		APIUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20180315T152328Z.ac1fea9447bfc10e.2fc4303594266a5551f3346c55fb58a5f796e977&text=${text}&lang=${lang}`
		
		XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
		xhr = new XMLHttpRequest()
		
		xhr.onreadystatechange = function(){
			if (this.readyState == 4) {
				result = JSON.parse(this.responseText)
				if (result.code == 200) response.write(result.text[0])
				else response.write(` Ошибка перевода. Ошибка: ${result.code} ${result.message}`)
			}
		}
		
		xhr.open('GET', APIUrl, false)
		xhr.send()
		
		response.end()
	}
	else if (queryArguments[0] == 'eval'){
		try {
			if (queryArguments[1])
				try {
					command = queryArguments[1].replace(/new\+/g,'new ')
					command = command.replace(/\+\-\+/g,'-').replace(/\-\+/g,'-').replace(/\+\-/g,'-').replace(/\-/g,'-')
					command = command.replace(/\+\*\*\+/g,'**').replace(/\*\*\+/g,'**').replace(/\+\*\*/g,'**')
					command = command.replace(/\+\^\+/g,'**').replace(/\^\+/g,'**').replace(/\+\^/g,'**').replace(/\^/g,'**')
					command = command.replace(/\+\*\+/g,'*').replace(/\*\+/g,'*').replace(/\+\*/g,'*').replace(/\*/g,'*')
					command = command.replace(/\+\/\+/g,'/').replace(/\/\+/g,'/').replace(/\+\//g,'/').replace(/\//g,'/')
					command = command.replace(/\+\+\+/g,'+').replace(/\+\+/g,'+')
					response.write(JSON.stringify(eval(command)).replace(/true/g,''))
				}
				catch (error){
					response.write(` Ошибка: ${error.toString().split(' ').slice(1).join(' ')}`)
					response.end()
			}
			else response.write(` Введите пример. Например '!calc 2+2' или '!calc 123 **3 - 123456/ 2'`)
			response.end()
		}
		catch {response.end()}
	}
	else {
		response.write(' Проверьте правильность настройки команды.')
		response.end()
	}
})
PORT = process.env.PORT || 3000
server.listen(PORT)
console.log('Server started on port: '+PORT)
