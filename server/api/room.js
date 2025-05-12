const express = require('express');
const router = express.Router();
const room = require('../container/room');


module.exports = function(){
    router.post('/info',room.RoomInfo)
    router.post('/by/friend',room.GetRoomIdByFriend);
    router.post('/by/group',room.GetRoomIdByGroup);
    router.post('/readed',room.ReadedUnreadMsg);
    router.post('/unread/list',room.GetAllUnreadMessage)
    return router;
}