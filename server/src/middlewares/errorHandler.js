const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    error = new ApiError(statusCode, error.message || 'Internal Server Error', 'INTERNAL_ERROR');
  }
  const response = {
    success: false,
    message: error.message,
    errorCode: error.errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
