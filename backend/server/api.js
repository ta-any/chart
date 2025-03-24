// server/api.js
import express from 'express';
import { pool } from './config.js';
import { back } from './cronJob.js'
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; // Импортируем утилиту для преобразования URL в путь

// Эмулируем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
    const scriptPath = path.join(__dirname, '../db/init.sql');

    try {
        // Проверка существования файла
        await fs.access(scriptPath);

        // Чтение SQL-скрипта
        const script = await fs.readFile(scriptPath, 'utf8');

        // Выполнение SQL-скрипта
        await pool.query(script);

        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1); // Завершение процесса с ошибкой
    }
};

// Вызов функции инициализации базы данных
// initDatabase();

const app = express();

// app.use(cors());
app.use(express.json());


// Получить данные за определённый день
app.get('/api', async (req, res) => {
    const data = req.query.data;
    const query = 'SELECT * FROM tprices WHERE data = ?';
    console.log(data)

    if (!data) {
        return res.status(400).json({ error: 'Необходимо указать data' });
    }

    try {
        const [results] = await pool.execute(query, [data], (err, results) => {
            if (err) {
                console.error('Ошибка при выполнении запроса:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
        });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Данные не найдены' });
        }
        res.json(results);
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить данные за интервал дат
app.get('/api/interval', async (req, res) => {
    const startDate = req.query.startDate; // Начальная дата интервала
    const endDate = req.query.endDate;   // Конечная дата интервала
    console.log(startDate, endDate)

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Необходимо указать startDate и endDate' });
    }

    const query = 'SELECT * FROM tprices WHERE data BETWEEN ? AND ?';

    try {
        const [results] = await pool.execute(query, [endDate, startDate]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Данные не найдены' });
        }
        res.json(results);
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

back

// Запуск сервера
app.listen(3030, () => {
    console.log('Сервер запущен на http://localhost:3030');
});



