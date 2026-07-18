const app = require('./app');
const connectDB = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');
const { initRideCronJobs } = require('./modules/rides/ride.cronJobs');

const startServer = async () => {
  await connectDB();
  
  if (NODE_ENV !== 'test') {
    initRideCronJobs();
  }

  app.listen(PORT, () => {
    console.log(`UniRideSync backend running on port ${PORT}`);
  });
};

startServer();
