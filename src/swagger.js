import yaml from 'yamljs';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Booking System API',
    version: '1.0.0',
    description: 'API для бронирования мест на мероприятие',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Локальный сервер',
    },
  ],
  paths: {
    '/api/bookings/reserve': {
      post: {
        summary: 'Забронировать место на мероприятие',
        tags: ['Bookings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  event_id: { type: 'integer', example: 1 },
                  user_id: { type: 'string', example: 'user123' },
                },
                required: ['event_id', 'user_id'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Бронирование успешно',
          },
          400: {
            description: 'Ошибка валидации или пользователь уже забронировал',
          },
          404: {
            description: 'Событие не найдено',
          },
          500: {
            description: 'Ошибка сервера',
          },
        },
      },
    },
  },
};

export default swaggerSpec;
