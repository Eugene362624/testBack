const Competition = require("../models/Competition");

exports.getAllCompetitions = async (req, res) => {
  const competitions = await Competition.find({});
  res.status(200).send(competitions);
};

exports.getCompetition = async (req, res) => {
  const competition = await Competition.find({
    name: req.body.competition,
  }).populate("seasonId");
  res.status(200).send(competition);
};
