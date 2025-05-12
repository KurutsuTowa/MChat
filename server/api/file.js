const express = require('express');
const router = express.Router();
const file = require('../container/file');
const multer = require('multer');
const path = require('path');
/* 设置存储策略 */
// 生成multer配置的函数
function createUploadConfig(folderName, fileTypes, maxSize=100) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `../server/upload/${folderName}`)
        },
        filename: function (req, file, cb) {
            // 使用时间戳和原始文件名保存文件，保留原始后缀名
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
    if(fileTypes != '*'){
        const fileFilter = (req, file, cb) => {
            if (fileTypes.some(type => file.mimetype.startsWith(type))) {
                cb(null, true);
            } else {
                cb(new Error(`文件上传失败: 只支持${fileTypes.join(', ')}格式`), false);
            }
        };
        
        return {
            storage: storage,
            limits: {
                fileSize: maxSize * 1024 * 1024 // 限制文件大小
            },
            fileFilter: fileFilter
        };
    }
    
    return {
        storage: storage,
        limits: {
            fileSize: maxSize * 1024 * 1024 // 限制文件大小
        },
    };

}

const uploadMediaConfig = createUploadConfig('media', ['image/', 'video/'],100);// 限制媒体大小100MB
const uploadFilesConfig = createUploadConfig('files', '*',300);// 限制文件大小300MB
const uploadImagesConfig = createUploadConfig('images', ['image/'], 20);// 限制图片大小300MB
const uploadMedia = multer(uploadMediaConfig);
const uploadFiles = multer(uploadFilesConfig);
const uploadImages = multer(uploadImagesConfig);


module.exports = function(){
    router.post('/image',uploadImages.single('file'),file.UploadImage);
    router.post('/media',uploadMedia.single('file'),file.UploadMedia);
    router.post('/file',uploadFiles.single('file'),file.UploadFile);
    return router;
}