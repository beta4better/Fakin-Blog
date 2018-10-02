/**
 * Created by Fakin on 2018/9/20.
 */
/*
 * 标签表结构
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    name: String,
    count: {
        type: Number,
        default: 0
    }
});
module.exports = blogSchema;