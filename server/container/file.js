const fs = require('fs');
const db = require('./db')
// 上传图片
function UploadImage(req, res) {
    const file = req.file;
    if (!file) {
        return res.send({ code: 201, data: { msg: '文件上传失败: 没有携带文件资源' } });
    }
    // 构建文件的web路径
    const webPath = 'http://localhost:8080/' + 'images' + file.filename;
    res.send({ code:200, data:{ webPath,filename:file.filename,...file  } });
}
// 上传媒体文件
function UploadMedia(req,res){
    const file = req.file;
    if (!file) {
        return res.send({ code: 201, data: { msg: '文件上传失败: 没有携带文件资源' } });
    }
    // 构建文件的web路径
    const webPath = 'http://localhost:8080/' + 'images' + '/' + file.filename;
    res.send({ code: 200, data: { webPath, filename: file.filename,...file } });
}

// 上传文件
function UploadFile(req,res){
    const file = req.file;
    if (!file) {
        return res.send({ code:201, data:{ msg:'文件上传失败:没有携带文件资源' } });
    }
    const webPath = 'http://localhost:8080/' + 'file/' + file.filename;
    res.send({ code:200, data:{ webPath,filename:file.filename,file_size:file.size,...file  } });
}
module.exports = {
    UploadImage,
    UploadMedia,
    UploadFile
}