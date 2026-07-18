const chatbotService = require('../../src/modules/chatbot/chatbot.service');
const chatbotRepository = require('../../src/modules/chatbot/chatbot.repository');
const rideRepository = require('../../src/modules/rides/ride.repository');
const ApiError = require('../../src/utils/ApiError');

jest.mock('../../src/modules/chatbot/chatbot.repository');
jest.mock('../../src/modules/rides/ride.repository');
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              { message: { content: 'This is a mock AI response' } }
            ]
          })
        }
      }
    };
  });
});

describe('Chatbot Service', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, GROQ_API_KEY: 'test-key' };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('handleMessage', () => {
    it('throws 503 if GROQ_API_KEY is missing', async () => {
      delete process.env.GROQ_API_KEY;
      await expect(chatbotService.handleMessage('user1', 'conv1', 'Hello'))
        .rejects.toThrow(new ApiError(503, 'Chatbot AI service is not configured'));
    });

    it('processes a message and returns AI response', async () => {
      chatbotRepository.saveMessage.mockResolvedValue(true);
      chatbotRepository.getConversationHistory.mockResolvedValue([]);

      const result = await chatbotService.handleMessage('user1', 'conv1', 'Hello');
      expect(result.reply).toBe('This is a mock AI response');
      expect(chatbotRepository.saveMessage).toHaveBeenCalledTimes(2); // user msg + ai msg
    });
  });
});
