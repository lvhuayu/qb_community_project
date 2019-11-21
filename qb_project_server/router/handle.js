// 导入express
const express = require('express');
// 导入路由
const router = express.Router();
// 导入bodyParser中间件
const bodyParser = require('body-parser');
const sqlUtil = require("../util/sqlutil");
const handle = require("../controllers/handleController");
router.use(bodyParser.urlencoded({ extended: false }));
//顶踩
router.post('/supPort', handle.supPort);
//评论
router.post('/comment', handle.comment);
router.post('/share', handle.share);
//关注用户
router.post('/follow', handle.follow);
//取消关注
router.post('/escFollow', handle.escFollow);
//互关列表
router.get('/friends', handle.friends);
//粉丝列表
router.get('/fans', handle.fans);
//关注列表
router.get('/follows', handle.follows);
//获取关注人文章列表
router.get('/followsArticle', handle.getFollowsArticle);
//用户反馈
router.post('/feedback', handle.feedBack);
//用户反馈列表
router.get('/feedbacklist', handle.feedBackList);
//检查更新
router.post('/update', handle.update);
module.exports = router;