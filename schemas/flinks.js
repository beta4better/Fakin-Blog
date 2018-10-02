/**
 * Created by Fakin on 2018/9/20.
 */
/*
 * 友链
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    name: String,
    url: String
});
module.exports = blogSchema;