# Конфигурация NVL Script

## Как использовать config.js

1. **Поместите файлы в одну папку:**
   - `nvlScript.jsx` (основной скрипт)
   - `config.js` (файл конфигурации)

2. **Загрузите скрипт в Illustrator:**
   - В Illustrator откройте `File → Scripts → Other Script...`
   - Выберите `nvlScript.jsx`

3. **При смене сезона:**
   - Откройте `config.js` в текстовом редакторе
   - Измените пути к файлам и другие значения по необходимости
   - Перезапустите скрипт в Illustrator

## Что можно менять в config.js

### Пути к файлам по умолчанию
```javascript
DEFAULT_GROUPS_FILE: "D:\\Work\\NVL\\2025 осень\\Осень 2025 группы на 3 тур.csv",
DEFAULT_RATING_FILE: "D:\\Work\\NVL\\2025 осень\\Рейтинг Осень 2025 generated1.csv",
DEFAULT_TOURNAMENT_FILE: "D:\\Work\\NVL\\2025 осень\\Осень 2025 группы на 2 тур.csv",
```

### Названия дивизионов
```javascript
DIVISIONS: {
    HIGH: "ВЫСШИЙ ДИВИЗИОН",
    FIRST: "ПЕРВЫЙ ДИВИЗИОН",
    // ...
}
```

### Названия месяцев
```javascript
MONTHS: [
    "января",
    "февраля",
    // ...
]
```

### Текстовые метки интерфейса
```javascript
UI_LABELS: {
    GROUPS_TAB: "Группы",
    LOAD_BUTTON: "Загрузить",
    // ...
}
```

## Пример для нового сезона

Для весны 2026 года измените config.js:

```javascript
var CONFIG = {
    DEFAULT_GROUPS_FILE: "D:\\Work\\NVL\\2026 весна\\Весна 2026 группы на 3 тур.csv",
    DEFAULT_RATING_FILE: "D:\\Work\\NVL\\2026 весна\\Рейтинг Весна 2026 generated1.csv",
    DEFAULT_TOURNAMENT_FILE: "D:\\Work\\NVL\\2026 весна\\Весна 2026 группы на 2 тур.csv",
    // ... остальные значения остаются теми же
};
```