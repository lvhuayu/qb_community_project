let sqlUtil = require("../util/sqlutil");
//获取用户昵称、头像
function getUser(id) {
    let sql = "select id, username,userpic from user where id=? ";
    let sqlArr = [id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
}
//获取用户图片
function getImgs(post_id) {
    let sql = "select url from post_image, image where post_image.post_id=? and post_image.image_id = image.id";
    let sqlArr = [post_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
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
//获取用户完整信息
let getUserInfo = (user_id) => {
    let sql = "select age,sex,qg,job,path,birthday from userinfo  where user_id =?"
    let sqlArr = [user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
module.exports = {
    async searchTopic(req, res) {
        let { keyword, page } = req.body;
        page = +page - 1;
        let sql = 'select * from topic where INSTR(title,?)>0  or  INSTR(`desc`,?)>0  limit ?,10 ';
        let sqlArr = [keyword, keyword, page * 10];
        let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
        if (data.length) {
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
    },
    async searchPost(req, res) {
        let { keyword, page, user_id: userId } = req.body;
        page = +page - 1;
        let sql = `select post.* from post where INSTR(post.title,?)>0 or INSTR(post.content,?)>0 limit ?,10`;
        let sqlArr = [keyword, keyword, page * 10];
        try {
            let data = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (data.length) {
                for (var item of data) {
                    let user_id = item.user_id;
                    let user = await getUser(user_id);
                    let imgList = await getImgs(user_id);
                    let fans = await getFans(userId, user_id);
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
    async searchUser(req, res) {
        let { keyword } = req.body;
        let userList = [];
        let sql = `select * from user where INSTR(username,?)`;
        let users = await sqlUtil.syncSqlConnect(sql, [keyword]);
        for (let item of users) {
            let user = await getUser(item.id);
            let userinfo = await getUserInfo(item.id);
            user[0].userinfo = userinfo[0]
            userList.push(user[0])
        }
        res.send({
            'code': 200,
            'data': userList
        })
    },
}