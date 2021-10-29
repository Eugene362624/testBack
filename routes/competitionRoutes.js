const express = require("express");
const {
  getAllCompetitions,
  getCompetition,
} = require("../controllers/competitionController");
const competitionRouter = express.Router();

competitionRouter.get("/api/competitions", getAllCompetitions);

competitionRouter.get("/api/competition", getCompetition);

module.exports = competitionRouter;
