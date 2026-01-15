import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';

export class DocxService {
    constructor() {
        this.templatePath = path.join(process.cwd(), 'templates', 'roster-template.docx');
    }

    /**
     * Генерирует DOCX файл с заявкой команды
     * @param {Object} team - Объект команды
     * @param {Array} players - Массив игроков
     * @returns {Promise<Buffer>} - Buffer с содержимым DOCX файла
     */
    async generateRosterDoc(team, players) {
        return new Promise((resolve, reject) => {
            try {
                // Чтение шаблона
                const content = fs.readFileSync(this.templatePath, 'binary');
                const zip = new PizZip(content);

                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true
                });

                // Создаем массив из 18 элементов: сначала игроки, затем пустые строки
                const allPlayers = [];

                // Добавляем реальных игроков
                players.forEach((player, index) => {
                    allPlayers.push({
                        number: index + 1,
                        name: player.name,
                        birthYear: player.birthYear || '-',
                        hasOutcome: player.currentOutcome ? '✓' : ''
                    });
                });

                for (let i = players.length; i < 20; i++) {
                    allPlayers.push({
                        number: i + 1,
                        name: '',
                        birthYear: '',
                        hasOutcome: ''
                    });
                }

                // Подготовка данных для шаблона
                const data = {
                    teamName: team.name,
                    players: allPlayers, // Используем массив с пустыми строками
                    totalPlayers: players.length, // Реальное количество игроков
                    date: new Date().toLocaleDateString('ru-RU')
                };

                // Заполнение шаблона
                doc.render(data);

                // Генерация файла
                const buffer = doc.getZip().generate({
                    type: 'nodebuffer',
                    compression: 'DEFLATE'
                });

                resolve(buffer);
            } catch (error) {
                console.error('Ошибка при генерации DOCX:', error);
                reject(error);
            }
        });
    }

    /**
     * Сохраняет файл на диск
     * @param {Buffer} buffer - Buffer с содержимым файла
     * @param {string} filename - Имя файла для сохранения
     * @returns {Promise<string>} - Путь к сохраненному файлу
     */
    async saveDocToFile(buffer, filename) {
        return new Promise((resolve, reject) => {
            const outputPath = path.join(process.cwd(), 'output', filename);

            // Создаем директорию output если её нет
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFile(outputPath, buffer, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(outputPath);
                }
            });
        });
    }
}

export default DocxService;