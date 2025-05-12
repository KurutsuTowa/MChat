module.exports = {
    Connection,
    groupBroadcast
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
    const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker.sticker_id);
    sticker.sticker_info = sticker_info;
    value.sticker = sticker;
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
    const [[sender_info]] = await db.query(user_info_sql,sender_id);
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
    const [[{ban_talk}]] = await db.query('SELECT ban_talk FROM group_members WHERE user_id=?',sender_id);
    if(ban_talk) {
        value.failed = true;
        client.send(JSON.stringify(value));
        value.media_type = '警告';
        value.content = '你已被管理者禁言,发送失败'
        return client.send(JSON.stringify(value));
    }
    // 判断是不是今天在群聊中的第一个评论，如果是，增加群经验
    const [[{today_first_send}]] = await db.query('SELECT TIMESTAMPDIFF(DAY,last_send_at,NOW()) AS today_first_send FROM group_members WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);
    if(today_first_send){
        // 经验+16
        await db.query('UPDATE group_members SET exp=exp+10 WHERE user_id=? AND group_id=?',[sender_id,receiver_id]);
        // 重新判断等级
        await UserLevelUpdate(sender_id,receiver_id);
        // 发出通知
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
        /**
         * message:{
         *  type
         *  media_type
         *  room_id
         * }
         */
        const message = JSON.parse(msg_req);
        if(message.type == '私人'){
            sendMessageToFriend(ws,message);
        }else if(message.type == '群聊'){
            sendMessageToGroup(ws,message);
        }
    })
    // 当用户关闭连接时，将用户从字典中移除
    ws.on('close',() => {
        console.log('用户' + client.user_id + '断开连接')
        delete connections[client.user_id];
    })
}



/**
 * 建立聊天
 * 需要获取信息:发送人ID,接收人ID,聊天内容,房间号,头像,内容的类型,文件大小,创建时间,(群聊中的昵称)
 * 1.获取房间号和对方id(群聊ID)
 * 2. 根据房间号获取所有聊天记录
 * 3.将当前用户的所有未读变成已读
 * 4.监听message
 * 5.消息类型目前分为text(文本),image(图片),video(视频),file(文件)
 * 6.text文本不做任何处理
 * 7. image(图片),video(视频),file(文件)先获取文件名,在判断存储的目录是否存在,不存在则创建,然后将其进行保存,并发送相关存储路径给前端
 * 8.插入数据到message表中
 * 9.并修改当前房间的最早一次的聊天时间
 * 
 */
async function ChatConnect(ws, req) {
    //获取name
    let url = req.url.split("?")[1];
    let params = new URLSearchParams(url)
    let room = params.get("room")
    let id = params.get("id")
    let type = params.get("type")
    if (!rooms[room]) {
        rooms[room] = {}
    }
    rooms[room][id] = ws
    let sql
    let resp
    if (type == 'group') {
        sql = 'SELECT gm.nickname,m.*,u.avatar FROM (SELECT sender_id, receiver_id, content, room, media_type,message.created_at FROM message WHERE `room` =? AND `type` = ?) AS m LEFT JOIN user as u ON u.`id`=m.`sender_id` LEFT JOIN group_members as gm on gm.group_id=? and user_id=u.`id` ORDER BY created_at ASC'
        resp = await Query(sql, [room, type, id])
    } else {
        sql = 'SELECT m.*,u.avatar FROM (SELECT sender_id, receiver_id, content, room, media_type,message.created_at FROM message WHERE `room` =? AND `type` = ?  ORDER BY created_at ASC) AS m LEFT JOIN user as u ON u.`id`=m.`sender_id`'
        resp = await Query(sql, [room, type])
    }
    let results = resp.results
    let histroyMsg = results.map((item) => {
        return {
            "sender_id": item.sender_id,
            "receiver_id": item.receiver_id,
            'nickname': item.nickname,
            "content": item.content,
            "room": item.room,
            "avatar": item.avatar,
            "type": item.media_type,
            'file_size': formatBytes(item.file_size),
            "created_at": new Date(item.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
        }
    })
    ws.send(JSON.stringify(histroyMsg))
    //将所有未读消息变成已读
    sql = 'update message set status=1 where receiver_id=? and room=? and type=? and status=0'
    await Query(sql, [id, room, type])
    let fileInfo = null;
    let receivedSize = 0;
    let writeStream = null;
    ws.on('message', async (Resp_data) => {
        let message = JSON.parse(Resp_data)
        let fileContent, fileSuffix, filename

        //判断其类型
        let msg = {
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            type: type,
            media_type: message.type,
            room: room,
            file_size: 0,
        }
        switch (message.type) {
            case 'text':
                msg.content = message.content
                break
            case 'image':
                fileContent = Buffer.from(message.content)
                fileSuffix = message.filename
                    .substring(message.filename.lastIndexOf(".") + 1)
                    .toLowerCase();
                filename = generateRandomString(32) + "." + fileSuffix
                notExitCreate(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, "_")}/images`))
                fs.writeFileSync(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, "_")}/images/${filename}`), fileContent)
                msg.content = `/uploads/message/${room.replace(/-/g, "_")}/images/${filename}`
                message.content = `/uploads/message/${room.replace(/-/g, "_")}/images/${filename}`
                break
            case 'video':
                fileContent = Buffer.from(message.content)
                fileSuffix = message.filename
                    .substring(message.filename.lastIndexOf(".") + 1)
                    .toLowerCase();
                filename = generateRandomString(32) + "." + fileSuffix
                notExitCreate(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, "_")}/video`))
                fs.writeFileSync(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, "_")}/video/${filename}`), fileContent)
                msg.content = `/uploads/message/${room.replace(/-/g, "_")}/video/${filename}`
                message.content = `/uploads/message/${room.replace(/-/g, "_")}/video/${filename}`
                break
            case 'file':
                if (message.fileType == 'start') {
                    receivedSize = 0;
                    fileInfo = JSON.parse(message.fileInfo)
                    notExitCreate(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, "_")}/file`))
                    writeStream = fs.createWriteStream(path.join(process.cwd(), `uploads/message/${room.replace(/-/g, "_")}/file/${message.filename}`));
                    return
                } else if (message.fileType == 'upload') {
                    fileContent = Buffer.from(message.content)
                    // 接收文件块并写入文件
                    writeStream.write(fileContent);
                    receivedSize += fileContent.length;
                    // 如果接收完整个文件，则关闭文件流并发送上传成功消息
                    if (receivedSize === fileInfo.fileSize) {
                        writeStream.end(async () => {
                            msg.content = `/uploads/message/${room.replace(/-/g, "_")}/file/${message.filename}`
                            msg.file_size = receivedSize
                            message.content = `/uploads/message/${room.replace(/-/g, "_")}/file/${message.filename}`
                            if (rooms[room][message.receiver_id]) {
                                msg.status = 1
                            } else {
                                msg.status = 0
                            }

                            sql = 'insert into message set ?'
                            await Query(sql, msg)
                            sql = `update  message_statistics set total=total+1  where room=?`
                            await Query(sql, [room])
                            for (const key in rooms[room]) {
                                rooms[room][key].send(JSON.stringify(message))
                            }
                            return
                        });
                    }
                    return
                }
                break
        }
        if (rooms[room][message.receiver_id]) {
            msg.status = 1
        } else {
            msg.status = 0
        }
        sql = 'insert into message set ?'
        await Query(sql, msg)
        sql = `update  message_statistics set total=total+1  where room=?`
        await Query(sql, [room])
        for (const key in rooms[room]) {
            rooms[room][key].send(JSON.stringify(message))
            NotificationUser({ receiver_id: message.receiver_id, name: "list" })
        }
    })
}
