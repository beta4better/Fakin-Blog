/**
 * Created by Fakin on 2018/9/20.
 */
/*
 * 个人信息表结构
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    author: String,
    description: String,
    content: String,
    thumbnail: String,
});
module.exports = blogSchema;