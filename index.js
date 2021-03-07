const http = require('http'),
	  url  = require('url'),
	  mongo = require("mongodb"),
	  deepai = require('deepai'),
	  requestify = require('requestify'),
	  translate = require('translate'),
	  
	  texts = require('./texts.js'),
	  commands = require('./commands.js')

function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
Array.prototype.choiceOne = function(){return this[randInt(0, this.length-1)]}
String.prototype.in = function(arr){return arr.indexOf(this.toString()) != -1}
translate.engine = 'libre'

const server = http.createServer(function(request, response) {
	response.writeHeader(200, {"Content-Type": "application/json"})
	
	pathname = url.parse(request.url).pathname
	
	queryArguments = decodeURIComponent(pathname.replace(/\?/g, '%3F')).replace(/%3F/g, '?').split('/').slice(1).concat([''])
	
	if (queryArguments[0] == 'mine'){
		name   = queryArguments[1]
		action = queryArguments[2].toLowerCase()
		mongo.MongoClient('\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x4B\x69\x63\x73\x68\x69\x6B\x78\x6F\x3A\x75\x61\x33\x77\x69\x6B\x71\x77\x65\x40\x63\x6C\x75\x73\x74\x65\x72\x30\x2D\x38\x68\x75\x6D\x79\x2E\x67\x63\x70\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x6D\x6F\x6F\x62\x6F\x74', {useUnifiedTopology: true}).connect(
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
		answer = sha256(queryArguments[2]+question).replace(/[^\d]/g, '').split('').map(parseFloat).reduce((a, b) => a + b) % 2 == 0
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
	else if (queryArguments[0] == 'deepai'){
		if (queryArguments[1] == '') return response.end(' Введите текст для преобразования его в картинку.')
			
		else if (queryArguments[1] == '--raw-link') {
			var raw = true
			queryArguments.shift()
		}
		
		deepai.setApiKey('06ebd50a-42aa-402e-b6c3-7f3257e92553');
		(async function() {
			var resp = await deepai.callStandardApi("text2img", {
				text: queryArguments[1].replace(/\+/g,' ').trim()
			})
			if (!raw){
				requestify.get(`https://clck.ru/--?url=${resp.output_url}`)
					.then(function(res){
						return response.end(` Картинка из текста "${queryArguments[1].replace(/\+/g,' ').trim()}": ${res.getBody()}`)
					}
				)
			}
			else return response.end(` Картинка из текста "${queryArguments[1].replace(/\+/g,' ').trim()}": ${resp.output_url}`)
		})()
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
		from = (query.shift() || '').toLowerCase()
		to = (query.shift() || '').toLowerCase()

		text = decodeURIComponent(query.join(' '))
		
		//langsList = ['aa','ab','ae','af','ak','am','an','ar','as','av','ay','az','ba','be','bg','bh','bi','bm','bn','bo','br','bs','ca','ce','ch','co','cr','cs','cu','cv','cy','da','de','dv','dz','ee','el','en','eo','es','et','eu','fa','ff','fi','fj','fo','fr','fy','ga','gd','gl','gn','gu','gv','ha','he','hi','ho','hr','ht','hu','hy','hz','ia','id','ie','ig','ii','ik','io','is','it','iu','ja','jv','ka','kg','ki','kj','kk','kl','km','kn','ko','kr','ks','ku','kv','kw','ky','la','lb','lg','li','ln','lo','lt','lu','lv','mg','mh','mi','mk','ml','mn','mr','ms','mt','my','na','nb','nd','ne','ng','nl','nn','no','nr','nv','ny','oc','oj','om','or','os','pa','pi','pl','ps','pt','qu','rm','rn','ro','ru','rw','sa','sc','sd','se','sg','si','sk','sl','sm','sn','so','sq','sr','ss','st','su','sv','sw','ta','te','tg','th','ti','tk','tl','tn','to','tr','ts','tt','tw','ty','ug','uk','ur','uz','ve','vi','vo','wa','wo','xh','yi','yo','za','zh','zu']
		
		langsList = ['en','ru','ar','zh','fr','de','it','pt','es']
		
		if (!from.in(langsList) || !to.in(langsList)){
			response.write(` Доступные языки для перевода: 'en' (Английский), 'ru' (Русский), 'ar' (Арабский), 'zh' (Китайский), 'de' (Немецкий), 'it' (Итальянский), 'fr' (Французский), 'pt' (Португальский), 'es' (Испанский). Сначала вводится оригинальный язык перевода, а после желаемый. Примеры: '!transl ru en Привет', '!transl en ru Hello'`)
			return response.end()
		}
		
		async function transl(text, from, to){
			try {
				result = await translate(text || '', {from: from, to: to})
			}
			catch(e) {
				return response.end(`Ошибка перевода. Ошибка: ${e}`)
			}
			return response.end(result) 
		}
		
		transl(text, from, to)
		
		//APIUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20180315T152328Z.ac1fea9447bfc10e.2fc4303594266a5551f3346c55fb58a5f796e977&text=${text}&lang=${lang}`
		
// 		XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
// 		xhr = new XMLHttpRequest()
// 		
// 		xhr.onreadystatechange = function(){
// 			if (this.readyState == 4) {
// 				result = JSON.parse(this.responseText)
// 				if (result.code == 200) response.write(result.text[0])
// 				else response.write(` Ошибка перевода. Ошибка: ${result.code} ${result.message}`)
// 			}
// 		}
// 		
// 		xhr.open('GET', APIUrl, false)
// 		xhr.send()
// 		
// 		response.end()
	}
	else if (queryArguments[0] == 'eval'){
		try {
			async function calc(){
				if (queryArguments[1]) {
					try {
						command = queryArguments.slice(1, -1).join('/').replace(/new\+/g,'new ').replace(/return\+/g,'return ').replace(/\+of\+/g,' of ').replace(/\+in\+/g,' in ')
						command = command.replace(/\+\-\+/g,'-').replace(/\-\+/g,'-').replace(/\+\-/g,'-')
						command = command.replace(/\+\*\*\+/g,'**').replace(/\*\*\+/g,'**').replace(/\+\*\*/g,'**')
						command = command.replace(/\+\^\+/g,'**').replace(/\^\+/g,'**').replace(/\+\^/g,'**').replace(/\^/g,'**')
						command = command.replace(/\+\*\+/g,'*').replace(/\*\+/g,'*').replace(/\+\*/g,'*')
						command = command.replace(/\+\/\+/g,'/').replace(/\/\+/g,'/').replace(/\+\//g,'/')
						command = command.replace(/\+\+\+/g,'+').replace(/\+\+/g,'+')
						
						result = await eval(command)
						response.write(JSON.stringify(result || "").replace(/^\"+|\"+$/g, '').replace(/true/g,''))
						response.end()
					}
					catch (error){
						response.write(` Ошибка: ${error.toString().split(' ').slice(1).join(' ')}`)
						response.end()
					}
				}
				else {
					response.write(` Введите пример. Например '!calc 2+2' или '!calc 123 **3 - 123456/ 2'`)
					response.end()
				}
			}
			calc()
		}
		catch {response.end()}
	}
	else if (queryArguments[0] == 'dj'){
		
		channelID = 82615
		channelAPI = '9PTj5Jpmrci1GyeHSlIFsDQhfVzqN7dW'
		
		allowedNames = ['aloinfait','vichuxa']
		
		if (queryArguments[1].toLowerCase().in(['skip', 'скип', 'далее', 'пропуск'])){
			async function skipSound(){
				result = JSON.parse((await requestify.get(`https://streamdj.ru/api/request_skip/${channelID}/${channelAPI}`)).body)
				if (result.error)
					response.end(`Ошибка: ${result.error}`)
				else if (result.success == '1')
					response.end(`Трек пропущен`)
				else if (result.success == '0')
					response.end(`Список треков пуст :(`)
				else 
					response.end(`Неизвестный ответ сервера`)
			}
			if (queryArguments[2].in(allowedNames))
				skipSound()
			else 
				response.end('У вас нет прав на пропуск трека')
		}
		else if (queryArguments[1].toLowerCase().in(['current', 'now', 'track', 'название', 'имя', 'песня', 'трек', 'текущий', 'текущее'])){
			async function getCurrentSound(){
				result = JSON.parse((await requestify.get(`https://streamdj.ru/api/get_track/${channelID}`)).body)
				if (result == null)
					response.end('Текущий трек не найден')
				else 
					response.end(`Текущий трек: ${result.title}, прислал - ${result.author}. Ссылка: https://www.youtube.com/watch?v=${result.yid}`)
			}
			getCurrentSound()
		}
		else if (queryArguments[1].toLowerCase().in(['list', 'список', 'лист'])){
			async function getSoundsList(){
				result = JSON.parse((await requestify.get(`https://streamdj.ru/api/playlist/${channelID}/c`)).body)
				if (result == false)
					response.end('Список треков пуст :(')
				else {
					let list = `Количество треков: ${Object.keys(result).length}. `
					for (i in result){
						list += `${i}\x20-\x20${result[i].title};\x20`
					}
					response.end(list)
				}
			}
			getSoundsList()
		}
		else
			response.end('Предложи свою песенку для стрима: https://streamdj.ru/c/Vichuxa')
	}
	else if (queryArguments[0] == 'repeat'){
		if (queryArguments[1])
			response.end(queryArguments[1].replace(/\+/g,' '))
		else
			response.end('Введите текст для повторения.')
	}
	else {
		response.write(' Проверьте правильность настройки команды.')
		response.end()
	}
})
PORT = process.env.PORT || 3000
server.listen(PORT)
console.log('Server started on port: '+PORT)
