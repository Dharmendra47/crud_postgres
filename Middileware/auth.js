const catchAsync = require("../Utils/catchAsync");
const client = require("../Database/dataBase");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/appError");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createSendToken = catchAsync(async (user, statusCode, res) => {
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: "success",
    token,
    message: "login sucessfully",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // if (!decoded) next(new AppError("token Expired Please Login again", 444));

  const currentUser = await client.query("SELECT * FROM students WHERE id=$1", [
    decoded.id,
  ]);

  if (currentUser.rowCount) {
    req.user = currentUser.rows[0];
    next();
  } else {
    next(
      new AppError("The User belonging to this token does no longer exits", 444)
    );
  }
});

exports.restrictTo = catchAsync(async (req, res, next) => {
  if (req.user.role != "admin")
    next(new AppError("Sorry You are not Authorised", 444));
  next();
});
