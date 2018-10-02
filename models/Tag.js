
var mongoose = require('mongoose');

var tagSchemas = require('../schemas/tags');

var Tag = mongoose.model('Tag', tagSchemas);

module.exports = Tag;