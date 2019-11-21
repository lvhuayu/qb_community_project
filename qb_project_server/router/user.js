// 导入express
const express = require('express');
const app = express();
// 导入路由
const router = express.Router();
// 导入bodyParser中间件
const bodyParser = require('body-parser');
// 导入multer中间件
const multer = require('multer');
const sqlUtil = require("../util/sqlutil");
const user = require('../controllers/userController');
const imgCheck = require('../util/imgCheck');
//注册body-parser中间件 parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
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
let upload = multer({ storage });
//发送验证码
router.post('/sendCode', user.sendCode);
//实现验证码登录
router.post('/uPhoneLogin', user.uPhoneLogin);
//用户名/邮箱/手机号登录
router.post('/login', user.login);
//用户第三方登录
router.post('/otherLogin', user.otherLogin);
//上传多图
router.post('/uploadMoreImg', upload.single('file'), user.uploadMoreImg);
//发布文章
router.post('/create', user.addArticle);
//获取用户统计数据
router.get('/getCounts', user.getCounts);
//绑定手机
router.post('/bindPhone', user.bindPhone);
//获取用户信息
router.post('/getuserinfo', user.getUsers);
//获取用户统计信息
router.post('/getusercount', user.getCounts);
//修改头像
router.post('/editUserImg', upload.single('file'), user.editUserImg);
//修改资料
router.post('/editUserInfo', user.editUserInfo);
//修改密码
router.post('/rePassWord', user.rePassWord);
//绑定邮箱
router.post('/bindEmail', user.bindEmail);
//退出登录需要验证token
router.post('/logout', user.logout);
module.exports = router;