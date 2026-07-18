const requestService = require('../../src/modules/requests/request.service');
const requestRepository = require('../../src/modules/requests/request.repository');
const rideRepository = require('../../src/modules/rides/ride.repository');
const ApiError = require('../../src/utils/ApiError');

jest.mock('../../src/modules/requests/request.repository');
jest.mock('../../src/modules/rides/ride.repository');

describe('Request Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRequestStatus', () => {
    it('throws 404 if request not found', async () => {
      requestRepository.findRequestById.mockResolvedValue(null);
      await expect(requestService.updateRequestStatus('req1', 'driver1', 'accept', {}))
        .rejects.toThrow(new ApiError(404, 'Ride request not found', 'REQUEST_NOT_FOUND'));
    });

    it('throws 400 if already accepted', async () => {
      requestRepository.findRequestById.mockResolvedValue({ status: 'accepted', rideId: { driver: 'driver1' } });
      await expect(requestService.updateRequestStatus('req1', 'driver1', 'accept', {}))
        .rejects.toThrow(new ApiError(400, "Cannot accept a request that is already 'accepted'", 'REQUEST_NOT_PENDING'));
    });

    it('throws 403 if user is not driver', async () => {
      requestRepository.findRequestById.mockResolvedValue({ 
        status: 'pending', rideId: { driver: { toString: () => 'driver2' } } 
      });
      await expect(requestService.updateRequestStatus('req1', 'driver1', 'accept', {}))
        .rejects.toThrow(new ApiError(403, 'Only the ride owner can accept or decline requests', 'NOT_RIDE_OWNER'));
    });

    it('decrements seat count atomically on accept', async () => {
      const mockRequest = { 
        status: 'pending', 
        rideId: { _id: 'ride1', driver: { toString: () => 'driver1' } } 
      };
      
      requestRepository.findRequestById.mockResolvedValue(mockRequest);
      // Mock Atomic Decrement Success
      rideRepository.decrementAvailableSeatsAtomic.mockResolvedValue({ availableSeats: 1 });
      requestRepository.updateRequestStatus.mockResolvedValue({ status: 'accepted' });
      
      const res = await requestService.updateRequestStatus('req1', 'driver1', 'accept', {});
      expect(rideRepository.decrementAvailableSeatsAtomic).toHaveBeenCalledWith('ride1');
      expect(res.status).toBe('accepted');
    });
  });
});
