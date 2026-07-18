const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const errorHandler = require('./middlewares/errorHandler');
const { CLIENT_URL, NODE_ENV } = require('./config/env');

const authRoutes = require('./modules/auth/auth.routes');
const rideRoutes = require('./modules/rides/ride.routes');
const requestRoutes = require('./modules/requests/request.routes');
const messageRoutes = require('./modules/messages/message.routes');
const ratingRoutes = require('./modules/ratings/rating.routes');
const chatbotRoutes = require('./modules/chatbot/chatbot.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
if (NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'OK' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1', requestRoutes);
app.use('/api/v1', messageRoutes);
app.use('/api/v1', ratingRoutes);
app.use('/api/v1', chatbotRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
