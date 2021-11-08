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
