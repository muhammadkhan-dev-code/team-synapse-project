const ratingService = require('../../src/modules/ratings/rating.service');
const ratingRepository = require('../../src/modules/ratings/rating.repository');
const rideRepository = require('../../src/modules/rides/ride.repository');
const participantUtil = require('../../src/utils/participant.util');
const ApiError = require('../../src/utils/ApiError');
const User = require('../../src/modules/auth/user.model');

jest.mock('../../src/modules/ratings/rating.repository');
jest.mock('../../src/modules/rides/ride.repository');
jest.mock('../../src/utils/participant.util');
jest.mock('../../src/modules/auth/user.model');

describe('Rating Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitRating', () => {
    it('throws 400 if ratee and rater are same', async () => {
      await expect(ratingService.submitRating('ride1', 'user1', 'user1', 5, 'Good'))
        .rejects.toThrow(new ApiError(400, 'You cannot rate yourself'));
    });

    it('throws 400 if ride is not completed', async () => {
      rideRepository.findRideById.mockResolvedValue({ status: 'closed' });
      await expect(ratingService.submitRating('ride1', 'user1', 'user2', 5, 'Good'))
        .rejects.toThrow(new ApiError(400, 'Cannot rate a ride that is not completed'));
    });

    it('throws 403 if users are not participants', async () => {
      rideRepository.findRideById.mockResolvedValue({ status: 'completed' });
      participantUtil.checkParticipant.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      await expect(ratingService.submitRating('ride1', 'user1', 'user2', 5, 'Good'))
        .rejects.toThrow(new ApiError(403, 'Both rater and ratee must be participants of the ride'));
    });

    it('throws 409 on duplicate rating', async () => {
      rideRepository.findRideById.mockResolvedValue({ status: 'completed' });
      participantUtil.checkParticipant.mockResolvedValue(true);
      ratingRepository.findExistingRating.mockResolvedValue({ score: 5 });
      await expect(ratingService.submitRating('ride1', 'user1', 'user2', 5, 'Good'))
        .rejects.toThrow(new ApiError(409, 'Rating already submitted for this user on this ride'));
    });

    it('submits rating successfully and updates aggregate', async () => {
      rideRepository.findRideById.mockResolvedValue({ status: 'completed' });
      participantUtil.checkParticipant.mockResolvedValue(true);
      ratingRepository.findExistingRating.mockResolvedValue(null);
      ratingRepository.createRating.mockResolvedValue({ _id: 'rating1' });
      ratingRepository.getAggregateRating.mockResolvedValue({ averageScore: 4.5, count: 2 });
      User.findByIdAndUpdate.mockResolvedValue({});

      const rating = await ratingService.submitRating('ride1', 'user1', 'user2', 5, 'Good');
      expect(rating._id).toBe('rating1');
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user2', { averageRating: 4.5, totalRatings: 2 });
    });
  });
});
