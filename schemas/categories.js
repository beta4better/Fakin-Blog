/**
 * Created by Fakin on 2018/9/20.
 */
/*
 * 分类表结构
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    name: String,
    alias: String
});
module.exports = blogSchema;