const express = require('express');
const router = express.Router();
const friend = require('../container/friend');


module.exports = function(){
    router.post('/list',friend.FriendList)
    router.post('/group/list/id',friend.FriendListById)
    router.post('/request',friend.FriendRequest)
    router.post('/request/reply',friend.ReplyFriendRequest)
    router.post('/request/send',friend.SendFriendRequest);
    router.post('/delete',friend.DeleteFriend);
    router.post('/set',friend.SetFriend)

    // 分组
    router.post('/group/list',friend.FriendGroupList)
    router.post('/group/create',friend.FriendGroupCreate)
    router.post('/group/delete',friend.FriendGroupDelete)
    router.post('/group/append',friend.FriendGroupAppend)
    router.post('/group/remove',friend.FriendGroupRemove)
    router.post('/group/rename',friend.FriendGroupRename)
    return router;
}