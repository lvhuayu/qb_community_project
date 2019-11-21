var mysql = require('mysql'); //引入mysql模块
//通过此方法将一个mysql对象暴露出去
module.exports = {
    //mysql配置参数
    config: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'qb_app',
        dataStrings: true,
    },
    //连接池对象方法
    sqlConnect: function(sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config);
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log(err);
                return;
            }
            conn.query(sql, sqlArr, callBack);
            //第二次改动
            conn.release();
        })
    },
    //Promise回调
    syncSqlConnect: function(syncSql, sqlArr) {
        return new Promise((promiseData, promiseErr) => {
            var pool = mysql.createPool(this.config);
            pool.getConnection(function(err, conn) {
                if (err) {
                    promiseErr(err);
                    console.log("这里出错啦！synsql");
                } else {
                    conn.query(syncSql, sqlArr, (err, data) => {
                        if (err) {
                            promiseErr(err)
                        } else {
                            promiseData(data)
                        }
                    });
                    //第一次改动
                    conn.release();
                    //第二次改动
                }
            })
        })
    }
}