const {Schema, model} = require('mongoose')

const seasonSchema = new Schema({
    name: {type: String, required: true},
    matchId: [{ type: Schema.Types.ObjectId, ref: 'Matches' }]
})

module.exports = model('Seasons', seasonSchema)