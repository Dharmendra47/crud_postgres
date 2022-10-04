const express = require("express");
const catchAsync = require("../Utils/catchAsync");
const client = require("../Database/dataBase");
const userService = require("../Services/userService");
const auth = require("../Middileware/auth");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/appError");

exports.createUser = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  console.log(user);
  if (user) res.status(200).json({ message: "user inserted" });
});

exports.login = catchAsync(async (req, res, next) => {
  const data = await userService.loggedIn(req.body);
  if (data) {
    auth.createSendToken(data, 201, res);
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getAlluser();
  if (user) res.status(200).json({ message: "success", user });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await userService.getUserid(id);
  if (user) res.status(400).json(user);
  next(new AppError("invalid id ", 415));
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await userService.updateById(id, req.body);
  if (user) res.status(200).json({ status: "ok", message: "user updated" });
  else next(new AppError("user not exists ", 416));
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await userService.deleteById(id);
  if (user) res.status(200).json({ status: "ok", message: "user deleted" });
  else next(new AppError("user not exists ", 417));
});
