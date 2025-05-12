module.exports = {
    Connection,
    groupBroadcast,
};
const db = require('./db')
const {UserLevelUpdate} = require('./user');
let connections = {}


/**
 * 
 * @param ignore 忽略：在前端实现，未读消息不通知、标注色为暗色 
 * @param no_disturb 免打扰：在前端实现，未读信息不通知 
 * @Param top_up 置顶：在前端实现，进行房间号置顶，高亮显示
 */

// 更新房间最后信息
const updateRoomLastInfo = async (room_id,last_msg) => {
    console.log(room_id,last_msg)
    await db.query('UPDATE room SET last_msg=?,last_msg_at=NOW() WHERE room_id=?',[last_msg,room_id]);
    await updateRoomMsgTotal(room_id,1);
}
// 更新房间统计信息
const updateRoomMsgTotal = async (room_id,n) => {
    await db.query('UPDATE room SET msg_total=msg_total+? WHERE room_id=?',[n,room_id]);
}

// 给好友发送消息
const sendMessageToFriend = async (client,{ sender_id,receiver_id,content,media_type,file_size,room_id,type }) => {
    const friend = connections[receiver_id];
    const user_info_sql = 'SELECT * FROM user WHERE user_id=?';
    const [[sender_info]] = await db.query(user_info_sql,sender_id);
    const [[receiver_info]] = await db.query(user_info_sql,receiver_id);
    const value = {
        sender_id,
        receiver_id,
        room_id,
        media_type,
        content,
        media_type,
        sender_info,
        receiver_info,
        file_size,
        created_at:new Date(),
        failed:false,
        type
    };
    // 如果发送者被接收者加入黑名单，则发送失败，且给出提示
    const [[is_ban_user]] = await db.query('SELECT * FROM user_ban WHERE user_id=? AND ban_user_id=?',[receiver_id,sender_id]);
    if(is_ban_user) {
        value.failed = true;
        client.send(JSON.stringify(value));
        value.media_type = '警告';
        value.content = '你已被对方加入黑名单,发送失败'
        return client.send(JSON.stringify(value));
    }
    // 如果发送者将接收者加入黑名单，则发送失败，且给出提示
    const [[ban_user]] = await db.query('SELECT * FROM user_ban WHERE user_id=? AND ban_user_id=?',[sender_id,receiver_id]);
    if(ban_user){
        value.failed = true;
        client.send(JSON.stringify(value));
        value.media_type = '警告';
        value.content = '你已将对方加入黑名单,发送失败'
        return client.send(JSON.stringify(value));
    }
    // 携带发送者使用的贴纸信息
    const [[sticker]] = await db.query('SELECT * FROM user_stickers WHERE user_id=? AND used=1',sender_id);
    if(sticker){
        const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker.sticker_id);
        sticker.sticker_info = sticker_info;
        value.sticker = sticker;
    }
    // 未读数加1
    await db.query('UPDATE friend SET unread_msg_count=unread_msg_count+1 WHERE user_id=? AND friend_id=?',[receiver_id,sender_id]);
    // 如果在线，则推送消息
    if(friend){
        friend.send(JSON.stringify(value));
    }
    // 给发送者自己也推送一份
    client.send(JSON.stringify(value));
    // 将信息插入数据库
    await db.query('INSERT INTO message VALUES(NULL,?,?,?,?,"私人",?,?,NOW())',[sender_id,receiver_id,room_id,content,media_type,file_size])
    // 更新统计数据
    switch(media_type){
        case '文本':
            await updateRoomLastInfo(room_id,content);
            break;
        case '媒体':
            await updateRoomLastInfo(room_id,'[媒体]');
            break;
        case '表情':
            await updateRoomLastInfo(room_id,'[表情]');
            break;
        case '文件':
            await updateRoomLastInfo(room_id,'[文件]');
            break;
    }
        
}
// 给群聊发送消息
const sendMessageToGroup = async (client,{ sender_id,receiver_id,content,media_type,file_size,room_id,type }) => {
    // 获取群聊中的所有成员
    const [members] = await db.query('SELECT * FROM group_members JOIN user ON group_members.user_id = user.user_id  WHERE group_id=?',receiver_id);
    const user_info_sql = 'SELECT * FROM user WHERE user_id=?';
    const [[t1_sender_info]] = await db.query(user_info_sql,sender_id);
    const [[t2_sender_info]] = await db.query('SELECT * FROM group_members WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);
    const sender_info = {...t1_sender_info,...t2_sender_info}
    const [[receiver_info]] = await db.query('SELECT * FROM group_chat WHERE group_id=?',receiver_id);
    const value = {
        sender_id,
        receiver_id,
        room_id,
        media_type,
        content,
        media_type,
        sender_info,
        receiver_info,
        file_size:file_size,
        created_at:new Date(),
        failed : false,
        type
    };
    // 如果群聊已开启全体禁言，则发送失败，给出提示
    const [[group_info]] = await db.query('SELECT * FROM group_chat WHERE group_id=?',receiver_id);
    if(group_info.all_ban_talk){
        value.failed = true;
        client.send(JSON.stringify(value));
        value.media_type = '警告';
        value.content = '管理者已开启全体禁言,发送失败'
        return client.send(JSON.stringify(value));
    }
    // 如果发送者在群聊中已被禁言，则发送失败，且给出提示
    const [[{ban_talk}]] = await db.query('SELECT ban_talk FROM group_members WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);
    if(ban_talk) {
        value.failed = true;
        client.send(JSON.stringify(value));
        value.media_type = '警告';
        value.content = '你已被管理者禁言,发送失败'
        return client.send(JSON.stringify(value));
    }
    // 携带发送者使用的贴纸信息
    const [[sticker]] = await db.query('SELECT * FROM user_stickers WHERE user_id=? AND used=1',sender_id);
    if(sticker){
        const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker.sticker_id);
        sticker.sticker_info = sticker_info;
        value.sticker = sticker;
    }
    // 判断是不是今天在群聊中的第一个评论，如果是，增加群经验
    const [[{today_first_send}]] = await db.query('SELECT TIMESTAMPDIFF(DAY,last_send_at,NOW()) AS today_first_send FROM group_members WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);
    if(today_first_send || today_first_send === null){
        // 经验+16
        await db.query('UPDATE group_members SET exp=exp+16 WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);
        // 重新判断等级
        await UserLevelUpdate(sender_id,receiver_id);
        // 更新
        await db.query('UPDATE group_members SET last_send_at=NOW() WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);        
        // 发出通知
        const temp_value = {
            sender_id,
            receiver_id,
            room_id,
            media_type,
            content:'这是你今日第一次发言，经验+16',
            media_type:'通知',
            sender_info,
            receiver_info,
            file_size:file_size,
            created_at:new Date(),
            failed : false,
            type
        };
        client.send(JSON.stringify(temp_value));
    }
    // 增加发送者消息统计数
    await db.query('UPDATE group_members SET message_total=message_total+1 WHERE user_id=?',sender_id);
    // 并发执行将消息推送给所有成员
    const sendMessagesPromises = members.map(async member => {
        const online_member = connections[member.user_id];
        // 未读数加1
        await db.query('UPDATE group_members SET unread_msg_count=unread_msg_count+1 WHERE user_id=? AND group_id=?',[member.user_id,receiver_id]);
        // 如果在线，则推送消息
        if(online_member){
            online_member.send(JSON.stringify(value));
        }
    })
    // 等待所有推送完毕
    await Promise.all(sendMessagesPromises);
    // 将信息插入数据库
    await db.query('INSERT INTO message VALUES(NULL,?,?,?,?,"私人",?,?,NOW())',[sender_id,receiver_id,room_id,content,media_type,file_size])
    // 更新统计数据
    switch(media_type){
        case '文本':
            await updateRoomLastInfo(room_id,content);
            break;
        case '媒体':
            await updateRoomLastInfo(room_id,'[媒体]');
            break;
        case '表情':
            await updateRoomLastInfo(room_id,'[表情]');
            break;
        case '文件':
            await updateRoomLastInfo(room_id,'[文件]');
            break;
    }
}
// 群聊广播
async function groupBroadcast  ({ sender_id,receiver_id,content,media_type,file_size,room_id,type }) {
    // 获取群聊中的所有成员
    const [members] = await db.query('SELECT * FROM group_members JOIN user ON group_members.user_id = user.user_id  WHERE group_id=?',receiver_id);
    const [[receiver_info]] = await db.query('SELECT * FROM group_chat WHERE group_id=?',receiver_id);
    const value = {
        sender_id,
        receiver_id,
        room_id,
        media_type,
        content,
        media_type,
        receiver_info,
        file_size:file_size,
        created_at:new Date(),
        failed : false,
        type
    };
    
    // 并发执行将消息推送给所有成员
    const sendMessagesPromises = members.map(async member => {
        const online_member = connections[member.user_id];
        // 未读数加1
        await db.query('UPDATE group_members SET unread_msg_count=unread_msg_count+1 WHERE user_id=? AND group_id=?',[member.user_id,receiver_id]);
        // 如果在线，则推送消息
        if(online_member){
            online_member.send(JSON.stringify(value));
        }
    })
    // 等待所有推送完毕
    await Promise.all(sendMessagesPromises);
    // 将信息插入数据库
    await db.query('INSERT INTO message VALUES(NULL,?,?,?,?,"私人",?,?,NOW())',[sender_id,receiver_id,room_id,content,media_type,file_size])
    // 更新统计数据
    switch(media_type){
        case '文本':
        case '通知':
            await updateRoomLastInfo(room_id,content);
            break;
        case '媒体':
            await updateRoomLastInfo(room_id,'[媒体]');
            break;
        case '表情':
            await updateRoomLastInfo(room_id,'[表情]');
            break;
        case '文件':
            await updateRoomLastInfo(room_id,'[文件]');
            break;
    }
}
const { parseToken } = require('../utils/jwt');
let rooms = {} 
// 所有连接
async function Connection(ws, req){
    //获取并解析token
    const url = req.url.split("?")[1];
    const params = new URLSearchParams(url)
    const token = params.get("token");
    const client = parseToken(token).data;
    console.log('用户' + client.user_id + '加入连接')
    // 将用户存入字典
    connections[client.user_id] = ws;
    // 当用户发送消息时
    ws.on('message',(msg_req) => {
        const message = JSON.parse(msg_req);
        if (message.type === 'webrtc-signal') {
            // 转发信令到目标用户
            if (connections[message.targetId]) {
                connections[message.targetId].send(JSON.stringify({
                    ...message,
                    targetId: message.senderId // 反转发送者和目标者的ID
                }));
            }
        } else if (message.type === '私人') {
            sendMessageToFriend(ws, message);
        } else if (message.type === '群聊') {
            if(message.media_type == '通知'){
                groupBroadcast(message)
            }else{
                sendMessageToGroup(ws, message);
            }
        }
    })
    // 当用户关闭连接时，将用户从字典中移除
    ws.on('close',() => {
        console.log('用户' + client.user_id + '断开连接')
        delete connections[client.user_id];
    })
}


const socket = require('socket.io');
const http = require('http');
 
const d = http.createServer()
 
const io = socket(d, {
    cors: {
        origin: '*' // 配置跨域
    }
});
 
io.on('connection', sock => {
    // 向客户端发送连接成功的消息
    sock.emit('connectionSuccess');
 
    sock.on('joinRoom',(roomId)=>{
        sock.join(roomId);
        console.log('joinRoom-房间ID：'+roomId);
    })
 
    // 广播有人加入到房间
    sock.on('callRemote',(roomId)=>{
        console.log('有人加入房间')
        io.to(roomId).emit('callRemote')
    })
 
    // 广播同意接听视频
    sock.on('acceptCall',(roomId)=>{
        io.to(roomId).emit('acceptCall')
    })
 
    // 接收offer
    sock.on('sendOffer',({offer,roomId})=>{
        io.to(roomId).emit('sendOffer',offer)
    })
 
    // 接收answer
    sock.on('sendAnswer',({answer,roomId})=>{
        io.to(roomId).emit('sendAnswer',answer)
    })
 
    // 收到candidate
    sock.on('sendCandidate',({candidate,roomId})=>{
        console.log('收到candidate')
        io.to(roomId).emit('sendCandidate',candidate)
    })
 
    // 挂断结束视频
    sock.on('hangUp',(roomId)=>{
        io.to(roomId).emit('hangUp')
    })
})
 
d.listen(8081, () => {
    console.log('音视频服务器启动成功');
});

