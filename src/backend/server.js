import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // Разрешаем CORS-запросы

app.get('/proxy/phone', async (req, res) => {
    const { num } = req.query;
    if (!num) {
        return res.status(400).json({ error: 'Номер не указан' });
    }

    try {
        const response = await fetch(`https://num.voxlink.ru/get/?num=${num}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0', // Обход возможных блокировок
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Ошибка при получении данных' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
    }
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
