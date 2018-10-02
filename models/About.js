
var mongoose = require('mongoose');

var aboutSchemas = require('../schemas/about');

var About = mongoose.model('About', aboutSchemas);

module.exports = About;