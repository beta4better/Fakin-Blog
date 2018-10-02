/**
 * Created by Fakin on 2018/9/20.
 */
/*
 * 分类表结构
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title: String,
    content: {
        type: String,
        default: '',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    description: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    },
    addTime: {
        type: Date,
        default: new Date()
    },
    thumbnail: {
        type: String,
        default: ''
    },
    tag: [String]
});

module.exports = blogSchema;