# Moobot-commands

## Описание проекта
RESTful API интерфейс, предоставляющий несколько команд для <a href='https://moo.bot'>Moobot</a>

## Описание и настройка команд

- ### ask - Ответить на вопрос да или нет
  
  <details><summary>Параметры</summary>

    - q - Текст вопроса
    - random (Опционально) - отвечать на вопрос рандомно, или всегда отвечать на одинаковые вопросы одинаково (допустимые значения: true, false. По умолчанию принимает значение true)

  </details>
  
  <details><summary>Пример использования</summary>

    - [/ask/?random=false&q=команда+крутая?](https://kicshikxo-api.herokuapp.com/moobot-commands/ask/?random=false&q=команда+крутая?)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/ask.png?raw=true" alt="Скриншот конфигурации команды ask"/>
    </p>

  </details>

- ### search - Поиск изображения/текста по переданной категории
  
  <details><summary>Параметры</summary>

    - q - Категория поиска

  </details>
  
  <details><summary>Категории поиска</summary>

    - анек / анекдот - Поиск анекдота
    - киса / кот - Поиск рандомного изображения кота

  </details>
  
  <details><summary>Пример использования</summary>

    - [/search/?q=анек](https://kicshikxo-api.herokuapp.com/moobot-commands/search/?q=анек)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/search.png?raw=true" alt="Скриншот конфигурации команды search"/>
    </p>

  </details>
  
- ### choice - Выбрать один из предложенных вариантов
  
  <details><summary>Параметры</summary>

    - q - Список вариантов для выбора

  </details>
  
  <details><summary>Пример использования</summary>

    - [/choice/?q=кошка+собака](https://kicshikxo-api.herokuapp.com/moobot-commands/choice/?q=кошка+собака)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/choice.png?raw=true" alt="Скриншот конфигурации команды choice"/>
    </p>

  </details>
  
- ### birthday - Количество дней до дня рождения стримера
  
  <details><summary>Параметры</summary>

    - date - Дата дня рождения в формате ISO

  </details>
  
  <details><summary>Пример использования</summary>

    - [/birthday/?date=2021-09-25](https://kicshikxo-api.herokuapp.com/moobot-commands/birthday/?date=2021-09-25)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/birthday.png?raw=true" alt="Скриншот конфигурации команды birthday"/>
    </p>

  </details>
  
- ### calc - Решить математический пример
  
  <details><summary>Параметры</summary>

    - q - Математическое выражение для вычисления

  </details>
  
  <details><summary>Пример использования</summary>

    - [/calc/?q=56-12/2](https://kicshikxo-api.herokuapp.com/moobot-commands/calc/?q=56-12/2)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/calc.png?raw=true" alt="Скриншот конфигурации команды calc"/>
    </p>

  </details>
  
- ### translate - Переводчик
  
  <details><summary>Параметры</summary>

    - from - Код языка оригинального текста
    - to - Код языка перевода
    - text - Текст для перевода (допускается наличие кодов языков в начале)

  </details>
  
  <details><summary>Доступные коды языков</summary>

    - en - Английский
    - ru - Русский
    - de - Немецкий
    - fr - Французский
    - it - Итальянский
    - es - Испанский
    - zh - Китайский
    - pt - Португальский
    - ar - Арабский

  </details>
  
  <details><summary>Пример использования</summary>

    - [/translate/?from=en&to=ru&text=Hello](https://kicshikxo-api.herokuapp.com/moobot-commands/translate/?from=en&to=ru&text=Hello)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/translate.png?raw=true" alt="Скриншот конфигурации команды translate"/>
    </p>

  </details>

- ### deepai - Создание картинки из текста с помощью сервиса deepai
  
  <details><summary>Параметры</summary>

    - q - Текст для преобразования в картинку
    - apiKey - API ключ для DeepAI (https://deepai.org/dashboard/profile)

  </details>
  
  <details><summary>Пример использования</summary>

    - [/deepai/?q=shark&apiKey=06ebd50a-????-????-????-7f3257e92553](https://kicshikxo-api.herokuapp.com/moobot-commands/deepai/?q=shark&apiKey=06ebd50a-42aa-402e-b6c3-7f3257e92553)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/deepai.png?raw=true" alt="Скриншот конфигурации команды deepai"/>
    </p>

  </details>
  
- ### dj - Получение информации из [Stream Dj](https://streamdj.ru/)
  
  <details><summary>Параметры</summary>

    - q - Команда
    - c - ID канала (указан в URL - https://streamdj.ru/dashboard/??????#)
    - apiKey (Опционально) - API ключ от Stream Dj, необходим для команды skip
    - url (Опционально) - Ссылка на страницу Stream Dj. Отображается при вызове команды без параметров
    - nickname (Опционально) - Никнейм пользователя, который будет использоваться при добавлении треков (по-умолчанию: Moobot)

  </details>
  
  <details><summary>Доступные команды</summary>

    - current / track - Информация о текущем треке
    - list - Список треков
    - skip (работает только с указанным apiKey) - Пропустить текущий трек

  </details>
  
  <details><summary>Пример использования</summary>

    - [/dj/?c=??????&q=list](https://kicshikxo-api.herokuapp.com/moobot-commands/dj/?c=99840&q=list)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/dj.png?raw=true" alt="Скриншот конфигурации команды dj"/>
    </p>

  </details>
