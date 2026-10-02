# Deploy SocialShield to Vercel

The repository is configured as one Vercel project: Vite builds the React frontend to `frontend/dist`, and `api/[...path].js` sends `/api/*` requests to the Node.js Express API. The built-in Node.js threat analysis runs in the API, so the Python service is not required for this deployment.

## One-time setup

1. Push this repository to GitHub and import it in Vercel.
2. Keep the Vercel project **Root Directory** at the repository root. The included `vercel.json` sets the install command, frontend build command, output directory, and Node function.
3. Create a MongoDB Atlas database and allow connections from Vercel. Copy its application connection string.
4. In Vercel **Settings → Environment Variables**, add:
   - `MONGODB_URI` = the Atlas connection string, including the database name `socialshield`.
   - Apply it to Production and Preview (and Development if using Vercel CLI).
5. Deploy. Open the generated Vercel URL and create an account with an email address and a password of at least 8 characters containing uppercase, lowercase, and numeric characters.

The database stores accounts, expiring login sessions, and each user's scan history. Set a unique account email index and use a database user limited to the `socialshield` database. Do not commit the connection string or put it in frontend environment variables.

## Local use

Local development remains the same: start `backend-node` with `npm start` and `frontend` with `npm run dev`. Configure `MONGODB_URI` in `backend-node/.env` for persistent shared storage; without MongoDB, the API uses local JSON files for development only.

## Deployment notes

- Each `/api/*` request runs through a Vercel Node function; Vercel may start multiple function instances. Accounts and sessions use MongoDB rather than per-process memory in this mode.
- The local JSON account/history fallback is not used when Vercel cannot connect to MongoDB. In that case API requests return a database-unavailable response; configure `MONGODB_URI` before deploying.
- Vercel deployments are serverless; they do not run `node server.js` as a persistent web server.
- Capacity for 100–150 simultaneous users still needs load testing against the selected Vercel plan and MongoDB tier. See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).
