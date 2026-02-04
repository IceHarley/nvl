#target
illustrator

#targetengine
main
//the ui has problems and crashes when this isn't used
#script
"nvlScript"

function nvlScript() {

    // Fallback configuration
    var fallbackConfig = {
        DEFAULT_GROUPS_FILE: "D:\\Work\\NVL\\2025 осень\\Осень 2025 группы на 3 тур.csv",
        DEFAULT_RATING_FILE: "D:\\Work\\NVL\\2025 осень\\Рейтинг Осень 2025 generated1.csv",
        DEFAULT_TOURNAMENT_FILE: "D:\\Work\\NVL\\2025 осень\\Осень 2025 группы на 2 тур.csv",
        DIVISIONS: {
            HIGH: "ВЫСШИЙ ДИВИЗИОН",
            FIRST: "ПЕРВЫЙ ДИВИЗИОН",
            SECOND: "ВТОРОЙ ДИВИЗИОН",
            THIRD: "ТРЕТИЙ ДИВИЗИОН",
            FOURTH: "ЧЕТВЕРТЫЙ ДИВИЗИОН"
        },
        MONTHS: [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ],
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
        ERRORS: {
            INVALID_FORMAT: "Некорректный формат файла: количество полей в заголовке не совпадает с количеством полей данных!",
            GROUP_NOT_FOUND: "Не найдена группа",
            LOAD_DATA_ERROR: "Ошибка: Не удалось загрузить данные из файла",
            NO_FUTURE_TOURNAMENTS: "Не найдено будущих турниров",
            INSUFFICIENT_GROUPS: "Не достаточно групп для второй загрузки"
        },
        LOCATION_PREFIX: "с/к ",
        COLORS: {
            MAIN: { red: 254, green: 133, blue: 53, opacity: 100 },
            MAIN_BORDER: { red: 255, green: 255, blue: 255 },
            MAIN_TEXT: { red: 0, green: 0, blue: 0 },
            TOP6: { red: 254, green: 133, blue: 53, opacity: 60 },
            TOP6_BORDER: { red: 178, green: 0, blue: 0 }
        }
    };

    // Load configuration from external file
    // This will create a global CONFIG variable if config.js exists and loads successfully
    try {
        var scriptFile = new File($.fileName);
        var scriptFolder = scriptFile.parent;
        var configPath = new File(scriptFolder + "/config.js");

        if (configPath.exists) {
            $.evalFile(configPath.fsName);
            // config.js creates a global CONFIG variable if it loads successfully
        }
    } catch (e) {
        // Error loading config file, will use fallback
    }

    // Use external CONFIG if it exists (created by config.js), otherwise use fallback
    // We use eval to check the global scope without creating a local variable that would shadow it
    var CONFIG;
    try {
        // Check if global CONFIG exists (created by config.js)
        // Using eval to access global scope without declaring a local variable first
        if (eval('typeof CONFIG !== "undefined"')) {
            // Access the global CONFIG variable created by config.js
            CONFIG = eval('CONFIG');
        } else {
            // No external config found, use fallback
            CONFIG = fallbackConfig;
        }
    } catch (e) {
        // If there's any error accessing global CONFIG, use fallback
        CONFIG = fallbackConfig;
    }
    
    // Final safety check: ensure CONFIG is valid
    if (typeof CONFIG === 'undefined' || CONFIG === null) {
        CONFIG = fallbackConfig;
    }

//=================================== FUNCTIONS ====================================//

    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    String.prototype.startsWith = function (prefix) {
        return this.indexOf(prefix) === 0;
    };

    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };

    Array.prototype.map = function (callback, thisArg) {
        var arr = [];
        const len = this.length;
        for (var i = 0; i < len; i++) {
            if (i in this) arr.push(callback.call(thisArg, this[i], i, this));
            else arr.length++;
        }
        return arr;
    };

    var CSV = {
        // ===================================================== http://stackoverflow.com/a/12785546
        // ===================================================== Andy VanWagoner
        // ===================================================== http://thetalecrafter.com/
        parse: function (csv, reviver, splitter) {
            splitter = splitter || ',';
            reviver = reviver || function (r, c, v) {
                return v;
            };
            var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
            while (c < cc) {
                table.push(row = []);
                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
                    start = end = c;
                    if ('"' === chars[c]) {
                        start = end = ++c;
                        while (c < cc) {
                            if ('"' === chars[c]) {
                                if ('"' !== chars[c + 1]) {
                                    break;
                                } else {
                                    chars[++c] = '';
                                } // unescape ""
                            }
                            end = ++c;
                        }
                        if ('"' === chars[c]) {
                            ++c;
                        }
                        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && splitter !== chars[c]) {
                            ++c;
                        }
                    } else {
                        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && splitter !== chars[c]) {
                            end = ++c;
                        }
                    }
                    row.push(reviver(table.length - 1, row.length, chars.slice(start, end).join('')));
                    if (splitter === chars[c]) {
                        ++c;
                    }
                }
                if ('\r' === chars[c]) {
                    ++c;
                }
                if ('\n' === chars[c]) {
                    ++c;
                }
            }
            return table;
        },
        stringify: function (table, replacer, splitter) {
            replacer = replacer || function (r, c, v) {
                return v;
            };
            var csv = '', c, cc, r, rr = table.length, cell;
            for (r = 0; r < rr; ++r) {
                if (r) {
                    csv += '\r\n';
                }
                for (c = 0, cc = table[r].length; c < cc; ++c) {
                    if (c) {
                        csv += splitter;
                    }
                    cell = replacer(r, c, table[r][c]);
                    var rx = new RegExp("[" + splitter + "]\\r" + "\\n\"");
                    if (rx.test(cell)) {
                        cell = '"' + cell.replace(/"/g, '""') + '"';
                    }
                    csv += (cell || 0 === cell) ? cell : '';
                }
            }
            return csv;
        }
    };

    function getTextData(dataFile) {
        var df = dataFile;
        var dataFileName = decodeURI(df.name);
        var type = dataFileName.match(/(\.txt$|\.csv$)/i)[0].toLowerCase();
        var splitter = (type === '.txt') ? '\t' : ',';
        df.open('r');
        var fileContents = df.read();
        var firstRow = fileContents.split(/[\r\n]/g)[0];
        if (firstRow != null && splitter !== "\t") {
            if (firstRow.indexOf(",") === -1 && firstRow.indexOf(";") > -1) {
                splitter = ";"; // For the .csv format: if the first row has no commas but has a semicolon, assume this is a semicolon-delimited .csv file
            }
        }
        var everyRowRaw = CSV.parse(fileContents, undefined, splitter);
        df.close();

        var everyRow = [];

        for (var i = 0; i < everyRowRaw.length; i++) {
            // get rid of empty rows
            var thisRawRow = everyRowRaw[i];
            if (!checkRowForAllBlanks(thisRawRow)) {
                if (i > 0) {
                    if (thisRawRow.length < everyRow[0].length) {
                        var diff = everyRow[0].length - thisRawRow.length;
                        for (var d = 0; d < diff; d++) {
                            thisRawRow.push("");
                        }
                    }
                }
                everyRow.push(thisRawRow);
            }
        }
        return everyRow;
    }

    function getData(filePath) {
        try {
            var file = File(filePath);
            if (!file.exists) {
                alert("Файл не найден: " + filePath + "\nПроверьте путь к файлу в config.js");
                return null;
            }
            return getTextData(file);
        } catch (e) {
            alert("Ошибка при чтении файла: " + e.message);
            return null;
        }
    }

    function checkRowForAllBlanks(row) {
        for (var i = 0; i < row.length; i++) {
            if (row[i] !== '') {
                return false;
            }
        }
        return true;
    }


//==================================================================================//

    var doc = app.activeDocument;

    function findItalicFont(currentFont) {
        try {
            if (!currentFont || !currentFont.family || !app.textFonts) {
                return null;
            }
            
            for (var i = 0; i < app.textFonts.length; i++) {
                if (app.textFonts[i].family === currentFont.family && app.textFonts[i].style === "Italic") {
                    return app.textFonts[i];
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    function beforeLast(value, delimiter) {
        value = value || ''

        if (delimiter === '') {
            return value
        }

        const substrings = value.split(delimiter)

        return substrings.length === 1
            ? value // delimiter is not part of the string
            : substrings.slice(0, -1).join(delimiter)
    }

    function afterLast(value, delimiter) {
        value = value || ''

        return delimiter === ''
            ? value
            : value.split(delimiter).pop()
    }

    function setTextSize(textFrame, fontSize) {
        try {
            // Устанавливаем размер шрифта
            textFrame.textRange.characterAttributes.size = fontSize;
            return true;
        } catch (e) {
            alert("Ошибка при установке размера шрифта: " + e.message);
            return false;
        }
    }

    function setTextSizeWithAutoResize(textFrame, fullName, maxFontSize, minFontSize) {
        try {
            if (!textFrame || !fullName || !textFrame.textRange) {
                return maxFontSize;
            }

            // Разделяем название команды и город
            var teamName = beforeLast(fullName, " ");
            var city = afterLast(fullName, " ");

            // Устанавливаем базовое содержимое
            textFrame.contents = teamName;
            var currentFontSize = maxFontSize;

            if (city && city.trim() !== "") {
                var cityWord = textFrame.words.add(city);
                if (cityWord && cityWord.characterAttributes) {
                    var italicFont = findItalicFont(textFrame.textRange.textFont);
                    if (italicFont) {
                        cityWord.characterAttributes.textFont = italicFont;
                    }
                    cityWord.characterAttributes.stroked = false;
                }
            }

            function setSizeAndRedraw(size) {
                textFrame.textRange.characterAttributes.size = size;
                app.redraw();
            }

            function getOverflowFlag(tf) {
                try {
                    if (typeof tf.overflows !== 'undefined') {
                        return tf.overflows; // Illustrator Area Text
                    }
                    if (typeof tf.overflow !== 'undefined') {
                        return tf.overflow; // Fallback just in case
                    }
                } catch (e) {}
                return null;
            }

            function fitsByBounds(tf, fb) {
                try {
                    var tb = tf.textRange && tf.textRange.bounds;
                    if (tb && fb) {
                        var textWidth = tb[2] - tb[0];
                        var textHeight = tb[1] - tb[3];
                        var frameWidth = fb[2] - fb[0];
                        var frameHeight = fb[1] - fb[3];
                        return (textWidth <= frameWidth) && (textHeight <= frameHeight);
                    }
                } catch (e) {}
                return null;
            }

            var frameBounds = null;
            try { frameBounds = textFrame.geometricBounds; } catch (e) {}

            // Начальная установка размера
            setSizeAndRedraw(currentFontSize);

            // Шагаем вниз по 1 пункту, пока не поместится по надежным метрикам
            while (currentFontSize > minFontSize) {
                var overflow = getOverflowFlag(textFrame);
                if (overflow === false) {
                    break; // поместилось
                }
                if (overflow === true) {
                    currentFontSize -= 1;
                    setSizeAndRedraw(currentFontSize);
                    continue;
                }

                // Если нет overflow-флага, пробуем по bounds
                var fits = fitsByBounds(textFrame, frameBounds);
                if (fits === true) {
                    break; // поместилось
                }
                if (fits === false) {
                    currentFontSize -= 1;
                    setSizeAndRedraw(currentFontSize);
                    continue;
                }

                // Последний резерв — консервативная эвристика по ширине фрейма
                var frameWidth = frameBounds ? (frameBounds[2] - frameBounds[0]) : 0;
                if (frameWidth > 0) {
                    var estimatedWidth = fullName.length * (currentFontSize * 0.52);
                    if (estimatedWidth <= frameWidth * 0.98) {
                        break;
                    }
                }
                currentFontSize -= 1;
                setSizeAndRedraw(currentFontSize);
            }

            // Точная доводка вниз до минимального подходящего размера
            // Пытаемся уменьшать дальше, пока не наступит переполнение, затем откатываемся на 1
            var testSize = currentFontSize - 1;
            while (testSize >= minFontSize) {
                setSizeAndRedraw(testSize);
                var ov = getOverflowFlag(textFrame);
                var ok = null;
                if (ov === true) { ok = false; }
                else if (ov === false) { ok = true; }
                else { ok = fitsByBounds(textFrame, frameBounds); }

                if (ok === true) {
                    currentFontSize = testSize;
                    testSize -= 1;
                    continue;
                }
                // Не поместилось — возвращаем предыдущий подходящий размер
                setSizeAndRedraw(currentFontSize);
                break;
            }

            return currentFontSize;
        } catch (e) {
            alert("Ошибка при автоматическом изменении размера шрифта: " + e.message);
            return maxFontSize;
        }
    }

    function loadDataFromCsv(fileName) {
        var data = getData(fileName);
        const header = data[0];

        for (var i = 0; i < doc.layers.getByName("groupsLayer").groupItems.length; i++) {
            doc.layers.getByName("groupsLayer").groupItems[i].hidden = true;
        }

        for (var i = 1; i < data.length; i++) {
            var values = data[i];
            if (header.length !== values.length) {
                //Некорректный формат файла: количество полей в заголовке не совпадает с количеством полей данных!
                alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.INVALID_FORMAT)));
            }

            for (var j = 0; j < values.length; j++) {
                values[j] = decodeURIComponent(values[j]);
            }

            var group = getGroup(doc.layers.getByName("groupsLayer").groupItems, values[0]);
            if (group) {
                group.hidden = values[1].trim() !== 'true';
            } else {
                alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.GROUP_NOT_FOUND)) + ' ' + values[0]);
            }//Не найдена группа ...

            for (var col = 0; col < header.length; col++) {
                var item = getByNoteInGroup(group, header[col]);
                if (item) {
                    if (header[col].endsWith("FullName") && values[col] && values[col].trim() !== "") {
                        // Проверяем длину текста - если короткий, используем фиксированный размер
                        if (values[col].length <= 20) {
                            // Короткие названия - используем фиксированный размер
                            item.contents = beforeLast(values[col], " ");
                            setTextSize(item, 40);
                            var city = item.words.add(afterLast(values[col], " "));
                            city.characterAttributes.textFont = findItalicFont(item.textRange.textFont);
                        } else {
                            // Длинные названия - используем автоматическое изменение размера
                            setTextSizeWithAutoResize(item, values[col], 40, 12);
                        }
                    } else {
                        item.contents = values[col] || "";
                    }
                }
            }
        }
    }

    function loadRatingFromCsv(fileName) {
        var data = getData(fileName);
        if (!data || data.length === 0) {
            return;
        }

        const header = data[0];
        const values = data[1];

        if (!header || !values) {
            alert("Некорректная структура CSV файла. Отсутствует заголовок или данные.");
            return;
        }
            if (header.length !== values.length) {
                //Некорректный формат файла: количество полей в заголовке не совпадает с количеством полей данных!
                alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.INVALID_FORMAT)));
            }
            if (data.length !== 31) {
                //Некорректный формат файла: должно быть 30 строк
                alert('csv should contain header + 30 records! Actual: ' + data.length);
            }
            var items = doc.layers[0].groupItems;

        function getDelta(delta) {
            if (delta === '0') {
                return '';
            }
            if (data[i][1] < 0) {
                return decodeURIComponent('%E2%86%93') + +-data[i][1];
            }
            return decodeURIComponent('%E2%86%91') + data[i][1];
        }

        function getPlaceSymbol(place) {
            if (place === '1') {
                return ' ' + decodeURIComponent('%E2%9E%80');
            } else if (place === '2') {
                return ' ' + decodeURIComponent('%E2%9E%81');
            } else if (place === '3') {
                return ' ' + decodeURIComponent('%E2%9E%82');
            }
            return '';
        }

        // Create color objects from config
        function createRGBColor(colorConfig) {
            if (!colorConfig) {
                // Fallback color if config is missing
                var color = new RGBColor();
                color.red = 254;
                color.green = 133;
                color.blue = 53;
                return color;
            }
            var color = new RGBColor();
            color.red = (colorConfig.red !== undefined) ? colorConfig.red : 254;
            color.green = (colorConfig.green !== undefined) ? colorConfig.green : 133;
            color.blue = (colorConfig.blue !== undefined) ? colorConfig.blue : 53;
            return color;
        }


        // Gradient cache to avoid creating duplicate gradients
        var gradientCache = {};

        // Generate a unique key from gradient configuration
        function getGradientKey(gradientConfig) {
            if (!gradientConfig || !gradientConfig.stops) {
                return null;
            }
            var key = (gradientConfig.type || "linear") + "_";
            if (gradientConfig.angle !== undefined) {
                key += gradientConfig.angle + "_";
            }
            for (var i = 0; i < gradientConfig.stops.length; i++) {
                var stop = gradientConfig.stops[i];
                if (stop && stop.color) {
                    key += stop.position + "_" +
                           (stop.color.red || 0) + "_" +
                           (stop.color.green || 0) + "_" +
                           (stop.color.blue || 0) + "_" +
                           (stop.color.opacity !== undefined ? stop.color.opacity : 100) + "_";
                }
            }
            return key;
        }

        // Create gradient objects from config (with caching)
        function createGradient(gradientConfig) {
            if (!gradientConfig || !gradientConfig.stops || gradientConfig.stops.length === 0) {
                alert("Некорректная конфигурация градиента: отсутствуют остановки или пустой массив остановок");
                return null;
            }

            // Check cache first
            var cacheKey = getGradientKey(gradientConfig);
            if (cacheKey && gradientCache[cacheKey]) {
                // Reuse cached gradient - create a new GradientColor object with the cached gradient
                var cachedGradient = new GradientColor();
                cachedGradient.gradient = gradientCache[cacheKey];
                // Set angle if specified for linear gradients
                if (gradientConfig.angle !== undefined && gradientConfig.type !== "radial") {
                    cachedGradient.angle = gradientConfig.angle;
                }
                return cachedGradient;
            }

            try {
                // Create new gradient without name to avoid conflicts
                var newGradient = app.activeDocument.gradients.add();

                // Set gradient type
                if (gradientConfig.type === "radial") {
                    newGradient.type = GradientType.RADIAL;
                } else {
                    newGradient.type = GradientType.LINEAR;
                }

                // Create gradient stops
                for (var i = 0; i < gradientConfig.stops.length; i++) {
                    var stop = gradientConfig.stops[i];
                    if (!stop || !stop.color) {
                        continue;
                    }

                    var gradientStop = newGradient.gradientStops.add();

                    // Set color
                    var stopColor = new RGBColor();
                    stopColor.red = (stop.color.red !== undefined) ? stop.color.red : 0;
                    stopColor.green = (stop.color.green !== undefined) ? stop.color.green : 0;
                    stopColor.blue = (stop.color.blue !== undefined) ? stop.color.blue : 0;
                    gradientStop.color = stopColor;

                    // Set position (0-100)
                    gradientStop.rampPoint = (stop.position !== undefined) ? stop.position : (i * 100 / (gradientConfig.stops.length - 1));

                    // Set opacity if specified
                    if (stop.color.opacity !== undefined) {
                        gradientStop.opacity = stop.color.opacity;
                    }
                }

                // Cache the gradient object (not the GradientColor, as that includes angle)
                if (cacheKey) {
                    gradientCache[cacheKey] = newGradient;
                }

                // Create GradientColor object
                var gradient = new GradientColor();
                gradient.gradient = newGradient;

                // Set angle if specified for linear gradients
                if (gradientConfig.angle !== undefined && gradientConfig.type !== "radial") {
                    gradient.angle = gradientConfig.angle;
                }

                return gradient;
            } catch (e) {
                alert("Ошибка при создании градиента: " + e.message);
                return null;
            }
        }

        // Helper function to apply color or gradient to fill
        function applyFill(item, fillConfig) {
            if (!item || !fillConfig) {
                alert("applyFill: invalid parameters - item or fillConfig is null/undefined");
                return;
            }

            try {
                // Check if it's a gradient config
                if (fillConfig.type && fillConfig.stops) {
                    var gradient = createGradient(fillConfig);
                    if (gradient && gradient.gradient) {
                        item.fillColor = gradient;
                        // For gradients, don't set item opacity as gradient stops already have opacity
                    } else {
                        alert("Failed to create gradient, falling back to solid color");
                        // Fallback to solid color from first gradient stop
                        var fallbackColor = fillConfig.stops && fillConfig.stops[0] ? fillConfig.stops[0].color : { red: 255, green: 255, blue: 255 };
                        item.fillColor = createRGBColor(fallbackColor);
                        if (fallbackColor.opacity !== undefined) {
                            item.opacity = fallbackColor.opacity;
                        }
                    }
                } else {
                    // Solid color
                    item.fillColor = createRGBColor(fillConfig);
                    // Set opacity if specified for solid colors
                    if (fillConfig.opacity !== undefined) {
                        item.opacity = fillConfig.opacity;
                    }
                }
            } catch (e) {
                alert("Error in applyFill: " + e.message);
            }
        }

        var top6Color = createRGBColor(CONFIG.COLORS.TOP6);
        var top6BorderColor = createRGBColor(CONFIG.COLORS.TOP6_BORDER);
        var mainColor = createRGBColor(CONFIG.COLORS.MAIN);
        var mainBorderColor = createRGBColor(CONFIG.COLORS.MAIN_BORDER);
        var mainTextColor = createRGBColor(CONFIG.COLORS.MAIN_TEXT);

        for (var i = 1; i < data.length; i++) {
            var group = getRatingLine(items, i);
            if (group) {
                group.hidden = data[i][14] !== '1';
                getByNote('place', group).contents = data[i][0];
                getByNote('place', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('place', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('place', group).stroked = false; } catch (e) {}
                getByNote('delta', group).contents = getDelta(data[i][1]);
                getByNote('delta', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('delta', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('delta', group).textRange.characterAttributes.strokeWidth = 0; } catch (e) {}
                try { getByNote('delta', group).stroked = false; } catch (e) {}
                try { getByNote('delta', group).strokeWidth = 0; } catch (e) {}
                getByNote('team', group).contents = data[i][2];
                getByNote('team', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('team', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('team', group).stroked = false; } catch (e) {}
                getByNote('group1', group).contents = '  ' + data[i][3];
                getByNote('group1', group).textRange.justification = Justification.CENTER;
                getByNote('group1', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('group1', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('group1', group).stroked = false; } catch (e) {}
                getByNote('place1', group).contents = getPlaceSymbol(data[i][4]);
                getByNote('place1', group).textRange.characterAttributes.textFont = app.textFonts.getByName('AdobePiStd');
                getByNote('place1', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('place1', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('place1', group).stroked = false; } catch (e) {}
                getByNote('place1', group).contents = getPlaceSymbol(data[i][4]);
                getByNote('rating1', group).contents = data[i][5];
                getByNote('rating1', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('rating1', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('rating1', group).stroked = false; } catch (e) {}
                getByNote('group2', group).contents = '  ' + data[i][6];
                getByNote('group2', group).textRange.justification = Justification.CENTER;
                getByNote('group2', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('group2', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('group2', group).stroked = false; } catch (e) {}
                getByNote('place2', group).contents = getPlaceSymbol(data[i][7]);
                getByNote('place2', group).textRange.characterAttributes.textFont = app.textFonts.getByName('AdobePiStd');
                getByNote('place2', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('place2', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('place2', group).stroked = false; } catch (e) {}
                getByNote('rating2', group).contents = data[i][8];
                getByNote('rating2', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('rating2', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('rating2', group).stroked = false; } catch (e) {}
                getByNote('group3', group).contents = '  ' + data[i][9];
                getByNote('group3', group).textRange.justification = Justification.CENTER;
                getByNote('group3', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('group3', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('group3', group).stroked = false; } catch (e) {}
                getByNote('place3', group).contents = getPlaceSymbol(data[i][10]);
                getByNote('place3', group).textRange.characterAttributes.textFont = app.textFonts.getByName('AdobePiStd');
                getByNote('place3', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('place3', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('place3', group).stroked = false; } catch (e) {}
                getByNote('rating3', group).contents = data[i][11];
                getByNote('rating3', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('rating3', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('rating3', group).stroked = false; } catch (e) {}
                getByNote('rating', group).contents = data[i][12];
                getByNote('rating', group).textRange.characterAttributes.fillColor = mainTextColor;
                try { getByNote('rating', group).textRange.characterAttributes.stroked = false; } catch (e) {}
                try { getByNote('rating', group).stroked = false; } catch (e) {}
                for (var j = 0; j < group.pathItems.length; j++) {
                    if (group.pathItems[j].name.startsWith('back ')) {
                        // Check if gradients are defined and use them, otherwise fall back to colors
                        // Check if gradients are defined and use them, otherwise fall back to colors
                        if (data[i][15] === '1') {
                            if (CONFIG.GRADIENTS && CONFIG.GRADIENTS.TOP6_BACKGROUND) {
                                applyFill(group.pathItems[j], CONFIG.GRADIENTS.TOP6_BACKGROUND);
                            } else {
                                group.pathItems[j].fillColor = top6Color;
                                group.pathItems[j].opacity = (CONFIG.COLORS && CONFIG.COLORS.TOP6 && CONFIG.COLORS.TOP6.opacity) ? CONFIG.COLORS.TOP6.opacity : 60;
                            }
                        } else {
                            if (CONFIG.GRADIENTS && CONFIG.GRADIENTS.MAIN_BACKGROUND) {
                                applyFill(group.pathItems[j], CONFIG.GRADIENTS.MAIN_BACKGROUND);
                            } else {
                                group.pathItems[j].fillColor = mainColor;
                                group.pathItems[j].opacity = (CONFIG.COLORS && CONFIG.COLORS.MAIN && CONFIG.COLORS.MAIN.opacity) ? CONFIG.COLORS.MAIN.opacity : 100;
                            }
                        }
                    }
                    if (group.pathItems[j].name.startsWith('border')) { //первые 6 строк
                        group.pathItems[j].strokeColor = data[i][15] === '1' ? top6BorderColor : mainBorderColor;
                        var borderOpacity = 100; // default opacity for borders
                        if (data[i][15] === '1') {
                            borderOpacity = (CONFIG.COLORS && CONFIG.COLORS.TOP6_BORDER && CONFIG.COLORS.TOP6_BORDER.opacity) ? CONFIG.COLORS.TOP6_BORDER.opacity : 100;
                        } else {
                            borderOpacity = (CONFIG.COLORS && CONFIG.COLORS.MAIN_BORDER && CONFIG.COLORS.MAIN_BORDER.opacity) ? CONFIG.COLORS.MAIN_BORDER.opacity : 100;
                        }
                        group.pathItems[j].opacity = borderOpacity;
                    } else if (group.pathItems[j].name.startsWith('rect')) { //остальные
                        group.pathItems[j].strokeColor = mainBorderColor;
                        var rectOpacity = 100; // default opacity for rect borders
                        rectOpacity = (CONFIG.COLORS && CONFIG.COLORS.MAIN_BORDER && CONFIG.COLORS.MAIN_BORDER.opacity) ? CONFIG.COLORS.MAIN_BORDER.opacity : 100;
                        group.pathItems[j].opacity = rectOpacity;
                    }
                }
            }
        }
        redraw();
    }

    function showNotes() {
        for (var i = 0; i < doc.textFrames.length; i++) {
            var item = doc.textFrames[i];
            if (item.note) {
                item.contents = 'note: ' + item.note;
            }
        }
        redraw();
    }

    function getByNoteInDoc(note) {
        for (var i = 0; i < doc.pageItems.length; i++) {
            var item = doc.pageItems[i];
            if (item.note === note) {
                return item;
            }
        }
    }

    function getByNoteInGroup(group, note) {
        if (!group || !group.textFrames) {
            return undefined;
        }
        for (var i = 0; i < group.textFrames.length; i++) {
            var item = group.textFrames[i];
            if (item.note === note) {
                return item;
            }
        }
        for (var i = 0; i < group.groupItems.length; i++) {
            var result = getByNoteInGroup(group.groupItems[i], note);
            if (result) {
                return result;
            }
        }
    }

    function getByNote(note, group) {
        for (var i = 0; i < group.pageItems.length; i++) {
            var item = group.pageItems[i];
            if (item.note === note) {
                return item;
            }
        }
    }

    function matchRule(str, rule) {
        try {
            var escapeRegex = function (str) {
                return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
            };
            return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
        } catch (e) {
            alert(e);
            throw e;
        }
    }

    function getItemsByNoteMask(mask) {
        var result = [];
        for (var i = 0; i < doc.pageItems.length; i++) {
            var item = doc.pageItems[i];
            if (matchRule(item.note, mask)) {
                result.push(item);
            }
        }
        return result;
    }

    function changeFont(item, delta) {
        if (item && item.textRanges) {
            for (var j = 0; j < item.textRanges.length; j++) {
                var text = item.textRanges[j];
                text.characters[0].characterAttributes.size += delta;
            }
        }
    }

    function moveItem(item, delta) {
        if (item) {
            item.top += delta;
        }
    }

    var changeItemsFont = function (input, delta) {
        return function () {
            var items = getItemsByNoteMask(input.getValue());
            for (var i = 0; i < items.length; i++) {
                try {
                    changeFont(items[i], delta);
                } catch (e) {
                    alert(e);
                    throw e;
                }

            }
            redraw();
        };
    };

    var moveItems = function (input, delta) {
        return function () {
            var items = getItemsByNoteMask(input.getValue());
            for (var i = 0; i < items.length; i++) {
                try {
                    moveItem(items[i], delta);
                } catch (e) {
                    alert(e);
                    throw e;
                }

            }
            redraw();
        };
    };

    function getRatingLine(items, number) {
        for (var i = 0; i < items.length; i++)
            if (items[i].name === 'line' + number)
                return items[i];
        return undefined;
    }

    function getGroup(items, group) {
        for (var i = 0; i < items.length; i++)
            if (items[i].name === 'group' + group)
                return items[i];
        return undefined;
    }

    // Функция для форматирования команды с жирным названием и курсивным городом
    function formatTeamName(textFrame, fullName) {
        if (!textFrame || !fullName) return;

        // Разделяем название команды и город
        var teamName = beforeLast(fullName, " ");
        var city = afterLast(fullName, " ");

        // Устанавливаем название команды (жирный шрифт)
        textFrame.contents = teamName;
        setTextSize(textFrame, 50);

        // Добавляем город курсивом (без дополнительных скобок, так как они уже есть в city)
        var cityWord = textFrame.words.add(city);
        cityWord.characterAttributes.textFont = findItalicFont(textFrame.textRange.textFont);
    }

    // Функция для определения дивизиона по букве группы
    function getDivisionName(groupName) {
        // Высший дивизион: A, B
        if (groupName === 'A' || groupName === 'B') {
            return decodeURIComponent(encodeURIComponent(CONFIG.DIVISIONS.HIGH));
        }

        // Первый дивизион: C, D, E, F
        if (groupName >= 'C' && groupName <= 'F') {
            return decodeURIComponent(encodeURIComponent(CONFIG.DIVISIONS.FIRST));
        }

        // Второй дивизион: G, H, I, J
        if (groupName >= 'G' && groupName <= 'J') {
            return decodeURIComponent(encodeURIComponent(CONFIG.DIVISIONS.SECOND));
        }

        // Третий дивизион: K, L, M, N
        if (groupName >= 'K' && groupName <= 'N') {
            return decodeURIComponent(encodeURIComponent(CONFIG.DIVISIONS.THIRD));
        }

        // Четвертый дивизион: O, P, Q, R, S, T, U, V, W, X, Y, Z
        if (groupName >= 'O' && groupName <= 'Z') {
            return decodeURIComponent(encodeURIComponent(CONFIG.DIVISIONS.FOURTH));
        }

        // По умолчанию - высший дивизион
        return decodeURIComponent(encodeURIComponent(CONFIG.DIVISIONS.HIGH));
    }

    // Функция для парсинга даты из URL-encoded формата
    function parseDate(dateString) {
        try {
            // Декодируем URL-encoded строку
            var decoded = decodeURIComponent(dateString);
            // Парсим формат "12.10.25 11:00"
            var parts = decoded.split(' ');
            var datePart = parts[0]; // "12.10.25"
            var timePart = parts[1]; // "11:00"
            
            var dateComponents = datePart.split('.');
            var day = parseInt(dateComponents[0]);
            var month = parseInt(dateComponents[1]);
            var year = 2000 + parseInt(dateComponents[2]); // 25 -> 2025
            
            var timeComponents = timePart.split(':');
            var hours = parseInt(timeComponents[0]);
            var minutes = parseInt(timeComponents[1]);
            
            return new Date(year, month - 1, day, hours, minutes);
        } catch (e) {
            return null;
        }
    }

    // Функция для форматирования даты в русском формате
    function formatDate(date) {
        var day = date.getDate();
        var month = decodeURIComponent(encodeURIComponent(CONFIG.MONTHS[date.getMonth()]));
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        return day + ' ' + month + ' ' + year + ', ' +
               (hours < 10 ? '0' : '') + hours + ':' +
               (minutes < 10 ? '0' : '') + minutes;
    }

    // Функция для поиска ближайших турниров
    function findNearestTournaments(data) {
        var currentDate = new Date();
        var futureTournaments = [];
        
        // Парсим все турниры и фильтруем будущие
        for (var i = 1; i < data.length; i++) {
            var row = data[i];
            var dateStr = row[2]; // groupDate
            var tournamentDate = parseDate(dateStr);
            
            if (tournamentDate && tournamentDate > currentDate) {
                futureTournaments.push({
                    groupName: row[0],
                    date: tournamentDate,
                    location: decodeURIComponent(row[3]),
                    team1FullName: decodeURIComponent(row[6]),
                    team2FullName: decodeURIComponent(row[9]),
                    team3FullName: decodeURIComponent(row[12])
                });
            }
        }
        
        // Сортируем по дате
        futureTournaments.sort(function(a, b) {
            return a.date.getTime() - b.date.getTime();
        });
        
        // Находим ближайшую дату
        if (futureTournaments.length === 0) {
            return [];
        }
        
        var nearestDate = futureTournaments[0].date;
        var nearestTournaments = [];
        
        // Собираем все турниры на ближайшую дату (сравниваем только дату, без времени)
        var nearestDateOnly = new Date(nearestDate.getFullYear(), nearestDate.getMonth(), nearestDate.getDate());
        for (var j = 0; j < futureTournaments.length; j++) {
            var tournamentDateOnly = new Date(futureTournaments[j].date.getFullYear(), futureTournaments[j].date.getMonth(), futureTournaments[j].date.getDate());
            if (tournamentDateOnly.getTime() === nearestDateOnly.getTime()) {
                nearestTournaments.push(futureTournaments[j]);
            }
        }
        
        // Сортируем по алфавиту
        nearestTournaments.sort(function(a, b) {
            return a.groupName.localeCompare(b.groupName);
        });
        
        
        // Возвращаем все группы на ближайшую дату (не ограничиваемся 2)
        return nearestTournaments;
    }

    // Функция для загрузки данных турнира
    function loadTournamentData(fileName) {
        var data = getData(fileName);
        if (!data || data.length < 2) {
            alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.LOAD_DATA_ERROR)));
            return;
        }
        
        var allTournaments = findNearestTournaments(data);
        if (allTournaments.length === 0) {
            alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.NO_FUTURE_TOURNAMENTS)));
            return;
        }
        
        // Берем первые 2 группы для первой загрузки
        var tournaments = allTournaments.slice(0, 2);
        tournaments.sort(function(a, b) {
            return a.date.getTime() - b.date.getTime();
        });
        
        // Заполняем данные для первой группы
        if (tournaments.length >= 1) {
            var tournament1 = tournaments[0];
            var group1 = getByNoteInDoc("group1");
            if (group1) {
                var groupName1 = getByNoteInGroup(group1, "groupName");
                if (groupName1) groupName1.contents = tournament1.groupName;

                var team1FullName = getByNoteInGroup(group1, "team1FullName");
                if (team1FullName) formatTeamName(team1FullName, tournament1.team1FullName);

                var team2FullName = getByNoteInGroup(group1, "team2FullName");
                if (team2FullName) formatTeamName(team2FullName, tournament1.team2FullName);

                var team3FullName = getByNoteInGroup(group1, "team3FullName");
                if (team3FullName) formatTeamName(team3FullName, tournament1.team3FullName);

                var groupDate = getByNoteInGroup(group1, "groupDate");
                if (groupDate) groupDate.contents = formatDate(tournament1.date);

                var groupLocation = getByNoteInGroup(group1, "groupLocation");
                if (groupLocation) groupLocation.contents = decodeURIComponent(encodeURIComponent(CONFIG.LOCATION_PREFIX)) + tournament1.location;

                var division = getByNoteInGroup(group1, "division");
                if (division) division.contents = getDivisionName(tournament1.groupName);
            }
        }
        
        // Заполняем данные для второй группы
        if (tournaments.length >= 2) {
            var tournament2 = tournaments[1];
            var group2 = getByNoteInDoc("group2");
            if (group2) {
                var groupName2 = getByNoteInGroup(group2, "groupName");
                if (groupName2) groupName2.contents = tournament2.groupName;

                var team1FullName2 = getByNoteInGroup(group2, "team1FullName");
                if (team1FullName2) formatTeamName(team1FullName2, tournament2.team1FullName);

                var team2FullName2 = getByNoteInGroup(group2, "team2FullName");
                if (team2FullName2) formatTeamName(team2FullName2, tournament2.team2FullName);

                var team3FullName2 = getByNoteInGroup(group2, "team3FullName");
                if (team3FullName2) formatTeamName(team3FullName2, tournament2.team3FullName);

                var groupDate2 = getByNoteInGroup(group2, "groupDate");
                if (groupDate2) groupDate2.contents = formatDate(tournament2.date);

                var groupLocation2 = getByNoteInGroup(group2, "groupLocation");
                if (groupLocation2) groupLocation2.contents = decodeURIComponent(encodeURIComponent(CONFIG.LOCATION_PREFIX)) + tournament2.location;

                var division2 = getByNoteInGroup(group2, "division");
                if (division2) division2.contents = getDivisionName(tournament2.groupName);
            }
        }
        
        redraw();
    }

    // Функция для загрузки следующих двух групп турнира
    function loadNextTournamentData(fileName) {
        var data = getData(fileName);
        if (!data || data.length < 2) {
            alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.LOAD_DATA_ERROR)));
            return;
        }
        
        var allTournaments = findNearestTournaments(data);
        if (allTournaments.length < 3) {
            alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.INSUFFICIENT_GROUPS)));
            return;
        }
        
        // Берем группы 3-4 для второй загрузки
        var tournaments = allTournaments.slice(2, 4);
        tournaments.sort(function(a, b) {
            return a.date.getTime() - b.date.getTime();
        });
        
        // Заполняем данные для первой группы (3-я по алфавиту)
        if (tournaments.length >= 1) {
            var tournament1 = tournaments[0];
            var group1 = getByNoteInDoc("group1");
            if (group1) {
                var groupName1 = getByNoteInGroup(group1, "groupName");
                if (groupName1) groupName1.contents = tournament1.groupName;

                var team1FullName = getByNoteInGroup(group1, "team1FullName");
                if (team1FullName) formatTeamName(team1FullName, tournament1.team1FullName);

                var team2FullName = getByNoteInGroup(group1, "team2FullName");
                if (team2FullName) formatTeamName(team2FullName, tournament1.team2FullName);

                var team3FullName = getByNoteInGroup(group1, "team3FullName");
                if (team3FullName) formatTeamName(team3FullName, tournament1.team3FullName);

                var groupDate = getByNoteInGroup(group1, "groupDate");
                if (groupDate) groupDate.contents = formatDate(tournament1.date);

                var groupLocation = getByNoteInGroup(group1, "groupLocation");
                if (groupLocation) groupLocation.contents = decodeURIComponent(encodeURIComponent(CONFIG.LOCATION_PREFIX)) + tournament1.location;

                var division = getByNoteInGroup(group1, "division");
                if (division) division.contents = getDivisionName(tournament1.groupName);
            }
        }
        
        // Заполняем данные для второй группы (4-я по алфавиту)
        if (tournaments.length >= 2) {
            var tournament2 = tournaments[1];
            var group2 = getByNoteInDoc("group2");
            if (group2) {
                var groupName2 = getByNoteInGroup(group2, "groupName");
                if (groupName2) groupName2.contents = tournament2.groupName;

                var team1FullName2 = getByNoteInGroup(group2, "team1FullName");
                if (team1FullName2) formatTeamName(team1FullName2, tournament2.team1FullName);

                var team2FullName2 = getByNoteInGroup(group2, "team2FullName");
                if (team2FullName2) formatTeamName(team2FullName2, tournament2.team2FullName);

                var team3FullName2 = getByNoteInGroup(group2, "team3FullName");
                if (team3FullName2) formatTeamName(team3FullName2, tournament2.team3FullName);

                var groupDate2 = getByNoteInGroup(group2, "groupDate");
                if (groupDate2) groupDate2.contents = formatDate(tournament2.date);

                var groupLocation2 = getByNoteInGroup(group2, "groupLocation");
                if (groupLocation2) groupLocation2.contents = decodeURIComponent(encodeURIComponent(CONFIG.LOCATION_PREFIX)) + tournament2.location;

                var division2 = getByNoteInGroup(group2, "division");
                if (division2) division2.contents = getDivisionName(tournament2.groupName);
            }
        }
        
        redraw();
    }

//==========================================

    var SESSION = {
        os: $.os.match('Windows') ? 'Windows' : 'Mac',
        dataFileMask: function () {
            return (this.os === 'Windows') ? "*.txt;*.TXT;*.csv;*.CSV;" : function (f) {
                return f instanceof Folder || (f instanceof File && decodeURI(f.name).match(/(\.txt|\.csv)$/i));
            };
        },
    }

    EditText.prototype.getValue = function () {
        return this.text;
    };

    function filePathInput(parent, title, dialogTitle, fileSpec, defaultValue, buttonText) {
        var p = parent.add("panel", undefined, title);
        p.margins = [5, 6, 5, 4];
        p.spacing = 4;
        p.orientation = "row";

        // Используем переданный текст кнопки или значение по умолчанию
        var buttonLabel = buttonText || decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.GROUPS_BUTTON));
        var b = p.add("button", undefined, buttonLabel);

        var disp = p.add('edittext { properties : {readonly : true}, justify : "right" }');
        disp.characters = 50;
        disp.text = defaultValue;
        disp.setValue = function (value) {
            this.text = value;
            this.helpTip = value;
        };

        b.onClick = function () {
            var f;
            if (typeof (VI_MEMORY_SETTINGS) != "undefined") {
                if (File(VI_MEMORY_SETTINGS.lastChosenDataFilePath).exists) {
                    /* no extension on dummy file, because that disables .txt files */
                    f = File(File(VI_MEMORY_SETTINGS.lastChosenDataFilePath).parent + "/" + "VariableImporterDataFile").openDlg(dialogTitle, fileSpec, false);
                } else {
                    f = File.openDialog(dialogTitle, fileSpec);
                }
            } else {
                f = File.openDialog(dialogTitle, fileSpec);
            }
            if (f != null) {
                disp.setValue(decodeURI(f.fsName));
                disp.notify("onChange");
            }
        }
        return disp;
    }

    function validate(UIElements) {
        var res = {
            valid: true,
            problem: ""
        };
        if (UIElements["disp_dataFile"].getValue() === "") {
            res.problem = "Please choose a comma-delimited (.csv) or tab-delimited (.txt) data file first.";
            res.valid = false;
            return res;
        }
    }

    function UIWindow() {
        var w = new Window('dialog', 'NVL', undefined);
        w.spacing = 4;
        w.UIElements = {};

        var g_font = w.add("group");
        g_font.orientation = "row";
        g_font.spacing = 4;
        var maskInput = g_font.add("edittext", undefined, "*_groupName");
        maskInput.size = [200, 20];
        var btn_incFont = g_font.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.FONT_INCREASE)));
        var btn_decFont = g_font.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.FONT_DECREASE)));
        btn_incFont.onClick = changeItemsFont(maskInput, 1);
        btn_decFont.onClick = changeItemsFont(maskInput, -1);
        var btn_moveUp = g_font.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.MOVE_UP)));
        var btn_moveDown = g_font.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.MOVE_DOWN)));
        btn_moveUp.onClick = moveItems(maskInput, 1);
        btn_moveDown.onClick = moveItems(maskInput, -1);

        var g_notes = w.add("group");
        g_notes.orientation = "row";
        g_notes.spacing = 4;
        var btn_showNotes = g_notes.add("button", undefined, "Show notes");
        btn_showNotes.onClick = showNotes;


        var g_file = w.add("group");

        var disp_dataFile = filePathInput(
            g_file,
            "",
            "Choose a .txt (tab-delimited) or .csv (comma-delimited) text file to import.",
            SESSION.dataFileMask(),
            decodeURIComponent(encodeURIComponent(CONFIG.DEFAULT_GROUPS_FILE)),
            decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.GROUPS_TAB))
        );
        var btn_ok = g_file.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.LOAD_BUTTON)));
        w.UIElements["disp_dataFile"] = disp_dataFile;

        var g_rating = w.add("group");

        var rating_dataFile = filePathInput(
            g_rating,
            "",
            "Choose a .txt (tab-delimited) or .csv (comma-delimited) text file to import.",
            SESSION.dataFileMask(),
            decodeURIComponent(encodeURIComponent(CONFIG.DEFAULT_RATING_FILE)),
            decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.RATING_TAB))
        );
        var btn_loadRating1 = g_rating.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.LOAD_RATING_PART1)));
        var btn_loadRating2 = g_rating.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.LOAD_RATING_PART2)));
        btn_loadRating1.onClick = function () {
            try {
                loadRatingFromCsv(rating_dataFile.getValue());
            } catch (e) {
                alert(e);
            }
        }
        btn_loadRating2.onClick = function () {
            try {
                var filePath = rating_dataFile.getValue();
                filePath = filePath.replace(/generated1\.csv$/i, "generated2.csv");
                loadRatingFromCsv(filePath);
            } catch (e) {
                alert(e);
            }
        }
        w.UIElements["rating_dataFile"] = rating_dataFile;

        var g_tournament = w.add("group");

        var tournament_dataFile = filePathInput(
            g_tournament,
            "",
            "Choose a .txt (tab-delimited) or .csv (comma-delimited) text file to import.",
            SESSION.dataFileMask(),
            decodeURIComponent(encodeURIComponent(CONFIG.DEFAULT_TOURNAMENT_FILE)),
            decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.TOURNAMENT_TAB))
        );
        var btn_loadTournament = g_tournament.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.LOAD_TOURNAMENT_1_2)));
        btn_loadTournament.onClick = function () {
            try {
                loadTournamentData(tournament_dataFile.getValue());
            } catch (e) {
                alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.LOAD_DATA_ERROR)) + e.message);
            }
        }
        
        var btn_loadNextTournament = g_tournament.add("button", undefined, decodeURIComponent(encodeURIComponent(CONFIG.UI_LABELS.LOAD_TOURNAMENT_3_4)));
        btn_loadNextTournament.onClick = function () {
            try {
                loadNextTournamentData(tournament_dataFile.getValue());
            } catch (e) {
                alert(decodeURIComponent(encodeURIComponent(CONFIG.ERRORS.LOAD_DATA_ERROR)) + e.message);
            }
        }
        w.UIElements["tournament_dataFile"] = tournament_dataFile;

        var g_btn = w.add("group");
        g_btn.spacing = 4;

        /*var btn_ccl = g_btn.add("button", undefined, decodeURIComponent("%D0%92%D1%8B%D1%85%D0%BE%D0%B4"));
        btn_ccl.onClick = function () {
            w.close(2);
        }*/
        w.defaultElement = btn_ok;

        btn_ok.onClick = function () {
            var validationTest = validate(this.window.UIElements);

            if (validationTest.valid) {
                alert(this.window.UIElements["disp_dataFile"].getValue());
            } else {
                if (validationTest.problem !== "") {
                    alert(validationTest.problem);
                }
            }
        };

        w.onShow = function () {
            populateUI(this.window.UIElements, true);
            this.layout.layout(true);
        };

        if (w.show() === 2) {
            return null;
        }
        return {
            sourceDataPath: disp_dataFile.getValue()
        };
    }

    var userData = UIWindow();
    if (userData == null) {
        // abort mission
        return;
    }

    processUserInput(userData);

    function processUserInput(userInputObj) {
        loadDataFromCsv(userInputObj.sourceDataPath);
    }
}

nvlScript();