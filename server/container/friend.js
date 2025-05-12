const db = require('./db')
// 删除好友
async function DeleteFriend(req,res){
    const { friend_id } = req.body;
    const { user_id } = req.parse;
    const delete_sql = 'DELETE FROM friend WHERE user_id=? AND friend_id=?'
    const [result] = await db.query(delete_sql,[user_id,friend_id]);
    const [result1] = await db.query(delete_sql,[friend_id,user_id]);
    if(result.affectedRows && result1.affectedRows){
        res.send({code:200,data:{msg:'删除成功'}})
    }else{
        res.send({code:201,msg:'删除失败'})
    }
}
// 好友列表
async function FriendList(req,res){
    const { user_id } = req.parse;
    const friend_sql = 'SELECT * FROM friend WHERE user_id = ?';
    const [friend_list] = await db.query(friend_sql,user_id);
    const info_sql = 'SELECT * FROM user WHERE user_id=?'
    for(let friend of friend_list){
        const [[friend_info]] = await db.query(info_sql,friend.friend_id);
        friend.friend_info = friend_info;
        // 将用户tag包含其中
        const [ tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',friend.friend_id);
        friend_info.tags = tags;
    }
    res.send({ code:200,data:{ friend_list } });
}
// 根据id获取好友列表
async function FriendListById(req,res){
    const { user_id } = req.body;
    const friend_sql = 'SELECT * FROM friend WHERE user_id = ?';
    const [friend_list] = await db.query(friend_sql,user_id);
    const info_sql = 'SELECT * FROM user WHERE user_id=?'
    for(let friend of friend_list){
        const [[friend_info]] = await db.query(info_sql,friend.friend_id);
        friend.friend_info = friend_info;
        // 将用户tag包含其中
        const [ tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',friend.friend_id);
        friend_info.tags = tags;
    }
    res.send({ code:200,data:{ friend_list } });
}
// 好友请求
async function FriendRequest(req,res){
    const { user_id } = req.parse;
    const request_sql = 'SELECT * FROM friend_request WHERE receiver_id = ? OR sender_id = ? ORDER BY updated_at DESC';
    const [friend_request] = await db.query(request_sql,[ user_id,user_id ]);
    const info_sql = 'SELECT * FROM user WHERE user_id = ?';
    const [[user_info]] = await db.query(info_sql,user_id);
    for(let request of friend_request){
        if(request.sender_id == user_id){
            const [[receiver_info]] = await db.query(info_sql,request.receiver_id);
            request.receiver_info = receiver_info;
            request.sender_info = user_info;
        }else if(request.receiver_id == user_id){
            const [[sender_info]] = await db.query(info_sql,request.sender_id);
            request.sender_info = sender_info;
            request.receiver_info = user_info
        }
    }
    res.send({ code:200,data:{ friend_request } });
}
// 发送好友请求
async function SendFriendRequest(req,res){
    const { target_id,introduce,remark,friend_group_id } = req.body;
    const { user_id } = req.parse;
    // 对方不能已经是好友
    const target_is_friend_sql = 'SELECT * FROM friend WHERE user_id=? AND friend_id=?';
    const [[target_is_friend]] = await db.query(target_is_friend_sql,[user_id,target_id]);
    if(target_is_friend) return res.send({ code:201,msg:'对方已是好友！'});
    // 判断对方是否已经发送过好友请求，如果已经发送，则直接添加为好友
    const target_have_request_sql = 'SELECT * FROM friend_request WHERE sender_id=? AND receiver_id=? AND status="等待"'
    const [[target_have_request]] = await db.query(target_have_request_sql,[target_id,user_id]);
    if(target_have_request){
        const update_target_request_sql = 'UPDATE friend_request SET status="同意" WHERE id=?';
        await db.query(update_target_request_sql,target_have_request.id);
        addFriend({
            user_request:{
                sender_id:user_id,
                receiver_id:target_id,
                remark:remark,
                friend_group_id:friend_group_id,
            },
            target_request:{
                sender_id:target_have_request.sender_id,
                receiver_id:target_have_request.receiver_id,
                remark:target_have_request.remark,
                friend_group_id:target_have_request.friend_group_id,
            }
        });
        res.send({ code:200,data:{msg:'对方已经发送过好友请求，你添加了对方为好友'} })
    }else{
        // 判断是否已存在相同请求,如果存在，更新请求。如果不存在，新增请求
        const have_request_sql = 'SELECT * FROM friend_request WHERE sender_id=? AND receiver_id=?';
        const [[have_request]] = await db.query(have_request_sql,[user_id,target_id]);
        if(have_request){
            const update_request_sql = 'UPDATE friend_request SET status="等待",introduce=?,remark=?,friend_group_id=? WHERE sender_id=? AND receiver_id=?';
            const [affectedRows] = await db.query(update_request_sql,[introduce,remark,friend_group_id,user_id,target_id]);
            if(affectedRows){
                res.send({ code:200,data:{ msg:'已更新你发送的好友请求' } })
            }else{
                res.send({ code:201,msg:'更新好友请求失败' })
            }
        }else{
            const update_request_sql = 'INSERT INTO friend_request(sender_id,receiver_id,introduce,remark,friend_group_id,status,created_at) VALUES(?,?,?,?,?,"等待",NOW())';
            const [affectedRows] = await db.query(update_request_sql,[user_id,target_id,introduce,remark,friend_group_id]);
            if(affectedRows){
                res.send({ code:200,data:{ msg:'成功向对方发送好友请求' } })
            }else{
                res.send({ code:201,msg:'向对方发送好友请求失败' })
            }
        }
    }

}
// 回应好友请求
async function ReplyFriendRequest(req,res){
    const { id,status } = req.body;
    const {user_id} = req.parse;
    const request_sql = 'SELECT * FROM friend_request WHERE id=?';
    const [[friend_request]] = await db.query(request_sql,id);
    if(!friend_request) return res.send({code:201,msg:'不存在的好友请求'});
    // 检查请求是否过期(距离发起请求间隔3个月)
    if(new Date(new Date - new Date(friend_request.update_at)) > 3){
        const expire_sql = 'UPDATE friend_request SET status="过期" WHERE id=?';
        await db.query(expire_sql,[id]);
        res.send({ code:201,msg:'请求已过期!' });
    }else{
        const reply_sql = 'UPDATE friend_request SET status=? WHERE id=?';
        if(status == '拒绝'){
            const [affectedRows] = await db.query(reply_sql,[status,id]);
            if(affectedRows){
                res.send({ code:200,data:{ msg:'已拒绝!' } });
            }else{
                res.send({ code:201,msg:'拒绝失败' });
            }
        }else if(status == '同意'){
            console.log(friend_request)
            // 将用户添加为好友
            const result = await addFriend({ target_request:friend_request,user_request:{
                remark:'',
                sender_id:user_id,
                receiver_id:friend_request.sender_id,
            } });
            // 好友添加成功后改变好友请求状态
            const [affectedRows] = await db.query(reply_sql,[status,id]);
            if(affectedRows) res.send({code:200,data:{ msg:'成功添加好友' }});
        }
    }
}
// 好友设置
async function SetFriend(req,res){
    // 免打扰、置顶、忽略、备注
    const { friend_id,top_up,no_disturb,ignored,remark } = req.body;
    const { user_id } = req.parse;
    const set_sql = 'UPDATE friend SET top_up=?,no_disturb=?,ignored=?,remark=? WHERE user_id=? AND friend_id=?';
    const [affectedRows] = await db.query(set_sql,[top_up,no_disturb,ignored,remark,user_id,friend_id]);
    if(affectedRows){
        res.send({code:200,data:{msg:'修改成功'}});
    }else{
        res.send({code:201,msg:'修改失败'});
    }
}
// 用户好友分组列表 √ 11/3
async function FriendGroupList(req,res){
    const { user_id } = req.parse;
    const [user_friend_group] = await db.query('SELECT * FROM friend_group WHERE user_id=?',user_id);
    await Promise.all(user_friend_group.map(async friend_group => {
        const { friend_group_id } = friend_group
        const [list] = await db.query('SELECT * FROM friend_group_list WHERE friend_group_id=?',friend_group_id);
        friend_group.list = list;
    }))
    res.send({code:200,data:{user_friend_group}})
}
// 用户好友分组创建 √ 11/3
async function FriendGroupCreate(req,res){
    const { friend_group_name } = req.body;
    const { user_id } = req.parse;
    const [[name_repeat]] = await db.query('SELECT * FROM friend_group WHERE friend_group_name=? AND user_id=?',[friend_group_name,user_id]);
    if(name_repeat) return res.send({code:201,msg:'创建失败！已存在同名分组'});
    const [{affectedRows}] = await db.query('INSERT INTO friend_group(user_id,friend_group_name) VALUES(?,?)',[user_id,friend_group_name]);
    if(affectedRows){
        res.send({code:200,data:{msg:'好友分组创建成功'}});
    }else{
        res.send({code:201,msg:'好友分组创建失败'});
    }
}
// 用户好友分组删除 √ 11/3
async function FriendGroupDelete(req,res){
    const { friend_group_id } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('DELETE FROM friend_group WHERE friend_group_id=? AND user_id=?',[friend_group_id,user_id]);
    if(affectedRows){
        // 将分组中的所有好友移除
        await db.query('DELETE FROM friend_group_list WHERE friend_group_id=?',friend_group_id)
        res.send({code:200,data:{msg:'好友分组删除成功'}});
    }else{
        res.send({code:201,msg:'好友分组删除失败'});
    }
}
// 用户好友分组重命名 √ 11/3
async function FriendGroupRename(req,res){
    const { friend_group_name,friend_group_id } = req.body;
    const { user_id } = req.parse;
    const [[name_repeat]] = await db.query('SELECT * FROM friend_group WHERE friend_group_name=? AND user_id=?',[friend_group_name,user_id]);
    if(name_repeat) return res.send({code:201,msg:'好友分组重命名失败！已存在同名分组'});
    const [{affectedRows}] = await db.query('UPDATE friend_group SET friend_group_name=? WHERE friend_group_id=? AND user_id=?',[friend_group_name,friend_group_id,user_id]);
    if(affectedRows){
        res.send({code:200,data:{msg:'好友分组重命名成功'}});
    }else{
        res.send({code:201,msg:'好友分组重命名失败'});
    }
}
// 用户分组添加好友 √ 11/3
async function FriendGroupAppend(req,res){
    const { friend_list } = req.body;
    const { user_id } = req.parse; 
    if(!friend_list || !friend_list.length) return res.send({code:201,msg:'请求体无效！'});
    const friend_group_id = friend_list[0].friend_group_id;
    // 用户必须拥有该分组
    const [[user_have_friend_group]] = await db.query('SELECT * FROM friend_group WHERE user_id=? AND friend_group_id=?',[user_id,friend_group_id]);
    if(!user_have_friend_group) return res.send({code:201,msg:'该分组不被你持有！'});
    const result = await Promise.all(friend_list.map(async friend => {
        // 用户必须拥有该好友关系
        const [[user_have_relation]] = await db.query('SELECT * FROM friend WHERE user_id=? AND friend_relation_id=?',[user_id,friend.friend_relation_id]);
        if(!user_have_relation) throw res.send({code:200,data:{ msg:'操作进行一半时中止,因为有些用户不是你的好友，无法加入分组！' }});
        const [{affectedRows}] = await db.query('INSERT INTO friend_group_list(friend_relation_id,friend_group_id) VALUES(?,?)',[friend.friend_relation_id,friend_group_id]);
        return affectedRows;
    }))

    
    if(result){
        res.send({code:200,data:{msg:'好友加入分组成功'}});
    }else{
        res.send({code:201,msg:'好友加入分组时出现一些错误'});
    }
}
// 用户分组移出好友 √ 11/3
async function FriendGroupRemove(req,res){
    const { friend_list } = req.body;
    const { user_id } = req.parse; 
    if(!friend_list || !friend_list.length) return res.send({code:201,msg:'请求体无效！'});
    const friend_group_id = friend_list[0].friend_group_id;
    // 用户必须拥有该分组
    const [[user_have_friend_group]] = await db.query('SELECT * FROM friend_group WHERE user_id=? AND friend_group_id=?',[user_id,friend_group_id]);
    if(!user_have_friend_group) return res.send({code:201,msg:'该分组不被你持有！'});
    const result = await Promise.all(friend_list.map(async friend => {
        const [{affectedRows}] = await db.query('DELETE FROM friend_group_list WHERE friend_relation_id=? AND friend_group_id=?',[friend.friend_relation_id,friend_group_id]);
        return affectedRows;
    }))
    if(result){
        res.send({code:200,data:{msg:'好友移出分组成功'}});
    }else{
        res.send({code:201,msg:'好友移出分组时出现一些错误'});
    }
}
// 增加为好友
async function addFriend({ user_request,target_request }){
    const {room_id} = await addRoom('私人');
    const add_sql = `INSERT INTO friend(user_id,friend_id,remark,room_id) VALUES(?,?,?,?)`;
    await db.query(add_sql,[user_request.sender_id,user_request.receiver_id,user_request.remark,room_id]);
    const [[{user_request_friend_relation_id}]] = await db.query('SELECT LAST_INSERT_ID() AS user_request_friend_relation_id')
    await db.query(add_sql,[target_request.sender_id,target_request.receiver_id,target_request.remark,room_id]);
    const [[{target_request_friend_relation_id}]] = await db.query('SELECT LAST_INSERT_ID() AS target_request_friend_relation_id')
    const exist_sql = 'SELECT * FROM friend_group WHERE user_id=? AND friend_group_id=?';
    const append_sql = 'INSERT INTO friend_group_list(friend_relation_id,friend_group_id) VALUES(?,?)'
    // 将对方加入分组
    if(user_request.friend_group_id){
        // 原来的分组必须存在
        const [[friend_group_exist]] = await db.query(exist_sql,[user_request.sender_id,user_request.friend_group_id]);
        if(friend_group_exist) await db.query(append_sql,[user_request_friend_relation_id,user_request.friend_group_id])
    }
    if(target_request.friend_group_id){
        // 原来的分组必须存在
        const [[friend_group_exist]] = await db.query(exist_sql,[user_request.sender_id,user_request.friend_group_id]);
        if(friend_group_exist) await db.query(append_sql,[target_request_friend_relation_id,target_request.friend_group_id])
    }
    return true;
}

// 新建房间
async function addRoom(type){
    const add_sql = 'INSERT INTO room(room_id,type,msg_total) VALUES(NULL,?,0)';
    const [affectedRows] = await db.query(add_sql,type);
    if(affectedRows){
        const select_sql = 'SELECT LAST_INSERT_ID() AS room_id';
        const [[room_info]] = await db.query(select_sql); 
        return room_info;
    }

}
module.exports = {
    FriendList,
    FriendListById,
    FriendRequest,
    ReplyFriendRequest,
    SendFriendRequest,
    DeleteFriend,
    SetFriend,

    FriendGroupList,
    FriendGroupCreate,
    FriendGroupDelete,
    FriendGroupAppend,
    FriendGroupRemove,
    FriendGroupRename
}