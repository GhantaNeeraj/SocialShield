# SocialShield

SocialShield is a security analysis dashboard for reviewing suspicious messages and links. It highlights risk indicators, provides recommended next steps, and keeps scan history separated by user account.

## Features

- Message and link threat scanning with a combined risk score.
- Explainable indicators and recommended actions.
- Per-account scan history, filtering, and deletion.
- Detection quality dashboard and example scenarios.
- Email and password account registration and sign-in.

## Run locally

Prerequisites: Node.js and the included dependencies.

1. Start the Node API from `backend-node`:

   ```powershell
   npm start
   ```

   It listens on port 5000 and runs the Node.js threat scanner. Set `MONGODB_URI` for MongoDB persistence; local development can use the JSON fallback.

2. Start the web app from `frontend`:

   ```powershell
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

Create an account with your email address and a password of at least eight characters, including an uppercase letter, a lowercase letter, and a number. Passwords are stored as salted hashes. The local account file and JSON history fallback are for single-instance development use; use MongoDB before running multiple API instances.

## System design and scale

The current project is a local development app. It has not been load tested and should not yet be described as proven for 100–150 concurrent users. See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for the proposed scaled architecture, operational safeguards, validation plan, and system design topics used.

## Deploy to Vercel

The repo includes a Vercel setup for one project using the Node.js API and the built-in Node threat scanner. Configure `MONGODB_URI` in Vercel before deploying. Follow [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for setup steps.

## Stack

- React and Vite web client.
- Node.js and Express API with MongoDB storage and a local development fallback.
- Node.js message and URL threat analysis.
