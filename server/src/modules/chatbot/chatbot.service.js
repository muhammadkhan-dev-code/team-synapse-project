const Groq = require('groq-sdk');
const chatbotRepository = require('./chatbot.repository');
const rideRepository = require('../rides/ride.repository');
const ApiError = require('../../utils/ApiError');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

// Define the tool available to the chatbot
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_open_rides',
      description: 'Search for available open rides in the platform based on origin and/or destination.',
      parameters: {
        type: 'object',
        properties: {
          origin: {
            type: 'string',
            description: 'The starting location (e.g. Model Town, Campus, Johar Town). Optional.',
          },
          destination: {
            type: 'string',
            description: 'The target location (e.g. Campus, DHA). Optional.',
          },
        },
      },
    },
  },
];

const SYSTEM_PROMPT = `You are the UniRideSync AI Assistant, a helpful bot for a smart campus ride coordination platform.
Strict Rules:
1. You are bilingual. You MUST automatically detect the user's language and script (English, Urdu script, or Roman Urdu). You MUST reply in the exact same language and script they used in their latest message.
2. Only answer questions related to the UniRideSync platform (e.g., how to request a ride, cancel a booking, safety, search for rides). If a user asks something unrelated (like coding help or recipes), politely decline.
3. NEVER invent or hallucinate ride data. If someone asks for a ride, ALWAYS use the 'search_open_rides' tool. If the tool returns empty, tell the user there are no rides right now.
4. Keep answers concise, friendly, and helpful.`;

/**
 * Handle a chat message, route through Groq, handle tool calls if any, and return the final language response.
 */
const handleMessage = async (userId, conversationId, userMessageText) => {
  if (!process.env.GROQ_API_KEY) {
    console.warn('GROQ_API_KEY is not set. Chatbot is disabled.');
    throw new ApiError(503, 'Chatbot AI service is not configured');
  }

  // 1. Save user's message
  await chatbotRepository.saveMessage({
    userId,
    conversationId,
    role: 'user',
    content: userMessageText,
  });

  // 2. Retrieve history (last 10 msgs)
  const history = await chatbotRepository.getConversationHistory(conversationId, 10);
  
  // Format for Groq
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.role,
      content: m.content || '',
      ...(m.toolCallId ? { tool_call_id: m.toolCallId } : {}),
      ...(m.name ? { name: m.name } : {})
    }))
  ];

  // 3. Make initial request to Groq (model: llama3-70b-8192 or llama3-8b-8192)
  // Tool calling is supported well on llama3-70b
  let response;
  try {
    response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages,
      tools,
      tool_choice: 'auto',
    });
  } catch (err) {
    throw new ApiError(502, 'Failed to communicate with AI provider');
  }

  const responseMessage = response.choices[0].message;

  // 4. Handle Tool Calls if any
  if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    // Save AI's intention to call a tool
    messages.push(responseMessage);
    
    // Process each tool call
    for (const toolCall of responseMessage.tool_calls) {
      if (toolCall.function.name === 'search_open_rides') {
        const args = JSON.parse(toolCall.function.arguments);
        
        // Execute the service layer search (only find 'open' status rides)
        // ride.repository automatically bounds by page/limit and status='open' default
        const filters = {
          status: { $in: ['open'] }
        };
        if (args.origin) filters.origin = args.origin;
        if (args.destination) filters.destination = args.destination;

        const results = await rideRepository.listRides(filters, 1, 5); // limit to top 5 hits

        const compactResults = results.rides.map(r => ({
          origin: r.origin,
          destination: r.destination,
          departureTime: r.departureTime,
          price: r.price,
          seatsLeft: r.availableSeats,
          driverRating: r.driver ? r.driver.averageRating : 0
        }));

        const toolResultContent = compactResults.length > 0 
          ? JSON.stringify(compactResults) 
          : "No open rides found matching the criteria.";

        // Append tool result to context for final evaluation
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: toolResultContent,
        });
      }
    }

    // 5. Send back to Groq for the final natural language summary
    try {
      const finalResponse = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages,
      });

      const finalContent = finalResponse.choices[0].message.content;
      
      // Save assistant's final output
      await chatbotRepository.saveMessage({
        userId,
        conversationId,
        role: 'assistant',
        content: finalContent,
      });

      return { reply: finalContent };

    } catch (err) {
      throw new ApiError(502, 'Failed to generate final AI response');
    }
  }

  // 6. Natural Language Response (No tools used)
  const content = responseMessage.content;
  await chatbotRepository.saveMessage({
    userId,
    conversationId,
    role: 'assistant',
    content,
  });

  return { reply: content };
};

module.exports = {
  handleMessage,
};
