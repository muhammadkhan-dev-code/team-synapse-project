const ApiError = require('../utils/ApiError');

const authorize = (checkFn) => async (req, res, next) => {
  const allowed = await checkFn(req);
  if (!allowed) {
    return next(new ApiError(403, 'You are not authorized to perform this action', 'FORBIDDEN'));
  }
  next();
};

module.exports = authorize;
