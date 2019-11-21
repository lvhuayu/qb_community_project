// 导入express
const express = require('express');
// 导入路由
const router = express.Router();
// 导入bodyParser中间件
const bodyParser = require('body-parser');
const sqlUtil = require("../util/sqlutil");
const search = require("../controllers/searchController");
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/searchTopic', search.searchTopic);
router.post('/searchPost', search.searchPost);
router.post('/searchUser', search.searchUser);




module.exports = router;