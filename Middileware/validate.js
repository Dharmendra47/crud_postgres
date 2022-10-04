const AppError = require("../Utils/appError");
exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.message, 409));
  next();
};
