// server/api.js
import express from 'express';
import { pool } from './config.js';
import { back } from './cronJob.js'

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
        const [results] = await pool.query(query, [data], (err, results) => {
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
        const [results] = await pool.query(query, [endDate, startDate]);

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



