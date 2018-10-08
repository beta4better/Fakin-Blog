## Express-Blog
### 技术栈
 - express （框架）
 - mongodb （数据库）
 - mongose （操作mongodb）
 - ejs（模板解析）

使用nodemon来启动和重启项目
### 食用方式
*在此之前必须先安装MongoDB并启动*
```c
git clone
npm install
node app.js //使用nodemon app.js每次修改后就不需要重启项目
```
### 目录及说明
 - config：配置文件（目前只有后台登录账号密码的配置）
 - models：mongodb控制器
 - public：静态文件存储
 - routers：路由
 - schems：mongose
 - upload：后端图片上传地址
 - views：模板

端口8082
后台首页：/admin （未登录自动跳转到/admin/login）
后台登录：admin 123456 （在项目的config/admin.js中可配置）

### 实现功能及页面
#### 前端
 - 首页
 - 分类列表页
 - 标签列表页
 - 标签云
 - 文章点击排行
 - 文章详情页（上下章）
 - 评论（可无限楼中楼回复，需要后台审核）
#### 后端
 - 分类管理（添加分类、编辑文章、删除分类、分类列表、批量删除）
 - 文章管理（添加文章、编辑文章、删除文章、文章列表、批量删除）
 - 评论管理（审核评论（驳回和批准），回复评论，删除评论、批量删除）
 - 站点管理
    - 个人信息，昵称（回复用户评论和文章作者处）简介和详情（前端导航：关于页面）
    - 友情链接（添加链接、编辑链接、删除链接、链接列表、批量链接）

*以上所有列表页都具有分页功能，无论前端还是后端*

### 计划实现功能
评论头像随机（目前是固定的一张图片）
文章搜索
文章置顶

### BUG
目前所有功能及页面全部测试完毕，暂未发现bug，如果你食用后有bug欢迎提issues

### 鸣谢

前端模板：[杨青-早安](https://www.yangqq.com/download/div/2018-05-08/850.html)
后端模板：[x-admin](http://x.xuebingsi.com/)

### 部分截图

<center>![blog6.png](https://github.com/ZpsssLll/Fakin-Blog/blob/master/screenshot/5bbabadf754ff.png)</center>
<center>![blog3.png](https://github.com/ZpsssLll/Fakin-Blog/blob/master/screenshot/5bbabadf9f956.png)</center>

<center>![blog5.png](https://github.com/ZpsssLll/Fakin-Blog/blob/master/screenshot/5bbabadfadfb1.png)</center>

<center>![blog4.png](https://github.com/ZpsssLll/Fakin-Blog/blob/master/screenshot/5bbabadfb11f9.png)</center>

<center>![blog2.png](https://github.com/ZpsssLll/Fakin-Blog/blob/master/screenshot/5bbabae0908b7.png)</center>

<center>![blog1.png](https://github.com/ZpsssLll/Fakin-Blog/blob/master/screenshot/5bbabae0d2301.png)</center>
