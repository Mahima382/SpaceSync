# SpaceSync — Backend API
### Node.js + Express + Sequelize + MySQL

---

## Folder Structure

```
spacesync-backend/
│
├── .env                     ← Your DB credentials (edit this)
├── .env.example             ← Reference copy
├── package.json
│
└── src/
    ├── server.js            ← Entry point, starts Express
    │
    ├── config/
    │   └── database.js      ← Sequelize connection setup
    │
    ├── models/
    │   ├── index.js         ← Associations (Resource hasMany Booking)
    │   ├── Resource.js      ← id, name, type, capacity
    │   └── Booking.js       ← id, resource_id (FK), requested_by, booking_date, status
    │
    ├── routes/
    │   ├── resources.js     ← GET /api/resources, POST /api/resources
    │   └── bookings.js      ← GET/POST /api/bookings, DELETE /api/bookings/:id
    │
    ├── middleware/
    │   └── errorHandler.js  ← 404 + global error handler
    │
    └── seeders/
        └── seedResources.js ← Populates 5 sample resources
```

---

## Step-by-Step Setup

### Step 1 — Create the MySQL database

Open MySQL (via terminal, MySQL Workbench, or phpMyAdmin) and run:

```sql
CREATE DATABASE spacesync_db;
```

### Step 2 — Configure environment

Open the `.env` file and fill in your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=spacesync_db
DB_USER=root
DB_PASS=your_mysql_password_here
PORT=3000
```

> Leave `DB_PASS=` empty if your MySQL has no password set.

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Start the server

```bash
npm run dev
```

You should see:
```
✔  Database connection established
✔  Database synced (tables ready)

┌────────────────────────────────────────┐
│  SpaceSync API running                  │
│  http://localhost:3000                  │
└────────────────────────────────────────┘
```

> Sequelize automatically creates the `resources` and `bookings` tables on first run.

### Step 5 — Seed sample resources

```bash
npm run seed
```

This inserts 5 resources into the database:
- Networking Lab (Lab, cap: 30)
- Seminar Library (Library, cap: 50)
- Multimedia Projector A (Equipment, cap: 1)
- Conference Room 101 (Room, cap: 20)
- Computer Lab B (Lab, cap: 40)

---

## API Endpoints

### Resources

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/resources` | — | Get all resources |
| POST | `/api/resources` | `{ name, type, capacity }` | Create a resource |

### Bookings

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings` | — | Get all bookings (with Resource data joined) |
| POST | `/api/bookings` | `{ resource_id, requested_by, booking_date }` | Create a booking |
| DELETE | `/api/bookings/:id` | — | Cancel a booking |

---

## Testing with Postman

**Create a resource manually:**
```
POST http://localhost:3000/api/resources
Content-Type: application/json

{ "name": "Physics Lab", "type": "Lab", "capacity": 25 }
```

**Create a booking:**
```
POST http://localhost:3000/api/bookings
Content-Type: application/json

{
  "resource_id": 1,
  "requested_by": "Dr. Rahman",
  "booking_date": "2026-05-10"
}
```

**Double-booking test** (same resource_id + same date returns 400):
```json
{ "error": "\"Networking Lab\" is already booked on 2026-05-10. Please choose a different date." }
```

---

## Frontend Connection

The React frontend (Vite, port 5173) proxies all `/api` calls to this server at port 3000. Both must be running simultaneously:

```bash
# Terminal 1 — Backend
cd spacesync-backend
npm run dev

# Terminal 2 — Frontend
cd spacesync
npm run dev
```

Then open: **http://localhost:5173**
