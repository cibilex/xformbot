const MyError = require("../helpers/MyError");
const asyncErrHandler = require("express-async-handler");
const errorHandler = (err, req, res, next) => {
  console.log(err)
    res.sendStatus(err.code || 400).json({message:err.message || "Server Error"});
  };

module.exports = errorHandler;
