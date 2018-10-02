/*
* 分类表模型
* */

var mongoose = require('mongoose');

var cateSchemas = require('../schemas/categories');

var Category = mongoose.model('Category', cateSchemas);

module.exports = Category;