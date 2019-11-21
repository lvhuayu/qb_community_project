let sqlUtil = require("../util/sqlutil");
//查找文章是否存在
let findPost = async(post_id) => {
    let sql = "select* from post where id=?";
    let sqlArr = [post_id];
    let res = await sqlUtil.syncSqlConnect(sql, sqlArr);
    if (res.length) {
        return true;
    } else {
        return false;
    }
};
//判断文章顶踩类型
let checkType = async(user_id, post_id) => {
    let sql = "select type from support where post_id=? and user_id=?";
    let sqlArr = [post_id, user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};

//添加评论
let addComment = (fid, data, post_id, user_id) => {
    let sql = "insert into  comment(user_id,fid,data,create_time,post_id) values(?,?,?,?,?)";
    let sqlArr = [user_id, fid, data, (new Date()).valueOf(), post_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//回复数增加
let fnumAdd = async(fid, data, post_id, user_id) => {
    let sql = "update comment set fnum=fnum+1 where id=?";
    let sqlArr = [fid];
    let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
    if (result.affectedRows == 1) {
        let ok = await addComment(fid, data, post_id, user_id);
        if (ok.affectedRows == 1) {
            return ok.insertId;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};
//检测是否关注
let checkFollow = async(user_id, follow_id) => {
    let sql = "select * from follow where user_id=? and follow_id=?";
    let sqlArr = [user_id, follow_id];
    let res = await sqlUtil.syncSqlConnect(sql, sqlArr);
    if (res.length) {
        return true
    } else {
        return false
    }
};
//获取互关列表
let findUserFriends = async(user_id) => {
    let friendsList = [];
    let sql = 'select * from follow where user_id=? ';
    let sqlArr = [user_id]
    let res = await sqlUtil.syncSqlConnect(sql, sqlArr);
    for (var item of res) {
        let sql = "select * from follow where user_id=?";
        let sqlArr = [item.follow_id];
        let ok = await sqlUtil.syncSqlConnect(sql, sqlArr);
        for (var oks of ok) {
            if (oks.follow_id == user_id) {
                friendsList.push(oks)
            }
        }
    }
    return friendsList;
};
//获取用户信息
let getUser = (user_id) => {
    let sql = "select id,username,userpic from user where id=?";
    let sqlArr = [user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//获取用户完整信息
let getUserInfo = (user_id) => {
    let sql = "select age,sex,qg,job,path,birthday from userinfo  where user_id =?"
    let sqlArr = [user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};

//获取关注列表
let getFollows = (user_id) => {
    let sql = "select follow_id from follow where user_id=?";
    let sqlArr = [user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//获取用户文章
let getUserPost = (user_id) => {
    let sql = 'select * from post where user_id=?'
    return sqlUtil.syncSqlConnect(sql, [user_id])
};
//获取文章评论数
let commentNum = (post_id) => {
    let sql = 'select count(id) as num from comment where post_id=?';
    return sqlUtil.syncSqlConnect(sql, [post_id])
};
//修改文章顶踩数
let changeSupport = async(post_id, upnum, downnum) => {
    let sql = 'update post set upnum=?,downnum=? where id=?'
    let sqlArr = [upnum, downnum, post_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr)
}
module.exports = {
    //用户顶踩
    async supPort(req, res) {
        let { user_id, type, post_id, typeText, upnum, downnum } = req.body;
        if (type == 0) {
            typeText = '顶过了';
            typeTxt = '顶';
        } else if (type == 1) {
            typeText = '踩过了';
            typeTxt = '踩';
        }
        if (await findPost(post_id)) {
            let postSupType = await checkType(user_id, post_id);
            if (!postSupType.length) {
                let sql = 'insert into support(user_id,post_id,type,create_time) values(?,?,?,?)';
                let sqlArr = [user_id, post_id, type, (new Date()).valueOf()];
                let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
                if (result.affectedRows == 1) {
                    changeSupport(post_id, upnum, downnum)
                    res.send({
                        'code': 200,
                        'msg': typeTxt + '成功'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '操作失败'
                    })
                }
                return;
            }
            if (postSupType[0].type == type) {
                res.send({
                    'code': 201,
                    'msg': typeText
                })
            } else if (postSupType[0].type != type) {
                let sql = 'update support set type=? where user_id=? and post_id=?';
                let sqlArr = [type, user_id, post_id];
                let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
                if (result.affectedRows == 1) {
                    changeSupport(post_id, upnum, downnum)
                    res.send({
                        'code': 200,
                        'msg': typeTxt + '成功'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '操作失败'
                    })
                }
            }
        } else {
            res.send({
                'code': 400,
                'msg': '文章不存在'
            })
        }
    },
    //用户评论
    async comment(req, res) {
        let { fid, data, post_id, user_id } = req.body;
        if (fid == 0) {
            let result = await addComment(fid, data, post_id, user_id);
            if (result.affectedRows == 1) {
                res.send({
                    'code': 200,
                    'msg': '评论成功',
                    'data': result.insertId
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '评论失败'
                })
            }
        } else {
            let ok = await fnumAdd(fid, data, post_id, user_id);
            if (ok) {
                res.send({
                    'code': 200,
                    'msg': '回复成功',
                    'data': ok
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '回复失败'
                })
            }
        }
    },
    //分享
    async share(req, res) {
        let { post_id, sharenum } = req.body;
        let sql = 'update post set sharenum=? where id=?';
        let result = await sqlUtil.syncSqlConnect(sql, [sharenum, post_id]);
        if (result.affectedRows == 1) {
            res.send({
                'code': 200,
                'msg': '分享成功'
            })
        } else {
            res.send({
                'code': 400,
                'msg': '分享失败'
            })
        }
    },
    //关注用户
    async follow(req, res) {
        let { user_id, follow_id } = req.body;
        if (!await checkFollow(user_id, follow_id)) {
            if (user_id == follow_id) {
                res.send({
                    'code': 400,
                    'msg': '非法关注'
                })
            } else {
                let sql = "insert into follow(follow_id,user_id,create_time) values(?,?,?)";
                let sqlArr = [follow_id, user_id, (new Date()).valueOf()];
                let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
                if (result.affectedRows == 1) {
                    res.send({
                        'code': 200,
                        'msg': '关注成功'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '关注失败'
                    })
                }
            }
        } else {
            res.send({
                'code': 202,
                'msg': '重复关注'
            })
        }
    },
    //取消关注
    async escFollow(req, res) {
        let { user_id, follow_id } = req.body;
        if (user_id == follow_id) {
            res.send({
                'code': 400,
                'msg': '非法操作'
            })
        } else {
            if (await checkFollow(user_id, follow_id)) {
                let sql = "delete from follow where user_id=? and follow_id=?";
                let sqlArr = [user_id, follow_id];
                let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
                if (result.affectedRows == 1) {
                    res.send({
                        'code': 200,
                        'msg': '取关成功'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '取关失败'
                    })
                }
            }
        }
    },
    //互关列表
    async friends(req, res) {
        let { user_id } = req.query;
        let friendsList = []
        let friends = await findUserFriends(user_id);
        for (var item of friends) {
            let user = await getUser(item.user_id);
            let userinfo = await getUserInfo(item.user_id);
            user[0].userinfo = userinfo[0];
            friendsList.push(user[0])
        }
        res.send({
            'code': 200,
            'data': friendsList
        })
    },
    //粉丝列表
    async fans(req, res) {
        let { user_id } = req.query;
        let fansList = [];
        let sql = "select user_id from follow where follow_id=?";
        let sqlArr = [user_id];
        let fans = await sqlUtil.syncSqlConnect(sql, sqlArr);
        if (fans.length) {
            for (var item of fans) {
                let user = await getUser(item.user_id);
                let userinfo = await getUserInfo(item.user_id);
                user[0].userinfo = userinfo[0];
                fansList.push(user[0])
            }
            res.send({
                'code': 200,
                'data': fansList
            })
        } else {
            res.send({
                'code': 400,
                'msg': '没有粉丝'
            })
        }
    },
    //关注列表
    async follows(req, res) {
        let { user_id } = req.query;
        let followsList = [];
        let sql = "select follow_id from follow where user_id=?";
        let sqlArr = [user_id];
        let follow = await sqlUtil.syncSqlConnect(sql, sqlArr);
        if (follow.length) {
            for (var item of follow) {
                let user = await getUser(item.follow_id)
                let userinfo = await getUserInfo(item.follow_id);
                user[0].userinfo = userinfo[0]
                followsList.push(user[0]);
            }
            res.send({
                'code': 200,
                'data': followsList
            })
        } else {
            res.send({
                'code': 400,
                'msg': '未关注用户'
            })
        }
    },
    //获取关注人文章
    async getFollowsArticle(req, res) {
        let { user_id } = req.query;
        let follows = await getFollows(user_id);
        let followsArticle = []
        if (follows.length) {
            for (let item of follows) {
                var userPost = await getUserPost(item.follow_id);
                for (let i of userPost) {
                    followsArticle.push(i)
                }
            }
            for (let i of followsArticle) {
                console.log(i)
                let user = await getUser(i.user_id)
                let userinfo = await getUserInfo(i.user_id)
                let comments = await commentNum(i.id);
                i.user = user[0]
                i.userinfo = userinfo[0]
                i.commentnum = comments[0].num
            }
            res.send({
                'code': 200,
                'data': followsArticle
            })
        } else {
            res.send({
                'code': 202,
                'data': followsArticle
            })
        }
    },
    //用户反馈
    async feedBack(req, res) {
        let { user_id, data } = req.body;
        if (user_id && data) {
            let sql = "insert into feedback(to_id,from_id,data,create_time) values(?,?,?,?)";
            let sqlArr = [0, user_id, data, (new Date()).valueOf()];
            let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (result.affectedRows == 1) {
                res.send({
                    'code': 200,
                    'msg': '反馈成功'
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '反馈失败'
                })
            }
        } else {
            res.send({
                'code': 400,
                'msg': '信息不能为空'
            })
        }
    },
    //用户反馈列表
    async feedBackList(req, res) {
        let { user_id } = req.query;
        let sql = "select * from feedback where from_id=?";
        let sqlArr = [user_id];
        let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
        res.send({
            'code': 200,
            'data': {
                'list': result
            }
        })
    },
    //检查更新
    async update(req, res) {
        let { version } = req.body;
        let sql = "select * from `update` order by create_time desc";
        let sqlArr = []
        let result = await sqlUtil.syncSqlConnect(sql);
        if (result.length) {
            if (version == result[0].version) {
                res.send({
                    'code': 400,
                    'msg': '当前为最新版本'
                })
            } else {
                res.send({
                    'code': 200,
                    'data': result
                })
            }
        } else {
            res.send({
                'code': 400,
                'msg': '服务器错误'
            })
        }
    }
};