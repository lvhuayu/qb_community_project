/*
Navicat MySQL Data Transfer

Source Server         : QBapp
Source Server Version : 50153
Source Host           : localhost:3306
Source Database       : qb_app

Target Server Type    : MYSQL
Target Server Version : 50153
File Encoding         : 65001

Date: 2019-11-20 18:45:33
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adsense
-- ----------------------------
DROP TABLE IF EXISTS `adsense`;
CREATE TABLE `adsense` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0 动态轮播图 1个人中心',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of adsense
-- ----------------------------
INSERT INTO `adsense` VALUES ('1', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/banner1.jpg', '#', '0', null);
INSERT INTO `adsense` VALUES ('2', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/banner2.jpg', '#', '0', null);
INSERT INTO `adsense` VALUES ('3', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/banner3.jpg', '#', '0', null);
INSERT INTO `adsense` VALUES ('4', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/demo20.jpg', '#', '1', null);

-- ----------------------------
-- Table structure for blacklist
-- ----------------------------
DROP TABLE IF EXISTS `blacklist`;
CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `black_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '拉黑id',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `create_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of blacklist
-- ----------------------------

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) unsigned DEFAULT '0' COMMENT '发布人',
  `fid` int(20) unsigned NOT NULL DEFAULT '0' COMMENT '回复id',
  `fnum` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '被回复数',
  `data` varchar(225) NOT NULL,
  `create_time` bigint(13) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('106', '49', '0', '2', '696969', '1573719970742', '1');
INSERT INTO `comment` VALUES ('107', '49', '106', '0', '696969', '1573720047426', '1');
INSERT INTO `comment` VALUES ('108', '49', '106', '0', '696969', '1573720068414', '1');
INSERT INTO `comment` VALUES ('109', '49', '0', '1', '1级评论', '1573720139452', '36');
INSERT INTO `comment` VALUES ('110', '49', '0', '0', '为什么', '1573720263854', '36');
INSERT INTO `comment` VALUES ('111', '49', '0', '0', '我的1级评论为什么不出现', '1573720342724', '36');
INSERT INTO `comment` VALUES ('112', '49', '0', '0', '1111', '1573720410028', '36');
INSERT INTO `comment` VALUES ('113', '49', '0', '0', '22222', '1573720506550', '36');
INSERT INTO `comment` VALUES ('114', '49', '0', '1', '33333333', '1573720583816', '36');
INSERT INTO `comment` VALUES ('115', '49', '0', '1', '最后的一级评论', '1573720719341', '36');
INSERT INTO `comment` VALUES ('116', '49', '0', '1', '这是二级评论吖', '1573720734333', '36');
INSERT INTO `comment` VALUES ('117', '49', '114', '1', '？？？？', '1573720751346', '36');
INSERT INTO `comment` VALUES ('118', '49', '115', '1', '什么鬼', '1573720759042', '36');
INSERT INTO `comment` VALUES ('119', '49', '116', '0', '你是什么鬼', '1573720765379', '36');
INSERT INTO `comment` VALUES ('120', '49', '117', '0', '？？？？', '1573720771616', '36');
INSERT INTO `comment` VALUES ('121', '49', '118', '0', '哈哈哈', '1573720777414', '36');
INSERT INTO `comment` VALUES ('122', '49', '109', '0', '2222级评论', '1573800840040', '36');
INSERT INTO `comment` VALUES ('123', '49', '0', '0', '狗宝牛逼', '1573823688852', '3');
INSERT INTO `comment` VALUES ('124', '49', '0', '0', '恩？', '1573826784021', '23');
INSERT INTO `comment` VALUES ('125', '49', '0', '1', '哈哈哈？', '1573826834190', '10');
INSERT INTO `comment` VALUES ('126', '49', '125', '0', 'halo吖 ', '1573827534475', '10');
INSERT INTO `comment` VALUES ('127', '49', '0', '0', '打', '1574233199830', '36');
INSERT INTO `comment` VALUES ('128', '49', '0', '0', '什么意思吖', '1574234105108', '11');
INSERT INTO `comment` VALUES ('129', '49', '0', '0', '咧好呀~', '1574234783652', '36');

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '接受id',
  `from_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '发送id',
  `data` varchar(255) DEFAULT NULL,
  `create_time` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of feedback
-- ----------------------------
INSERT INTO `feedback` VALUES ('1', '0', '13', '反馈信息', '1558188172');
INSERT INTO `feedback` VALUES ('2', '0', '13', '你好', '1559632845');
INSERT INTO `feedback` VALUES ('3', '0', '13', '请问现在几点了', '1559632859');
INSERT INTO `feedback` VALUES ('4', '0', '13', '你好啊', '1560247142');
INSERT INTO `feedback` VALUES ('5', '0', '13', '哈哈', '1560247201');
INSERT INTO `feedback` VALUES ('6', '0', '13', '哦哦哦', '1560247277');
INSERT INTO `feedback` VALUES ('7', '0', '25', '1', '1560474823');
INSERT INTO `feedback` VALUES ('8', '0', '26', '这是一条反馈信息！', '1572526070657');
INSERT INTO `feedback` VALUES ('9', '0', '26', '我打', '1572765232813');

-- ----------------------------
-- Table structure for follow
-- ----------------------------
DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `follow_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '关注id',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `create_time` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of follow
-- ----------------------------
INSERT INTO `follow` VALUES ('146', '49', '14', null);
INSERT INTO `follow` VALUES ('147', '49', '12', null);
INSERT INTO `follow` VALUES ('153', '49', '17', null);
INSERT INTO `follow` VALUES ('180', '20', '49', null);
INSERT INTO `follow` VALUES ('181', '0', '0', null);
INSERT INTO `follow` VALUES ('195', '49', '26', null);
INSERT INTO `follow` VALUES ('200', '12', '49', '1573822243147');

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `create_time` bigint(15) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of image
-- ----------------------------
INSERT INTO `image` VALUES ('1', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/1.jpg', null, '12');
INSERT INTO `image` VALUES ('2', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/2.jpg', null, '12');
INSERT INTO `image` VALUES ('3', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/3.jpg', null, '12');
INSERT INTO `image` VALUES ('4', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', null, '12');
INSERT INTO `image` VALUES ('5', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/5.jpg', null, '12');
INSERT INTO `image` VALUES ('6', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/6.jpg', null, '12');
INSERT INTO `image` VALUES ('7', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/7.jpg', null, '12');
INSERT INTO `image` VALUES ('8', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/8.jpg', null, '12');
INSERT INTO `image` VALUES ('9', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/9.jpg', null, '12');
INSERT INTO `image` VALUES ('10', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/10.jpg', null, '12');
INSERT INTO `image` VALUES ('165', 'http://192.168.112.56:8080/uploads/1573715907622timg-4.bin', '1573715907635', '49');
INSERT INTO `image` VALUES ('166', 'http://192.168.112.56:8080/uploads/1573715907617timg-5.bin', '1573715907637', '49');
INSERT INTO `image` VALUES ('167', 'http://192.168.112.56:8080/uploads/1573715907627timg-8.bin', '1573715907639', '49');

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) unsigned NOT NULL DEFAULT '0' COMMENT '发布人',
  `title` varchar(80) NOT NULL,
  `titlepic` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `sharenum` int(10) unsigned DEFAULT '0',
  `path` varchar(255) NOT NULL,
  `type` tinyint(1) unsigned DEFAULT '0' COMMENT '0 图文 1分享',
  `create_time` bigint(15) DEFAULT NULL,
  `post_class_id` int(11) DEFAULT NULL,
  `isopen` tinyint(1) DEFAULT '1' COMMENT '1开放，0仅自己可见',
  `upnum` int(11) DEFAULT '0',
  `downnum` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES ('1', '12', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '广东深圳', '0', null, '1', '1', '1', '11');
INSERT INTO `post` VALUES ('3', '12', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '广东-广州', '0', null, '1', '1', '0', '0');
INSERT INTO `post` VALUES ('4', '12', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '广东-广州', '0', null, '5', '1', '0', '0');
INSERT INTO `post` VALUES ('5', '12', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '广东-广州', '0', null, '2', '1', '0', '0');
INSERT INTO `post` VALUES ('8', '12', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '广东-广州', '0', null, '1', '1', '0', '0');
INSERT INTO `post` VALUES ('9', '12', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '广东-广州', '0', null, '4', '1', '0', '0');
INSERT INTO `post` VALUES ('10', '14', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '未知', '0', '0', '4', '1', '0', '0');
INSERT INTO `post` VALUES ('11', '14', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '未知', '0', '0', '1', '0', '1', '0');
INSERT INTO `post` VALUES ('12', '14', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '未知', '0', '1557581053', '4', '0', '0', '0');
INSERT INTO `post` VALUES ('13', '14', '最前线 | 微信调整公众号分成比例，收入不设上限留住好内容', 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/4.jpg', 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。', '0', '未知', '0', '1557581932', '1', '1', '2', '0');
INSERT INTO `post` VALUES ('14', '17', '12132', '', '12132', '0', '广东广州', '0', '1560005478', '2', '0', '0', '0');
INSERT INTO `post` VALUES ('15', '17', '12132', '', '12132', '0', '广东广州', '0', '1560005579', '3', '0', '0', '0');
INSERT INTO `post` VALUES ('16', '17', '测试一下发布信息', '', '测试一下发布信息', '0', '广东广州', '0', '1560006203', '2', '0', '0', '0');
INSERT INTO `post` VALUES ('17', '17', '再来发一篇文章', '', '再来发一篇文章', '0', '广东广州', '0', '1560060388', '5', '1', '0', '0');
INSERT INTO `post` VALUES ('18', '17', '哈哈哈哈', '', '哈哈哈哈', '0', '广东广州', '0', '1560060668', '3', '0', '0', '0');
INSERT INTO `post` VALUES ('21', '17', '哦哦哦', '', '哦哦哦', '0', '广东广州', '0', '1560063314', '2', '0', '0', '0');
INSERT INTO `post` VALUES ('22', '13', '哈哈哈哈嗝', '', '哈哈哈哈嗝', '0', '河北省-石家庄市-新华区', '0', '1560265417', '3', '1', '0', '0');
INSERT INTO `post` VALUES ('23', '17', '试一下发布', '', '试一下发布', '0', '广东广州', '0', '1560343579', '1', '1', '1', '0');
INSERT INTO `post` VALUES ('24', '17', '哈哈哈哈哈哈', '', '哈哈哈哈哈哈', '0', '广东广州', '0', '1560343652', '2', '1', '0', '0');
INSERT INTO `post` VALUES ('26', '26', '啊哈哈哈哈哈哈', '/uploads/1572006169642card4.jpg', '啊哈哈哈哈哈哈', '0', '北京-顺义', '0', '1572153664589', '6', '1', '0', '0');
INSERT INTO `post` VALUES ('27', '26', '啊哈哈哈哈哈哈', '/uploads/1572006169642card4.jpg', '啊哈哈哈哈哈哈', '0', '北京-顺义', '0', '1572153745482', '6', '0', '0', '0');
INSERT INTO `post` VALUES ('28', '26', '啦啦啦啦啦', '/uploads/1572006169642card4.jpg', '啦啦啦啦啦', '0', '北京-顺义', '0', '1572247088907', '4', '1', '0', '0');
INSERT INTO `post` VALUES ('36', '49', '娃哈哈果粒多，喝出你想喝的味道~~~~~~~~~~~', 'http://192.168.112.56:8080/uploads/1573715907617timg-5.bin', '娃哈哈果粒多，喝出你想喝的味道~~~~~~~~~~~', '13', '北京市-市辖区-顺义区', '0', '1573715918632', '1', '0', '109', '45');
INSERT INTO `post` VALUES ('37', '49', '这是文章标题', '', '这是文章的内容吖', '0', '北京市-市辖区-顺义区', '0', '1574242565825', '1', '0', '0', '0');

-- ----------------------------
-- Table structure for post_class
-- ----------------------------
DROP TABLE IF EXISTS `post_class`;
CREATE TABLE `post_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(5) NOT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '0 禁用 1启用',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of post_class
-- ----------------------------
INSERT INTO `post_class` VALUES ('1', '关注', '1', null);
INSERT INTO `post_class` VALUES ('2', '推荐', '1', null);
INSERT INTO `post_class` VALUES ('3', '体育', '1', null);
INSERT INTO `post_class` VALUES ('4', '热点', '1', null);
INSERT INTO `post_class` VALUES ('5', '财经', '1', null);
INSERT INTO `post_class` VALUES ('6', '娱乐', '1', null);

-- ----------------------------
-- Table structure for post_image
-- ----------------------------
DROP TABLE IF EXISTS `post_image`;
CREATE TABLE `post_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '帖子id',
  `image_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '图片id',
  `create_time` bigint(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of post_image
-- ----------------------------
INSERT INTO `post_image` VALUES ('1', '1', '1', null);
INSERT INTO `post_image` VALUES ('2', '1', '2', null);
INSERT INTO `post_image` VALUES ('3', '1', '3', null);
INSERT INTO `post_image` VALUES ('4', '2', '4', null);
INSERT INTO `post_image` VALUES ('5', '2', '5', null);
INSERT INTO `post_image` VALUES ('6', '3', '19', null);
INSERT INTO `post_image` VALUES ('7', '3', '20', null);
INSERT INTO `post_image` VALUES ('8', '4', '19', '0');
INSERT INTO `post_image` VALUES ('9', '4', '20', '0');
INSERT INTO `post_image` VALUES ('10', '5', '19', '1556872203');
INSERT INTO `post_image` VALUES ('11', '5', '20', '1556872203');
INSERT INTO `post_image` VALUES ('12', '8', '20', '1556872774');
INSERT INTO `post_image` VALUES ('13', '9', '20', '1556872856');
INSERT INTO `post_image` VALUES ('14', '14', '43', '1560005478');
INSERT INTO `post_image` VALUES ('15', '14', '44', '1560005478');
INSERT INTO `post_image` VALUES ('16', '15', '43', '1560005579');
INSERT INTO `post_image` VALUES ('17', '15', '44', '1560005579');
INSERT INTO `post_image` VALUES ('18', '16', '46', '1560006203');
INSERT INTO `post_image` VALUES ('19', '16', '45', '1560006203');
INSERT INTO `post_image` VALUES ('20', '17', '47', '1560060388');
INSERT INTO `post_image` VALUES ('21', '17', '48', '1560060388');
INSERT INTO `post_image` VALUES ('22', '17', '49', '1560060388');
INSERT INTO `post_image` VALUES ('23', '17', '50', '1560060388');
INSERT INTO `post_image` VALUES ('24', '18', '51', '1560060668');
INSERT INTO `post_image` VALUES ('25', '18', '52', '1560060668');
INSERT INTO `post_image` VALUES ('26', '22', '56', '1560265417');
INSERT INTO `post_image` VALUES ('27', '22', '57', '1560265417');
INSERT INTO `post_image` VALUES ('28', '23', '58', '1560343579');
INSERT INTO `post_image` VALUES ('29', '23', '59', '1560343579');
INSERT INTO `post_image` VALUES ('30', '24', '58', '1560343652');
INSERT INTO `post_image` VALUES ('31', '24', '59', '1560343652');
INSERT INTO `post_image` VALUES ('32', '25', '62', '1560474675');
INSERT INTO `post_image` VALUES ('43', '36', '166', '1573715918637');
INSERT INTO `post_image` VALUES ('44', '36', '165', '1573715918641');
INSERT INTO `post_image` VALUES ('45', '36', '167', '1573715918644');

-- ----------------------------
-- Table structure for support
-- ----------------------------
DROP TABLE IF EXISTS `support`;
CREATE TABLE `support` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '发布人',
  `post_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '帖子id',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0 顶 1踩',
  `create_time` bigint(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of support
-- ----------------------------
INSERT INTO `support` VALUES ('68', '49', '36', '0', '1574232937394');
INSERT INTO `support` VALUES ('69', '49', '23', '0', '1574233010295');
INSERT INTO `support` VALUES ('70', '49', '13', '0', '1574234019271');
INSERT INTO `support` VALUES ('71', '49', '11', '0', '1574234085454');

-- ----------------------------
-- Table structure for topic
-- ----------------------------
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL,
  `titlepic` varchar(255) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '0 禁用 1启用',
  `create_time` datetime DEFAULT NULL,
  `topic_class_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic
-- ----------------------------
INSERT INTO `topic` VALUES ('1', '男生打游戏不理女生该怎么办', 'http://pic41.nipic.com/20140508/18159932_141918370000_2.jpg', '男生打游戏没有理女朋友，该不该生气？', '1', null, '1');
INSERT INTO `topic` VALUES ('2', '说出你不想说的秘密', 'http://ku.90sjimg.com/element_origin_min_pic/17/05/02/ccb7940525b12d000632dd3adecf2c98.jpg', '每个人说出一个藏在心底的小秘密。', '1', null, '1');
INSERT INTO `topic` VALUES ('3', '前女友真的那么难忘记吗', 'http://www.agri35.com/UploadFiles/img_1_3767628913_1264636066_26.jpg', '关于前女友的记忆，怎么才能消失。', '1', null, '2');
INSERT INTO `topic` VALUES ('4', '冬景秀', 'http://pic41.nipic.com/20140508/18159932_141918370000_2.jpg', '秀出你冬天的景色。', '1', null, '3');
INSERT INTO `topic` VALUES ('5', '淘宝记录簿', 'http://ku.90sjimg.com/element_origin_min_pic/17/05/02/ccb7940525b12d000632dd3adecf2c98.jpg', '都在淘宝买了什么好货？赶紧分享出来吧。', '1', null, '5');
INSERT INTO `topic` VALUES ('6', '相信异性存在友谊吗', 'http://www.agri35.com/UploadFiles/img_1_3767628913_1264636066_26.jpg', '异性之间真的存在纯的友谊吗？', '1', null, '1');
INSERT INTO `topic` VALUES ('7', '减肥大放送', 'http://pic41.nipic.com/20140508/18159932_141918370000_2.jpg', '你想不到的减肥方法，这里都有。', '1', null, '1');

-- ----------------------------
-- Table structure for topic_class
-- ----------------------------
DROP TABLE IF EXISTS `topic_class`;
CREATE TABLE `topic_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classname` varchar(5) NOT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '0 禁用 1启用',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_class
-- ----------------------------
INSERT INTO `topic_class` VALUES ('1', '最新', '1', null);
INSERT INTO `topic_class` VALUES ('2', '游戏', '1', null);
INSERT INTO `topic_class` VALUES ('3', '情感', '1', null);
INSERT INTO `topic_class` VALUES ('4', '打卡', '1', null);
INSERT INTO `topic_class` VALUES ('5', '故事', '1', null);
INSERT INTO `topic_class` VALUES ('6', '喜爱', '1', null);

-- ----------------------------
-- Table structure for topic_post
-- ----------------------------
DROP TABLE IF EXISTS `topic_post`;
CREATE TABLE `topic_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '话题id',
  `post_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '帖子id',
  `create_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_post
-- ----------------------------
INSERT INTO `topic_post` VALUES ('1', '1', '1', null);
INSERT INTO `topic_post` VALUES ('2', '1', '3', null);
INSERT INTO `topic_post` VALUES ('3', '3', '9', '0');
INSERT INTO `topic_post` VALUES ('4', '2', '4', '0');
INSERT INTO `topic_post` VALUES ('5', '2', '5', '1560343579');
INSERT INTO `topic_post` VALUES ('6', '2', '8', '1560343652');
INSERT INTO `topic_post` VALUES ('7', '3', '10', '1560474675');
INSERT INTO `topic_post` VALUES ('8', '4', '12', null);
INSERT INTO `topic_post` VALUES ('9', '4', '13', null);
INSERT INTO `topic_post` VALUES ('10', '5', '14', null);
INSERT INTO `topic_post` VALUES ('11', '5', '15', null);
INSERT INTO `topic_post` VALUES ('12', '6', '18', null);
INSERT INTO `topic_post` VALUES ('13', '6', '17', null);

-- ----------------------------
-- Table structure for update
-- ----------------------------
DROP TABLE IF EXISTS `update`;
CREATE TABLE `update` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `version` varchar(10) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0' COMMENT '0未上线 1上线',
  `create_time` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of update
-- ----------------------------
INSERT INTO `update` VALUES ('1', 'http://www.baidu.com', '1.0.1', '1', null);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `userpic` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` tinyint(1) unsigned DEFAULT '1' COMMENT '0 禁用 1启用',
  `create_time` bigint(13) DEFAULT NULL,
  `bind_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('12', '测试1', 'http://img3.duitang.com/uploads/item/201605/07/20160507191419_J2m8R.thumb.700_0.jpeg', '666', '13450772007', '123', '1', '1556431201', null);
INSERT INTO `user` VALUES ('13', '昵111称', 'http://img.52z.com/upload/news/image/20181108/20181108204521_83402.jpg', '$2y$10$Wtnl6fUcWn9FVJ0HeUcMEeYrUxAHxaXgXRb62T4wjvR6uG18qdRRW', '13450772008', '111@qq.com', '1', '1556790013', null);
INSERT INTO `user` VALUES ('14', '666', 'http://b-ssl.duitang.com/uploads/item/201608/21/20160821230024_MyCYK.thumb.700_0.jpeg', '$2y$10$f1CR90N6Ocstrc42rYj.wuxSBQHLNm3vq1oamQaN2XcSxdDwYR0Ge', '13450772011', '', '1', '1556974137', null);
INSERT INTO `user` VALUES ('15', '13450772009', 'http://img0.imgtn.bdimg.com/it/u=533012005,1605503981&fm=26&gp=0.jpg', '', '13450772009', null, '1', '1558078514', null);
INSERT INTO `user` VALUES ('17', '王大临', 'http://m.360buyimg.com/pop/jfs/t23434/230/1763906670/10667/55866a07/5b697898N78cd1466.jpg', '666', '13450772012', null, '1', '1558084499', null);
INSERT INTO `user` VALUES ('18', '王大临772222', 'http://m.360buyimg.com/pop/jfs/t23434/230/1763906670/10667/55866a07/5b697898N78cd1466.jpg', '$2y$10$9.KtKNdViCzg7UEeBooZNuxoNBufcwBJaQwV7g6e2gsCnCJEPeHyK', '13450772013', null, '1', '1559474168', null);
INSERT INTO `user` VALUES ('19', '王大临772222', 'http://m.360buyimg.com/pop/jfs/t23434/230/1763906670/10667/55866a07/5b697898N78cd1466.jpg', '', '13656457563', null, '1', '1559655420', null);
INSERT INTO `user` VALUES ('20', '13450772022', 'http://img0.imgtn.bdimg.com/it/u=533012005,1605503981&fm=26&gp=0.jpg', '', '13450772022', null, '1', '1559655600', null);
INSERT INTO `user` VALUES ('21', '13450772023', 'http://img0.imgtn.bdimg.com/it/u=533012005,1605503981&fm=26&gp=0.jpg', '', '13450772023', null, '1', '1559655843', null);
INSERT INTO `user` VALUES ('22', '13450772024', 'http://img0.imgtn.bdimg.com/it/u=533012005,1605503981&fm=26&gp=0.jpg', '$2y$10$y76WPQI2GY8x4G9BdRB2se0kWknPBsosJnWW9ZODtONyd/s/gkV32', '13450772024', '1112@qq.com', '1', '1559655964', null);
INSERT INTO `user` VALUES ('23', '13711111111', 'http://img0.imgtn.bdimg.com/it/u=533012005,1605503981&fm=26&gp=0.jpg', '', '13711111111', null, '1', '1560235719', null);
INSERT INTO `user` VALUES ('24', '13122222222', 'https://ceshi2.dishait.cn//uploads/20190614/ea9a848e1db826bcc9a0fd9367867cc1.png', '', '13122222222', null, '1', '1560388448', null);
INSERT INTO `user` VALUES ('26', '18300000000', 'https://ceshi2.dishait.cn//uploads/20190614/ea9a848e1db826bcc9a0fd9367867cc1.png', '666', '18327681010', null, '1', '1560474455', null);
INSERT INTO `user` VALUES ('47', '13947863695', 'http://m.360buyimg.com/pop/jfs/t23434/230/1763906670/10667/55866a07/5b697898N78cd1466.jpg', '123', '13947863695', null, '1', '1573373375909', null);
INSERT INTO `user` VALUES ('49', '王大临', 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKHdNuqiaO5uXgFfm5n0R6rehnhgdJY0bfqoVdU8z8EmKjjzHzyWLQ8jd4VDJZiaI9CkfE5iawAyYpBw/132', '666', null, '994692405@qq.com', '1', '1573375448364', '37');
INSERT INTO `user` VALUES ('50', '站住.', 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKHdNuqiaO5uXgFfm5n0R6rehnhgdJY0bfqoVdU8z8EmKjjzHzyWLQ8jd4VDJZiaI9CkfE5iawAyYpBw/132', null, null, null, '1', '1573542599314', '38');

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `age` int(3) unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  `sex` tinyint(3) unsigned NOT NULL DEFAULT '2' COMMENT '0 男 1女 2不限',
  `qg` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0不限',
  `job` varchar(10) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `birthday` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('18', '18', '181', '1', '2', 'IT-WEB', '北京wfawaf', '1996-05-16');
INSERT INTO `userinfo` VALUES ('19', '49', '23', '0', '0', '1', '北京市-市辖区-顺义区', '1996-08-16');
INSERT INTO `userinfo` VALUES ('20', '17', '23', '0', '1', 'IT-WEB', '北京', '1996-08-16');
INSERT INTO `userinfo` VALUES ('21', '50', '23', '0', '1', '0', '内蒙古自治区-巴彦淖尔市-临河区', '1996-08-16');
INSERT INTO `userinfo` VALUES ('22', '12', '15', '1', '1', null, null, null);
INSERT INTO `userinfo` VALUES ('23', '13', '25', '0', '2', 'IT-WEB', '西伯利亚', null);
INSERT INTO `userinfo` VALUES ('24', '14', '20', '0', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('25', '15', '0', '0', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('26', '17', '0', '0', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('27', '18', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('28', '19', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('29', '20', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('30', '21', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('31', '22', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('32', '23', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('33', '24', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('34', '26', '0', '2', '0', null, null, null);
INSERT INTO `userinfo` VALUES ('35', '0', '0', '2', '0', null, null, null);

-- ----------------------------
-- Table structure for user_bind
-- ----------------------------
DROP TABLE IF EXISTS `user_bind`;
CREATE TABLE `user_bind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `openid` varchar(255) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `avatarurl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_bind
-- ----------------------------
INSERT INTO `user_bind` VALUES ('37', 'qq', '3C7DE730ECED0A2C30DE2CC21B3B434B', '明早', 'http://qzapp.qlogo.cn/qzapp/1104455702/3C7DE730ECED0A2C30DE2CC21B3B434B/30');
INSERT INTO `user_bind` VALUES ('38', 'weixin', 'oU5Yyt8rCLBG8skSLkT7kRptLwCQ', '站住.', 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKHdNuqiaO5uXgFfm5n0R6rehnhgdJY0bfqoVdU8z8EmKjjzHzyWLQ8jd4VDJZiaI9CkfE5iawAyYpBw/132');
