# Booking System Node.js

API для бронирования мест на мероприятия с автодокументацией Swagger и контейнерами Docker.

---

## 📂 Структура проекта

booking-system-nodejs/
├─ docker-compose.yml
├─ nginx/
│ └─ nginx.conf
├─ docker/app/Dockerfile
├─ initdb/
│ └─ init.sql
├─ src/
│ ├─ index.js
│ ├─ db.js
│ ├─ routes/
│ │ └─ bookings.js
│ └─ swagger.js
├─ .env.example
├─ package.json
└─ README.md


---

## ⚙️ Настройка окружения

1. Скопируйте пример `.env`:

```bash
cp .env.example .env
```

2. Отредактируйте при необходимости переменные в .env:
```bas
PORT=5000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=booking_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

# 🐳 Запуск через Docker
# Сборка и запуск контейнеров

```bash
docker compose up --build
```

Контейнеры:
booking-db — PostgreSQL
booking-app — Node.js/Express
booking-nginx — Nginx, проксирует запросы к Express

# Просмотр логов контейнеров
```bash
docker compose logs -f
```

# Остановка и удаление контейнеров
```bash
docker compose down
```

# Управление контейнерами
Перезапуск:
```bash
docker compose restart
```

Вход в контейнер приложения:
```bash
docker exec -it booking-app sh
```

Вход в базу PostgreSQL:
```bash
docker exec -it booking-db psql -U postgres -d booking_db
```

# 🚀 API
Swagger UI: http://localhost:5000/api-docs

# Пример запроса бронирования:
```bash
curl -X POST http://localhost/api/bookings/reserve \
-H "Content-Type: application/json" \
-d '{"event_id": 1, "user_id": "user123"}'
```

Пример успешного ответа:
```bash
{
  "message": "Бронирование успешно!",
  "booking": {
    "id": 1,
    "event_id": 1,
    "user_id": "user123",
    "created_at": "2025-10-15T10:00:00.000Z"
  }
}
```

# ✅ 🔧 Быстрые команды тестирования

Проверка бронирования одного пользователя дважды:
```bash
curl -X POST http://localhost/api/bookings/reserve \
-H "Content-Type: application/json" \
-d '{"event_id": 1, "user_id": "user123"}'

curl -X POST http://localhost/api/bookings/reserve \
-H "Content-Type: application/json" \
-d '{"event_id": 1, "user_id": "user123"}'
```

Проверка лимита мест (например, 50 мест):
Создать 51 бронирование через скрипт или цикл curl и убедиться, что последний запрос возвращает ошибку.