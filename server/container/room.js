const db = require('./db')
// 获取房间信息
/**
 * 前端可能会用到的属性
 * frined_info.avatar/remark or username
 * group_status.avatar/group_name/all_silent
 */
async function RoomInfo(req,res){
    /**
     * friend_status:{
     *  user_info:用户信息          
     *  friend_info:好友信息
     * }
     * group_status:{
     *  members:成员信息
     * }
     */
    const { room_id } = req.body;
    const { user_id } = req.parse;
    const room_info_sql = 'SELECT * FROM room WHERE room_id=?'
    const [[room_info]] = await db.query(room_info_sql,room_id)
    if(!room_info) return res.send({ code:201,msg:'不存在的房间号' });

    if(room_info.type == '私人'){
        const a = await db.query('SELECT friend_id FROM friend WHERE room_id=? AND user_id=?',[room_id,user_id]); 
        console.log(room_id,user_id);
        const friend_status_sql = 'SELECT * FROM friend WHERE user_id=? AND room_id=?';
        const [[friend_status]] = await db.query(friend_status_sql,[user_id,room_id]);
        const user_info_sql = 'SELECT * FROM user WHERE user_id=?';
        const [[user_info]] = await db.query(user_info_sql,user_id);
        const [[friend_info]] = await db.query(user_info_sql,friend_status.friend_id);
        friend_status.user_info = user_info;
        friend_status.friend_info = friend_info;
        room_info.friend_status = friend_status;
    }else if(room_info.type == '群聊'){
        const group_status_sql = 'SELECT * FROM group_chat WHERE room_id=?';
        const [[group_status]] = await db.query(group_status_sql,room_id);
        const members_info_sql = 'SELECT * FROM group_members JOIN user ON group_members.user_id = user.user_id  WHERE group_id=?'
        const [members] = await db.query(members_info_sql,group_status.group_id);
        const self_info_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=?';
        const [[self_info]] = await db.query(self_info_sql,[user_id,group_status.group_id]);
        // 获取等级
        const [group_level] = await db.query('SELECT * FROM group_level WHERE group_id=?',group_status.group_id);
        group_status.members = members;
        group_status.group_level = group_level;
        room_info.self_info = self_info;
        room_info.group_status = group_status;
    }
    res.send({ code:200,data:{ room_info } });
}
// 房间信息已读
async function ReadedUnreadMsg(req,res){
    const { room_id } = req.body;
    const { user_id } = req.parse;
    const [[{type}]] = await db.query('SELECT type FROM room WHERE room_id=?',room_id );
    let success;
    if(type == '私人'){
        const [{affectedRows}] = await db.query('UPDATE friend SET unread_msg_count=0 WHERE user_id=? AND room_id=?',[user_id,room_id]);
        success = affectedRows;
    }else if(type == '群聊'){
        const [[{group_id}]] = await db.query('SELECT group_id FROM group_chat WHERE room_id=?',room_id)
        const [{affectedRows}] = await db.query('UPDATE group_members SET unread_msg_count=0 WHERE user_id=? AND group_id=?',[user_id,group_id]);
        success = affectedRows;
    }

    if(success){
        res.send({ code:200,data:{ msg:'房间信息全部已读' } })
    }else{
        res.send({ code:201,msg:'房间信息已读失败' })
    }
}
// 根据用户好友获取房间号
async function GetRoomIdByFriend(req,res){
    const { friend_id } = req.body;
    const { user_id } = req.parse;
    const get_sql = 'SELECT room_id FROM friend WHERE user_id=? AND friend_id=?';
    const [[{room_id}]] = await db.query(get_sql,[user_id,friend_id]);
    res.send({ code:200,data:{room_id} });
}
// 根据群聊获取房间号
async function GetRoomIdByGroup(req,res){
    const { group_id } = req.body;
    const get_sql = 'SELECT room_id FROM group_chat WHERE group_id=?';
    const [[{room_id}]] = await db.query(get_sql,group_id);
    res.send({ code:200,data:{room_id} });
}
// 获取所有未读信息
async function GetAllUnreadMessage(req,res){
    console.log('-------------------')
    const { user_id } = req.parse;

    // 获取好友的未读信息
    const [friend_unread_list] = await db.query('SELECT * FROM friend WHERE user_id=? AND unread_msg_count != 0', user_id);
    // 获取群聊的未读信息
    const [group_unread_list] = await db.query('SELECT * FROM group_members JOIN group_chat ON group_chat.group_id=group_members.group_id WHERE user_id=? AND unread_msg_count != 0', user_id);

    // 获取每个好友的未读信息列表
    const friendPromises = friend_unread_list.map(async friend => {
        const [unread_msg_list] = await db.query('SELECT * FROM message WHERE room_id=? LIMIT 0,?', [friend.room_id,friend.unread_msg_count]);
        await db.query('UPDATE friend SET unread_msg_count=0 WHERE room_id=? AND user_id=?',[friend.room_id,user_id]);
        // 获取未读信息的发送者和接收者信息
        const [[sender_info]] = await db.query('SELECT * FROM user WHERE user_id=?',unread_msg_list[0].sender_id);
        const [[receiver_info]] = await db.query('SELECT * FROM user WHERe user_id=?',unread_msg_list[0].receiver_id);
        // 获取发送者和接收者正在使用的贴纸
        if(sender_info){
            const [[sticker]] = await db.query('SELECT * FROM user_stickers WHERE user_id=? AND used=1',unread_msg_list[0].sender_id);
            if(sticker){
                const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker.sticker_id);
                sticker.sticker_info = sticker_info;
                sender_info.sticker = sticker;
            }
        }
        if(receiver_info){
            const [[sticker]] = await db.query('SELECT * FROM user_stickers WHERE user_id=? AND used=1',unread_msg_list[0].receiver_id);
            if(sticker){
                const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker.sticker_id);
                sticker.sticker_info = sticker_info;
                receiver_info.sticker = sticker;
            }
        }
        unread_msg_list.forEach(msg => {
            msg.sender_info = sender_info;
            msg.receiver_info = receiver_info;
        })
        friend.unread_msg_list = unread_msg_list;
        return friend;
    });
    const noSenderMessageType = ['警告','通知'];
    // 获取每个群聊的未读信息列表
    const groupPromises = group_unread_list.map(async group => {
        const [unread_msg_list] = await db.query('SELECT * FROM message WHERE room_id=? LIMIT 0,?', [group.room_id,group.unread_msg_count]);
        await db.query('UPDATE group_members SET unread_msg_count=0 WHERE group_Id=? AND user_id=?',[group.group_id,user_id]);
        // 获取未读信息的接收者信息
        if (unread_msg_list.length > 0) {
            const [[receiver_info]] = await db.query('SELECT * FROM user WHERE user_id=?', unread_msg_list[0].receiver_id);
            // 获取每条未读消息的发送者信息
            const messagesWithUserInfo = await Promise.all(unread_msg_list.map(async msg => {
                if(noSenderMessageType.includes(msg.media_type)) return { ...msg };
                console.log(msg)
                const [[t1_sender_info]] = await db.query('SELECT * FROM user WHERE user_id=?',msg.sender_id);
                const [[t2_sender_info]] = await db.query('SELECT * FROM group_members WHERE user_id=? AND group_id=?',[sender_id,msg.receiver_id]);
                const sender_info = {...t1_sender_info,...t2_sender_info}
                return {
                    ...msg,
                    receiver_info,
                    sender_info
                };
            }));
            group.unread_msg_list = messagesWithUserInfo;
        } else {
            group.unread_msg_list = [];
        }
        return group;
    });

    // 等待所有好友和群聊的未读信息查询完成
    const allFriendsUnread = await Promise.all(friendPromises);
    const allGroupsUnread = await Promise.all(groupPromises);
    // 合并好友和群聊的未读信息列表
    const room_unread_list = [...allFriendsUnread, ...allGroupsUnread];
    console.log(room_unread_list)

    // 发送响应
    res.send({ code: 200, data: { room_unread_list } });
}
module.exports = {
    RoomInfo,
    GetRoomIdByFriend,
    GetRoomIdByGroup,
    ReadedUnreadMsg,
    GetAllUnreadMessage
}