const Competition = require("../models/Competition");
const Match = require("../models/Match");
const Season = require("../models/Season");

exports.getMatches = async (req, res) => {
  const page = req.query.page || 1;
  const allMatches = await Match.find({});
  const matches = await Match.find({})
    .skip((page - 1) * 10)
    .limit(10);
  const count = allMatches.length;
  res.send({ matches: matches, count: count }).status(200);
};

exports.addMatch = async (req, res) => {
  let competitionCandtidate = await Competition.findOne({
    name: req.body.competition,
  });
  if (!competitionCandtidate) {
    let newSeason = await Season.create({ name: req.body.season });
    let newCompetition = await Competition.create({
      name: req.body.competition,
    });
    await Competition.updateOne(
      { _id: newCompetition._id.toString().split('"')[0] },
      { $push: { seasonId: newSeason._id } }
    );
    let newMatch = await Match.create({
      homeTeamName: req.body.homeTeamName,
      awayTeamName: req.body.awayTeamName,
      score: req.body.score,
      date: req.body.date,
    });
    await Season.updateOne(
      { _id: newSeason._id },
      { $push: { matchId: newMatch._id.toString().split('"')[0] } }
    );
  } else {
    const candidate = await Competition.findOne({
      _id: competitionCandtidate._id,
    }).populate("seasonId");
    let candidateSeasons = candidate.seasonId;
    let candidateSeason = candidateSeasons.filter(
      (e) => e.name == req.body.season
    );
    let newSeason;
    if (!candidateSeason.length) {
      newSeason = await Season.create({ name: req.body.season });
      await Competition.updateOne(
        { _id: candidate._id },
        { $push: { seasonId: newSeason._id } }
      );
    } else {
      newSeason = candidateSeason;
    }
    let newMatch = await Match.create({
      homeTeamName: req.body.homeTeamName,
      awayTeamName: req.body.awayTeamName,
      score: req.body.score,
      date: req.body.date,
    });
    await Season.updateOne(
      {
        _id:
          newSeason.length > 0
            ? newSeason[0]._id.toString().split('"')[0]
            : newSeason._id.toString().split('"')[0],
      },
      { $push: { matchId: newMatch._id.toString().split('"')[0] } }
    );
  }
  res.status(201).json({ message: "Match saved." });
};
