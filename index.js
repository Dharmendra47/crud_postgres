const express = require("express");
const dotenv = require("dotenv");
const AppError = require("./Utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
dotenv.config();
const client = require("./Database/dataBase");
const userRoute = require("./Routes/route");
const port = process.env.PORT;

const app = express();

app.use(express.json());

client.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected!");
  }
});

app.use("/", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server..`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => console.log(`App in running on ${port}...`));
