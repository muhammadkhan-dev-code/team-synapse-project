/**
 * request.service.js
 * ------------------
 * ALL business logic for the Ride Requests module lives here.
 * No Mongoose imports, no HTTP-layer concerns.
 * Services call repositories; cross-module calls go through the other
 * module's repository (ride.repository), never its service.
 */

const requestRepository = require('./request.repository');
const rideRepository = require('../rides/ride.repository');
const ApiError = require('../../utils/ApiError');
const ERROR = require('../../errors/errorCodes');
const { sendNotificationEmail } = require('../../utils/mailer');

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Assert that a ride request exists. Throws 404 if not found.
 * @param {string} id
 * @returns {Promise<RideRequest>}
 */
const getRequestOrThrow = async (id) => {
  const request = await requestRepository.findRequestById(id);
  if (!request) {
    throw new ApiError(404, 'Ride request not found', ERROR.REQUEST_NOT_FOUND);
  }
  return request;
};

/**
 * Assert that a ride exists. Throws 404 if not found.
 * @param {string} id
 * @param {boolean} [populateDriver=false]
 * @returns {Promise<Ride>}
 */
const getRideOrThrow = async (id, populateDriver = false) => {
  const ride = await rideRepository.findRideById(id, populateDriver);
  if (!ride) {
    throw new ApiError(404, 'Ride not found', ERROR.RIDE_NOT_FOUND);
  }
  return ride;
};

/**
 * Resolve driver _id to a plain string regardless of whether the driver
 * field is populated (object with _id) or a raw ObjectId.
 * @param {Ride} ride
 * @returns {string}
 */
const resolveDriverId = (ride) =>
  ride.driver._id ? ride.driver._id.toString() : ride.driver.toString();

// ─── Notification Template Helpers ───────────────────────────────────────────

const notifyOwnerOfNewRequest = async (ownerEmail, riderName, origin, destination) => {
  const subject = 'UniRideSync — New Join Request for Your Ride';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
      <h2 style="color:#1F3864;">New Ride Join Request</h2>
      <p><strong>${riderName}</strong> has requested to join your ride:</p>
      <p style="color:#2E5AA8;"><strong>${origin} → ${destination}</strong></p>
      <p>Log in to UniRideSync to accept or decline this request.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#999;">You received this because you are a registered driver on UniRideSync.</p>
    </div>
  `;
  await sendNotificationEmail(ownerEmail, subject, html);
};

const notifyRiderOfDecision = async (riderEmail, action, origin, destination) => {
  const accepted = action === 'accepted';
  const subject = accepted
    ? 'UniRideSync — Your Ride Request Was Accepted 🎉'
    : 'UniRideSync — Your Ride Request Was Declined';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
      <h2 style="color:#1F3864;">${accepted ? 'Request Accepted!' : 'Request Declined'}</h2>
      <p>Your request to join the ride <strong>${origin} → ${destination}</strong> has been <strong>${accepted ? 'accepted' : 'declined'}</strong>.</p>
      ${accepted ? '<p style="color:#28a745;">You now have a confirmed seat on this ride. Safe travels! 🚗</p>' : '<p style="color:#dc3545;">Don\'t worry — there are other rides available on UniRideSync.</p>'}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#999;">UniRideSync — Ride together, save together.</p>
    </div>
  `;
  await sendNotificationEmail(riderEmail, subject, html);
};

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * FR-4.1 — Rider sends a join request to a ride owner.
 *
 * Business rules checked (in order):
 *  1. Ride must exist.
 *  2. Ride must have status 'open' and availableSeats > 0.
 *  3. Rider cannot request their own ride (FR owner-check).
 *  4. Duplicate requests are rejected (app-level fast-path; DB unique index
 *     is the authoritative guard against race conditions).
 *
 * FR-4.2 — Email notification sent to ride owner after creation.
 *
 * @param {string} riderId  - req.user.sub (authenticated rider)
 * @param {string} rideId   - route param
 * @param {Object} riderInfo - { name, email } for notification template
 */
const sendRequest = async (riderId, rideId, riderInfo) => {
  // 1. Ride existence
  const ride = await getRideOrThrow(rideId, true); // populate driver for email

  // 2. Ride must be open and have seats
  if (ride.status !== 'open') {
    throw new ApiError(
      400,
      `Cannot request a ride with status '${ride.status}'`,
      ERROR.RIDE_NOT_OPEN
    );
  }
  if (ride.availableSeats <= 0) {
    throw new ApiError(400, 'No seats available on this ride', ERROR.NO_SEATS_AVAILABLE);
  }

  // 3. Owner cannot request their own ride
  if (resolveDriverId(ride) === riderId) {
    throw new ApiError(
      403,
      'You cannot send a join request to your own ride',
      ERROR.CANNOT_REQUEST_OWN_RIDE
    );
  }

  // 4. Duplicate check (fast-path; DB index is the race-condition guard)
  const existing = await requestRepository.findExistingRequest(riderId, rideId);
  if (existing) {
    throw new ApiError(
      409,
      'You have already sent a join request for this ride',
      ERROR.DUPLICATE_REQUEST
    );
  }

  // Create the request
  const request = await requestRepository.createRequest({ riderId, rideId });

  // FR-4.2: Non-blocking notification to ride owner
  if (ride.driver && ride.driver.email) {
    notifyOwnerOfNewRequest(
      ride.driver.email,
      riderInfo.name,
      ride.origin,
      ride.destination
    ).catch(() => {}); // fire-and-forget; mailer already logs internally
  }

  return request;
};

/**
 * FR-4.3 — Ride owner lists all requests for their ride.
 * @param {string} rideId   - route param
 * @param {string} userId   - req.user.sub (must be the ride owner)
 * @param {Object} queryParams - { status, page, limit }
 */
const listRequestsForRide = async (rideId, userId, queryParams) => {
  const ride = await getRideOrThrow(rideId);

  // Ownership check
  if (resolveDriverId(ride) !== userId) {
    throw new ApiError(
      403,
      'Only the ride owner can view requests for this ride',
      ERROR.NOT_RIDE_OWNER
    );
  }

  const { status, page = 1, limit = 20 } = queryParams;
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  return requestRepository.listRequestsByRide(rideId, { status }, parsedPage, parsedLimit);
};

/**
 * FR-4.3 + FR-4.4 — Ride owner accepts or declines a pending request.
 *
 * On acceptance:
 *  - Atomically decrements availableSeats using a $gt: 0 condition to
 *    prevent concurrent accepts from pushing seats below 0.
 *  - If availableSeats reaches 0, sets ride status to 'full'.
 *
 * FR-4.5: Email notification sent to the requester after the decision.
 *
 * @param {string} requestId - route param :id
 * @param {string} userId    - req.user.sub (must be the ride driver)
 * @param {string} action    - 'accept' | 'reject'
 * @param {Object} ownerInfo - { name, email } for response context
 */
const updateRequestStatus = async (requestId, userId, action, ownerInfo) => {
  const request = await getRequestOrThrow(requestId);

  const ride = request.rideId; // populated by findRequestById
  if (!ride) {
    throw new ApiError(404, 'Associated ride not found', ERROR.RIDE_NOT_FOUND);
  }

  // Ownership: only the ride's driver can accept/decline
  const driverId = ride.driver ? ride.driver.toString() : null;
  if (driverId !== userId) {
    throw new ApiError(
      403,
      'Only the ride owner can accept or decline requests',
      ERROR.NOT_RIDE_OWNER
    );
  }

  // Request must be pending
  if (request.status !== 'pending') {
    throw new ApiError(
      400,
      `Cannot ${action} a request that is already '${request.status}'`,
      ERROR.REQUEST_NOT_PENDING
    );
  }

  // Ride must still be actionable
  if (ride.status === 'cancelled' || ride.status === 'completed') {
    throw new ApiError(
      400,
      `Cannot accept/decline requests for a ride that is '${ride.status}'`,
      ERROR.RIDE_CLOSED
    );
  }

  const newStatus = action === 'accept' ? 'accepted' : 'rejected';

  if (action === 'accept') {
    // Atomic seat decrement — returns null if seats already == 0
    const updatedRide = await rideRepository.decrementAvailableSeatsAtomic(ride._id.toString());

    if (!updatedRide) {
      // Another concurrent accept grabbed the last seat
      throw new ApiError(
        409,
        'No seats available — another request was accepted simultaneously',
        ERROR.NO_SEATS_AVAILABLE
      );
    }

    // If seats just hit 0, close the ride (status: 'full')
    if (updatedRide.availableSeats === 0) {
      await rideRepository.setRideStatus(ride._id.toString(), 'full');
    }
  }

  // Update the request status + append to statusHistory
  const updated = await requestRepository.updateRequestStatus(requestId, newStatus);

  // FR-4.5: Non-blocking notification to rider
  const riderEmail = updated.riderId && updated.riderId.email;
  if (riderEmail) {
    notifyRiderOfDecision(riderEmail, newStatus, ride.origin, ride.destination).catch(() => {});
  }

  return updated;
};

/**
 * Rider views all of their own sent requests.
 * @param {string} riderId  - req.user.sub
 * @param {Object} queryParams - { status, page, limit }
 */
const getMyRequests = async (riderId, queryParams) => {
  const { status, page = 1, limit = 20 } = queryParams;
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  return requestRepository.listRequestsByRider(riderId, { status }, parsedPage, parsedLimit);
};

module.exports = {
  sendRequest,
  listRequestsForRide,
  updateRequestStatus,
  getMyRequests,
};
