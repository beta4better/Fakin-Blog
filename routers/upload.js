var express = require('express');
var router = express.Router();

var fs = require('fs');
var multer = require('multer');
var upload = multer({
    dest: './upload'
});

router.post('/uploader', upload.single('file'), function (req, res, next) {
    var file = req.file;
    // 接收文件成功后返回数据给前端
    res.json({
        "code": 0
        , "msg": ""
        , "data": {
            "src": req.originalUrl + '/' + file.filename
        }
    });
});
//这个路由是防止前端拿预览图片的时候，直接拿xxx.com/api/uploader/xxxxx而导致xxx.com/api/uploader 404错误
router.get('/uploader', (req, res,) => {
    res.render('upload')
});
router.get('/uploader/:name', (req, res,) => {
    var options = {
        root: './upload/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    var fileName = req.params.name;
    res.sendFile(fileName, options);
});

module.exports = router;
