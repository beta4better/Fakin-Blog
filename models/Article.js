/**
 * Created by Fakin on 2018/9/26.
 */
var mongoose = require('mongoose');

var articleSchemas = require('../schemas/article');

var Article = mongoose.model('Article', articleSchemas);


module.exports = Article;