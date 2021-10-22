const {Schema, model} = require('mongoose')

const competitionSchema = new Schema({
    name: {type: String, required: true},
    seasonId: [{ type: Schema.Types.ObjectId, ref: 'Seasons' }]
})

module.exports = model('Competitions', competitionSchema)