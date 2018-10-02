/**
 * Created by Fakin on 2018/9/20.
 */
// var User = require('../models/User');
// var express = require('express');
// var router = express.Router();
// var resData;
// router.use(function () {
//     resData = {
//         code: 0,
//         message: ''
//     }
// });
// router.post('/user/login', function (req, res) {
//     var user = req.body.username;
//     var pwd = req.body.pwd;
//     if (user === "" || pwd === "") {
//         resData.code = 1;
//         resData.message = '用户名或密码错误';
//         res.json(resData);
//         return
//     }
//     //查询数据库中用户名
//     User.findOne({
//         user: user,
//         pwd: pwd
//     }).then(function (userInfo) {
//         console.log(userInfo)
//     })
// });
//
// module.exports = router;