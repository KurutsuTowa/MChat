const express = require('express');
const expressWs = require('express-ws');
const app = express();
expressWs(app)
const bodyParser = require('body-parser');
const { parseToken } = require('../utils/jwt');

app.use(bodyParser.json({ limit: '100mb' })); //parse application/json
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); //parse application/json
app.use((req, res, next) => {
    // 解决跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.path.startsWith('/message/connection')) {
        return next();
    }
    if(req.method == 'OPTIONS'){
        next();
    }else if(!isAllowPath(req.path)){
        // 如果对方请求的不是登录注册接口或者静态资源，则进行token校验
        if(!req.headers.authorization) return res.send({ code:201,msg:'请携带token' });
        const token = req.headers.authorization;
        let parse = parseToken(token);
        // 进行token校验
        if(!parse.ok){
            res.send({ code:201,msg:parse.msg });
        }else{
            parse = parse.data;
            if(parse.user_id == undefined){
                res.send({ code:201,msg:'token错误！' });
            }else{
                req.token = token;
                req.parse = parse;
                next();
            }
        }
    }else{
        next();
    }
})
// 设置静态资源目录
app.use(express.static('upload'));
const isAllowPath = (path) => {
    const allowPath = ['/emoji','/images','upload','/media','/stickers','/user/login','/user/register','/file','/socket.io']
    return allowPath.some(allow => path.includes(allow))
}
const user = require('./user')();
app.use('/user',user);
const group = require('./group')();
app.use('/group',group);
const friend = require('./friend')();
app.use('/friend',friend);
const file = require('./file')();
app.use('/upload',file);
const room = require('./room')();
app.use('/room',room);
const message = require('./message')();
app.use('/message',message);
module.exports = app;