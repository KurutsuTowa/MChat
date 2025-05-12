// 用于生成和解析 JWT 令牌
const jwt = require('jsonwebtoken');
// 存储jwt 的密钥
const secretKey = 'mt';
// 将用户数据生成为token
function generateToken(user){
    // 生成 Token
    const token = jwt.sign(user, secretKey);
    return token;
}
// 将token解析为用户数据
function parseToken(token){
    try{
        return { ok:true,data:jwt.verify(token, secretKey) };
    }catch(e){
        let msg;
        if (e instanceof jwt.TokenExpiredError) {
            msg = 'token过期'
        } else{
            msg = 'token解析错误'
        }
        return { ok:false,msg };
    }
}
module.exports = {
    generateToken,
    parseToken
}