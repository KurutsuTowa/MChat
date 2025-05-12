const mysql2 = require('mysql2/promise');
const db = mysql2.createPool({
    user:'root',
    password:'admin',
    database:'mt',
    host:'localhost',
    port:'3306',
    charset: 'utf8mb4',
    multipleStatements: true,
})
db.getConnection(e => {
    if(e) throw e;
    console.log('数据库连接成功');
});
module.exports = db;