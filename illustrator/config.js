// Configuration file for NVL Script
// Edit this file to change default values for different seasons

var CONFIG = {
    // Пути к файлам по умолчанию (изменяйте при смене сезона)
    DEFAULT_GROUPS_FILE: "D:\\Work\\NVL\\2026 весна\\Весна 2026 группы на 1 тур.csv",
    DEFAULT_RATING_FILE: "D:\\Work\\NVL\\2026 весна\\Рейтинг Весна 2026 generated1.csv",
    DEFAULT_TOURNAMENT_FILE: "D:\\Work\\NVL\\2026 весна\\Весна 2026 группы на 1 тур.csv",

    // Названия дивизионов
    DIVISIONS: {
        HIGH: "ВЫСШИЙ ДИВИЗИОН",
        FIRST: "ПЕРВЫЙ ДИВИЗИОН",
        SECOND: "ВТОРОЙ ДИВИЗИОН",
        THIRD: "ТРЕТИЙ ДИВИЗИОН",
        FOURTH: "ЧЕТВЕРТЫЙ ДИВИЗИОН"
    },

    // Названия месяцев
    MONTHS: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
    ],

    // Метки интерфейса
    UI_LABELS: {
        GROUPS_BUTTON: "Файл с данными",
        GROUPS_TAB: "Группы",
        RATING_TAB: "Рейтинг",
        TOURNAMENT_TAB: "Анонс турнира",
        LOAD_BUTTON: "Загрузить",
        FONT_INCREASE: "Шрифт ↑",
        FONT_DECREASE: "Шрифт ↓",
        MOVE_UP: "Вверх",
        MOVE_DOWN: "Вниз",
        LOAD_RATING_PART1: "Часть 1",
        LOAD_RATING_PART2: "Часть 2",
        LOAD_TOURNAMENT_1_2: "Загрузить анонс (1-2)",
        LOAD_TOURNAMENT_3_4: "Загрузить анонс (3-4)"
    },

    // Сообщения об ошибках
    ERRORS: {
        INVALID_FORMAT: "Некорректный формат файла: количество полей в заголовке не совпадает с количеством полей данных!",
        GROUP_NOT_FOUND: "Не найдена группа",
        LOAD_DATA_ERROR: "Ошибка: Не удалось загрузить данные из файла",
        NO_FUTURE_TOURNAMENTS: "Не найдено будущих турниров",
        INSUFFICIENT_GROUPS: "Не достаточно групп для второй загрузки"
    },

    // Префикс места проведения
    LOCATION_PREFIX: "с/к ",

    // Цвета и градиенты для рейтинговой таблицы
    COLORS: {
        MAIN: { red: 255, green: 255, blue: 255, opacity: 50 },        // Основной цвет фона
        MAIN_BORDER: { red: 255, green: 160, blue: 185, opacity: 50 }, // Цвет границ основных строк
        MAIN_TEXT: { red: 0, green: 0, blue: 0 },        // Цвет текста
        TOP6: { red: 241, green: 21, blue: 59, opacity: 15 },        // Цвет фона топ-6 команд
        TOP6_BORDER: { red: 255, green: 255, blue: 255 }     // Цвет границ топ-6 команд
    },

    // Градиенты для фонов (опционально, раскомментируйте и настройте при необходимости)
    // Если GRADIENTS определены, они будут использоваться вместо COLORS для фонов
    
    GRADIENTS: {
        /*MAIN_BACKGROUND: {  // Градиент для фона основных команд
            type: "linear",    // "linear" или "radial"
            angle: 45,         // угол для линейного градиента (0-360)
            stops: [           // остановки градиента
                { position: 0, color: { red: 255, green: 255, blue: 255, opacity: 50 } },
                { position: 100, color: { red: 240, green: 240, blue: 240, opacity: 30 } }
            ]
        },*/
        TOP6_BACKGROUND: { // Градиент для фона топ-6 команд
            type: "linear",    // радиальный градиент
            stops: [
                { position: 0, color: { red: 255, green: 255, blue: 255, opacity: 50 } },
                { position: 100, color: { red: 241, green: 26, blue: 59, opacity: 70 } }
            ]
        }
    }
};