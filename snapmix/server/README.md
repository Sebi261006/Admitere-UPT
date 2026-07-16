# SnapMix mock API

Run the mock API server for local development.

Install dependencies:

```bash
cd server
npm install
```

Start server:

```bash
npm run dev
```

API endpoints:
- `GET /api/bookings`
- `POST /api/bookings` {name,email,date,...}
- `GET /api/messages`
- `POST /api/messages` {name,email,message}
