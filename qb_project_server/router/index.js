// 导入express
const express = require('express');
// 导入路由
const router = express.Router();
// 导入bodyParser中间件
const bodyParser = require('body-parser');
const imgCheck = require('../util/imgCheck');
// 导入multer中间件
const multer = require('multer');
const sqlUtil = require("../util/sqlutil");
const article = require("../controllers/articleController");
// 注册body-parser中间件
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
//配置文件上传
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads') //设置图片上传路径
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
let checkFileExt = imgCheck.checkFileExt;
let fileFilter = imgCheck.fileFilter;
let upload = multer({ storage, fileFilter });

//获取首页文章标题列表
router.get('/getClass', article.getPostClass);
//获取话题分类标题列表
router.get('/getTopicClass', article.getTopicClass);
//获取热门话题
router.get('/hotTopic', article.getHotTopic);
//获取指定下的话题分类话题
router.get('/topicClass', article.topicClass);
//获取文章详情
router.get('/post', article.getPost);
//获取话题文章
router.get('/topicPost', article.getTopicPost);
//获取指定话题分类下的文章
router.get('/postClassArticle', article.getPostClassArticle);
//获取文章评论列表
router.get('/getComment', article.getComment);
//获取用户开放文章信息
router.get('/userPost', article.getUserPost);
//获取用户所有文章信息
router.get('/userAllPost', article.getUserAllPost);
//获取广告位信息
router.get('/advList', article.getAdvList);

module.exports = router;