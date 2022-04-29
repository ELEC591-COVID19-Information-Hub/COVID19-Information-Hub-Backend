const mongoose = require('mongoose');

const AutoIncrementFactory = require('mongoose-sequence');

const AutoIncrement = AutoIncrementFactory(mongoose.connection);
const ArticleSchema = new mongoose.Schema({
    author: {type: String, required: true},
    text: {type: String, required: true},
    // title: {type: String, required: true},
    date: {type: Date, required: true},
    comments: {type: [], required: true},
    state: {type: String, required: true}
})

ArticleSchema.plugin(AutoIncrement, {inc_field: 'pid'});

module.exports = mongoose.model('articles', ArticleSchema);
