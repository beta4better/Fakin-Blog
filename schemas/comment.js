var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var commentSchema = new Schema({
    fatherId: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    article: {
        type: String,
        default: ''
    },
    articleId: {
        type: String,
        default: ''
    },
    reply: [
        {
            fatherId: {
                type: String,
                default: ''
            },
            article: {
                type: String,
                default: ''
            },
            articleId: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            },
            to: {
                type: String,
                default: ''
            },
            content: {
                type: String,
                default: ''
            },
            isSh: {
                type: Boolean,
                default: false
            },
            addTime: {
                type: Date,
                default: new Date()
            }
        }
    ],

    content: {
        type: String,
        default: ''
    },
    isSh: {
        type: Boolean,
        default: false
    },
    addTime: {
        type: Date,
        default: new Date()
    }
});
module.exports = commentSchema;