const messageService = require('../../src/modules/messages/message.service');
const messageRepository = require('../../src/modules/messages/message.repository');
const rideRepository = require('../../src/modules/rides/ride.repository');
const requestRepository = require('../../src/modules/requests/request.repository');
const ApiError = require('../../src/utils/ApiError');
const { checkParticipant } = require('../../src/utils/participant.util');

jest.mock('../../src/modules/messages/message.repository');
jest.mock('../../src/modules/rides/ride.repository');
jest.mock('../../src/modules/requests/request.repository');

describe('Message Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkParticipant (via participant.util)', () => {
    const mockRideId = 'ride123';
    
    it('returns false when ride not found (Phase 1 Fix)', async () => {
      rideRepository.findRideById.mockResolvedValue(null);
      const isParticipant = await checkParticipant(mockRideId, 'user123');
      expect(isParticipant).toBe(false);
    });

    it('returns true for driver', async () => {
      rideRepository.findRideById.mockResolvedValue({ driver: 'driver123' });
      const isParticipant = await checkParticipant(mockRideId, 'driver123');
      expect(isParticipant).toBe(true);
    });

    it('returns true for accepted passenger', async () => {
      rideRepository.findRideById.mockResolvedValue({ driver: 'driver123' });
      requestRepository.findExistingRequest.mockResolvedValue({ status: 'accepted' });
      const isParticipant = await checkParticipant(mockRideId, 'passenger123');
      expect(isParticipant).toBe(true);
    });

    it('returns false for pending/rejected passenger', async () => {
      rideRepository.findRideById.mockResolvedValue({ driver: 'driver123' });
      requestRepository.findExistingRequest.mockResolvedValue({ status: 'rejected' });
      const isParticipant = await checkParticipant(mockRideId, 'passenger123');
      expect(isParticipant).toBe(false);
    });
  });

  describe('sendMessage', () => {
    const mockRideId = 'ride123';
    const senderId = 'user123';
    
    it('throws Thread not found on unauthorized (404) - matches Ride not found (Phase 1 Fix)', async () => {
      rideRepository.findRideById.mockResolvedValue(null); // Ride not found
      await expect(messageService.sendMessage(mockRideId, senderId, 'hello'))
        .rejects.toThrow(new ApiError(404, 'Thread not found', 'THREAD_NOT_FOUND'));
    });

    it('sends message if valid', async () => {
      rideRepository.findRideById.mockResolvedValue({ driver: senderId });
      messageRepository.createMessage.mockResolvedValue({ _id: 'msg123' });
      const result = await messageService.sendMessage(mockRideId, senderId, 'hello');
      expect(result._id).toBe('msg123');
    });
  });
});
