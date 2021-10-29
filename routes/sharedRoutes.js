const express = require("express");
const { getSorted } = require("../controllers/sharedController");
const sharedRouter = express.Router();

sharedRouter.get("/api/sorted", getSorted);

module.exports = sharedRouter;
