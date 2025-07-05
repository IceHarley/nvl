#target
illustrator

#targetengine
main
//the ui has problems and crashes when this isn't used
#script
"nvlScript"

function nvlScript() {


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
        var splitter = (type == '.txt') ? '\t' : ',';
        df.open('r');
        var fileContents = df.read();
        var firstRow = fileContents.split(/[\r\n]/g)[0];
        if (firstRow != null && splitter != "\t") {
            if (firstRow.indexOf(",") == -1 && firstRow.indexOf(";") > -1) {
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
    };

    function getData(filePath) {
        try {
            return getTextData(File(filePath));
        } catch (e) {
            alert(e);
            return null;
        }
    };

    function checkRowForAllBlanks(row) {
        for (var i = 0; i < row.length; i++) {
            if (row[i] != '') {
                return false;
            }
        }
        return true;
    };


//==================================================================================//

    var doc = app.activeDocument;

    function findItalicFont(currentFont) {
        for (var i = 0; i < app.textFonts.length; i++) {
            if (app.textFonts[i].family === currentFont.family && app.textFonts[i].style === "Italic") {
                return app.textFonts[i];
            }
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
                alert(decodeURIComponent('%D0%9D%D0%B5%D0%BA%D0%BE%D1%80%D1%80%D0%B5%D0%BA%D1%82%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%84%D0%B0%D0%B9%D0%BB%D0%B0%3A%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B5%20%D0%BD%D0%B5%20%D1%81%D0%BE%D0%B2%D0%BF%D0%B0%D0%B4%D0%B0%D0%B5%D1%82%20%D1%81%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%21'));
            }

            for (var j = 0; j < values.length; j++) {
                values[j] = decodeURIComponent(values[j]);
            }

            var group = getGroup(doc.layers.getByName("groupsLayer").groupItems, values[0]);
            if (group) {
                group.hidden = values[1].trim() === 'true' ? false : true;
            } else {
                alert(decodeURIComponent('%D0%9D%D0%B5%20%D0%BD%D0%B0%D0%B9%D0%B4%D0%B5%D0%BD%D0%B0%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0%20') + values[0]);
            }//Не найдена группа ...

            for (var col = 0; col < header.length; col++) {
                var item = getByNoteInGroup(group, header[col]);
                if (item) {
                    if (header[col].endsWith("FullName")) {
                        item.contents = beforeLast(values[col], " ");
                        var city = item.words.add(afterLast(values[col], " "));
                        city.characterAttributes.textFont = findItalicFont(item.textRange.textFont);
                    } else {
                        item.contents = values[col];
                    }
                }
            }
        }
    }

    function loadRatingFromCsv(fileName) {
        var data = getData(fileName);
        const header = data[0];
        const values = data[1];
        if (header.length !== values.length) {
            //Некорректный формат файла: количество полей в заголовке не совпадает с количеством полей данных!
            alert(decodeURIComponent('%D0%9D%D0%B5%D0%BA%D0%BE%D1%80%D1%80%D0%B5%D0%BA%D1%82%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%84%D0%B0%D0%B9%D0%BB%D0%B0%3A%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B5%20%D0%BD%D0%B5%20%D1%81%D0%BE%D0%B2%D0%BF%D0%B0%D0%B4%D0%B0%D0%B5%D1%82%20%D1%81%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%21'));
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

        var top6Color = new RGBColor();
        top6Color.red = 254;
        top6Color.green = 133;
        top6Color.blue = 53;
        var top6BorderColor = new RGBColor();
        top6BorderColor.red = 178;
        top6BorderColor.green = 0;
        top6BorderColor.blue = 0;
        var mainColor = new RGBColor();
        mainColor.red = 254;
        mainColor.green = 133;
        mainColor.blue = 53;
        var mainBorderColor = new RGBColor();
        mainBorderColor.red = 255;
        mainBorderColor.green = 255;
        mainBorderColor.blue = 255;
        var mainTextColor = new RGBColor();
        mainBorderColor.red = 0;
        mainBorderColor.green = 0;
        mainBorderColor.blue = 0;

        for (var i = 1; i < data.length; i++) {
            var group = getRatingLine(items, i);
            if (group) {
                group.hidden = data[i][14] !== '1';
                getByNote('place', group).contents = data[i][0];
                getByNote('place', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('delta', group).contents = getDelta(data[i][1]);
                getByNote('delta', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('team', group).contents = data[i][2];
                getByNote('team', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('group1', group).contents = '  ' + data[i][3];
                getByNote('group1', group).textRange.justification = Justification.CENTER;
                getByNote('group1', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('place1', group).contents = getPlaceSymbol(data[i][4]);
                getByNote('place1', group).textRange.characterAttributes.textFont = app.textFonts.getByName('AdobePiStd');
                getByNote('place1', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('place1', group).contents = getPlaceSymbol(data[i][4]);
                getByNote('rating1', group).contents = data[i][5];
                getByNote('rating1', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('group2', group).contents = '  ' + data[i][6];
                getByNote('group2', group).textRange.justification = Justification.CENTER;
                getByNote('group2', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('place2', group).contents = getPlaceSymbol(data[i][7]);
                getByNote('place2', group).textRange.characterAttributes.textFont = app.textFonts.getByName('AdobePiStd');
                getByNote('place2', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('rating2', group).contents = data[i][8];
                getByNote('rating2', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('group3', group).contents = '  ' + data[i][9];
                getByNote('group3', group).textRange.justification = Justification.CENTER;
                getByNote('group3', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('place3', group).contents = getPlaceSymbol(data[i][10]);
                getByNote('place3', group).textRange.characterAttributes.textFont = app.textFonts.getByName('AdobePiStd');
                getByNote('place3', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('rating3', group).contents = data[i][11];
                getByNote('rating3', group).textRange.characterAttributes.fillColor = mainTextColor;
                getByNote('rating', group).contents = data[i][12];
                getByNote('rating', group).textRange.characterAttributes.fillColor = mainTextColor;
                for (var j = 0; j < group.pathItems.length; j++) {
                    if (group.pathItems[j].name.startsWith('back ')) {
                        group.pathItems[j].fillColor = data[i][15] === '1' ? top6Color : mainColor;
                        // group.pathItems[j].opacity = data[i][15] === '1' ? 60 : 100;
                    }
                    if (group.pathItems[j].name.startsWith('border')) { //первые 6 строк
                        group.pathItems[j].strokeColor = data[i][15] === '1' ? top6BorderColor : mainColor;
                        group.pathItems[j].opacity = data[i][15] === '1' ? 100 : 100;
                    } else if (group.pathItems[j].name.startsWith('rect')) { //остальные
                        group.pathItems[j].strokeColor = mainColor;
                        group.pathItems[j].opacity = data[i][15] === '1' ? 100 : 100;
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

    function getByNameInDoc(name) {
        for (var i = 0; i < doc.pageItems.length; i++) {
            var item = doc.pageItems[i];
            if (item.contents === name) {
                return item;
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

    function generateVariables() {
        var items = doc.layers[0].groupItems;
        for (var i = 65; i <= 85; i++) {
            var group = String.fromCharCode(i);
            var item = getGroup(items, group);

            if (item) {
                addVariable(item, group + '_visible', VariableKind.VISIBILITY);
                addNote(item, group + '_visible');
                var frames = item.textFrames;
                for (var j = 0; j < frames.length; j++) {
                    var frame = frames[j];
                    addVariable(frame, group + '_' + frame.contents, VariableKind.TEXTUAL);
                    addNote(frame, group + '_' + frame.contents);
                }
            }
        }
    }

    function generateRatingVariables() {
        var items = doc.layers[0].groupItems;
        for (var i = 1; i <= 30; i++) {
            var item = getRatingLine(items, i);
            if (item) {
                var frames = item.textFrames;
                for (var j = 0; j < frames.length; j++) {
                    var frame = frames[j];
                    addNote(frame, frame.contents);
                }
            }
        }
    }

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

    function addVariable(frame, varName, kind) {
        if (frame.contentVariable) {
            return;
        }
        var variable = doc.variables.add();
        try {
            variable.name = varName;
            variable.kind = kind;
            if (kind === VariableKind.VISIBILITY) {
                frame.visibilityVariable = variable;
            } else {
                frame.contentVariable = variable;
            }
        } catch (e) {
            alert(e);
            variable.remove();
        }
    }

    function addNote(item, value) {
        item.note = value;
    }

//==========================================

    var SESSION = {
        os: $.os.match('Windows') ? 'Windows' : 'Mac',
        dataFileMask: function () {
            return (this.os == 'Windows') ? "*.txt;*.TXT;*.csv;*.CSV;" : function (f) {
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
        var buttonLabel = buttonText || decodeURIComponent("%D0%A4%D0%B0%D0%B9%D0%BB%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8");
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
    };

    function validate(UIElements) {
        var res = {
            valid: true,
            problem: ""
        };
        if (UIElements["disp_dataFile"].getValue() == "") {
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
        var maskLabel = g_font.add("statictext", undefined, decodeURIComponent("%D0%9C%D0%B0%D1%81%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20note%3A%20"));
        var maskInput = g_font.add("edittext", undefined, "*_groupName");
        maskInput.size = [200, 20];
        var btn_incFont = g_font.add("button", undefined, decodeURIComponent("%D0%A8%D1%80%D0%B8%D1%84%D1%82") + " \u2795");
        var btn_decFont = g_font.add("button", undefined, decodeURIComponent("%D0%A8%D1%80%D0%B8%D1%84%D1%82") + " \u2796");
        btn_incFont.onClick = changeItemsFont(maskInput, 1);
        btn_decFont.onClick = changeItemsFont(maskInput, -1);
        var btn_moveUp = g_font.add("button", undefined, decodeURIComponent("%D0%92%D0%B2%D0%B5%D1%80%D1%85"));
        var btn_moveDown = g_font.add("button", undefined, decodeURIComponent("%D0%92%D0%BD%D0%B8%D0%B7"));
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
            decodeURIComponent("D%3A%5CWork%5CNVL%5C2025%20%D0%BE%D1%81%D0%B5%D0%BD%D1%8C%5C%D0%9E%D1%81%D0%B5%D0%BD%D1%8C%202025%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B%20%D0%BD%D0%B0%201%20%D1%82%D1%83%D1%80.csv"),
            decodeURIComponent("%D0%93%D1%80%D1%83%D0%BF%D0%BF%D1%8B")
        );
        var btn_ok = g_file.add("button", undefined, decodeURIComponent('%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%B8%D1%82%D1%8C'));
        w.UIElements["disp_dataFile"] = disp_dataFile;

        var g_rating = w.add("group");

        var rating_dataFile = filePathInput(
            g_rating,
            "",
            "Choose a .txt (tab-delimited) or .csv (comma-delimited) text file to import.",
            SESSION.dataFileMask(),
            decodeURIComponent("D%3A%5CWork%5CNVL%5C2025%20%D0%BE%D1%81%D0%B5%D0%BD%D1%8C%5C%D0%A0%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%20%D0%9E%D1%81%D0%B5%D0%BD%D1%8C%202025%20generated1.csv"),
            decodeURIComponent("%D0%A0%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3")
        );
        var btn_loadRating1 = g_rating.add("button", undefined, decodeURIComponent('%D0%A7%D0%B0%D1%81%D1%82%D1%8C%201'));
        var btn_loadRating2 = g_rating.add("button", undefined, decodeURIComponent('%D0%A7%D0%B0%D1%81%D1%82%D1%8C%202'));
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
                if (validationTest.problem != "") {
                    alert(validationTest.problem);
                }
            }
        };

        w.onShow = function () {
            populateUI(this.window.UIElements, true);
            this.layout.layout(true);
        };

        if (w.show() == 2) {
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