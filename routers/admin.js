/**
 * Created by Fakin on 2018/9/20.
 */
//加载express模块
var express = require('express');
var admin = require('../config/admin');
var Category = require('../models/Category');
var About = require('../models/About');
var Tag = require('../models/Tag');
var Comment = require('../models/Comment');
var Flinks = require('../models/Flinks');
var Article = require('../models/Article');
var router = express.Router();
router.get('/', function (req, res) {
    if (req.session.user && req.session.pwd) {
        res.redirect('/admin/index')
    } else {
        res.redirect('/admin/login')
    }
});
let resData,about;
resData = {
    code: 0,
    message: ''
};
var compare = function (obj1, obj2) {
    var val1 = obj1.addTime;
    var val2 = obj2.addTime;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
About.findOne().then(function (_about) {
    about = _about
});
//后台首页
router.get('/index', function (req, res) {
    res.render('admin/index')
});
//登陆页面
router.get('/login', function (req, res) {
    if (req.session.user && req.session.pwd) {
        res.redirect('/admin/index');
        return
    }
    res.render('admin/login')
});
//登陆
router.post('/login', function (req, res) {
    var user = req.body.user;
    var pwd = req.body.pwd;
    if (pwd === admin.login.pwd && user === admin.login.user) {
        req.session.user = req.body.user;
        req.session.pwd = req.body.pwd;
        // console.log(req.session);
        res.redirect('/admin/index')
    } else {
        res.redirect('/admin/login');
    }

});
//欢迎页
router.get('/welcome', function (req, res) {
    res.render('admin/welcome')
});
//退出
router.get('/logout', function (req, res) {
    req.session.user = null; // 删除session
    req.session.pwd = null; // 删除session
    res.redirect('/admin/login');
});

//分类列表
router.get('/category', function (req, res) {
    // res.render('admin/category');
    Category.countDocuments().then(function (conut) {
        Category.find().then(function (cate) {
            res.render('admin/category', {
                count: conut,
                cate: cate
            })
        })
    })
});
//分类添加
router.post('/category', function (req, res) {
    var name = req.body.name;
    var alias = req.body.alias;
    //查询数据库中是否有同名分类
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {//存在
            res.render('admin/category', function () {
                resData.message = '重复的分类名';
                resData.code = '1';
                res.json(resData)
            })
        } else {//不存在
            res.render('admin/category', function () {
                resData.message = '添加成功';
                resData.code = '0';
                res.json(resData)
            });
            return new Category({
                name: name,
                alias: alias
            }).save();
        }
    })
});

//分类编辑
router.get('/cate_edit', function (req, res) {
    //获取要修改分类的信息，用表单的形式展现出来
    var id = req.query.id || '';
    Category.findOne({
        _id: id
    }).then(function (cate) {
        if (!cate) {
            res.render('admin/category');
        } else {
            res.render('admin/cate_edit', {
                cate: cate
            })
        }
    })
});

router.post('/cate_edit', function (req, res) {
    var id = req.body.id || '';
    var name = req.body.name || '';
    Category.findOne({
        _id: id
    }).then(function (cate) {
        if (!cate) {
            res.redirect('/admin/category');
        } else {
            if (name === cate.name) {
                res.render('admin/category', function () {
                    resData.code = '0';
                    resData.message = '修改成功';
                    res.json(resData);
                })
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                }).then(function (sameCate) {
                    if (sameCate) {
                        res.render('admin/category', function () {
                            resData.code = '1';
                            resData.message = '修改失败';
                            res.json(resData);
                        })
                    } else {
                        return Category.updateOne({
                            _id: id
                        }, {name: name}).then(function () {
                            res.render('admin/category', function () {
                                resData.code = '0';
                                resData.message = '修改成功';
                                res.json(resData);
                            })
                        })
                    }
                })
            }
        }
    })
});
//分类删除
router.post('/cate_del', function (req, res) {
    let name = req.body.name;
    Category.deleteOne({
        name: name
    }).then(function (rs) {
        if (rs.ok === 1) {
            res.render('admin/category', function () {
                resData.code = '0';
                resData.message = '删除成功';
                res.json(resData);
            })
        } else {
            res.render('admin/category', function () {
                resData.code = '1';
                resData.message = '删除失败';
                res.json(resData);
            })
        }

    })
});

//批量删除
router.post('/cate_del_all', function (req, res) {
    let idList = req.body.id || '';
    Category.deleteMany({_id: {$in: idList}}, (function () {
        res.render('admin/category', function () {
            resData.code = '0';
            resData.message = '删除成功';
            res.json(resData);
        })
    }))
});

//友链操作
router.get('/flinks', function (req, res) {
    // res.render('admin/category');
    Flinks.countDocuments().then(function (conut) {
        Flinks.find().then(function (flinks) {
            res.render('admin/flinks', {
                count: conut,
                flinks: flinks
            })
        })
    })
});

//添加
router.post('/flinks', function (req, res) {
    var name = req.body.name || '';
    var url = req.body.url || '';
    Flinks.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {//存在
            res.render('admin/flinks', function () {
                resData.message = '重复名称';
                resData.code = '1';
                res.json(resData)
            })
        } else {//不存在
            res.render('admin/flinks', function () {
                resData.message = '添加成功';
                resData.code = '0';
                res.json(resData)
            });
            return new Flinks({
                name: name,
                url: url
            }).save();
        }
    })
});

//删除
router.post('/flinks_del', function (req, res) {
    let name = req.body.name;
    Flinks.deleteOne({
        name: name
    }).then(function (rs) {
        if (rs.ok === 1) {
            res.render('admin/flinks', function () {
                resData.code = '0';
                resData.message = '删除成功';
                res.json(resData);
            })
        } else {
            res.render('admin/flinks', function () {
                resData.code = '1';
                resData.message = '删除失败';
                res.json(resData);
            })
        }

    })
});

//编辑
router.get('/flinks_edit', function (req, res) {
    //获取要修改分类的信息，用表单的形式展现出来
    var id = req.query.id || '';
    Flinks.findOne({
        _id: id
    }).then(function (flinks) {
        if (!flinks) {
            res.render('admin/flinks');
        } else {
            res.render('admin/flinks_edit', {
                flinks: flinks
            })
        }
    })
});

router.post('/flinks_edit', function (req, res) {
    var id = req.body.id || '';
    var name = req.body.name || '';
    var url = req.body.url || '';
    Flinks.findOne({
        _id: id
    }).then(function (flinks) {
        if (!flinks) {
            res.redirect('/admin/flinks');
        } else {
            if (name === flinks.name) {
                res.render('admin/flinks', function () {
                    resData.code = '0';
                    resData.message = '修改成功';
                    res.json(resData);
                })
            } else {
                return Flinks.findOne({
                    _id: {$ne: id},
                    name: name
                }).then(function (sameflinks) {
                    if (sameflinks) {
                        res.render('admin/flinks', function () {
                            resData.code = '1';
                            resData.message = '修改失败';
                            res.json(resData);
                        })
                    } else {
                        return Flinks.updateOne({
                            _id: id
                        }, {name: name, url: url}).then(function () {
                            res.render('admin/flinks', function () {
                                resData.code = '0';
                                resData.message = '修改成功';
                                res.json(resData);
                            })
                        })
                    }
                })
            }
        }
    })
});

//文章操作
router.get('/article', (req, res) => {
    /*
     * limit(Number)限制 获取文章条数
     * skip(2) 忽略数据条数
     * */
    var page = Number(req.query.page || 1), limit = 20;
    Article.countDocuments().then(function (conut) {
        pages = Math.ceil(conut / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Article.find().limit(limit).skip(skip).sort({_id: -1}).populate('category').then(function (article) {
            res.render('admin/article', {
                count: conut,
                article: article,
                page: page,
            })
        })
    })
});
//添加
router.get('/article_add', (req, res) => {
    Category.find().then((category) => {
        res.render('admin/article_add', {
            category: category
        })
    });
});

router.post('/article_add', (req, res) => {
    var thumbnail = req.body.img || '';
    var title = req.body.title || '';
    var content = req.body.content || '';
    var description = req.body.des || '';
    var category = req.body.category || '';
    var tags = req.body.tags || '';
    var _tags = tags.split(',');
    Article.findOne({
        title: title
    }).then((rs) => {
        if (rs) {//存在
            res.render('admin/article_add', function () {
                resData.message = '重复名称';
                resData.code = '1';
                res.json(resData)
            })
        } else {
            return new Article({
                thumbnail: thumbnail,
                title: title,
                content: content,
                description: description,
                category: category,
            }).save().then(() => {
                Article.updateOne({title: title}, {$push: {'tag': {$each: _tags}}}, () => {
                    _tags.forEach((item) => {

                        if (item) {
                            Tag.findOne({name: item}).then((tag) => {
                                if (tag) {//标签库中已存在
                                    tag.count++;
                                    tag.save();
                                } else {
                                    return new Tag({
                                        name: item,
                                        count: 1
                                    }).save()
                                }

                            })
                        } else {

                        }

                    })

                });
                res.render('admin/article', function () {
                    resData.message = '添加成功';
                    resData.code = '0';
                    res.json(resData)
                });
            });
        }
    });
});

//删除
router.post('/article_del', (req, res) => {
    let title = req.body.title;
    let id = req.body.id;
    Article.findOne({title: title}).then((article) => {
        let tags = article.tag;
        Article.deleteOne({
            title: title
        }).then(function (rs) {
            if (rs.ok === 1) {
                //删除标签
                tags.forEach((item) => {
                    if (item) {
                        Tag.findOne({name: item}).then((tag) => {
                            if (tag) {
                                tag.count--;
                                tag.save();
                            }
                        })
                    }
                });
                //删除评论
                Comment.deleteOne({article: id}).then((comment) => {
                    console.log(comment)
                });
                res.render('admin/article', function () {
                    resData.code = '0';
                    resData.message = '删除成功';
                    res.json(resData);
                })
            } else {
                res.render('admin/article', function () {
                    resData.code = '1';
                    resData.message = '删除失败';
                    res.json(resData);
                })
            }
        });


    });


});

//批量删除
router.post('/article_del_all', (req, res) => {
    let idList = req.body.id || '';
    Article.deleteMany({_id: {$in: idList}}, (function () {
        //删除评论
        Comment.deleteMany({_id: {$in: idList}}).then((comment) => {
            console.log(comment)
        });
        res.render('admin/article', function () {
            resData.code = '0';
            resData.message = '删除成功';
            res.json(resData);
        })
    }))
});

//编辑
router.post('/article_edit', (req, res) => {
    var id = req.body.id || '';
    var thumbnail = req.body.img || '';
    var title = req.body.title || '';
    var content = req.body.content || '';
    var description = req.body.des || '';
    var category = req.body.category || '';
    var tags = req.body.tags || '';
    var _tags = tags.split(',');
    console.log(category)
    Article.findOne({
        _id: id
    }).then(() => {
        return Article.updateOne({_id: id}, {
            $addToSet: {'tag': {$each: _tags}},
            title: title,
            thumbnail: thumbnail,
            content: content,
            description: description,
            category: category,
            addTime: new Date()
        }, () => {
            _tags.forEach((item) => {
                if (item) {
                    Tag.findOne({name: item}).then((tag) => {
                        if (tag) {//标签库中已存在
                            tag.count++;
                            tag.save();
                        } else {
                            return new Tag({
                                name: item,
                            }).save()
                        }
                    })
                }
            })
            res.render('admin/article', function () {
                resData.message = '修改成功';
                resData.code = '0';
                res.json(resData)
            });
        });
    });
});

router.get('/article_edit', (req, res) => {
    var id = req.query.id || '';
    Category.find().then((category) => {
        Article.findOne({
            _id: id
        }).populate('category').then(function (article) {
            if (!article) {
                res.render('admin/article');
            } else {
                res.render('admin/article_edit', {
                    article: article,
                    category: category
                })
            }
        })
    });

});

router.get('/about', (req, res) => {
    About.findOne().then((rs) => {
        console.log(rs)
        if (!rs) {
            new About({
                author: "",
                thumbnail: "",
                content: "",
                description: ""
            }).save().then(() => {
                res.render('admin/about', {
                    info: rs
                })
            });
        } else {
            res.render('admin/about', {
                info: rs
            })
        }

    })

});
router.post('/about', (req, res) => {

    var author = req.body.author || '';
    var thumbnail = req.body.img || '';
    var content = req.body.content || '';
    var description = req.body.des || '';
    return About.updateOne({
        author: author,
        thumbnail: thumbnail,
        content: content,
        description: description
    }).then(function () {
        res.render('admin/about', function () {
            resData.code = '0';
            resData.message = '修改成功';
            res.json(resData);
        })
    })
});


//标签页
router.get('/tags', (req, res) => {
    var page = Number(req.query.page || 1), limit = 20;
    Tag.countDocuments().then(function (conut) {
        pages = Math.ceil(conut / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Tag.find().limit(limit).skip(skip).then(function (tags) {
            res.render('admin/tags', {
                count: conut,
                tags: tags,
                page: page,
            })
        })
    })

});
//添加
router.post('/tags', (req, res) => {
    var name = req.body.name;
    //查询数据库中是否有同名分类
    Tag.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {//存在
            res.render('admin/tags', function () {
                resData.message = '重复的标签名';
                resData.code = '1';
                res.json(resData)
            })
        } else {//不存在
            res.render('admin/tags', function () {
                resData.message = '添加成功';
                resData.code = '0';
                res.json(resData)
            });
            return new Tag({
                name: name,
            }).save();
        }
    })
});

//编辑
router.get('/tags_edit', function (req, res) {
    //获取要修改分类的信息，用表单的形式展现出来
    var id = req.query.id || '';
    Tag.findOne({
        _id: id
    }).then(function (tag) {
        if (!tag) {
            res.render('admin/tags');
        } else {
            res.render('admin/tags_edit', {
                tags: tag
            })
        }
    })
});

router.post('/tags_edit', function (req, res) {
    var id = req.body.id || '';
    var name = req.body.name || '';
    Tag.findOne({
        _id: id
    }).then(function (tag) {
        if (!tag) {
            res.redirect('/admin/tags');
        } else {
            if (name === tag.name) {
                res.render('admin/tags', function () {
                    resData.code = '0';
                    resData.message = '修改成功';
                    res.json(resData);
                })
            } else {
                return Tag.findOne({
                    _id: {$ne: id},
                    name: name
                }).then(function (sameCate) {
                    if (sameCate) {
                        res.render('admin/tags', function () {
                            resData.code = '1';
                            resData.message = '修改失败';
                            res.json(resData);
                        })
                    } else {
                        return Tag.updateOne({
                            _id: id
                        }, {name: name}).then(function () {
                            res.render('admin/tags', function () {
                                resData.code = '0';
                                resData.message = '修改成功';
                                res.json(resData);
                            })
                        })
                    }
                })
            }
        }
    })
});
//删除
router.post('/tags_del', function (req, res) {
    let name = req.body.name;
    Tag.deleteOne({
        name: name
    }).then(function (rs) {
        if (rs.ok === 1) {
            res.render('admin/tags', function () {
                resData.code = '0';
                resData.message = '删除成功';
                res.json(resData);
            })
        } else {
            res.render('admin/tags', function () {
                resData.code = '1';
                resData.message = '删除失败';
                res.json(resData);
            })
        }

    })
});
//批量删除
router.post('/tags_del_all', (req, res) => {
    let idList = req.body.id || '';
    Tag.deleteMany({_id: {$in: idList}}, (function () {
        res.render('admin/tags', function () {
            resData.code = '0';
            resData.message = '删除成功';
            res.json(resData);
        })
    }))
});

//评论
router.get('/comments', (req, res) => {
    var pageIndex = Number(req.query.page) || 1;
    if (pageIndex === 0) {
        pageIndex = 1
    }
    var replyList = [], pageSize = 4, pages;
    Comment.find({}, {reply: 0}).then((comments) => {
        Comment.find({"$where": "this.reply.length>0"}, {reply: 1, _id: 0}).then((reply) => {

            // console.log(reply)
            // for(var )
            reply.forEach((item) => {
                item.reply.forEach((items) => {
                    replyList.push(items)
                });
            });//把获取到的子评论全部展开成一个新的数组
            // console.log(replyList)
            var commentCount = [...comments, ...replyList]//楼中楼+顶级回复
            // console.log(comments)
            pages = Math.ceil(commentCount.length / pageSize);//总页数
            pageIndex = Math.min(pageIndex, pages);
            pageIndex = Math.max(pageIndex, 1);
            //这一步算法是：通过获取req.query.page的值来确定返回数组的个数及返回数组中哪几项
            var _comments = commentCount.sort(compare).reverse().slice((pageIndex - 1) * pageSize, pageSize * pageIndex);
            // console.log(_comments)
            res.render('admin/comment', {
                count: commentCount.length,
                comments: _comments,
                page: pageIndex
            })
        })
    })


});
router.post('/comments', (req, res) => {
    console.log(req.body)
    var name = req.body.name || '';
    var cBody = req.body.body || '';
    var articleId = req.body.articleId || '';
    var cId = req.body.cid || '';
    var cname = req.body.cname || '';
    var title = req.body.title || '';
    var admin = req.body.admin || ''
    console.log(admin,cId)
    if (admin) {
        Comment.findById(cId, function (err, comment) {
            var reply = {
                fatherId: cId,
                article: title,
                articleId: articleId,
                name: about.author,
                to: cname,
                content: cBody,
                isSh: true
            };
            comment.reply.push(reply);
            comment.save(function (err, comment) {
                if (err) {
                    console.log(err)
                }
                res.render('/admin/comment', () => {
                    resData.code = '0';
                    resData.message = '提交成功';
                    res.json(resData);
                })
            })

        })

    } else {
        if (cId) {
            Comment.findById(cId, function (err, comment) {
                var reply = {
                    fatherId: cId,
                    article: title,
                    articleId: articleId,
                    name: name,
                    to: cname,
                    content: cBody,
                    isSh: false
                };
                comment.reply.push(reply);
                comment.save(function (err, comment) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('templates/article_article', () => {
                        resData.code = '0';
                        resData.message = '提交成功';
                        res.json(resData);
                    })
                })

            })
        } else {
            new Comment({
                article: title,
                articleId: articleId,
                name: name,
                content: cBody,
                isSh: false
            }).save().then(() => {
                res.render('templates/article_article', () => {
                    resData.code = '0';
                    resData.message = '提交成功';
                    res.json(resData);
                })
            });
        }
    }


});
router.post('/comments/examine', (req, res) => {
    var id = req.body.id || '';
    var bool = req.body.isSh || false;
    var pid = req.body.pid || '';
    if (pid) {
        Comment.findOne({"reply": {$elemMatch: {"_id": id}}}).then((comment) => {
            Comment.updateOne({_id: comment._id, reply: {$elemMatch: {"_id": id}}}, {
                $set: {"reply.$.isSh": bool}
            }).then((_res) => {
                res.render('admin/comment', function () {
                    resData.code = '0';
                    resData.message = '操作成功';
                    res.json(resData);
                });
            })
        })
    } else {
        Comment.updateOne({_id: id}, {isSh: bool}).then((comment) => {
            res.render('admin/comment', function () {
                resData.code = '0';
                resData.message = '操作成功';
                res.json(resData);
            });

        })
    }


});
router.post('/comments/delete', (req, res) => {
    var id = req.body.id || '';
    var to = req.body.to || '';
    if (to) {
        Comment.findOne({"reply": {$elemMatch: {"_id": id}}}).then((comment) => {
            Comment.updateOne({_id: comment._id}, {$pull: {'reply': {_id: id}}}).then((_res) => {
                res.render('admin/comment', function () {
                    resData.code = '0';
                    resData.message = '操作成功';
                    res.json(resData);
                });
            })
        })
    } else {
        Comment.deleteOne({
            _id: id
        }).then(function (rs) {
            if (rs.ok === 1) {
                res.render('admin/comment', function () {
                    resData.code = '0';
                    resData.message = '删除成功';
                    res.json(resData);
                })
            } else {
                res.render('admin/comment', function () {
                    resData.code = '1';
                    resData.message = '删除失败';
                    res.json(resData);
                })
            }

        })

    }

});
router.post('/comments/delete_all', (req, res) => {
    let idList = req.body.id || '';
    // console.log(idList)
    idList.forEach((item) => {
        Comment.findOne({_id: item}).then((comment) => {
            if (comment) {
                Comment.deleteOne({
                    _id: item
                }).then((com) => {
                    console.log(com)
                })
            } else {
                Comment.findOne({"reply": {$elemMatch: {"_id": item}}}).then((comment) => {
                    Comment.updateOne({_id: comment._id}, {$pull: {'reply': {_id: item}}}).then((_res) => {
                        console.log(_res)
                    })
                })
            }
            res.render('admin/comment', function () {
                resData.code = '0';
                resData.message = '操作成功';
                res.json(resData);
            });

        })
    })

});
router.post('comments/myreply', (req, res) => {

});
router.get('/comments/myreply', (req, res) => {
    res.render('admin/comment_reply')
});

module.exports = router;












