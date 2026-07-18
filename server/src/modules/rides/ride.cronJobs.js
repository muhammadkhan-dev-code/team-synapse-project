/**
 * ride.cronJobs.js
 * ----------------
 * Scheduled background jobs for the Rides module.
 */

const cron = require('node-cron');
const rideRepository = require('./ride.repository');
const { RIDE_COMPLETION_BUFFER_HOURS } = require('../../config/constants');

// Check for logger usage, we'll fall back to console if there's no custom logger.
// It seems `console.log` and `console.error` are the fallback per server.js
const logger = console;

/**
 * Initializes the ride auto-close cron job.
 * Runs every 15 minutes to find all open rides past their departureTime
 * and auto-closes them.
 */
const initRideCronJobs = () => {
  // schedule: every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      logger.log('[Cron] Running ride auto-close job...');
      const closedCount = await rideRepository.closeExpiredRides(new Date());
      if (closedCount > 0) {
        logger.log(`[Cron] Successfully closed ${closedCount} expired ride(s).`);
      }

      const bufferHours = process.env.RIDE_COMPLETION_BUFFER_HOURS || RIDE_COMPLETION_BUFFER_HOURS;
      const completedCount = await rideRepository.completeClosedRides(new Date(), bufferHours);
      if (completedCount > 0) {
        logger.log(`[Cron] Successfully completed ${completedCount} closed ride(s).`);
      }
    } catch (error) {
      logger.error('[Cron Error] Failed to execute ride auto-close job:', error);
    }
  });

  logger.log('[Cron] Ride auto-close job initialized (runs every 15 mins)');
};

module.exports = {
  initRideCronJobs,
};
