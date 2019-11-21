let sqlUtil = require("../util/sqlutil");
//获取用户昵称、头像
function getUser(id) {
    let sql = "select username,userpic,sex,age,path from user,userinfo where user.id=? and user.id = userinfo.user_id";
    let sqlArr = [id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//获取用户图片
function getImgs(post_id) {
    let sql = "select url from post_image, image where post_image.post_id=? and post_image.image_id = image.id";
    let sqlArr = [post_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//获取文章评论数
let commentNum = (post_id) => {
    let sql = 'select count(id) as num from comment where post_id=?';
    return sqlUtil.syncSqlConnect(sql, [post_id])
};
//获取当前用户顶踩信息
function getSupPort(user_id) {
    let sql = "select * from support where user_id=?";
    let sqlArr = [user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//判断用户是否关注当前文章作者
function getFans(user_id, follow_id) {
    let sql = "select * from follow where user_id=? and follow_id=?";
    let sqlArr = [user_id, follow_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
module.exports = {
    //获取分类列表
    getPostClass(req, res) {
        var sql = "select id,classname from post_class";
        var sqlArr = [];
        var callBack = (err, data) => {
            if (err) {
                throw '数据库错误';
                console.log(err)
            } else {
                res.send({
                    'code': 200,
                    'data': {
                        'list': data
                    }
                })
            }
        }
        sqlUtil.sqlConnect(sql, sqlArr, callBack);
    },
    //获取话题分类
    getTopicClass(req, res) {
        var sql = "select id,classname from topic_class";
        var sqlArr = [];
        var callBack = (err, data) => {
            if (err) {
                throw '数据库错误';
                console.log(err)
            } else {
                res.send({
                    'code': 200,
                    'data': {
                        'list': data
                    }
                })
            }
        }
        sqlUtil.sqlConnect(sql, sqlArr, callBack);
    },
    //获取热门话题列表
    getHotTopic(req, res) {
        var sql = "select * from topic where type=1 limit 10";
        var sqlArr = [];
        var callBack = (err, data) => {
            if (err) {
                throw '数据库错误';
            } else if (data == "") {
                res.send({
                    'code': 400,
                    'msg': '未查询到信息'
                })
            } else {
                res.send({
                    'code': 200,
                    'data': {
                        list: data
                    }
                })
            }
        }
        sqlUtil.sqlConnect(sql, sqlArr, callBack)
    },
    //获取指定分类下话题列表
    topicClass(req, res) {
        let { id, page } = req.query;
        page = +page - 1;
        let sql = `select * from topic where topic_class_id=? limit ?,10`;
        let sqlArr = [id, page * 10];
        var callBack = (err, data) => {
            if (err) {
                console.log(err)
                throw '数据库错误';
            } else {
                res.send({
                    'code': 200,
                    'data': {
                        'list': data
                    }
                })
            }
        };
        sqlUtil.sqlConnect(sql, sqlArr, callBack)
    },
    //获取指定文章信息
    async getPost(req, res) {
        let sql = "select * from post where id=?";
        let sqlArr = [req.query.id];
        try {
            let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (data.length) {
                let user_id = data[0].user_id;
                let user = await getUser(user_id);
                let imgList = await getImgs(req.query.id);
                data[0].user = user;
                data[0].imgList = imgList;
                res.send({
                    'code': 200,
                    'data': data
                })
            }
        } catch (e) {
            res.send({
                'code': 500,
                'data': '服务器错误'
            })
        }
    },
    //获取话题分类下所有文章
    async getTopicPost(req, res) {
        let { id, page, user_id: userId } = req.query;
        page = +page - 1;
        let sql = "select post.* from post,topic,topic_post where topic.id=? and topic.id = topic_post.topic_id and topic_post.post_id = post.id order by post.id desc limit ?,10";
        let sqlArr = [id, page * 10];
        try {
            let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (data.length) {
                for (var item of data) {
                    let user_id = item.user_id;
                    let user = await getUser(user_id);
                    let imgList = await getImgs(user_id);
                    let fans = await getFans(userId, user_id);
                    let comments = await commentNum(item.id);
                    item.commentnum = comments[0].num;
                    item.user = user;
                    item.imgList = imgList;
                    item.fans = fans
                }
                res.send({
                    'code': 200,
                    'data': data
                })
            } else {
                res.send({
                    'code': 200,
                    'data': data
                })
            }
        } catch (e) {
            res.send({
                'code': 500,
                'msg': '服务器致命错误'
            })
        }
    },
    //获取指定话题分类下所有文章
    async getPostClassArticle(req, res) {
        let { user_id: userId, id, page } = req.query;
        page = +page - 1;
        let sql = "select post.* from post,post_class where post_class.id =? and post_class.id = post.post_class_id order by post.id  desc  limit ?,10";
        let sqlArr = [id, page * 10];
        try {
            let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (data.length) {
                for (var item of data) {
                    let user_id = item.user_id;
                    let user = await getUser(user_id);
                    let imgList = await getImgs(user_id);
                    let fans = await getFans(userId, user_id);
                    let comments = await commentNum(item.id);
                    item.commentnum = comments[0].num;
                    item.user = user;
                    item.imgList = imgList;
                    item.fans = fans
                }
                let supportData = await getSupPort(userId);
                for (var item of data) {
                    for (var items of supportData) {
                        if (item.id == items.post_id) {
                            item.support = items
                        }
                    }
                }
                res.send({
                    'code': 200,
                    'data': data
                })
            }
        } catch (e) {
            res.send({
                'code': 500,
                'msg': '服务器致命错误'
            })
        }
    },
    //获取文章评论列表
    async getComment(req, res) {
        let { post_id } = req.query;
        let sql = "select * from comment where post_id=?";
        let sqlArr = [post_id];
        let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
        if (data.length) {
            for (var item of data) {
                let user_id = item.user_id;
                let user = await getUser(user_id);
                item.user = user[0];
            }
            res.send({
                'code': 200,
                'data': data
            })
        } else {
            res.send({
                'code': 200,
                'data': []
            })
        }
    },
    //获取用户开放文章
    async getUserPost(req, res) {
        let { user_id, page, my_id } = req.query;
        page = +page - 1;
        let sql = "select * from post where user_id=? limit ?,10";
        let sqlArr = [user_id, page * 10];
        try {
            let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
            for (var item of data) {
                let user_id = item.user_id;
                let user = await getUser(user_id);
                let imgList = await getImgs(user_id);
                let fans = await getFans(my_id, user_id);
                let comments = await commentNum(item.id);
                item.commentnum = comments[0].num;
                item.user = user[0];
                item.fans = fans || [];
                item.imgList = imgList;
            }
            res.send({
                'code': 200,
                'data': data
            })
        } catch (e) {
            res.send({
                'code': 500,
                'msg': '服务器致命错误'
            })
        }
    },
    //获取用户全部文章
    async getUserAllPost(req, res) {
        let { user_id, page, my_id } = req.query;
        page = +page - 1;
        let sql = "select post.* from user,post where user.id=?  and post.user_id = user.id limit ?,10";
        let sqlArr = [user_id, page * 10];
        try {
            let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
            for (var item of data) {
                let user_id = item.user_id;
                let user = await getUser(user_id);
                let imgList = await getImgs(user_id);
                let fans = await getFans(my_id, user_id);
                let comments = await commentNum(item.id);
                item.commentnum = comments[0].num;
                item.user = user;
                item.fans = fans || [];
                item.imgList = imgList;
            }
            res.send({
                'code': 200,
                'data': data
            })
        } catch (e) {
            res.send({
                'code': 500,
                'msg': '服务器致命错误'
            })
        }
    },
    //获取广告位
    getAdvList(req, res) {
        let type = req.query.type;
        let sql = "select * from adsense where type=?";
        let sqlArr = [type];
        let callBack = (err, data) => {
            if (err) {
                console.log(err)
                throw '数据库错误';
            } else {
                res.send({
                    'code': 200,
                    'data': data
                })
            }
        }
        sqlUtil.sqlConnect(sql, sqlArr, callBack);
    },
    //
}