const http = require('http'),
	  url  = require('url'),
	  PORT = process.env.PORT || 3000
const MongoClient = require("mongodb").MongoClient;
   
const mongoUrl = "\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x4B\x69\x63\x73\x68\x69\x6B\x78\x6F\x3A\x75\x61\x33\x77\x69\x6B\x71\x77\x65\x40\x63\x6C\x75\x73\x74\x65\x72\x30\x2D\x38\x68\x75\x6D\x79\x2E\x67\x63\x70\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x6D\x6F\x6F\x62\x6F\x74"
	  
function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}
Array.prototype.choiceOne = function(){return this[randInt(0, this.length-1)]}
characters = [
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
	'Я сделаю всё что угодно, чтобы заполучить что-то редкое или очень ценное.'
]
events = [
	'Персонажи видят объявление, написанное детским почерком, в котором говорится о том, что потерялся морской котик, и за его нахождение готовы заплатить 2 медяка.',
	'Местный художник пытается продать эскизы нескольких своих картин, так же он предлагает прохожим нарисовать их портрет углем всего за 5 серебрянных.',
	'Прибой выносит к берегу мертвеца.',
	'После пары бокалов вам на миг показалось, что у всех посетителей таверны одно лицо. Да ну, бред какой-то. Очевидно, это все вино.',
	'В этой деревне есть традиция устраивать шуточный суд для любого, кто прожил в браке не менее семи лет. Есть супруги под присягой торжественно поклянется, что никогда не ссорились друг с другом, то они получают шмат бекона или еще что-то из закромов родины.',
	'Когда отречется король от своей короны, кровь обычного человека воспрянет подобно новому солнцу.',
	'Группа деревенских ребятишек, устроившая шуточное побоище, вооружившись палками, и соорудив доспехи из старых кастрюль и прочего старья. Если группа проявляет дружелюбие, дети могут указать направление к ближайшей деревне (или к месту, которое ищут персонажи).',
	'Все горные вершины покрыты снегом. Все кроме одной. Необычная гора - это спящий вулкан, который стал домом для морского народа.',
	'Странствующие бард и волшебник-иллюзионист устраивают представление, в ходе которого оживает (фигурально выражаясь) древняя легенда.',
	'Вялая мышь крутится под ногами и делает всё, чтобы её раздавили.',
	'Сильнейшая звездная вспышка ввела из строя важные узлы корабля. Необходимо приземлиться на ближайшую планету до того, как полученная доза радиации убьет весь экипаж, и починить корабль. Само собой ближайшей оказалась планета весьма удаленная от основных торговых путей.',
	'С лотка пробаются восхитительно-пахнужие пирожки с мясом. Всякая попытка ужнать о происхождении начинки встречается милой и понимающей улыбкой продавщицы.',
	'Поток горячей воды вдруг вырывается из-под земли и насмерть обваривает двух ремесленников, трудящихся на крупным заказом от короны.',
	'Сирены. Массивная металлическая штука… гуманоид… выскакивает прямо перед тобой.',
	'Порт украшают праздничными гирляндами из рыбьих костей. Какие-то хулиганы каждую ночь обрывают одну из них.',
	'В этот праздник на порогах домов выставляют выдолбленные овощи, на которых вырезаны странные, жуткие и забавные лица. Внутрь овощей помещают зажженные свечи. Говорят, это отпугивает злых духов.',
	'Практически недвижимая гладь воды усеяна большими листьями кувшинок, выглядящими достаточно большими, чтобы на них можно было спокойно наступить.',
	'Это мэр Тилкинс из колонии на Райан 4 всем, кто нас слышит. Мы находимся в блокаде 18 месяцев, у нас заканчиваются еда и прочие припасы, мы отчаянно нуждаемся в помощи!',
	'Из-за магической катастрофы, произошедшей в этих местах много сотен лет назад, горы все еще излучают элементальную энергию. Здесь частенько можно столкнуться с случаями спонтанного самовозгорания и с элементалями.',
	'Несколько крыс прибито за хвост к стенке тележки, у которой стоит потрепанного вида мужик. При вашем приближении, он кричит: "Крыса на палочке - 1 медяк, очень питательно!"',
	'Большая толпа не дает увидеть, что именно продается в этом лотке. Продавец окружен рассерженными людьми, требующими вернуть им деньги за испорченный товар. Похоже, в любой момент может начаться мордобой.',
	'Местные соревнуются в том, кто состроит самую страшную рожу. А победителю следует обойти все поселение по кругу, своим страшным видом отгоняя злых духов.',
	'Одетый в разномастное тряпье человек подбирает мусор, разбросанный по улице. Он ворошит разнокалиберные обломки и обрывки длинной палкой, выискивая что-нибудь на продажу.',
	'Деревенские мастерят простенькие хлопушки и трещотки и ходят от дома к дому, галдят, запускают ракеты. Считается, что те, чья совесть запятнана неблаговидными поступками устрашатся шума и покаятся.',
	'Человек, чья одежда выглядит значительно респектабельнее, чем окружение, продает темно-лиловый порошок, который, по его утверждениям, увеличивает магические способности. Незнакомец даже готов предоставить персонажам бесплатный образец, так как они ему понравились.',
	'Через пару минут после того, как партия зашла в таверну, они могут услышать звуки приближающейся грозы. Чем дольше партия находится в таверне, тем сильнее и ближе бушует шторм. А через 45 минут в стену таверны врезается дерево.',
	'Жители села устраивают соревнования, кто дальше закинет старые ботинки. Победитель получает новую пару обуви от местного сапожника. кроме того, считается, что с новой обувью победителю скоро придут хорошие новости.',
	'Ваш корабль наводнили паразиты. Всем известна их способность к размножению, поэтому ни одна станция или планета не разрешит пришвартоваться зараженному судну. А паразитов становится все больше.',
	'C горы спускаются Цеповые Улитки . Они довольно опасны, но поддаются приручению.',
	'Червоточина в этой системе весьма нестабильна, мы полагаем, она сломала барьер между измерениями, мы уже повстречали три копии нашего собственного корабля с командой. Точно такие же, с небольшими отличиями. Я бы посоветовал вам повернуть обратно, пока не стало поздно.',
	'В дальнем углу сидит человек в темном плаще. Он готов продать контрабанду любому, кто его об этом спросит.',
	'Разрытые могилы на кладбище и вывернутые из земли надгробные камни. Цепочка следов уводит к селению.',
	'Из озера в небо идёт дождь.',
	'Какой-то оборванец подсыпает что-то в напиток женщины сидящей с ним за одним столом.',
	'Мандилион или комитетчики оцепили дом, где скрывается враждебный инопланетянин. Где-то на пятом этаже послушались крики и ругательства, а потом… ББУБУХХХХХ!!!!! Полыхнуло огнём, и от постройки отломился порядочный кусок. Из дыры… высунулась харя, искорёженная взрывом. Как он там выжить-то сумел? А харя возьми и запрыгни на крышу соседнего здания.',
	'На борту телеги виднеется надпись "Приют Должника", в самой телеге лежат три тела, а рядом стоит большой человек в фартуке и с клещами в руках, он замечает вас и улыбается, показывая идеальные белые зубы.',
	'В телеге лежат куски мяса в разном состянии, у некоторых неприятный зеленоватый отенок, а над ними лениво жужжат крупные мухи.',
	'На пне некогда огромного дерева сидит большая лягушка. покрытая цветными пятнами и полосами. Она глядит куда-то вдаль и издает хриплые квакающие звуки, раздувая свой горловой мешок.',
	'Местный правитель изменил налогообложение моряков, и горожане в порту нападают на объявившего это глашатая.',
	'Несколько пыльных бутылок сложено в дальнем углу лотка. Кто-то сделал грубые наброски виноградных гроздей на них.',
	'Застонут деревья великого леса и подобно дождю с небес опадут звезды.',
	'Вы обнаруживаете покрытые льдом тела, разбросанные по тропе. Несчастный случай или злой умысел? Нужно быть осторожнее.',
	'Кольцо мерцающего света звезд освещает путь в новый мир, что старше времени.',
	'Долгожданное открытие сезона гонок на метлах! Ведьмы и волшебники рассекают в небесах ничуть не беспокоясь о сохранности природы или партии. Остерегайтесь огненных шаров!',
	'Прекраснейшую девушку на глазах партии кусает ядовитая змея. Времени на спасение мало.',
	'Партия натыкается на место преступления, и как раз появившиеся стражники, которых послали расследовать смерть знаменитого героя, обвиняют во всем вас. Совпадение?..',
	'За персонажами следит человек, который записывает в тетрадь все их покупки.',
	'Фермер, возвращающийся с полей с полной тачкой свежих овощей (1d6 рационов). Если группа дружелюбна, он может предложить обменять еду на что-нибудь (деньги его мало интересуют).',
	'Гарпии. Самые обычные гарпии. Они хотят съесть всю партию. или хотя бы их запасы еды.',
	'Скользкий на вид господин продает со своего ярко раскрашенного фургона чудо-эликсир исцеляющий от всего. В толпе виден сгорбленный страничек с палочкой, как только он принял образец эликсира, так он закричал от радости, отбросил трость и бодро шагает по улице.'
]
const server = http.createServer(function(req, res) {
	res.writeHeader(200, {"Content-Type": "application/json"})
	pathname = url.parse(req.url).pathname
	if (pathname == '/ask') {
		res.write(['Да', 'Нет'].choiceOne())
		return res.end()
	}
	else if (pathname.split('/')[1] == 'mine'){
		name = url.domainToUnicode(pathname.split('/')[2])
		action = url.domainToUnicode(pathname.split('/')[3]).toLowerCase()
		
		const mongoClient = new MongoClient(mongoUrl, {useNewUrlParser: true});
		mongoClient.connect(async function(error, client){
			
			if (error) {
				res.write(' Ошибка подключения к серверу. Ошибка: '+error)
				return res.end()
			}
			
			const collection = client.db("Moobot").collection("mine")
			
			data = await new Promise(function(resolve, reject){
				collection.find({}, { projection: { _id: 0}}).toArray(function(error, result){
					resolve(result)
				})
			})
			
			if ((function(){
				for (i of data){
					if (i.name == name) {
						user = i
						return true
					}
				}
			})()) {
				if (action == 'инфо') res.write(' Имя: '+user.name+', Золото: '+user.gold)
				else if (action == 'инвентарь') {
					total = 0
					for (i of user.inventory) total += i.price * i.quantity
					for (i of user.inventory){res.write(i.type+' ('+((i.quantity > 1) ? +i.quantity+'×' : '')+i.price+'$), ')}
					res.write('Всего: '+total+'$')
				}
				else if (action == 'копать') await new Promise(function(resolve, reject){
					options = [{
						type: 'Камень',
						comment: user.name+' вскопал камень',
						price: 1,
						chance: 50
					},{
						type: 'Железная руда',
						comment: user.name+' вскопал железо',
						price: 25,
						chance: 30
					},{
						type: 'Золотая руда',
						comment: user.name+' вскопал золото',
						price: 50,
						chance: 10
					},{
						type: 'Алмазная руда',
						comment: user.name+' вскопал алмазы',
						price: 100,
						chance: 10
					}]
					for (sum = options[0].chance, choice = 0, rand = ~~(Math.random() * 100); sum <= rand; sum += options[choice].chance) choice++
					res.write(options[choice].comment)
					
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
						
					user.inventory.sort(function(a, b){return b.quantity - a.quantity})
						
					collection.updateOne({name: user.name},{$set: {inventory: user.inventory}}, function(error, result){
						if(error) res.write(' Ошибка с добавлением в инвентарь. Ошибка: '+error)
						resolve()
					})
				})
				else if (action == 'продать') await new Promise(function(resolve, reject){
					total = 0
					for (i of user.inventory) total += i.price * i.quantity
					collection.updateOne({name: user.name},{$set: {gold: user.gold+total,inventory: []}}, function(error, result){
						if(error) res.write(' Ошибка с продажей. Ошибка: '+error)
						else res.write(' Вы продали свои ресурсы за '+total+'$, текущий баланс: '+(total + user.gold)+'$')
						resolve()
					})
				})
				else if (action == 'удалить') await new Promise(function(resolve, reject){
					collection.deleteOne(user, function(error, obj){
						if(error) res.write(' Ошибка удаления аккаунта. Ошибка: '+error)
						else res.write(' Аккаунт удалён')
						resolve()
					})
				})
			}
			else await new Promise(function(resolve, reject){
				collection.insertOne({name: name, gold: 100, inventory: []}, function(error, result){
					if(error) res.write(' Ошибка создания аккаунта. Ошибка: '+error)
					else res.write(' Аккаунт создан')
					resolve()
				})
			})
			
			
			
			res.end()
			client.close()
		});
// 		res.write('name: '+name+' action: '+action+'.   ')
	}
	else if (pathname.split('/')[1] == 'rpg'){
		style = url.domainToUnicode(pathname.split('/')[2]).toLowerCase()
		if (['персонаж','персонажи','перс','герой'].indexOf(style) != -1)
			res.write(characters.choiceOne())
		else if (['событие','соба','ивент'].indexOf(style) != -1)
			res.write(events.choiceOne())
		else res.write(' Добро пожаловать в наш волшебный мир! Хочешь поучаствовать и узнать больше информации? Выбери категорию: персонаж (чтобы узнать, кто ты по жизни), событие (что происходит вокруг твоего персонажа). Например "!rpg персонаж"')
		return res.end()
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
			<div class = 'button'><a href = "rpg">rpg</a></div>
			<div class = 'button'><a href = "ask">ask</a></div>
		</body>
		`)
		return res.end()
	}
})
server.listen(PORT)
console.log('Server started on port: '+PORT)
