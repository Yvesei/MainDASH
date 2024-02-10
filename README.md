# MainDash

Task and client management built with Vue, Express, Prisma and MySQL.

![MainDash dashboard](docs/maindash.png)

## Docker

Run the full stack:

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). The first run applies migrations and creates:

| Login | Password |
| --- | --- |
| `admin` | `admin` |

For a shared deployment, copy `.env.example` to `.env` and set your own database passwords and `JWT_KEY`:

```sh
cp .env.example .env
docker compose up --build -d
```

`mysql_data` and `uploads_data` keep database records and uploads. Use `docker compose down` to stop the stack. `docker compose down -v` removes those volumes.

The Compose file is for local HTTP use and sets `COOKIE_SECURE=false`. Use HTTPS and set `COOKIE_SECURE=true` outside local development.

## Run locally

Requires Node.js, npm and MySQL.

1. Install dependencies in both directories:

   ```sh
   cd server && npm install
   cd ../client && npm install
   ```

2. Create `server/.env`:

   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/maindash"
   JWT_KEY="replace-with-a-long-random-secret"
   ```

3. Apply migrations and seed the administrator:

   ```sh
   cd server
   npx prisma migrate dev
   node seeds/seed.js
   ```

4. Start the API and frontend in separate terminals:

   ```sh
   cd server && npm start
   ```

   ```sh
   cd client && npm start
   ```

   The frontend runs at `http://localhost:8080` and expects the API on port 3000. Set `VUE_APP_API_URL` in `client/.env.local` to change the API URL.

For a production client build, run `npm run build` in `client`. Production cookies require HTTPS.

## Production configuration

Use HTTPS with `NODE_ENV=production`. If the frontend is on another origin, set `CORS_ORIGINS` and build the client with the right `VUE_APP_API_URL`.

Run API tests with `cd server && npm test`.
