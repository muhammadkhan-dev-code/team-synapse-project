# UniRideSync Backend Completion Report

## Phase 1 — Fix Messaging Module Nitpicks

### Requirement Analysis
- **Goal:** Ensure identical error responses (404 Not Found) for both missing rides and unauthorized users when accessing messaging endpoints, mitigating information leakage.
- **Goal:** Key the messaging rate limiter by authenticated user ID instead of IP to avoid false positives shared by NAT/WiFi networks.

### Architecture
- Modified the service layer to catch missing ride logic instead of throwing immediately, unifying it with the unauthorized thread error.
- Modified the rate-limit middleware to inject `keyGenerator` leveraging the populated `req.user.id`.

### Folder Changes
- Modified `src/modules/messages/message.service.js`
- Modified `src/modules/messages/message.routes.js`

### Database Changes
- No schema changes.

### API Design
- Unchanged routes, but behavior refined for `POST /api/v1/rides/:rideId/messages` and `GET /api/v1/rides/:rideId/messages` to return identical 404s.

### Security
- Info-leak mitigation protects against an attacker polling ride IDs to confirm their existence.
- Identity-based rate limiting prevents IP-ban collateral damage.

### Implementation
- `checkParticipant` logic modified to return `false` on missing rides and logs internally for metrics.
- Overrode the default IP key generator in `express-rate-limit` using the JWT payload `user.id`. 

### Testing
- Unit tests written to confirm Phase 1 fix. `message.service.test.js` asserts both failure paths throw identical `THREAD_NOT_FOUND` codes.

### Future Improvements
- Make error unification a middleware generic approach across all modules.

---

## Phase 2 — Ride Lifecycle: 'closed' → 'completed' Transition

### Requirement Analysis
- **Goal:** Transition rides from 'closed' to 'completed' after their departure time passes a certain configurable buffer (3 hours).

### Architecture
- Extended existing cron job and repository queries.
- Extracted constants configurations for better global management.

### Folder Changes
- Modified `src/modules/rides/ride.repository.js`
- Modified `src/modules/rides/ride.cronJobs.js`
- Modified `src/config/constants.js`

### Database Changes
- No schema changes.

### API Design
- No direct user-facing API changes; transitions happen asynchronously on the server.

### Security
- Executed on a scheduled safe environment isolated from user injection vectors.

### Implementation
- Implemented `completeClosedRides` in `ride.repository.js` acting on `$lt` conditional dates based on the configured environment buffer, falling back to 3 hours. Let cron call it sequentially after sweeping `closeExpiredRides`.
- Decision left ambiguous: Kept it as a second `updateMany` call to keep responsibilities distinct and buffers independent. 

### Testing
- Wrote tests in `ride.service.test.js` ensuring the scheduled sweeps fire the mocked repository methods successfully.

### Future Improvements
- Send notifications to participants when a ride wraps to 'completed' requesting a mutual rating.

---

## Phase 3 — Ratings & Ride History Module 

### Requirement Analysis
- **Goal:** Post-ride mutual rating and tracking historical events mapping riders/drivers to completed experiences, fulfilling UC-7 and UC-8.

### Architecture
- Clean architecture layers: `rating.routes.js` → `rating.controller.js` → `rating.service.js` → `rating.repository.js` → `rating.model.js`.
- Implemented `participant.util.js` shared utility enforcing DRY participant checking across messaging and ratings.

### Folder Changes
- Brand new `src/modules/ratings/` module directory mapped with full 5-layer components.
- Added shared `src/utils/participant.util.js`.

### Database Changes
- **New Collection:** Ratings tracking `rideId`, `raterId`, `rateeId`, `score`, and `comment`.
- **Constraint:** Created a compound unique index `{rideId:1, raterId:1, rateeId:1}` ensuring no duplicate submissions per participant pair.
- **Cache Denormalization Tradeoff Documented Decision:** I chose to compute the aggregate rating actively each time a rating is submitted, updating the `averageRating` and `totalRatings` on the `User` document. This optimizes repetitive read performance dramatically on user profile requests at the expensive of minor compute latency on infrequent write events (rating submissions).

### API Design
- `POST /api/v1/rides/:rideId/ratings` — Secure submission of ratings.
- `GET /api/v1/users/:userId/rating-summary` — Public lookup of a rating.
- `GET /api/v1/users/:userId/ride-history` — Secured lookup of past engagements.

### Security
- Verified strict endpoint mapping: `rateeId !== raterId`.
- Re-used `checkParticipant` to verify users actively went on the journey together.
- Ride History restricted strictly to account owners by evaluating `req.user.id`.

### Implementation
- MongoDB Aggregation pipelines utilized heavily to offload statistical analysis to the database engine.
- Express async handlers standardized.

### Testing
- `rating.service.test.js` covering identical authorizations, duplicate blocks, completed gating, and cache propagation events.

### Future Improvements
- Extend history views with richer pagination filters and graph data plotting progression metrics over given semesters.

---

## Phase 4 — Testing Framework Setup + Coverage

### Requirement Analysis
- **Goal:** Build a cohesive jest testing layer integrated securely across `modules/`. Isolated dependencies using mongodb-memory-server.

### Architecture
- Root `tests/` directory mapped to child feature domains mirroring `src/`.
- Configured DB memory utility wrapper intercepting raw Mongoose DB interactions statically. Mock abstractions explicitly for services testing business layers directly.

### Folder Changes
- Created top-level `tests/` and structured `requests/`, `rides/`, `messages/`, `ratings/`.
- Created `.test.js` files testing isolated capabilities.

### Database Changes
- Test environment runs off isolated short-lived local RAM.

### Implementation
- Unit tests written wrapping Jest modules mocked around repositories. Addressed explicit business logic paths across all targeted endpoints assuring proper auth/seat counts.
- Small happy-path integration test testing application framework health.

### Testing
- npm package updated.

### Future Improvements
- Implement E2E Cypress or Playwright strategies validating front-end connectivity. Full E2E test seeding in integration environments.
