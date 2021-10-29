const Competition = require("../models/Competition");
const Season = require("../models/Season");

exports.getSorted = async (req, res) => {
  let competition,
    season,
    matches,
    seasons = [];
  if (req.query.competition) {
    competition = await Competition.findOne({
      name: req.query.competition,
    }).populate("seasonId");
    seasons = competition.seasonId;
  }
  if (req.query.season && req.query.competition) {
    season = seasons.filter((e) => e.name == req.query.season);
    season = await Season.findOne({ _id: season[0]._id }).populate("matchId");
  }
  res.status(200).send({ competition, season, matches });
};
