/**
 * Created by Fakin on 2018/9/26.
 */
var mongoose = require('mongoose');

var linksSchemas = require('../schemas/flinks');

var Flinks = mongoose.model('Flink', linksSchemas);

module.exports = Flinks;