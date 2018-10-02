/**
 * Created by Fakin on 2018/9/20.
 */
var express = require('express');
var Category = require('../models/Category');
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var Tag = require('../models/Tag');
var About = require('../models/About');
var Flinks = require('../models/Flinks');
var router = express.Router();
var category, flinks, pArticle, tags, comments, about;

Category.find().then(function (_category) {
    category = _category
});
About.findOne().then(function (_about) {
    about = _about
});
Flinks.find().then(function (_flinks) {
    flinks = _flinks
});
Article.find().sort({'views': -1}).limit(5).then((_article) => {
    pArticle = _article
});
Tag.find().sort({'count': -1}).limit(10).then((tag) => {
    tags = tag
});
router.get('/', function (req, res) {
    // res.type('html')
    // console.log(req.query.page);
    /*
     * limit(Number)限制 获取文章条数
     * skip(2) 忽略数据条数
     * */
    var page = Number(req.query.page || 1), pages, limit = 10;
    Article.countDocuments().then(function (conut) {
        pages = Math.ceil(conut / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Article.find().limit(limit).skip(skip).populate('category').sort({_id: -1}).then(function (article) {
            // console.log(article)
            res.render('templates/index', {
                pages: pages,
                count: conut,
                article: article,
                page: page,
                flinks: flinks,
                category: category,
                pArticle: pArticle,
                tags: tags

            })
        })
    })
    // //从数据库读取菜单
    // res.render('templates/index', {
    //     flinks: flinks
    // })

});

router.get('/about', function (req, res) {
    About.findOne().then((article) => {
        res.render('templates/about', {
            category: category,
            article: article,

        })
    });

});

router.get('/program/:id', function (req, res) {
    var id = req.params.id;
    var nextArticle, prevArticle;
    Article.findOne({'_id': {"$gt": id}}).limit(1).sort({_id: 1}).then((art) => {
        nextArticle = art
    });
    Article.findOne({'_id': {"$lt": id}}).limit(1).sort({_id: -1}).then((art) => {
        prevArticle = art
    });

    Comment.find({'articleId': id}).then((art) => {
        comments = art
    });
    Article.findOne({
        _id: id
    }).populate('category').then((content) => {
        content.views++;
        content.save();
        res.render('templates/article_article', {
            category: category,
            content: content,
            prevArticle: prevArticle,
            nextArticle: nextArticle,
            pArticle: pArticle,
            tags: tags,
            comments: comments,
            author: about.author
        })
    })

});
router.get('/category/:id', function (req, res) {
    // console.log(req.query.page);
    /*
     * limit(Number)限制 获取文章条数
     * skip(2) 忽略数据条数
     * */
    var currentCategory = '';
    Category.findOne({_id: req.params.id}).then(function (_category) {
        currentCategory = _category.name
    });
    var page = Number(req.query.page || 1), pages, limit = 10, where = {
        category: req.params.id || ''
    };
    Article.where(where).countDocuments().then(function (conut) {
        pages = Math.ceil(conut / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Article.where(where).find().limit(limit).skip(skip).populate('category').then(function (article) {
            res.render('templates/article_list', {
                catalog: 'category',
                id: req.params.id,
                pages: pages,
                count: conut,
                article: article,
                page: page,
                flinks: flinks,
                category: category,
                currentCategory: currentCategory,
                pArticle: pArticle,
                tags: tags
            })
        })
    })

    // res.render('templates/article_list', {
    //     category: category
    // })
});
router.get('/tag/:id', function (req, res) {
    // var currentCategory = '';
    // Category.findOne({_id: req.params.id}).then(function (_category) {
    //     currentCategory = _category.name
    // });
    var currentCategory = '';
    Tag.findOne({_id: req.params.id}).then(function (tag) {
        currentCategory = tag.name
    });
    var page = Number(req.query.page || 1), pages, limit = 10, artcileList;
    Article.countDocuments().then(function () {
        Article.find({'tag': {$in: [currentCategory]}}).then((list) => {
            artcileList = list.length
            pages = Math.ceil(artcileList / limit);
            page = Math.min(page, pages);
            page = Math.max(page, 1);
            var skip = (page - 1) * limit;
            Article.find({'tag': {$in: [currentCategory]}}).limit(limit).skip(skip).populate('category').then(function (article) {
                res.render('templates/article_list', {
                    catalog: 'category',
                    id: req.params.id,
                    pages: pages,
                    article: article,
                    page: page,
                    flinks: flinks,
                    category: category,
                    currentCategory: currentCategory,
                    pArticle: pArticle,
                    tags: tags

                })

            })
        });
    })

});
module.exports = router;