// process.on('uncaughtException',function(err) { console.log('运行期间发生异常: '+ err); })
const app = require('./api/app');
app.listen(8080);