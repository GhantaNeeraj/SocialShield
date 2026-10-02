# SocialShield system design

## Goal

Design SocialShield for approximately 100–150 users working at the same time. This is a planning target, not a measured capacity claim. The current repository is a single machine development build and has not been load tested.

## Request flow

```text
Browser
  -> CDN / Vercel static hosting
  -> Vercel Node.js API functions
       -> MongoDB (accounts, expiring sessions, per-user scan history)
       -> bounded native Node.js threat analysis
```

The browser serves the React application from Vercel's static hosting. A catch-all Node.js function handles API requests, checks the signed-in user's MongoDB session, validates the input, runs message and URL analysis, and saves results under that user's ID. A TTL index expires session records. The browser only receives the fields it needs to display the result.

## Capacity approach for 100–150 concurrent users

Use Vercel's static hosting and serverless Node.js functions with a managed MongoDB replica set. Keep the web client cacheable. Vercel adds function instances as requests arrive; MongoDB connection pooling must be bounded to avoid connection spikes. The included pool cap is 10 per warm function instance. Actual capacity depends on plan limits, function concurrency, MongoDB tier, request size, and scan rate.

Keep function instances stateless. Store only a hash of each opaque session token in MongoDB with an expiry so a user can move between instances. Locally, when MongoDB is unavailable, the app uses an in-process session map and JSON account data; that fallback is only for one development process and a restart signs the user out.

Apply request body limits, per-user rate limits, API timeouts, and a bounded analysis queue. Reject or defer excess work instead of letting bursts exhaust memory. If scan bursts exceed function execution limits, put analysis jobs on a durable queue and return a job ID for the browser to poll. Add this only when measurements show synchronous requests are saturated.

Create MongoDB indexes on `{ ownerId: 1, createdAt: -1 }` for history and `{ email: 1 }` with a unique constraint for accounts. Paginate history, retain data for a defined period, and back up the database. Avoid unbounded collection reads. The JSON fallback is for local development only; it is not safe shared storage for multiple API instances.

## Security and reliability

- Serve the application and API over HTTPS outside localhost.
- Store passwords only as salted, slow password hashes. Never log passwords, tokens, or submitted message contents.
- Keep session state shared between instances, rotate/revoke sessions on logout, and expire inactive sessions.
- Authorize every scan read and deletion against the authenticated owner ID.
- Validate input length and type, set strict CORS origins, and rate-limit account creation and login.
- Use health/readiness endpoints, structured logs, request IDs, and metrics for latency, errors, queue depth, and database connections.
- Use timeouts and circuit breakers for the analysis service; return a clear temporary-unavailable response if it is down.

## Capacity validation

Before claiming support for 100–150 concurrent users, run a staged load test with realistic message and URL lengths. Measure concurrent active sessions separately from requests per second. Track p50/p95/p99 response time, error rate, API and analysis CPU/memory, database latency and connection use, and queue depth. Increase worker count or database capacity based on the bottleneck, then repeat with a failure test that removes one API or analysis instance.

## System design topics used

1. Client–server architecture and API boundaries.
2. Horizontal scaling, stateless services, and load balancing.
3. Authentication, session management, authorization, and tenant isolation.
4. Persistence, indexing, pagination, backup, and data retention.
5. Caching and shared session state.
6. Rate limiting, input validation, and abuse prevention.
7. Queues, backpressure, and asynchronous job processing.
8. Timeouts, health checks, circuit breakers, and graceful degradation.
9. Observability, capacity planning, and load testing.
10. Security and secrets management.
