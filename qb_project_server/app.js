const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const privateKey = fs.readFileSync('./public/CA_certificate/2446326_codelin.site.key', 'utf8'); //https
const certificate = fs.readFileSync('./public/CA_certificate/2446326_codelin.site.pem', 'utf8'); //https
const options = { key: privateKey, cert: certificate }; //https
const user = require('./router/user');
const index = require('./router/index');
const search = require('./router/search');
const handles = require('./router/handle');
app.use(express.static(__dirname + '/public')); //静态资源
app.use(bodyParser.urlencoded({ extended: false })); //post请求设置
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin); //需要显示设置来源
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); //带cookies
    console.log(`${req.url}`);
    next();
});
app.use('/user', user);
app.use('/index', index);
app.use('/search', search);
app.use('/handle', handles);
//服务器启动-satar
// var httpServer = http.createServer(function(req, res) {
//     //将http请求重定向问https请求
//     res.writeHead(301, { 'location': 'https://www.codelin.site' });
//     res.end();
// });
// var httpsServer = https.createServer(options, app);
// httpsServer.listen(443, function() {
//     console.log('HTTPS Server is running ');
// });
// httpServer.listen(80, function() {
//     console.log("Redirection is ready");
// });
//服务器启动-end

var server = app.listen(8080, function() {
    console.log("Server is Running");
});