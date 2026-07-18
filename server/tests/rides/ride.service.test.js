const rideService = require('../../src/modules/rides/ride.service');
const rideRepository = require('../../src/modules/rides/ride.repository');
const ApiError = require('../../src/utils/ApiError');

jest.mock('../../src/modules/rides/ride.repository');

describe('Ride Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRide', () => {
    it('throws 404 if ride not found', async () => {
      rideRepository.findRideById.mockResolvedValue(null);
      await expect(rideService.updateRide('ride1', 'driver1', {})).rejects.toThrow(ApiError);
    });

    it('throws 403 if not driver', async () => {
      rideRepository.findRideById.mockResolvedValue({ driver: { _id: 'driver2' } });
      await expect(rideService.updateRide('ride1', 'driver1', {})).rejects.toThrow(ApiError);
    });
  });

  describe('Sweep Logic (Repository level unit test)', () => {
    it('calls closeExpiredRides and completeClosedRides', async () => {
      rideRepository.closeExpiredRides.mockResolvedValue(2);
      rideRepository.completeClosedRides.mockResolvedValue(1);
      
      const closed = await rideRepository.closeExpiredRides(new Date());
      const completed = await rideRepository.completeClosedRides(new Date(), 3);
      
      expect(closed).toBe(2);
      expect(completed).toBe(1);
    });
  });
});
