const express = require("express");
const { getMatches, addMatch } = require("../controllers/matchController");
const matchRouter = express.Router();

matchRouter.get("/api/matches", getMatches);

matchRouter.post("/api/add-match", addMatch);

module.exports = matchRouter;
