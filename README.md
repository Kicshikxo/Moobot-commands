# Moobot-commands

## Описание
RESTful API интерфейс, предоставляющий несколько команд для <a href='https://moo.bot'>Moobot</a>

## Описание и настройка команд

- ### ask - Ответить на вопрос да или нет
  
  <details><summary>Параметры</summary>

    - q - Текст вопроса

  </details>
  
  <details><summary>Пример использования</summary>

    - [/ask/?q=команда+крутая?](https://moobot-commands.herokuapp.com/ask/?q=команда+крутая?)

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

    - [/search/?q=анек](https://moobot-commands.herokuapp.com/search/?q=анек)

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

    - [/choice/?q=кошка+собака](https://moobot-commands.herokuapp.com/choice/?q=кошка+собака)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/choice.png?raw=true" alt="Скриншот конфигурации команды choice"/>
    </p>

  </details>
  
- ### translate - Переводчик
  
  <details><summary>Параметры</summary>

    - from - Код языка оригинального текста
    - to - Код языка перевода
    - text - Текст для перевода (допускается наличие кода языка в начале)

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

    - [/translate/?from=en&to=ru&text=Hello](https://moobot-commands.herokuapp.com/translate/?from=en&to=ru&text=Hello)

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

    - [/deepai/?q=shark&apiKey=06ebd50a-????-????-????-7f3257e92553](https://moobot-commands.herokuapp.com/deepai/?q=shark&apiKey=06ebd50a-42aa-402e-b6c3-7f3257e92553)

  </details>
  
  <details><summary>Скриншот конфигурации</summary>
  
    <p align="center">
      <img src="https://github.com/Kicshikxo/Moobot-commands/blob/master/configuration-screenshots/deepai.png?raw=true" alt="Скриншот конфигурации команды deepai"/>
    </p>

  </details>
