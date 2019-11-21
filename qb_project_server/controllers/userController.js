let sqlUtil = require("../util/sqlutil");
const Core = require('@alicloud/pop-core');
const session = require('express-session');
//调用阿里大于SDK
const config = require('../util/config');
//配置阿里大于
var client = new Core(config.alicloud);
var requestOption = {
    method: 'POST'
};
let validationPhoneCode = [];
//匹配手机号与验证码
let findPhoneOrCode = (phone, code) => {
    for (var item of validationPhoneCode) {
        if (phone == item.phone && code == item.code) {
            return 'login';
        }
    }
    return 'phone';
};
//验证手机号码是否发送过验证码
let findPhone = (phone) => {
    for (var item of validationPhoneCode) {
        if (phone == item.phone) {
            return true;
        }
    }
    return false
};
//60秒自动推出数组第一位手机号码
let popPhoneArr = () => {
    let timer = setInterval(() => {
        if (!validationPhoneCode == "") {
            validationPhoneCode.shift();
        }
        clearInterval(timer)
    }, 60000)
};
//生成四位随机验证码
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
//时间戳转日期
let getDate = (timestamp) => {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
};
//检查用户是否绑定手机号
let checkBindPhone = (user_id, phone) => {
    let sql = "update user set phone=? where id=?";
    let sqlArr = [phone, user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//检查用户密码
let checkUserPwd = async(user_id) => {
    let sql = "select password from user where id=?";
    let sqlArr = [user_id];
    let res = await sqlUtil.syncSqlConnect(sql, sqlArr);
    if (res.length) {
        return res[0].password;
    } else {
        return 0;
    }
};
//获取用户完整信息
let getUserInfo = (user_id) => {
    let sql = "select age,sex,qg,job,path,birthday from userinfo  where user_id =?"
    let sqlArr = [user_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//用户验证码登录检测是否第一次登录
let uPhoneLoginBind = async(user_phone) => {
    let sql = "select * from user where username=? or phone=?";
    let sqlArr = [user_phone, user_phone];
    let res = await sqlUtil.syncSqlConnect(sql, sqlArr);
    if (res.length) {
        res[0].userinfo = await getUserInfo(res[0].id);
        return res
    } else {
        //用户第一次登录，进行注册并绑定副表
        let res = await regUser(user_phone);
        res[0].userinfo = await getUserInfo(res[0].id);
        return res
    }
};
//如果第一次登录添加用户
let regUser = async(user_phone) => {
    let dufaultimg = 'http://codelin.site/uploads/defaultuserpic.jpg';
    let sql = 'insert into user(username,userpic,phone,create_time) values(?,?,?,?)';
    let sqlArr = [user_phone, dufaultimg, user_phone, (new Date()).valueOf()];
    let res = await sqlUtil.syncSqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
        let user = await getUser(user_phone);
        //创建用户副表
        let userinfo = await bindUserInfo(user[0].id)
        if (userinfo.affectedRows == 1) {
            return user
        } else {
            return false;
        }
    } else {
        return false;
    }
};
//用户绑定副表
let bindUserInfo = async(user_id) => {
    let sql = 'insert into userinfo(user_id,age,sex,qg,job) values(?,?,?,?,?)';
    let sqlArr = [user_id, 18, 2, 0, '未设置'];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//获取用户信息
let getUser = (user_name) => {
    let sql = 'select * from user where id=? or phone=? or username=?';
    let sqlArr = [user_name, user_name, user_name];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//获取用户文章统计
let getArticleCount = (user_id) => {
    let sql = 'select id from post where user_id=?'
    let sqlArr = [user_id]
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
//第三方登录判断用户是否登录过
let findOtherLogin = (openid) => {
    let sql = 'select * from user_bind where openid=?';
    return sqlUtil.syncSqlConnect(sql, [openid]);
};
//如果用户第一次第三方登录,自动绑定到用户表
let bindOtherLogin = (userinfo) => {
    let sql = 'insert into user(username,userpic,create_time,bind_id) values(?,?,?,?)';
    let sqlArr = [userinfo.username, userinfo.userpic, (new Date()).valueOf(), userinfo.bind_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr)
};
let getBindUser = async(bind_id) => {
    let sql = 'select * from user where bind_id=?'
    let res = await sqlUtil.syncSqlConnect(sql, [bind_id])
    if (res.length) {
        let userinfo = await getUserInfo(res[0].id)
        res[0].userinfo = userinfo[0]
        return res
    } else {
        return false
    }
};
//修改用户昵称
let setUserName = async(user_id, user_name) => {
    let sql = 'update user set username=? where id=?'
    let res = await sqlUtil.syncSqlConnect(sql, [user_name, user_id])
    if (res.affectedRows == 1) {
        return true
    } else {
        return false
    }
};
//查看用户是否有info信息
let findUserInfo = async(user_id) => {
    let sql = 'select * from userinfo where user_id=?'
    let res = await sqlUtil.syncSqlConnect(sql, [user_id])
    if (res.length) return true;
    return false;
};
//修改用户其他信息
let setUserInfo = async(user_id, age, sex, qg, job, path, birthday) => {
    if (await findUserInfo(user_id)) {
        let sql = 'update userinfo set age=?,sex=?,qg=?,job=?,path=?,birthday=? where user_id=?'
        let res = await sqlUtil.syncSqlConnect(sql, [age, sex, qg, job, path, birthday, user_id])
        if (res.affectedRows == 1) {
            let user = await getUser(user_id)
            let userinfo = await getUserInfo(user_id)
            user[0].userinfo = userinfo[0]
            return user;
        } else {
            return false;
        }
    } else {
        let sql = 'insert into userinfo(user_id,age,sex,qg,job,path,birthday) values(?,?,?,?,?,?,?)'
        let res = await sqlUtil.syncSqlConnect(sql, [user_id, age, sex, qg, job, path, birthday])
        if (res.affectedRows == 1) {
            let user = await getUser(user_id)
            let userinfo = await getUserInfo(user_id)
            user[0].userinfo = userinfo[0]
            return user;
        } else {
            return false;
        }
    }
};
//根据图片id获取图片路径
let getImgUrl = (img_id) => {
    let sql = 'select url from image where id=?';
    return sqlUtil.syncSqlConnect(sql, [img_id])
};
//将图片插入到文章图片表里
let insertPostImage = async(imgList_id, post_id) => {
    let len = imgList_id.length;
    let num = 0;
    for (var i of imgList_id) {
        let sql = 'insert into post_image(post_id,image_id,create_time) values(?,?,?)';
        let sqlArr = [post_id, i.id, (new Date()).valueOf()]
        let res = await sqlUtil.syncSqlConnect(sql, sqlArr)
        if (res.affectedRows == 1) {
            num++;
        }
    }
    if (num == len) {
        return true;
    } else {
        return false;
    }
};
//获取文章图片
function getImgs(post_id) {
    let sql = "select url from post_image, image where post_image.post_id=? and post_image.image_id = image.id";
    let sqlArr = [post_id];
    return sqlUtil.syncSqlConnect(sql, sqlArr);
};
module.exports = {
    //发送验证码
    sendCode(req, res) {
        let phone = req.body.user_phone;
        if (findPhone(phone)) {
            res.send({
                'code': 400,
                'msg': `已发送,请稍后重试`,
            });
        } else {
            let code = rand(1000, 9999);
            validationPhoneCode.push({
                'phone': phone,
                'code': code,
            });
            console.log('用户' + phone + '发送验证码' + '验证码为:' + code);
            popPhoneArr();
            res.send({
                'code': 200,
                'msg': '发送成功'
            });
            console.log(code)
                // var params = {
                //     "RegionId": "cn-hangzhou",
                //     "PhoneNumbers": phone,
                //     "SignName": "校园邦App",
                //     "TemplateCode": "SMS_175532943",
                //     "TemplateParam": JSON.stringify({ "code": code })
                // };
                // client.request('SendSms', params, requestOption).then((result) => {
                //     if (result.Code == 'OK') {
                //         res.send({
                //             'code': 200,
                //             'msg': '发送成功'
                //         });
                //         validationPhoneCode.push({
                //             'phone': phone,
                //             'code': code,
                //         });
                //         console.log('用户' + phone + '发送验证码' + '验证码为:' + code);
                //         popPhoneArr();
                //     } else {
                //         res.send({
                //             'code': 400,
                //             'msg': '发送失败,请重试'
                //         })
                //     };
                // }, (ex) => {
                //     console.log(ex);
                //     res.send({
                //         'code': 400,
                //         'msg': '触发服务限制流'
                //     })
                // });
        }
    },
    //验证码登录
    async uPhoneLogin(req, res) {
        let { user_phone, code } = req.body;
        if (findPhone(user_phone)) {
            let status = findPhoneOrCode(user_phone, code);
            if (status == 'login') {
                let user = await uPhoneLoginBind(user_phone);
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': user[0]
                });
                for (var i = 0; i < validationPhoneCode.length; i++) {
                    if (validationPhoneCode[i].phone == user_phone) {
                        validationPhoneCode.splice(i, 1);
                    }
                }
            } else if (status == 'phone') {
                res.send({
                    'code': 400,
                    'msg': '验证码错误',
                });
            } else {
                res.send({
                    'code': 400,
                    'msg': '未发送验证码,非法访问'
                });
            }
        } else {
            res.send({
                'code': 400,
                'msg': '未发送验证码,非法访问'
            });
        }
    },
    //手机号/邮箱/昵称登录
    async login(req, res) {
        var user_name = req.body.user_name,
            user_pwd = req.body.user_pwd;
        let phone = /^1[3456789]\d{9}$/;
        let email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (phone.test(user_name)) {
            var sql = "select * from user where phone=? and  password=?  or username=?  and  password=?";
            var sqlArr = [user_name, user_pwd, user_name, user_pwd];
            var callBack = async(err, data) => {
                if (err) {
                    throw '数据库错误';
                    console.log(err)
                    res.send({
                        'code': 400,
                        'msg': '系统错误'
                    })
                } else if (data == "") {
                    res.send({
                        'code': 400,
                        'msg': '用户名或密码错误',
                        'data': []
                    })
                } else {
                    let user_id = data[0].id;
                    let result = await getUserInfo(user_id);
                    data[0].userinfo = result[0]
                    res.send({
                        'code': 200,
                        'msg': '登录成功',
                        'data': data[0]
                    })
                }
            }
            sqlUtil.sqlConnect(sql, sqlArr, callBack);
        } else if (email.test(user_name)) {
            var sql = "select * from user where email=? and password=?";
            var sqlArr = [user_name, user_pwd];
            var callBack = async(err, data) => {
                if (err) {
                    throw '数据库错误';
                    console.log(err)
                    res.send({
                        'code': 400,
                        'msg': '系统错误'
                    })
                } else if (data == "") {
                    res.send({
                        'code': 400,
                        'msg': '用户名或密码错误',
                        'data': []
                    })
                } else {
                    let user_id = data[0].id;
                    let result = await getUserInfo(user_id);
                    data[0].userinfo = result[0]
                    res.send({
                        'code': 200,
                        'msg': '登录成功',
                        'data': data[0]
                    })
                }
            }
            sqlUtil.sqlConnect(sql, sqlArr, callBack);
        } else {
            var sql = "select * from user where username=? and password=?";
            var sqlArr = [user_name, user_pwd];
            var callBack = async(err, data) => {
                if (err) {
                    throw '数据库错误';
                    console.log(err)
                    res.send({
                        'code': 400,
                        'msg': '系统错误'
                    })
                } else if (data == "") {
                    res.send({
                        'code': 400,
                        'msg': '用户名或密码错误',
                        'data': []
                    })
                } else {
                    let user_id = data[0].id;
                    let result = await getUserInfo(user_id);
                    data[0].userinfo = result[0]
                    res.send({
                        'code': 200,
                        'msg': '登录成功',
                        'data': data[0]
                    })
                }
            }
            sqlUtil.sqlConnect(sql, sqlArr, callBack);
        }
    },
    //第三方登录
    async otherLogin(req, res) {
        let { provider, openid, expires_in, nickName, avatarUrl } = req.body;
        if (openid) {
            let user = await findOtherLogin(openid);
            if (user.length) {
                let users = await getBindUser(user[0].id);
                res.send({
                    'code': 200,
                    'data': users[0]
                })
            } else {
                let sql = "insert into  user_bind(type,openid,nickname,avatarurl) values(?,?,?,?)";
                let sqlArr = [provider, openid, nickName, avatarUrl];
                let bindOther = await sqlUtil.syncSqlConnect(sql, sqlArr);
                if (bindOther.affectedRows == 1) {
                    let bindu = await findOtherLogin(openid);
                    let userinfo = {
                        username: bindu[0].nickname,
                        userpic: bindu[0].avatarurl,
                        openid: bindu[0].openid,
                        bind_id: bindu[0].id
                    }
                    let bindUser = await bindOtherLogin(userinfo);
                    if (bindUser.affectedRows == 1) {
                        let users = await getBindUser(userinfo.bind_id);
                        res.send({
                            'code': 200,
                            'data': users[0]
                        })
                    } else {
                        res.send({
                            'code': 400,
                            'msg': '用户表绑定失败'
                        })
                    }
                } else {
                    res.send({
                        'code': 400,
                        'msg': '登录失败'
                    })
                }
            }
        } else {
            res.send({
                'code': 400,
                'msg': '缺少重要参数'
            })
        }
    },
    //绑定手机号
    async bindPhone(req, res) {
        let { user_id, phone } = req.body;
        let sql = "select phone from user where id=?";
        let sqlArr = [user_id];
        try {
            let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (!result[0].phone) {
                let ok = await checkBindPhone(user_id, phone).then((res) => {
                    if (res.affectedRows == 1) return 1;
                }).catch((err) => {
                    console.log(err);
                    return 0;
                })
                if (ok) {
                    res.send({
                        'code': 200,
                        'msg': '绑定成功'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '绑定失败'
                    })
                }
            } else {
                res.send({
                    'code': 400,
                    'msg': '该用户已经绑定手机号码'
                })
            }
        } catch (e) {
            console.log(e)
            res.send({
                'code': 500,
                'msg': '服务器错误'
            })
        }
    },
    //用户发布文章上传多图
    async uploadMoreImg(req, res) {
        let { user_id } = req.body;
        let files = req.file;
        let imgList;
        let url = 'http://192.168.112.32:8080/uploads/' + files.filename;
        let sql = `insert into image(url,create_time,user_id) values(?,?,?)`
        let id = await sqlUtil.syncSqlConnect(sql, [url, (new Date()).valueOf(), user_id])
            .then(data => {
                return data.insertId;
            }).catch(err => {
                console.log(err)
                return false
            })
        if (id) {
            res.send({
                url: url,
                id: id
            })
        } else {
            res.send({
                'code': 400,
                'msg': '上传失败'
            })
        }
    },
    //用户发布文章
    async addArticle(req, res) {
        let { user_id, title, text, openType, path, topic_id, post_class_id, imglist_id: imgList_id } = req.body;
        imgList_id = JSON.parse(imgList_id)
        let imgUrl = [];
        for (var i of imgList_id) {
            let url = await getImgUrl(i.id)
            imgUrl.push(url[0].url)
        }
        let sql = 'insert into post(user_id,title,titlepic,content,path,create_time,post_class_id,isopen) values(?,?,?,?,?,?,?,?)';
        let sqlArr = [user_id, title, imgUrl[0] ? imgUrl[0] : '', text, path, (new Date()).valueOf(), post_class_id, openType];
        let post_id = await sqlUtil.syncSqlConnect(sql, sqlArr)
            .then(res => {
                return res.insertId;
            }).catch(err => {
                console.log(err)
                return false
            });
        if (post_id) {
            let result = await insertPostImage(imgList_id, post_id)
            if (result) {
                res.send({
                    'code': 200,
                    'msg': '发布成功'
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '好像哪里出问题了'
                })
            }
        } else {
            res.send({
                'code': 401,
                'msg': '发布失败'
            })
        }
    },
    async getUsers(req, res) {
        let { user_id, my_id } = req.body;
        let sql = 'select user.id as id ,username,userpic,age,sex,qg,job,path,birthday from user,userinfo where  user.id=? and user.id = userinfo.user_id';
        let user = await sqlUtil.syncSqlConnect(sql, [user_id]);
        if (user.length) {
            let sql = ' select id from follow where user_id=? and follow_id=?';
            let fans = await sqlUtil.syncSqlConnect(sql, [my_id, user_id]);
            user[0].fans = fans[0];
            res.send({
                'code': 200,
                'data': user[0]
            })
        } else {
            res.send({
                'code': 400,
                'msg': '信息获取失败'
            })
        }
    },
    //获取用户统计数据/文章数/今日文章数/粉丝数/评论数/收藏
    async getCounts(req, res) {
        let { user_id } = req.body;
        let sql = 'select count(id) as post_count from post where user_id=?';
        let post_count = await sqlUtil.syncSqlConnect(sql, [user_id]);
        let sql1 = 'select count(user_id) as follow_count  from follow where user_id=?';
        let follow_count = await sqlUtil.syncSqlConnect(sql1, [user_id]);
        let sql2 = 'select count(follow_id) as fans_count  from follow where follow_id=?';
        let fans_count = await sqlUtil.syncSqlConnect(sql2, [user_id]);
        let sql3 = 'select count(id) as comment_count from comment where user_id=?';
        let comment_count = await sqlUtil.syncSqlConnect(sql3, [user_id]);
        res.send({
            'code': 200,
            'data': {
                post_count: post_count[0].post_count,
                follow_count: follow_count[0].follow_count,
                fans_count: fans_count[0].fans_count,
                comment_count: comment_count[0].comment_count
            }
        })
    },
    //修改头像
    editUserImg(req, res) {
        let { user_id } = req.body;
        let file = req.file;
        let imgUrl = 'http://192.168.112.32:8080/uploads/' + file.filename;
        if (file) {
            let sql = "update user set userpic=? where id=?";
            let sqlArr = [imgUrl, user_id];
            sqlUtil.sqlConnect(sql, sqlArr, (err, data) => {
                if (err) {
                    console.log(err)
                    throw '数据库错误';
                } else {
                    if (data.affectedRows == 1) {
                        res.send({
                            'code': 200,
                            'msg': '修改成功',
                            'url': imgUrl
                        })
                    } else {
                        res.send({
                            'code': 400,
                            'msg': '修改失败'
                        })
                    }
                }
            })
        }
    },
    //修改资料
    async editUserInfo(req, res) {
        let { user_id, user_name, age, sex, qg, job, path, birthday } = req.body;
        let result = await setUserName(user_id, user_name);
        if (result) {
            let result = await setUserInfo(user_id, age, sex, qg, job, path, birthday);
            if (result.length) {
                res.send({
                    'code': 200,
                    'data': result[0]
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '修改失败'
                })
            }
        } else {
            res.send({
                'code': 400,
                'msg': '修改失败'
            })
        }
    },
    //修改密码
    async rePassWord(req, res) {
        let { user_id, oldpassword, newpassword } = req.body;
        let userPwd = await checkUserPwd(user_id);
        if (userPwd) {
            if (oldpassword == userPwd) {
                let sql = "update user set password=? where id=?";
                let sqlArr = [newpassword, user_id];
                let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
                if (result.affectedRows == 1) {
                    res.send({
                        'code': 200,
                        'msg': '修改成功'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '修改失败'
                    })
                }
            } else {
                res.send({
                    'code': 400,
                    'msg': '新旧密码不一致'
                })
            }
        } else {
            let sql = "update user set password=? where id=?";
            let sqlArr = [newpassword, user_id];
            let result = await sqlUtil.syncSqlConnect(sql, sqlArr);
            if (result.affectedRows == 1) {
                res.send({
                    'code': 200,
                    'msg': '修改成功'
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '修改失败'
                })
            }
        }
    },
    //绑定邮箱
    async bindEmail(req, res) {
        let { user_id, email } = req.body
        let sql = 'update user set email=? where id=?';
        let result = await sqlUtil.syncSqlConnect(sql, [email, user_id])
        if (result.affectedRows == 1) {
            res.send({
                'code': 200,
                'msg': '绑定成功'
            })
        } else {
            res.send({
                'code': 400,
                'msg': '绑定失败'
            })
        }
    },
    //退出登录
    logout(req, res) {
        res.send({
            'code': 200,
            'msg': '退出成功'
        })
    },
};