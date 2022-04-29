// Covid Data Schema
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
    },
    cases: {
        type: Number,
        required: true
    },
    deaths: {
        type: Number,
        required: true
    }
}, { collection: 'covid_data' })

module.exports = mongoose.model('covid_data', dataSchema);





