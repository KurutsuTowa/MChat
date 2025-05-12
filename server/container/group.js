const db = require('./db')
const { generateToken } = require('../utils/jwt');
// 创建群聊 ?
async function CreateGroup(req,res){
    let { group_name='未命名',avatar='avatar_default.jpg',description='无简介',space_background='default.avif',auth='confirm',auth_query='',members=[] } = req.body;
    group_name = group_name || '未命名'
    avatar = avatar || 'avatar_default.jpg'
    description = description || '无简介'
    space_background = space_background || 'default.avif'
    auth = auth || 'confirm'

    if(!space_background) space_background = 'default.avif';

    // user_id作为群聊创建者
    const { user_id } = req.parse;
    // 创建房间
    const { room_id } = await AddRoom('群聊');
    // 创建群聊
    const add_sql = 'INSERT INTO group_chat(group_name,creator_id,avatar,description,space_background,auth,auth_query,room_id,member_total) VALUES(?,?,?,?,?,?,?,?,1)'
    const [result] = await db.query(add_sql,[group_name ,user_id,avatar,description,space_background,auth,auth_query,room_id]);
    if(!result.affectedRows) return res.send({code:201,msg:'群聊创建失败！'});
    const group_id_sql = 'SELECT LAST_INSERT_ID() AS group_id'
    const [[{group_id}]] = await db.query(group_id_sql)
    // 创建等级表
    const level_map = ['菜鸟','新手','学徒','熟练','老手','大师','宗师'];// 默认等级称号
    for(let i = 1; i <= 7;i ++){
        await db.query('INSERT INTO group_level VALUES(?,?,?)',[group_id,i,level_map[i-1]]);
    }
    // 将创建用户作为群主加入群聊中 
    const join_sql = `INSERT INTO group_members(group_id,user_id,position) VALUES(?,?,"群主")`;
    const [result1] = await db.query(join_sql,[group_id,user_id]); 
    // 遍历成员列表，向所有成员发送邀请
    if(members.length) members.forEach(member => db.query('INSERT INTO group_request(receiver_id,group_id,sender_id,type,status,created_at) VALUES(?,?,?,"邀请","等待",NOW())',[member.friend_info.user_id,group_id,user_id]))

    if(result1.affectedRows){
        return res.send({code:200,data:{
            msg:'群聊创建成功！',
            group_id
        }});
    }else{
        return res.send({code:201,msg:'群聊创建过程中失败：加入群聊失败！'});
    }
    
}
// 修改群聊信息 ?
async function UpdateGroup(req,res){
    const { group_id,group_name,avatar,description,space_background,auth,auth_query,all_ban_talk,tags } = req.body;
    const { user_id } = req.parse;
    // 用户必须是管理员或者群主
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[is_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!is_manager) return res.send({code:201,msg:'你无权进行操作！'});
    // 编辑
    const update_sql = 'UPDATE group_chat SET group_name=?,avatar=?,description=?,space_background=?,auth=?,auth_query=?,all_ban_talk=?,tags=? WHERE group_id=?'
    const [affectedRows] = await db.query(update_sql,[group_name,avatar,description,space_background,auth,auth_query,all_ban_talk,tags?.join(','),group_id]);
    if(affectedRows){
        res.send({code:200,data:{msg:'编辑成功！'}});
    }else{
        res.send({code:201,msg:'编辑失败！'});
    }
}
// 解散群聊 √
async function DisbandGroup(req,res){
    const { group_id } = req.body;
    const { user_id } = req.parse;
    // 用户必须是群主
    const is_master_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position="群主"';
    const [[is_master]] = await db.query(is_master_sql,[user_id,group_id]);
    if(!is_master) return res.send({code:201,msg:'你不是群主，无权进行操作！'});
    // 移除群聊中的所有成员
    const remove_member_sql = 'DELETE group_members WHERE group_id=?';
    const remove_member_result = await db.query(remove_member_sql,group_id);
    if(!remove_member_result.affectedRows) return res.send({code:201,msg:'解散群聊过程中失败：移除成员失败'})
    // 清空群等级信息
    const remove_level_result = await db.query('DELETE group_level WHERE group_id=?',group_id);
    // 清空群相册
    const clear_photo_sql = 'DELETE group_photo WHERE group_id=?';
    const clear_photo_result = await db.query(clear_photo_sql,group_id);
    if(!clear_photo_result.affectedRows) return res.send({code:201,msg:'解散群聊过程中失败：清空相册失败'})
    // 清空群文件
    const clear_file_sql = 'DELETE group_file WHERE group_id=?';
    const clear_file_result = await db.query(clear_file_sql,group_id);
    if(!clear_file_result.affectedRows) return res.send({code:201,msg:'解散群聊过程中失败：清空群文件失败'})
    // 删除群聊
    const disband_sql = 'DELETE group_chat WHERE gropu_id=?'
    const disband_group_result = await db.query(disband_sql,group_id);
    if(!disband_group_result.affectedRows) return res.send({code:201,msg:'解散群聊过程中失败：删除群聊失败'})
    res.send({code:200,data:{msg:'成功解散群聊'}})
}
// 发布群公告
async function AnnounceAppend(req,res){
    const {group_id,announce} = req.body;
    const {user_id} = req.parse;
    // 用户必须是管理者
    const is_master_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[is_master]] = await db.query(is_master_sql,[user_id,group_id]);
    if(!is_master) return res.send({code:201,msg:'你无权进行此操作！'});
    const [{affectedRows}] = await db.query('INSERT INTO group_announce(group_id,announce,created_at) VALUES(?,?,NOW())',[group_id,announce]);
    if(affectedRows){
        res.send({code:200,data:{msg:'公告发布成功！'}});
    }else{
        res.send({code:201,msg:'公告发布失败！'});
    }
}
// 群公告列表
async function AnnounceList(req,res){
    const {group_id} = req.body;
    const [announce_list] = await db.query('SELECT * FROM group_announce WHERE group_id=?',group_id);
    res.send({code:200,data:{announce_list}})
}
// 群聊成员禁言设置
async function BanTalkGroup(req,res){
    const {member_list,ban_talk,group_id} = req.body;
    const {user_id} = req.parse;
    // 用户必须是管理员或者群主
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[is_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!is_manager) return res.send({code:201,msg:'你无权进行操作！'});
    Promise.all(member_list.map(async member => {
        await db.query('UPDATE group_members SET ban_talk=? WHERE user_id=? AND group_id=?',[ban_talk,member.user_id,group_id]);
    }))
    res.send({code:200,data:{msg:'设置成功'}});
}
// 群称号修改
async function UpdateGroupLevelName(req,res){
    const {level_list,group_id} = req.body;
    const {user_id} = req.parse;
    // 用户必须是管理员或者群主
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[is_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!is_manager) return res.send({code:201,msg:'你无权进行操作！'});
    Promise.all(level_list.map(async level => {
        await db.query('UPDATE group_level SET level_name=? WHERE group_id=? AND level=?',[level.level_name,group_id,level.level]);
    }))
    res.send({code:200,data:{msg:'修改成功'}});
}
// 用户对群聊的个人设置 ?
async function SetGroup(req,res){
    // 免打扰、置顶、忽略
    const { group_id,no_disturb,top_up,ignored } = req.body;
    const { user_id } = req.parse;
    const set_sql = 'UPDATE group_members SET no_disturb=?,top_up=?,ignored=? WHERE user_id=? AND group_id=?';
    const [affectedRows] = await db.query(set_sql,[no_disturb,top_up,ignored,user_id,group_id]);
    if(affectedRows){
        res.send({code:200,data:{msg:'修改成功'}});
    }else{
        res.send({code:201,data:{msg:'修改失败'}});
    }
}
// 设置群聊职位
async function SetPosition(req,res){
    const { target_id,position,group_id } = req.body;
    const { user_id } = req.parse;
    // 用户必须是群主
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主")';
    const [[is_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!is_manager) return res.send({code:201,msg:'你无权进行操作！'});
    // 不能设置群主职位
    if(position == '群主') return res.send({code:201,msg:"无法设置多个群主"});
    // 设置
    const set_sql = 'UPDATE group_members SET position=? WHERE user_id=? AND group_id=?'
    const [affectedRows] = await db.query(set_sql,[position,target_id,group_id]);
    console.log(position,target_id,group_id)
    if(affectedRows){
        res.send({code:200,data:{msg:'设置成功！'}});
    }else{
        res.send({code:201,msg:'设置失败！'});
    }
}
// 移除群成员
async function RemoveMember(req,res){
    const { target_id,group_id } = req.body;
    const { user_id } = req.parse;
    // 用户移除对象不能是自己
    if(target_id == user_id) return res.send({code:201,msg:'你没办法移除你自己！'});
    // 用户必须是群主或者管理员
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[user_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!user_manager) return res.send({code:201,msg:'你无权进行操作！'});
    // 如果对方职位大于，或与自身同级，则无法移除
    const [[target_manager]] = await db.query(is_manager_sql,[target_id,group_id]);
    if(target_manager?.position == '群主') {
        return res.send({code:201,msg:'你不能移除群主！'});
    }else if(target_manager?.position == user_manager.position){
        return res.send({code:201,msg:'你不能移除和自己职位权限相同的用户！'});
    }else{
        const remove_member_sql = 'DELETE FROM group_members WHERE group_id=? AND user_id=?';
        const [{affectedRows}] = await db.query(remove_member_sql,[group_id,target_id]);
        await db.query('UPDATE group_chat SET member_total=member_total-?',affectedRows);
        if(affectedRows){
            res.send({code:200,data:{msg:'移除成功！'}});
        }else{
            res.send({code:201,msg:'对方已被移除群聊'});
        }
    }
}
// 搜索群聊
async function SearchGroup(req,res){
    const { keywords } = req.body;
    const search_sql = 'SELECT * FROM group_chat WHERE group_id=? OR group_name LIKE ?';
    const [group_list] = await db.query(search_sql,[keywords,'%' + keywords + '%']);
    res.send({ code:200,data:{ group_list } });
}
// 群聊列表
async function GroupList(req,res){
    const { user_id } = req.parse;
    const group_sql = 'SELECT * FROM group_members WHERE user_id = ?';
    const [group_list] = await db.query(group_sql,user_id);
    const info_sql = 'SELECT * FROM group_chat WHERE group_id=?'
    for(let group of group_list){
        const [[group_info]] = await db.query(info_sql,group.group_id);
        group.group_info = group_info;
    }
    res.send({ code:200,data:{ group_list } });
}
// 群聊信息
async function GroupInfo(req,res){
    const { group_id } = req.body;
    // 群聊基本信息
    const info_sql = 'SELECT * FROM group_chat WHERE group_id=?';
    const [[group_info]] = await db.query(info_sql,group_id);
    // 群聊统计信息
    const statistic_sql = 'SELECT * FROM message_statistics WHERE room_id=?'
    const [[message_statistic]] = await db.query(statistic_sql,group_info.room_id);
    // 群聊成员信息
    const members_sql = 'SELECT group_members.*,user.avatar,user.username,user.gender,user.born_at FROM group_members JOIN user ON group_members.user_id=user.user_id WHERE group_id=?'
    const [group_members] = await db.query(members_sql,group_id);
    // 获取每个群聊成员的tags
    await Promise.all(group_members.map(async member => {
        const [ user_tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',member.user_id)
        member.tags = user_tags;
    }))
    // 群聊等级信息
    const [group_level] = await db.query('SELECT * FROM group_level WHERE group_id=?',group_id);

    group_info.message_statistic = message_statistic;
    group_info.group_members = group_members;
    group_info.group_level = group_level;

    res.send({ code:200,data:{ group_info } });
}
// 群聊请求
async function GroupRequest(req,res){
    const { user_id } = req.parse;
    // 获取与用户相关的群聊请求
    const about_request_sql = 'SELECT * FROM group_request WHERE receiver_id=? OR sender_id=? ORDER BY updated_at DESC';
    const [about_group_request] = await db.query(about_request_sql,[ user_id,user_id ]);
    // 获取他人向自己管理的群聊申请的请求
    const ctrl_request_sql = 'SELECT group_request.* FROM group_request right JOIN group_members ON group_request.group_id = group_members.group_id WHERE sender_id IS NULL AND group_members.user_id=? AND receiver_id !=? AND group_members.position IN ("群主","管理员")';
    const [ctrl_group_request] = await db.query(ctrl_request_sql,[ user_id,user_id ])
    // 组合数组
    const group_request = about_group_request.concat(ctrl_group_request);
    const user_info_sql = 'SELECT * FROM user WHERE user_id=?';
    const group_info_sql = 'SELECT * FROM group_chat WHERE group_id=?'
    for(let request of group_request){
        const [[group_info]] = await db.query(group_info_sql,request.group_id);
        const [[receiver_info]] = await db.query(user_info_sql,request.receiver_id);
        request.group_info = group_info;
        request.receiver_info = receiver_info;
        if(request.sender_id){
            const [[sender_info]] = await db.query(user_info_sql,request.sender_id);
            request.sender_info = sender_info;
        }

        if(request.handle_id){
            const [[handle_info]] = await db.query(user_info_sql,request.handle_id);
            request.handle_info = handle_info;
        }
    }
    res.send({ code:200,data:{ group_request } });
}
// 发送加群请求
async function SendGroupRequest(req,res){
    const { group_id,introduce } = req.body;
    const { user_id } = req.parse;
    // 自己不能在群聊内
    const self_in_group_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=?';
    const [[self_in_group]] = await db.query(self_in_group_sql,[user_id,group_id]);
    if(self_in_group) return res.send({ code:201,msg:'已经处在群聊内！'});
    // 验证判断
    const group_sql = 'SELECT * FROM group_chat WHERE group_id=?'
    const [[group_info]] = await db.query(group_sql,group_id);
    if(group_info.auth == 'confirm' || group_info.auth == 'query'){//如果对方的群聊需加群验证，则发送加群请求，让对方处理
        // 判断是否已经有其他人邀请自己加入该群聊，如有，使这些请求过期，并直接加入群聊
        const have_other_request_sql = 'SELECT * FROM group_request WHERE receiver_id=? AND group_id=? AND status="等待" AND sender_id IS NOT NULL';
        const [[have_other_request]] = await db.query(have_other_request_sql,[user_id,group_id]);
        if(have_other_request){
            const expire_sql = 'UPDATE group_request SET status="过期" WHERE receiver_id=? AND group_id=?';
            await db.query(expire_sql,[user_id,group_id]);
            const result = await JoinGroup({ group_id,user_id });
            if(result){
                res.send({ code:200,data:{ msg:'已有其他人邀请过你，加群成功！' } })
            }else{
                res.send({ code:200,data:{ msg:'加群失败！' } })
            }
        }else{
            // 判断是否已存在相同请求,如果存在，更新请求。如果不存在，新增请求
            const have_request_sql = 'SELECT * FROM group_request WHERE receiver_id=? AND group_id=? AND sender_id IS NULL AND status="等待"';
            const [[have_request]] = await db.query(have_request_sql,[user_id,group_id]);
            if(have_request){
                const update_request_sql = 'UPDATE group_request SET status="等待",introduce=? WHERE receiver_id=? AND group_id=?';
                const [affectedRows] = await db.query(update_request_sql,[introduce,user_id,group_id]);
                if(affectedRows){
                    res.send({ code:200,data:{ msg:'已更新加群请求' } })
                }else{
                    res.send({ code:201,msg:'更新加群请求失败' })
                }
            }else{
                const update_request_sql = 'INSERT INTO group_request VALUES(NULL,?,?,NULL,NULL,?,"申请","等待",NOW(),NOW())';
                const [affectedRows] = await db.query(update_request_sql,[user_id,group_id,introduce]);
                if(affectedRows){
                    res.send({ code:200,data:{ msg:'成功发送加群请求' } })
                }else{
                    res.send({ code:201,msg:'发送加群请求失败' })
                }
            }
        }
    }else if(group_info.auth == 'allow'){//如果对方的群聊无需加群验证，则直接加入群聊
        const result = await JoinGroup({ group_id,user_id });
        if(result.ok){
            res.send({ code:200,data:{ msg:'对方群聊无需进行验证,加群成功！' } })
        }else{
            res.send({ code:200,data:{ msg:'加群失败:' + result.msg } })
        }
    }
}
// 邀请加群
async function inviteGroupRequest(req,res){
    const { group_id,introduce,receiver_id } = req.body;
    const { user_id } = req.parse;
    //必须在群聊内
    const self_in_group_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=?';
    const [[self_in_group]] = await db.query(self_in_group_sql,[user_id,group_id]);
    if(!self_in_group) return res.send({ code:201,msg:'你不能邀请别人加入你没有加入的群聊！'});
    // 判断是否已存在相同请求,如果存在，更新请求。如果不存在，新增请求
    const have_request_sql = 'SELECT * FROM group_request WHERE receiver_id=? AND group_id=? AND sender_id=?';
    const [[have_request]] = await db.query(have_request_sql,[receiver_id,group_id,user_id]);
    if(have_request){
        const update_request_sql = 'UPDATE group_request SET status="等待",introduce=? WHERE receiver_id=? AND sender_id=? AND group_id=?';
        const [affectedRows] = await db.query(update_request_sql,[introduce,receiver_id,user_id,group_id]);
        if(affectedRows){
            res.send({ code:200,data:{ msg:'已更新加群邀请' } })
        }else{
            res.send({ code:201,msg:'更新加群邀请失败' })
        }
    }else{
        const invite_request_sql = 'INSERT INTO group_request VALUES(NULL,?,?,?,NULL,?,"邀请","等待",NOW(),NOW())';
        const [affectedRows] = await db.query(invite_request_sql,[receiver_id,group_id,user_id,introduce]);
        if(affectedRows){
            res.send({ code:200,data:{ msg:'成功发送加群邀请' } })
        }else{
            res.send({ code:201,msg:'发送加群邀请失败' })
        }
    }    
}
// 回应加群请求
async function ReplySendGroupRequest(req,res){
    const { request_id,group_id,status } = req.body;
    const { user_id } = req.parse;

    // 首先判断用户是不是管理员/群主
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[is_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!is_manager) return res.send({code:201,msg:'你不是管理员，无权进行管理！'});
    const request_sql = 'SELECT * FROM group_request WHERE request_id=?';
    const [[request_info]] = await db.query(request_sql,request_id);
    // 检查请求是否过期(距离发起请求间隔3个月)
    if(new Date(new Date - new Date(request_info.update_at)) > 3){
        const expire_sql = 'UPDATE group_request SET status="过期" WHERE request_id=?';
        await db.query(expire_sql,[request_id]);
        res.send({ code:201,msg:'请求已过期!' });
    }else{
        const reply_sql = 'UPDATE group_request SET status=?,handle_id=? WHERE request_id=?';
        if(status == '拒绝'){
            const [affectedRows] = await db.query(reply_sql,[status,user_id,request_id]);
            if(affectedRows){
                res.send({ code:200,data:{ msg:'已拒绝!' } });
            }else{
                res.send({ code:201,msg:'拒绝失败' });
            }
        }else if(status == '同意'){
            // 将用户添加到群聊中
            await JoinGroup({ group_id,user_id:request_info.receiver_id });
            // 添加成功后改变请求状态
            const result = await db.query(reply_sql,[status,user_id,request_id]);
            // 将该用户所有和该群聊相关的处于等待状态的请求失效
            const expire_sql = 'UPDATE group_request SET status="失效" WHERE group_id=? AND receiver_id=? AND status="等待"';
            const result1 = await db.query(expire_sql,[group_id,request_info.receiver_id]);
           res.send({code:200,data:{ msg:'已同意其加入群聊' }});
        }
    }
}
// 回应邀请加群请求
async function ReplyInviteGroupRequest(req,res){
    const { request_id,group_id,status } = req.body;
    const { user_id } = req.parse;
    const request_sql = 'SELECT * FROM group_request WHERE request_id=?';
    const [[request_info]] = await db.query(request_sql,request_id);
    // 检查请求是否过期(距离发起请求间隔3个月)
    if(new Date(new Date - new Date(request_info.update_at)) > 3){
        const expire_sql = 'UPDATE group_request SET status="过期" WHERE request_id=?';
        await db.query(expire_sql,[request_id]);
        res.send({ code:201,msg:'请求已过期!' });
    }else{
        const reply_sql = 'UPDATE group_request SET status=? WHERE request_id=?';
        if(status == '拒绝'){
            const [affectedRows] = await db.query(reply_sql,[status,request_id]);
            if(affectedRows){
                res.send({ code:200,data:{ msg:'已拒绝!' } });
            }else{
                res.send({ code:201,msg:'拒绝失败' });
            }
        }else if(status == '同意'){

            // 将自己添加到群聊中
            await JoinGroup({ group_id,user_id:user_id });
            // 添加成功后改变请求状态
            const result = await db.query(reply_sql,[status,request_id]);
            // 将自身所有和该群聊相关的处于等待状态的请求失效
            const expire_sql = 'UPDATE group_request SET status="失效" WHERE group_id=? AND receiver_id=? AND status="等待"';
            const result1 = await db.query(expire_sql,[group_id,user_id]);
            res.send({code:200,data:{ msg:'已同意加入群聊' }});
        }
    }
}
const {groupBroadcast} = require('./message');
// 退出群聊
async function LeaveGroup(req,res){
    const { group_id } = req.body;
    const { user_id } = req.parse;
    const [[group_info]] = await db.query('SELECT * FROM group_chat WHERE group_id=?',group_id);
    const leave_sql = 'DELETE FROM group_members WHERE group_id=? AND user_id=?';
    const [{affectedRows}] = await db.query(leave_sql,[group_id,user_id]);
    await db.query('UPDATE group_chat SET member_total=member_total-? WHERE group_id=?',[affectedRows,group_id]);
    const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',user_id);
    if(affectedRows){
        res.send({code:200,data:{msg:'成功退出群聊'}});
        setTimeout(() => {
            // 进行群聊广播
            groupBroadcast({
                sender_id:null,
                receiver_id:group_id,
                content:user_info.username + '退出了群聊',
                media_type:'通知',
                file_size:null,
                room_id:group_info.room_id,
                type:'群聊'
            })
        },10)
    }else{
        res.send({code:201,msg:'退出群聊失败'});
    }
} 
// 将用户加入群聊
async function JoinGroup({ group_id,user_id }){
    const [[group_info]] = await db.query('SELECT * FROM group_chat WHERE group_id=?',group_id);
    const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',user_id);
    if(group_info.member_total >= group_info.member_max){
        return { ok:false,msg:'该群聊成员数量已达上限！' }
    }else{
        const join_sql = `INSERT INTO group_members(group_id,user_id,position) VALUES(?,?,"成员")`;
        const [affectedRows] = await db.query(join_sql,[group_id,user_id]); 
        // 增加群聊人数
        await db.query('UPDATE group_chat SET member_total=member_total+1 WHERE group_id=?',group_info.group_id);
        setTimeout(() => {
            // 进行群聊广播
            groupBroadcast({
                sender_id:null,
                receiver_id:group_id,
                content:user_info.username + '加入了群聊',
                media_type:'通知',
                file_size:null,
                room_id:group_info.room_id,
                type:'群聊'
            })
        },10)

        return { ok:affectedRows };
    }
}
// 新建房间
async function AddRoom(type){
    const add_sql = 'INSERT INTO room VALUES(NULL,?)';
    const [affectedRows] = await db.query(add_sql,type);
    if(affectedRows){
        const select_sql = 'SELECT LAST_INSERT_ID() AS room_id';
        const [[room_info]] = await db.query(select_sql); 
        return room_info;
    }
}

// 群等级设置 ? 最大7级 
async function GroupLevelSet(req,res){
    const { group_level_list,group_id } = req.body;
    const {user_id} = req.parse;
    // 用户必须是管理员或者群主
    const is_manager_sql = 'SELECT * FROM group_members WHERE user_id=? AND group_id=? AND position IN ("群主","管理员")';
    const [[is_manager]] = await db.query(is_manager_sql,[user_id,group_id]);
    if(!is_manager) return res.send({code:201,msg:'你无权进行操作！'});
    for(let i = 1; i <= 7; i ++){
        const level_item = group_level_list['level_' + i];
        if(!level_item) continue;
        await db.query('UPDATE group_level SET level_name=? WHERE group_id=? AND level=?',[level_item.level_name,group_id,level_item.level]);
    }
    res.send({code:200,data:{msg:'群等级调整成功'}})
}

// 群聊相册列表
async function GroupPhotoList(req,res){
    const { group_id } = req.body;
    // 查询相册
    const [group_photo_list] = await db.query('SELECT * FROM group_photo WHERE group_id=?',group_id);
    // 查询相册中的图片
    const result = await Promise.all(group_photo_list.map(async photo => {
        const [image_list] = await db.query('SELECT * FROM group_photo_image WHERE photo_id=?',photo.photo_id);
        photo.image_list = image_list;
        return image_list
    }))
    if(result){
        res.send({ code:200,data:{ group_photo_list } });
    }else{
        res.send({ code:201,msg:'群相册查询过程中出现问题' });
    }
}
// 群聊相册创建 创建相册→将图片上传到相册中
async function GroupPhotoCreate(req,res){
    const { group_id,photo_name,photo_desc } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('INSERT INTO group_photo(group_id,photo_name,photo_desc,photo_size,creator_id) VALUES(?,?,?,0,?)',[group_id,photo_name,photo_desc,user_id])
    if(affectedRows){
        res.send({ code:200,data:{ msg:'群相册创建成功' } });
    }else{
        res.send({ code:201,msg:'群相册创建失败！' });
    }
}   
// 群聊相册删除
async function GroupPhotoDelete(req,res){
    const { photo_id } = req.body;
    const { user_id } = req.parse;
    // 进行身份校验 只有群主/管理员/图片创建者 有权限对图片进行删除
    const [[{creator_id}]] = await db.query('SELECT creator_id FROM group_photo WHERE photo_id=? AND creator_id=?',[photo_id,user_id]);
    const [[isMasterOrManager]] = await db.query('SELECT * FROM group_members WHERE user_id=? AND position IN ("群主","管理员")',user_id);
    if(!creator_id && !isMasterOrManager) return res.send({code:201,msg:'你无权对该相册进行删除！'}); 
    // 删除相册中的图片
    await db.query('DELETE FROM group_photo_image WHERE photo_id=?',photo_id);
    // 删除相册
    const [{affectedRows}] = await db.query('DELETE FROM group_photo WHERE photo_id=?',photo_id);
    if(affectedRows){
        res.send({code:200,data:{msg:'群相册删除成功'}}); 
    }else{
        res.send({code:201,msg:'群相册删除失败'}); 
    }
}
// 群聊相册图片添加 
async function GroupPhotoAppend(req,res){
    const { photo_id,image } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('INSERT INTO group_photo_image(photo_id,image,user_id,upload_at) VALUES(?,?,?,NOW())',[photo_id,image,user_id]);
    if(affectedRows){
        const [{affectedRows}] = await db.query('UPDATE group_photo SET photo_size=photo_size+1 WHERE photo_id=?',[photo_id]);
        if(affectedRows){
            res.send({ code:200,data:{ msg:'群相册图片上传成功' } });
        }else{
            res.send({ code:201,msg:'群相册图片上传成功,但在更新统计数据时失败！' });
        }
    }else{
        res.send({ code:201,msg:'群相册图片上传失败！' });
    }
}
// 群聊相册图片删除
async function GroupPhotoRemove(req,res){
    const { photo_id,image_id } = req.body;
    const { user_id } = req.parse;
    // 进行身份校验 只有群主/管理员/图片创建者 有权限对图片进行删除
    const [[{upload_id}]] = await db.query('SELECT upload_id FROM group_photo_image WHERE photo_id=? AND image_id=? AND upload_id=?',[photo_id,image_id,user_id]);
    const [[isMasterOrManager]] = await db.query('SELECT * FROM group_members WHERE user_id=? AND position IN ("群主","管理员")',user_id);
    if(!upload_id && !isMasterOrManager) return res.send({code:201,msg:'你无权对该图片进行删除！'}); 
    // 校验通过，进行删除
    const [{affectedRows}] = await db.query('DELETE FROM group_photo_image WHERE photo_id=? AND image_id=?',[photo_id,image_id]);
    if(affectedRows){
        const [{affectedRows}] = await db.query('UPDATE group_photo SET photo_size=photo_size-1 WHERE photo_id=?',[photo_id]);
        if(affectedRows){
            res.send({code:200,data:{msg:'群相册图片删除成功'}}); 
        }else{
            res.send({code:201,msg:'群相册图片删除成功，但更新统计数据时失败！'}); 
        }
    }else{
        res.send({code:201,msg:'群相册图片删除失败'}); 
    }
}
// 群聊文件添加
async function GroupFileAppend(req,res){
    const { group_id,file_name,file_type,file_size } = req.body;
    const { user_id } = req.parse; 

    // 在开始上传文件之前，需要检查群文件空间是否足够
    const [[{current_size,storage_size}]] = await db.query('SELECT current_size,storage_size FROM group_file_statistics WHERE group_id=?',[group_id]);
    if(current_size + file_size > storage_size){
        return res.send({ code:201,msg:'群文件容量已达上限！请进行扩容或删除其他文件' });
    }
    const [{affectedRows}] = await db.query('INSERT INTO group_file(group_id,file_name,file_type,file_size,upload_id,download_total,created_at) VALUES(?,?,?,?,?,0,NOW())',[  group_id,file_name,file_type,file_size,user_id]);
    // 增加容量占用
    await db.query('UPDATE group_statistics SET file_length=file_length+1,current_size=current_size+?',file_size);

    if(affectedRows){
        res.send({ code:200,data:{ msg:'群文件上传成功' } });
    }else{
        res.send({ code:201,msg:'群文件上传失败！' });
    }
}
// 群聊文件删除
async function GroupFileRemove(req,res){
    const { file_id,group_id } = req.body;
    const { user_id } = req.parse;
    // 进行身份校验 只有群主/管理员/文件上传者 有权限对文件进行删除
    const [[{upload_id}]] = await db.query('SELECT upload_id FROM group_file WHERE file_id=? AND group_id=? AND upload_id=?',[file_id,group_id,user_id]);
    const [[isMasterOrManager]] = await db.query('SELECT * FROM group_members WHERE user_id=? AND position IN ("群主","管理员")',user_id);
    if(!upload_id && !isMasterOrManager) return res.send({code:201,msg:'你无权对该文件进行删除！'}); 

    const [[{file_size}]] = await db.query('SELECT * FROM group_file WHERE file_id=?',file_id)
    // 删除文件
    const [{affectedRows}] = await db.query('DELETE FROM group_file WHERE file_id=?',file_id);
    // 释放空间占用
    await db.query('UPDATE group_statistics SET file_length=file_length-1,current_size=current_size-?',file_size);

    if(affectedRows){
        res.send({code:200,data:{msg:'群文件删除成功'}}); 
    }else{
        res.send({code:201,msg:'群文件删除失败'}); 
    }
}
// 群聊文件列表
async function GroupFileList(req,res){
    const { group_id } = req.body;
    const [group_file_list] = await db.query('SELECT * FROM group_file WHERE group_id=?',group_id);
    res.send({ code:200,data:{ group_file_list } })
}
module.exports = {
    SearchGroup,
    GroupList,
    GroupInfo,
    CreateGroup,
    UpdateGroup,
    DisbandGroup,
    SetGroup,
    SetPosition,
    RemoveMember,
    GroupRequest,
    SendGroupRequest,
    inviteGroupRequest,
    ReplySendGroupRequest,
    ReplyInviteGroupRequest,
    LeaveGroup,
    UpdateGroupLevelName,
    // 群等级设置
    GroupLevelSet,
    // 群公告,
    AnnounceAppend,
    AnnounceList,
    // 用户禁言
    BanTalkGroup,
    // 与群相册与文件相关
    GroupPhotoCreate,
    GroupPhotoAppend,
    GroupPhotoList,
    GroupPhotoRemove,
    GroupPhotoDelete,
    GroupFileAppend,
    GroupFileList,
    GroupFileRemove
}