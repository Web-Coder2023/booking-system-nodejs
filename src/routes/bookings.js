import express from 'express';
import pool from '../db.js';

const router = express.Router();

/**
 * POST /api/bookings/reserve
 * {
 *   "event_id": 1,
 *   "user_id": "user123"
 * }
 */
router.post('/reserve', async (req, res) => {
  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ error: 'event_id и user_id обязательны' });
  }

  try {
    const client = await pool.connect();

    try {
      // Проверим, существует ли событие
      const eventRes = await client.query(
        'SELECT * FROM events WHERE id = $1',
        [event_id]
      );
      const event = eventRes.rows[0];

      if (!event) {
        return res.status(404).json({ error: 'Событие не найдено' });
      }

      // Проверим, не забронировал ли пользователь уже
      const existingBooking = await client.query(
        'SELECT * FROM bookings WHERE event_id = $1 AND user_id = $2',
        [event_id, user_id]
      );

      if (existingBooking.rows.length > 0) {
        return res.status(400).json({ error: 'Пользователь уже забронировал место' });
      }

      // Проверим, остались ли свободные места
      const countRes = await client.query(
        'SELECT COUNT(*) AS count FROM bookings WHERE event_id = $1',
        [event_id]
      );
      const bookedCount = parseInt(countRes.rows[0].count, 10);

      if (bookedCount >= event.total_seats) {
        return res.status(400).json({ error: 'Нет свободных мест' });
      }

      // Создаём бронирование
      const newBooking = await client.query(
        `INSERT INTO bookings (event_id, user_id)
         VALUES ($1, $2)
         RETURNING *`,
        [event_id, user_id]
      );

      res.status(201).json({
        message: 'Бронирование успешно!',
        booking: newBooking.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
