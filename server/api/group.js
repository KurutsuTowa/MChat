const express = require('express');
const router = express.Router();
const group = require('../container/group');


module.exports = function(){
    // 信息相关
    router.post('/search',group.SearchGroup);
    router.post('/list',group.GroupList);
    router.post('/info',group.GroupInfo);

    // 管理相关
    router.post('/create',group.CreateGroup);
    router.post('/update',group.UpdateGroup);
    router.post('/disband',group.DisbandGroup);
    router.post('/position/set',group.SetPosition);
    router.post('/member/remove',group.RemoveMember);
    // 群公告
    router.post('/announce/append',group.AnnounceAppend);
    router.post('/announce/list',group.AnnounceList);

    // 群等级
    router.post('/level/set',group.UpdateGroupLevelName)
    // 禁言
    router.post('/ban/talk',group.BanTalkGroup);

    // 用户对群聊的个人设置
    router.post('/set',group.SetGroup);
    // 用户退出群聊
    router.post('/leave',group.LeaveGroup);


    // 请求相关
    router.post('/request',group.GroupRequest);
    router.post('/request/send',group.SendGroupRequest);
    router.post('/request/invite',group.inviteGroupRequest);
    router.post('/request/send/reply',group.ReplySendGroupRequest);
    router.post('/request/invite/reply',group.ReplyInviteGroupRequest);

    // 群相册
    router.post('/photo/list',group.GroupPhotoList)
    router.post('/photo/create',group.GroupPhotoCreate)
    router.post('/photo/delete',group.GroupPhotoDelete)
    router.post('/photo/append',group.GroupPhotoAppend)
    router.post('/photo/remove',group.GroupPhotoRemove)
   
    // 群文件
    router.post('/file/list',group.GroupFileList)
    router.post('/file/append',group.GroupFileAppend)
    router.post('/file/remove',group.GroupFileRemove)

    return router;
}