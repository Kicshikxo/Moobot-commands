const http = require('http'),
	config = require('./config.js')

commands = {
	receiveData: function(collection){
		return new Promise(function(resolve, reject){
			collection.find({}, { projection: { _id: 0}}).toArray(function(error, result){
				resolve(result)
			})
		})
	},
	info: function(response, collection, user){
		if (queryArguments[3]){
			requestedUser = queryArguments[3].replace('@','').toLowerCase()
			for (i of data){if (i.name == requestedUser) user = i}
		}
		occupiedSpace = 0
		for (i of user.inventory) occupiedSpace += i.quantity
		response.write(` Имя: ${user.name}, Баланс: ${user.money}, Рюкзак: ${occupiedSpace}/${user.backpackSize}, Уровень кирки: ${user.pickaxeLevel}, ${(user.swordLevel > 0) ? `Уровень меча: ${user.swordLevel}` : 'Меча нет'}.`)
	},
	inventory: function(response, collection, user){
		if (user.inventory.length < 1){
			response.write(' В вашем рюкзаке ничего нет, \'!mine копать\' для добычи.')
			return response.end()
		}

		total = 0
		for (item of user.inventory) total += item.price * item.quantity
		for (item of user.inventory) response.write(`${item.type} (${(item.quantity > 1) ? `${item.quantity}×` : ''}${item.price}$), `)
		
		occupiedSpace = 0
		for (item of user.inventory) occupiedSpace += item.quantity
		response.write(` Всего: ${total}$, Место: ${occupiedSpace}/${user.backpackSize}.`)
	},
	dig: function(response, collection, user){return new Promise(function(resolve, reject){
		if ((function(){
			occupiedSpace = 0
			for (i of user.inventory) occupiedSpace += i.quantity
			return occupiedSpace
		})() >= user.backpackSize){
			response.write(' Рюкзак переполнен.')
			return resolve()
		}
		if (user.pickaxeLevel == 1) options = config.pickaxeLevel1
		else if (user.pickaxeLevel == 2) options = config.pickaxeLevel2
		else if (user.pickaxeLevel == 3) options = config.pickaxeLevel3
		else if (user.pickaxeLevel == 4) options = config.pickaxeLevel4
		else if (user.pickaxeLevel == 5) options = config.pickaxeLevel5
		for (sum = options[0].chance, choice = 0, rand = ~~(Math.random() * 1000); sum <= rand; sum += options[choice].chance) choice++
		occupiedSpace = 0
		for (i of user.inventory) occupiedSpace += i.quantity
		response.write(` ${options[choice].comment}, Рюкзак: ${occupiedSpace+1}/${user.backpackSize}.`)
		
		if ((function(){
			for (i of user.inventory){
				if (i.type == options[choice].type) return true
			}
		})()){
			for (i of user.inventory){
				if (i.type == options[choice].type){
					i.quantity++
				}
			}
		}
		else 
			user.inventory.push({
			type: options[choice].type,
			quantity: 1,
			price: options[choice].price
		})
			
		user.inventory.sort(function(a, b){return b.price - a.price})
			
		collection.updateOne({name: user.name},{$set: {inventory: user.inventory}}, function(error, result){
			if(error) response.write(` Ошибка с добавлением в инвентарь. Ошибка: ${error}`)
			resolve()
		})
	})},
	dungeon: function(response, collection, user){return new Promise(function(resolve, reject){
		if (user.swordLevel < 1){
			response.write(' Для похода в подземелье вам необходим меч. \'!mine купить меч\' для покупки.')
			return resolve()
		}
		if (user.swordLevel == 1) options = config.dungeonEventsLevel1
		else if (user.swordLevel == 2) options = config.dungeonEventsLevel2
		else if (user.swordLevel == 3) options = config.dungeonEventsLevel3
		for (sum = options[0].chance, choice = 0, rand = ~~(Math.random() * 1000); sum <= rand; sum += options[choice].chance) choice++
		response.write(options[choice].text)
		if (options[choice].money){
			if (options[choice].good){
				if (user.money >= Math.abs(options[choice].money)) 
					collection.updateOne(user,{$set: {money: Math.max(0, user.money+options[choice].money)}}, function(error, result){
						if(error) response.write(` Ошибка с пересчётом денег. Ошибка: ${error}`)
						else response.write(options[choice].good)
						resolve()
				})
				else collection.deleteOne(user, function(error, obj){
					if(error) response.write(` Ошибка удаления аккаунта. Ошибка: ${error}`)
					else response.write(options[choice].bad)
					resolve()
				})
			}
			else collection.updateOne(user,{$set: {money: Math.max(0, user.money+options[choice].money)}}, function(error, result){
				if(error) response.write(` Ошибка с пересчётом денег. Ошибка: ${error}`)
				else if (options[choice].good) response.write(options[choice].good)
				resolve()
			})
		}
		else if (options[choice].kill == true) collection.deleteOne(user, function(error, obj){
			if(error) response.write(` Ошибка удаления аккаунта. Ошибка: ${error}`)
			resolve()
		})
		else resolve()
	})},
	sell: function(response, collection, user){return new Promise(function(resolve, reject){
		total = 0
		for (i of user.inventory) total += i.price * i.quantity
		if (total > 0){
			collection.updateOne(user,{$set: {money: user.money+total,inventory: []}}, function(error, result){
				if(error) response.write(' Ошибка с продажей. Ошибка: '+error)
				else response.write(` Вы продали свои ресурсы за ${total}$, текущий баланс: ${parseInt(total + user.money)}$`)
				resolve()
			})
		}
		else {
			response.write(' Вам нечего продавать, \'!mine копать\' для добычи.')
			resolve()
		}
	})},
	upgrade: function(response, collection, user){return new Promise(function(resolve, reject){
		upgradingItem = (queryArguments[3] || '').toLowerCase()
		if (upgradingItem.in(['рюкзак','сумка','сумку','инвентарь','inventory','inv'])){
			
			if (user.backpackSize == 50){
				response.write(' У вас максимальный уровень рюкзака.')
				return resolve()
			}
			else {
				newBackpackSize = config.backpackSizes[user.backpackSize]
				price = config.backpackPrices[user.backpackSize]
			}
			
			if (user.money >= price){
				collection.updateOne(user,{$set: {money: user.money - price, backpackSize: newBackpackSize}}, function(error, result){
					if(error) response.write(` Ошибка улучшения рюкзака. Ошибка: ${error}`)
					else response.write(` Вместимость рюкзака увеличена до ${newBackpackSize} за ${price}$, оставшиеся деньги: ${user.money - price}.`)
					resolve()
				})
			}
			else {
				response.write(` Для увеличения места в рюкзаке до ${newBackpackSize} требуется ${price}$.`)
				resolve()
			}
		}
		else if (upgradingItem.in(['кирка','кирку','инструмент','pickaxe','pick'])){
			
			if (user.pickaxeLevel == 5){
				response.write(' У вас максимальный уровень кирки.')
				return resolve()
			}
			else price = config.pickaxePrices[user.pickaxeLevel]
				
			if (user.money >= price){
				collection.updateOne(user,{$set: {money: user.money - price, pickaxeLevel: user.pickaxeLevel + 1}}, function(error, result){
					if(error) response.write(` Ошибка улучшения кирки. Ошибка: ${error}`)
					else response.write(` Уровень кирки увеличен до ${user.pickaxeLevel+1} уровня за ${price}$, оставшиеся деньги: ${user.money-price}$.`)
					resolve()
				})
			}
			else {
				response.write(` Для увеличения уровня кирки до ${user.pickaxeLevel+1} требуется ${price}$.`)
				resolve()
			}
		}
		else if (upgradingItem.in(['меч','оружие','данж','sword','sw'])){
			
			if (user.swordLevel == 3){
				response.write(' У вас максимальный уровень меча.')
				return resolve()
			}
			else price = config.swordPrices[user.swordLevel]
				
			if (user.money >= price){
				collection.updateOne(user,{$set: {money: user.money - price, swordLevel: user.swordLevel + 1}}, function(error, result){
					if(error) response.write(` Ошибка улучшения меча. Ошибка: ${error}`)
					else response.write(` Уровень меча увеличен до ${user.swordLevel+1} уровня за ${price}$, оставшиеся деньги: ${user.money-price}$.`)
					resolve()
				})
			}
			else {
				response.write(` Для увленичения уровня меча до ${user.swordLevel+1} уровня требуется ${price}$.`)
				resolve()
			}
		}
		else {
			response.write(` Команда '!mine улучшить' имеет структуру: '!mine улучшить (рюкзак/кирку/меч)'. ${(user.backpackSize != 15) ? `Для увеличения рюкзака до ${config.backpackSizes[user.backpackSize]} необходимо ${config.backpackPrices[user.backpackSize]}$` : 'У вас максимальный уровень рюкзака'}. ${(user.pickaxeLevel != 5) ? `Для улучшение кирки до ${user.pickaxeLevel+1} уровня необходимо ${config.pickaxePrices[user.pickaxeLevel]}$` : 'У вас максимальный уровень кирки'}. ${(user.swordLevel != 3) ? `Для улучшения меча до ${user.swordLevel+1} уровня необходимо ${config.swordPrices[user.swordLevel]}` : 'У вас максимальный уровень меча'}.`)
			resolve()
		}
	})},
	give: function(response, collection, user){return new Promise(function(resolve, reject){
		recipient = queryArguments[3].replace('@','').toLowerCase()
		value = Math.abs(parseInt(queryArguments[4]))
		
		if (!recipient || !value){
			response.write(' Команда \'!mine передать\' имеет структуру: \'!mine передать {пользователь} {сумма}\'.')
			return resolve()
		}
		
		if (user.name == recipient){
			response.write(' Нельзя передавать деньги себе.')
			return resolve()
		}
		
		if ((function(){for (_ of data){if (_.name == recipient)return recipientGold = _.money}})()){
			if (user.money >= value){
				collection.updateOne({name: recipient},{$set: {money: recipientGold+value}}, function(error, result){
					if(error) {
						response.write( `Ошибка с передачей денег. Ошибка: ${error}`)
						return resolve()
					}
					else response.write(` Вы отдали @${recipient} ${value}$, текущий баланс: ${user.money-value}$`)
				})
				collection.updateOne(user,{$set: {money: user.money-value}}, function(error, result){
					if(error) response.write(` Ошибка с пересчётом баланса. Ошибка: ${error}`)
					return resolve()
				})
			}
			else {
				response.write(' У вас недостаточно средств для перевода.')
				resolve()
			}
		}
		else {
			response.write(` Пользователь ${recipient} не зарегистрирован.`)
			resolve()
		}
	})},
	users: function(response, data){
		response.write(' Зарегистрированные пользователи: ')
		data.sort(function(a,b){return b.money-a.money})
		for (let user of data) response.write(user.name.replace(/\b\w/g, l => l.toUpperCase()) + `(${user.money}$) `)
	},
	create: function(response, collection, name){return new Promise(function(resolve, reject){
		collection.insertOne({name: name, money: 0, inventory: [], backpackSize: 3, pickaxeLevel: 1, swordLevel: 0}, function(error, result){
			if(error) response.write(` Ошибка создания аккаунта. Ошибка: ${error}`)
			else response.write(' Аккаунт создан, теперь вы можете пользоваться командами бота.')
			resolve()
		})
	})},
	remove: function(response, collection, user){return new Promise(function(resolve, reject){
		collection.deleteOne(user, function(error, obj){
			if(error) response.write(` Ошибка удаления аккаунта. Ошибка: ${error}`)
			else response.write(" Аккаунт удалён, введите любое сообщение с '!mine' чтобы создать новый.")
			resolve()
		})
	})},
	search: function(response, type){
		http.get({host: 'rzhunemogu.ru', port: 80, path: '/RandJSON.aspx?CType='+type, method: 'GET', encoding: 'binary'}, function(res){
			res.on('data', function(body){
				result = require('iconv').Iconv('windows-1251', 'utf8').convert(new Buffer(body, 'binary')).toString().slice(12, -2)
				if (result.length <= 400) {
					response.write(result)
					response.end()
				}
				else commands.search(response, type)
			})
		})
	}
} 
module.exports = commands
