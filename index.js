const express = require('express')
const mongoose = require('mongoose')
const BP = require('body-parser')
const Match = require('./models/Match')
const dateformat = require('dateformat')
const Competition = require('./models/Competition')
const Season = require('./models/Season')

const app = express()
app.use(BP.json())
app.use(BP.urlencoded({extended: true}))


app.get('/', async (req, res) => {
    const matches = await Match.find({}).limit(20)
    res.send(matches)
})

app.get('/api/matches', async (req, res) => {
    const page = req.query.page || 1
    const allMatches = await Match.find({})
    const matches = await Match.find({}).skip((page-1)*10).limit(10)
    const count = allMatches.length
    res.send({matches: matches, count: count}).status(200)
})

app.get('/api/competitions', async (req, res) => {
    const competitions = await Competition.find({})
    res.status(200).send(competitions)
})

app.get('/api/competition', async (req, res) => {
    const competition = await Competition.find({name: req.body.competition}).populate('seasonId')
    res.status(200).send(competition)
})

app.get('/api/seasons', async (req, res) => {

})

app.get('/api/season', async (req, res) => {
    const season = await Season.find({name: req.body.season}).populate('matchId')

})

app.get('/api/sorted', async (req, res) => {
    let competition, season, matches, seasons = []
    // console.log(new Date(req.query.date))
    if (req.query.competition) {
        competition = await Competition.findOne({name: req.query.competition}).populate('seasonId')
        seasons = competition.seasonId
    }
    if (req.query.season && req.query.competition) {
        season = seasons.filter(e => e.name == req.query.season)
        season = await Season.findOne({_id: season[0]._id}).populate('matchId')
    }
    // if (req.query.date) {
    //     matches = await Match.find({date: {$gte: new Date(req.query.date)}})
    // }
    res.status(200).send({competition, season, matches})
})

app.get('/', async (req, res) => {
    res.json('Привет!')
})

app.post('/api/add-match', async (req, res) => {
    let competitionCandtidate = await Competition.findOne({name: req.body.competition})
    let seasonsCandidate = await Season.findOne({name: req.body.season})
    if (!competitionCandtidate) {
        await Competition.create({name: req.body.competition})
        .then(async (data) =>  await Competition.updateOne({_id: (data._id).toString().split('"')[0]}, {$push: {seasonId: seasonsCandidate._id}}))
        await Match.create({
            homeTeamName: req.body.homeTeamName,
            awayTeamName: req.body.awayTeamName,
            score: req.body.score,
            date: req.body.date
        })
        .then(async (data) => await Season.updateOne({_id: seasonsCandidate._id}, {$push: {matchId: (data._id).toString().split('"')[0]}}))
    } else {
        const candidate = await Competition.findOne({_id:(competitionCandtidate._id)}).populate('seasonId')
        let candidateSeasons = candidate.seasonId
        let candidateSeason = candidateSeasons.filter(e => e.name == req.body.season) 
        let newSeason
        if (!candidateSeason.length) {
            newSeason = await Season.create({name: req.body.season})
            await Competition.updateOne({_id:(candidate._id)}, { $push: { seasonId: newSeason._id }})
        } else {
            newSeason = candidateSeason
        }
        await Match.create({
            homeTeamName: req.body.homeTeamName,
            awayTeamName: req.body.awayTeamName,
            score: req.body.score,
            date: req.body.date
        })
        .then(async (data) => await Season.updateOne({_id: newSeason.length > 0 ? (newSeason[0]._id.toString().split('"')[0]) : (newSeason._id.toString().split('"')[0])}, {$push: {matchId: (data._id).toString().split('"')[0]}}))
    }
    res.status(201).json({message: 'Match saved. All is OK.'})
})

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/testtask', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("mongo db is connected")
        app.listen(3000, () => {
            console.log('server started on porn 3000')
        })
    } catch (error) {
        console.log(error)
    }
}

start()