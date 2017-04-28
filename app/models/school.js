var q = require('q');
var mongoose = require('mongoose');

// Setup DB Promise
mongoose.Promise = q.Promise;

module.exports = mongoose.model('School', {
    name: String,
    entityName: String,
    alias: String
});
