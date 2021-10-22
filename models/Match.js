const {Schema, model} = require('mongoose')

const matchSchema = new Schema({
    awayTeamName: {type: String, required: true},
    homeTeamName: {type: String, required: true},
    score: {type: String},
    date: {type: Date, required: true},
})

module.exports = model('Matches', matchSchema)