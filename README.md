# НВЛ

Приложения для автоматизации работы волейбольной Лиги НВЛ с помощью БД [Airtable](https://airtable.com/app1MljghZX5136lh)

[![Node.js CI](https://github.com/IceHarley/nvl/actions/workflows/node.js.yml/badge.svg)](https://github.com/IceHarley/nvl/actions/workflows/node.js.yml)

Запуск приложения: 
```
node app.js
```

### Пункты меню
* `Распределить команды на следующий тур` - создание новых групп по результатам завершенного тура, с возможностью добавить новые команды. Параметры распределения задаются в таблице `Параметры распределения`, а результаты сохраняются в таблицу `Распределение команд`
* `Удалить распределение команд` - отмена созданного распределения. Записи из таблицы `Распределение команд` удаляются
* `Составить рейтинговую таблицу` - посчитать текущий рейтинг и распределить команды по местам. Будут заполнены поля `Рейтинг` и `Результат (место)` в таблице `Результаты турниров`
