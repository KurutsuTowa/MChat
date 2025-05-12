const db = require('./db')
const { generateToken } = require('../utils/jwt');
const user = require('../api/user');

// 获取贴纸
async function UserGetSticker(user_id,sticker_id,used=0){
    const rarity_role = {
        '普通':1,
        '稀有':2,
        '史诗':3,
        '传说':4,
    }
    const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker_id);
    // 获取贴纸
    await db.query('INSERT INTO user_stickers(user_id,sticker_id,get_at,used) VALUES(?,?,NOW(),?)',[user_id,sticker_id,used]);
    // 更新统计数据
    await db.query('UPDATE user_stickers_info SET point=point+? WHERE user_id=?',[rarity_role[sticker_info.rarity],user_id]);
}
// 判断用户群等级并进行更新
async function UserLevelUpdate(user_id,group_id){
    let level = 1;
    const [[{exp}]] = await db.query('SELECT * FROM group_members WHERE user_id=? AND group_id=?',[user_id,group_id]);
    console.log('exp' + exp)
    // 进行等级判断
    if(exp < 30){
        level = 1;
    }else if(exp < 100){
        level = 2;
    }else if(exp < 200){
        level = 3;
    }else if(exp < 400){
        level = 4;
    }else if(exp < 700){
        level = 5;
    }else if(exp < 1000){
        level = 6;
    }else if(exp >= 1000){
        level = 7;
    }

    // 进行等级更新
    await db.query('UPDATE group_members SET level=? WHERE user_id=? AND group_id=?',[level,user_id,group_id]);

}

// 使用贴纸
async function UseSticker(req,res){
    console.log(1123)
    const {user_sticker_id} = req.body;
    const { user_id } = req.parse;
    const [[{sticker_id}]] = await db.query('SELECT sticker_id FROM user_stickers WHERE user_sticker_id=? AND user_id=?',[user_sticker_id,user_id]);
    await db.query('UPDATE user_stickers SET used=0 WHERE user_id=?',user_id);
    const [{affectedRows}] = await db.query('UPDAtE user_stickers SET used=1 WHERE user_id=? AND user_sticker_id=?',[user_id,user_sticker_id]);
    if(affectedRows){
        return res.send({ code:200,data:{msg:'使用贴纸成功'} })
    }else{
        return res.send({ code:201,msg:'使用贴纸失败' })
    }

}
// 登录 √
async function Login(req,res){
    const { account,password } = req.body;
    const have_sql = 'SELECT * FROM user WHERE account=?';
    const [[have_account]] = await db.query(have_sql,account);
    if(!have_account) return res.send({ code:201,msg:'账号不存在！' }) ;

    const auth_sql = 'SELECT * FROM user WHERE account=? AND password=?';
    const [[auth_account]] = await db.query(auth_sql,[account,password]);
    if(auth_account){
        return res.send({ code:200,data:{ token:generateToken(auth_account) }});
    }else{
        return res.send({ code:201,msg:'密码错误！' });
    }
}
// 注册 √
async function Register(req,res){
    const { account,password } = req.body;
    const have_sql = 'SELECT * FROM user WHERE account=?';
    const [[have_account]] = await db.query(have_sql,account);
    if(have_account) return res.send({ code:201,msg:'账号已存在！' }) ;

    const add_sql = 'INSERT INTO user(user_id,account,password) VALUES(NULL,?,?)'
    const [ { affectedRows} ] = await db.query(add_sql,[account,password]);
    const [[{user_id}]] = await db.query('SELECT LAST_INSERT_ID() AS user_id');
    // 获取默认贴纸 并使用它
    await db.query('INSERT INTO user_stickers VALUES(NULL,?,1,NOW(),1)',user_id);
    // 插入贴纸统计记录
    await db.query('INSERT INTO user_stickers_info VALUES(?,1)',user_id);
    // 给新用户限时赠送稀有贴纸(30天后过期)
    await db.query('INSERT INTO user_mail(user_id,mail_content,mail_item,status,created_at,expire_at) VALUES(?,?,?,?,NOW(),DATE_ADD(NOW(), INTERVAL 30 DAY))',[user_id,'欢迎你,新用户,我给你准备了一份礼物',2,'生效']);

    if(affectedRows == 0){
        return res.send({ code:201,msg:'注册失败' })
    }else{
        const info_sql = 'SELECT * FROM user WHERE account=? AND password=?';
        const [[user_info]] = await db.query(info_sql,[account,password]);
        const token = generateToken(user_info);
        res.send({ code:200,data:{ token } });
    }
}
// 修改用户个人空间卡片
async function UpdateSpaceCard(req,res){
    const { space_background } = req.body;
    const {user_id} = req.parse;
    const [{affectedRows}] = await db.query('UPDATE user SET space_background=? WHERE user_id=?',[space_background,user_id]);
    if(affectedRows){
        return res.send({ code:200,data:{msg:'修改成功' }})
    }else{
        return res.send({ code:201,msg:'修改失败' })
    }
}
// 更换头像
async function UpdateUserAvatar(req,res){
    const { avatar } = req.body;
    const {user_id} = req.parse;
    const [{affectedRows}] = await db.query('UPDATE user SET avatar=? WHERE user_id=?',[avatar,user_id]);
    if(affectedRows){
        return res.send({ code:200,data:{msg:'修改成功' }})
    }else{
        return res.send({ code:201,msg:'修改失败' })
    }
}
// 访问邮件列表
async function UserMailList(req,res){
    const { user_id } = req.parse;
    const [mail_list] = await db.query('SELECT * FROM user_mail WHERE user_id=?',user_id);
    // 获取邮件携带物的信息
    await Promise.all(mail_list.map(async mail => {
        // 检查邮件是否过期，如果过期，将邮件状态变更为过期
        await db.query('UPDATE user_mail SET status="过期" WHERE NOW() >= expire_at AND mail_id=? AND user_id=?',[mail.mail_id,user_id]);
        const [[stickers_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',mail.mail_item);
        mail.stickers_info = stickers_info;
    }))
    res.send({code:200,data:{mail_list}});
}
// 回应邮件，使邮件失效(已领取/已读)
async function UserMailReply(req,res){
    const {mail_id} = req.body;
    const {user_id} = req.parse;

    const [[mail_info]] = await db.query('SELECT * FROM user_mail WHERE mail_id=? AND user_id=? ',[mail_id,user_id]);

    // 检查邮件是否失效
    if(mail_info.status == '失效') return res.send({code:201,data:{msg:'邮件已失效'}});
    // 检查邮件是否过期
    await db.query('UPDATE user_mail SET status="过期" WHERE NOW() >= expire_at AND mail_id=? AND user_id=?',[mail_id,user_id]);
    const [[isOuttime]] = await db.query('SELECT * FROM user_mail WHERE mail_id=? AND user_id=? AND status="过期"',[mail_id,user_id]);
    if(isOuttime) return res.send({code:201,data:{msg:'邮件已过期'}});


    // 如果邮件有携带物，则添加给用户
    if(mail_info.mail_item) {
        await UserGetSticker(user_id,mail_info.mail_item)
    }
    const [{affectedRows}] = await db.query('UPDATE user_mail SET status="失效" WHERE mail_id=? AND user_id=?',[mail_id,user_id]);
    if(affectedRows){
        res.send({code:200,data:{msg:'已处理'}})
    }else{
        res.send({code:200,data:{msg:'处理失败'}})
    }

}


// 获取用户基本信息 √ 一般来说，此用户信息是通过用户token获取的个人，返回的信息更详细
async function UserInfo(req,res){
    const { user_id } = req.parse;
    const info_sql = 'SELECT * FROM user WHERE user_id=?';
    const [[user_info]] = await db.query(info_sql,[user_id]);
    // 将用户tag包含其中
    const [ user_tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',user_id);
    user_info.tags = user_tags;
    res.send({ code:200,data:{ user_info } });
}
// 根据id获取用户信息 √ 正常情况下返回的信息不该有账号密码等私密信息，但目前为开发环境，与前者返回结果没有区别
async function UserInfoById(req,res){
    const { user_id } = req.body;
    const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',user_id);
    // 将用户tag包含其中
    const [ user_tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',user_id);
    user_info.tags = user_tags;
    res.send({ code:200,data:{user_info} });
}
// 搜索用户 √
async function SearchUser(req,res){
    const { keywords } = req.body;
    const search_sql = 'SELECT * FROM user WHERE account=? OR username like ? OR user_id=?';
    const [user_list] = await db.query(search_sql,[keywords,'%' + keywords + '%',keywords]);
    res.send({ code:200,data:{ user_list } });
}
// 发现用户 根据tag/年龄/性别提供随机用户
async function FindUser(req, res) {
    let { tags, age, gender } = req.body;
    let user_list = [];
    age = age || '保密';
    gender = gender || '保密';
    // 根据标签筛选用户
    if (tags && tags.length > 0) {
        const [tagUsers] = await db.query('SELECT DISTINCT user_id FROM user_tag WHERE tag_name IN (?)', [tags]);
        user_list = tagUsers.map(user => user.user_id);
    }

    // 根据年龄筛选用户
    if (age) {
        const [ageUsers] = await db.query('SELECT user_id FROM user WHERE age = ?', [age]);
        if (user_list.length === 0) {
            user_list = ageUsers.map(user => user.user_id);
        } else {
            user_list = user_list.filter(userId => ageUsers.some(user => user.user_id === userId));
        }
    }

    // 根据性别筛选用户
    if (gender) {
        const [genderUsers] = await db.query('SELECT user_id FROM user WHERE gender = ?', [gender]);
        if (user_list.length === 0) {
            user_list = genderUsers.map(user => user.user_id);
        } else {
            user_list = user_list.filter(userId => genderUsers.some(user => user.user_id === userId));
        }
    }

    // 获取用户详细信息
    if (user_list.length > 0) {
        const [list] = await db.query('SELECT * FROM user WHERE user_id IN (?) LIMIT 100', [user_list]);
        user_list = list;
        // 获取用户的标签
        for (let user of user_list) {
            const [tags] = await db.query('SELECT * FROM user_tag WHERE user_id = ?', [user.user_id]);
            user.tags = tags;
        }
    }
    // 返回筛选后的用户列表
    res.send({
        code: 200,
        data: {user_list}
    });
}

// 用户黑名单列表
async function UserBanList(req,res){
    const {user_id} = req.parse;
    const [user_ban_list] = await db.query('SELECT * FROM user_ban JOIN user ON user_ban.ban_user_id=user.user_id WHERE user_ban.user_id=?',user_id);
    res.send({code:200,data:{user_ban_list}});
}
// 用户黑名单添加 √
async function UserBanAppend(req,res){
    const {user_id} = req.body;
    const self_id = req.parse.user_id;
    const [[exist]] = await db.query('SELECT * FROM user_ban WHERE user_id=? AND ban_user_id=?',[self_id,user_id]);
    if(exist)return res.send({code:201,msg:'对方已在黑名单中'});
    await db.query('INSERT INTO user_ban VALUES(?,?,NOW())',[self_id,user_id]);
    res.send({code:200,data:{msg:'成功添加到黑名单'}});
}
// 用户黑名单移出 √
async function UserBanRemove(req,res){
    const {user_id} = req.body;
    const self_id = req.parse.user_id;
    await db.query('DELETE FROM user_ban WHERE user_id=? AND ban_user_id=?',[self_id,user_id]);
    res.send({code:200,data:{msg:'成功移出黑名单'}});
}
// 好友访问个人空间的权限 √
async function UserSpaceAuthByFriend(req,res){
    const {friend_id,space_auth} = req.body;
    const {user_id} = req.parse;
    const [{affectedRows}] = await db.query('UPDATE friend SET space_auth=? WHERE friend_id=? AND user_id=?',[space_auth,friend_id,user_id]);
    if(affectedRows){
        res.send({ code:200,data:{ msg:'设置成功' } });
    }else{
        res.send({ code:201,msg:'设置失败' });
    }
}
// 个人空间全局访问权限 √
async function UserSpaceAuthByGlobal(req,res){
    const {space_auth} = req.body;
    const {user_id} = req.parse;
    const [{affectedRows}] = await db.query('UPDATE user SET space_auth=? WHERE user_id=?',[space_auth,user_id]);
    if(affectedRows){
        res.send({ code:200,data:{ msg:'设置成功' } });
    }else{
        res.send({ code:201,msg:'设置失败' });
    }
}
// 用户空间 √
async function UserSpace(req,res){
    const { user_id } = req.body;
    const self_id = req.parse.user_id;
    // 获取用户基本信息
    const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',user_id);
    // 将用户tag包含其中
    const [ user_tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',user_id);
    user_info.tags = user_tags;
    // 获取用户的动态信息
    const [user_moments_list] = await db.query('SELECT * FROM user_moments WHERE user_id=? ORDER BY created_at DESC',user_id);
    // 获取每条动态的媒体和回复
    await Promise.all(user_moments_list.map(async user_moments => {
        user_moments.user_info = user_info;
        // 获取点赞
        const [thumb_list] = await db.query('SELECT * FROM user_moments_thumb JOIN user ON user_moments_thumb.user_id=user.user_id WHERE moments_id=?',[user_moments.moments_id])
        // 获取媒体
        const [media_list] = await db.query('SELECT * FROM user_moments_media WHERE moments_id=?',user_moments.moments_id);
        // 获取回复
        const [reply_list] = await db.query('SELECT * FROM user_moments_reply WHERE moments_id=?  ORDER BY created_at DESC',user_moments.moments_id)
        // 获取每条回复的用户信息
        await Promise.all(reply_list.map(async reply => {
            // 获取回复者信息
            const [[reply_user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',reply.reply_user_id);
            // 获取被回复者信息(如果有)
            if(reply.received_user_id){
                const [[received_user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',reply.received_user_id);
                reply.received_user_info = received_user_info;
            }
            reply.reply_user_info = reply_user_info;
        }))
        user_moments.thumb_list = thumb_list;
        user_moments.media_list = media_list;
        user_moments.reply_list = reply_list;
    }))
    // 获取用户的相册
    const [user_photo_list] = await db.query('SELECT * FROM user_photo WHERE user_id=?',user_id);
    // 获取每个相册中的图片
    await Promise.all(user_photo_list.map(async user_photo => {
        const [image_list] = await db.query('SELECT * FROM user_photo_image WHERE photo_id=? ORDER BY upload_at DESC',user_photo.photo_id);
        user_photo.image_list = image_list;
    }))
    // 获取访客记录
    const [visit_list] = await db.query('SELECT * FROM user_space_visit WHERE user_id=?',user_id);
    Promise.all(visit_list.map(async visit_user => {
        const [[visit_info]] = await db.query('SELECT user_id,username,avatar FROM user WHERE user_id=?',visit_user.visit_id);
        visit_user.visit_info = visit_info;
    }))
    // 用户空间权限校验
    const [[{space_auth}]] = await db.query('SELECT space_auth FROM user WHERE user_id=?',user_id);
    const [[isFriend]] = await db.query('SELECT * FROM friend WHERE user_id=? AND friend_id=?',[user_id,self_id]);
    if(user_id != self_id){
        if(space_auth == 'onlyFriend' && !isFriend){
            return res.send({code:200,data:{user_space:{ pass:false,user_info,msg:'对方设置了权限,仅好友能访问个人空间'}}})
        }else if(space_auth == 'noPass'){
            return res.send({code:200,data:{user_space:{pass:false,user_info,msg:'对方已禁止所有用户访问其个人空间'}}})
        }else if(space_auth == 'onlyRequest' && isFriend && isFriend.space_auth == 'default'){
            return res.send({code:200,data:{user_space:{pass:false,user_info,msg:'对方仅允许特定好友访问其个人空间'}}})
        }else if(isFriend?.space_auth == 'noPass'){
            return res.send({code:200,data:{user_space:{pass:false,user_info,msg:'对方没有允许你访问其个人空间'}}})
        }
    }

    // 将所有信息打包成一个对象
    const user_space = {
        user_info,
        user_moments_list,
        user_photo_list,
        user_visit_list:visit_list,
    };
    // 如果访问用户不是自身，留下访客记录
    const [[isVisited]] = await db.query('SELECT * FROM user_space_visit WHERE user_id=? AND visit_id=?',[user_id,self_id]);
    if(isVisited){
        await db.query('UPDATE user_space_visit SET visited_at=NOW()');
    }else{
        await db.query('INSERT INTO user_space_visit VALUES(?,?,NOW())',[user_id,self_id]);
    }
    res.send({ code:200,data:{ user_space } });
}
// 用户空间动态查询 √
async function UserSpaceMomentsList(req,res){
    const { user_id } = req.body;
    const self_id = req.parse.user_id;

    // 用户空间权限校验
    const [[{space_auth}]] = await db.query('SELECT space_auth FROM user WHERE user_id=?',user_id);
    const [[isFriend]] = await db.query('SELECT * FROM friend WHERE user_id=? AND friend_id=?',[user_id,self_id]);
    if(user_id != self_id){
        if(space_auth == 'onlyFriend' && !isFriend){
            return res.send({code:200,data:{user_space:{ pass:false,user_info,msg:'对方设置了权限,仅好友能访问个人空间'}}})
        }else if(space_auth == 'noPass'){
            return res.send({code:200,data:{user_space:{pass:false,user_info,msg:'对方已禁止所有用户访问其个人空间'}}})
        }else if(space_auth == 'onlyRequest' && isFriend && isFriend.space_auth == 'allow'){
            return res.send({code:200,data:{user_space:{pass:false,user_info,msg:'对方仅允许特定好友访问其个人空间'}}})
        }else if(isFriend?.space_auth == 'noPass'){
            return res.send({code:200,data:{user_space:{pass:false,user_info,msg:'对方没有允许你访问其个人空间'}}})
        }
    }

    // 获取用户的动态信息
    const [user_moments_list] = await db.query('SELECT * FROM user_moments WHERE user_id=? ORDER BY created_at DESC',user_id);
    // 获取用户自身信息
    const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',user_id);
    // 获取每条动态的媒体、回复、点赞数
    await Promise.all(user_moments_list.map(async user_moments => {
        // 获取点赞
        const [thumb_list] = await db.query('SELECT * FROM user_moments_thumb WHERE moments_id=?',user_moments.moments_id);
        // 获取媒体
        const [media_list] = await db.query('SELECT * FROM user_moments_media WHERE moments_id=?',user_moments.moments_id);
        // 获取回复
        const [reply_list] = await db.query('SELECT * FROM user_moments_reply WHERE moments_id=?',user_moments.moments_id)
        // 获取每条回复的用户信息
        await Promise.all(reply_list.map(async reply => {
            // 获取回复者信息
            const [[reply_user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',reply.reply_user_id);
            // 获取被回复者信息(如果有)
            if(reply.received_user_id){
                const [[received_user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',reply.received_user_id);
                reply.received_user_info = received_user_info;
            }
            reply.reply_user_info = reply_user_info;
        }))
        user_moments.user_info = user_info;
        user_moments.thumb_list = thumb_list;
        user_moments.media_list = media_list;
        user_moments.reply_list = reply_list;
    }))
    res.send({ code:200,data:{ user_moments_list,pass:true } });
}
// 用户空间动态发布  √
async function UserSpaceMomentsAppend(req,res){
    const {content,moments_media_list} = req.body;
    const { user_id } = req.parse;
    // 发布动态
    await db.query('INSERT INTO user_moments(user_id,content,thumb_up_count,reply_count,created_at) VALUES(?,?,0,0,NOW())',[user_id,content])
    const [[{moments_id}]] = await db.query('SELECT LAST_INSERT_ID() AS moments_id');
    // 将媒体录入数据库
    Promise.all(moments_media_list.map(async moments_media => {
        return await db.query('INSERT INTO user_moments_media(moments_id,src,media_type) VALUES(?,?,?)',[moments_id,moments_media.filename,moments_media.media_type])
    }))
    res.send({code:200,data:{msg:'动态发布成功'}})
}
// 用户空间动态删除 √
async function UserSpaceMomentsRemove(req,res){
    const {moments_id} = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('DELETE FROM user_moments WHERE moments_id=? AND user_id=?',[moments_id,user_id]);
    if(affectedRows){
        // 将动态关联的图片删除
        await db.query('DELETE FROM user_moments_media WHERE moments_id=?',[moments_id]);
        res.send({code:200,data:{msg:'动态删除成功'}})
    }
}
// 用户空间动态回复 √
async function UserSpaceMomentsReply(req,res){
    const {moments_id,content,received_user_id} = req.body;
    const {user_id} = req.parse;
    const [{affectedRows}] = await db.query('INSERT INTO user_moments_reply(moments_id,reply_user_id,received_user_id,content,created_at) VALUES(?,?,?,?,NOW())',[moments_id,user_id,received_user_id || null,content]);
    if(affectedRows){
        res.send({ code:200,data:{ msg:'动态回复成功' } });
    }else{
        res.send({ code:201,msg:'动态回复失败！' });
    }
}
// 用户空间动态回复列表 √
async function UserSpaceMomentsReplyList(req,res){
    const {moments_id} = req.body;
    // 获取回复
    const [reply_list] = await db.query('SELECT * FROM user_moments_reply WHERE moments_id=? ORDER BY created_at DESC',moments_id)
    // 获取每条回复的用户信息
    await Promise.all(reply_list.map(async reply => {
        // 获取回复者信息
        const [[reply_user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',reply.reply_user_id);
        // 获取被回复者信息(如果有)
        if(reply.received_user_id){
            const [[received_user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',reply.received_user_id);
            reply.received_user_info = received_user_info;
        }
        reply.reply_user_info = reply_user_info;
    }))
    res.send({ code:200,data:{ reply_list } });
}
// 用户空间点赞/取消点赞 √
async function UserSpaceMomentsThumbToggle(req,res){
    const {moments_id,thumb_up} = req.body;
    const {user_id} = req.parse;
    const [[is_thumb_up]] = await db.query('SELECT * FROM user_moments_thumb WHERE moments_id=? AND user_id=?',[moments_id,user_id]);
    // 如果用户已经点赞，则取消点赞
    if(is_thumb_up){
        await db.query('UPDATE user_moments SET thumb_up_count=thumb_up_count-1 WHERE moments_id=?',moments_id)
        const [{affectedRows}] = await db.query('DELETE FROM user_moments_thumb WHERE moments_id=? AND user_id=?',[moments_id,user_id])
        if(affectedRows){
            res.send({ code:200,data:{ msg:'已取消点赞' } });
        }else{
            res.send({ code:201,msg:'取消点赞失败！' });
        }
    }else{
        await db.query('UPDATE user_moments SET thumb_up_count=thumb_up_count+1 WHERE moments_id=?',moments_id)
        const [{affectedRows}] = await db.query('INSERT INTO user_moments_thumb(moments_id,user_id,created_at) VALUES(?,?,NOW())',[moments_id,user_id])
        if(affectedRows){
            res.send({ code:200,data:{ msg:'已点赞' } });
        }else{
            res.send({ code:201,msg:'点赞失败！' });
        }
    }
}
// 用户空间点赞记录 √
async function UserSpaceMomentsThumbList(req,res){
    const {moments_id} = req.body;
    const [thumb_list] = await db.query('SELECT * FROM user_moments_thumb JOIN user ON user_moments_thumb.user_id=user.user_id WHERE moments_id=?',[moments_id])
    res.send({ code:200,data:{thumb_list} });
}
// 用户空间访客记录 √
async function UserSpaceVisitList(req,res){
    const {user_id} = req.body;
    const [visit_list] = await db.query('SELECT * FROM user_space_visit WHERE user_id=?',user_id);
    Promise.all(visit_list.map(async visit_user => {
        visit_user.visit_info = await db.query('SELECT user_id,username,avatar');
    }))
    res.send({code:200,data:{visit_list}});
}


// 个人相册创建 √ 创建相册→将图片上传到相册中
async function UserPhotoCreate(req,res){
    const { photo_name,photo_desc,photo_cover } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('INSERT INTO user_photo(user_id,photo_name,photo_desc,photo_size,photo_cover) VALUES(?,?,?,0,?)',[user_id,photo_name,photo_desc,photo_cover])
    if(affectedRows){
        res.send({ code:200,data:{ msg:'个人相册创建成功' } });
    }else{
        res.send({ code:201,msg:'个人相册创建失败！' });
    }
}   
// 个人相册图片添加 √
async function UserPhotoAppend(req,res){
    const { photo_id,image } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('INSERT INTO user_photo_image(photo_id,image,upload_id,upload_at) VALUES(?,?,?,NOW())',[photo_id,image,user_id]);
    if(affectedRows){
        const [{affectedRows}] = await db.query('UPDATE user_photo SET photo_size=photo_size+1 WHERE photo_id=?',[photo_id]);
        if(affectedRows){
            res.send({ code:200,data:{ msg:'个人相册图片上传成功' } });
        }else{
            res.send({ code:201,msg:'个人相册图片上传成功,但在更新统计数据时失败！' });
        }
    }else{
        res.send({ code:201,msg:'个人相册图片上传失败！' });
    }
}
// 个人相册列表 √
async function UserPhotoList(req,res){
    const { user_id } = req.body;
    // 查询相册
    const [user_photo_list] = await db.query('SELECT * FROM user_photo WHERE user_id=?',user_id);
    // 查询相册中的图片
    const result = await Promise.all(user_photo_list.map(async photo => {
        const [image_list] = await db.query('SELECT * FROM user_photo_image WHERE photo_id=? ORDER BY upload_at DESC',photo.photo_id);
        photo.image_list = image_list;
        return image_list
    }))
    if(result){
        res.send({ code:200,data:{ user_photo_list } });
    }else{
        res.send({ code:201,msg:'群相册查询过程中出现问题' });
    }
}
// 个人相册图片删除 √
async function UserPhotoRemove(req,res){
    const { photo_id,image_id } = req.body;
    const { user_id } = req.parse;
    // 该相册所有者必须是用户自身
    const [[is_user_self]] = await db.query('SELECT * FROM user_photo WHERE photo_id=? AND user_id=?',[photo_id,user_id]);
    if(!is_user_self) return res.send({ code:201,msg:'你无法删除其他用户的相册图片！' });
    const [{affectedRows}] = await db.query('DELETE FROM user_photo_image WHERE photo_id=? AND image_id=?',[photo_id,image_id]);
    if(affectedRows){
        // 更新统计
        const [{affectedRows}] = await db.query('UPDATE user_photo SET photo_size=photo_size-1 WHERE photo_id=?',[photo_id]);
        if(affectedRows){
            res.send({code:200,data:{msg:'个人相册图片删除成功'}}); 
        }else{
            res.send({code:201,msg:'个人相册图片删除成功，但更新统计数据时失败！'}); 
        }
    }else{
        res.send({code:201,msg:'个人相册图片删除失败'}); 
    }
}
// 个人相册删除 √
async function UserPhotoDelete(req,res){
    const { photo_id } = req.body;
    const { user_id } = req.parse;
    // 该相册所有者必须是用户自身
    const [[is_user_self]] = await db.query('SELECT * FROM user_photo WHERE photo_id=? AND user_id=?',[photo_id,user_id]);
    if(!is_user_self) return res.send({ code:201,msg:'你无法删除其他用户的相册图片！' });
    // 清空相册中的图片
    await db.query('DELETE FROM user_photo_image WHERE photo_id=?',photo_id);
    // 删除相册
    const [{affectedRows}] = await db.query('DELETE FROM user_photo WHERE photo_id=?',photo_id);
    if(affectedRows){
        res.send({code:200,data:{msg:'个人相册删除成功'}}); 
    }else{
        res.send({code:201,msg:'个人相册删除失败'}); 
    }
}
// 个人相册修改 √
async function UserPhotoUpdate(req,res){
    const { photo_name,photo_desc,photo_cover,photo_id } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('UPDATE user_photo SET photo_name=?,photo_desc=?,photo_cover=? WHERE photo_id=? AND user_id=?',[photo_name,photo_desc,photo_cover,photo_id,user_id])
    if(affectedRows){
        res.send({ code:200,data:{ msg:'个人相册修改成功' } });
    }else{
        res.send({ code:201,msg:'个人相册修改失败！' });
    }
}




// 修改信息 √
async function UserUpdate(req,res){
    const { user_id } = req.parse;
    const { avatar,space_background,username,phone,age,born_at,gender,introduce } = req.body;
    const update_sql = 'UPDATE user SET avatar=?,space_background=?,username=?,age=?,born_at=?,gender=?,introduce=?,phone=? WHERE user_id =?';
    const [affectedRows] = await db.query(update_sql,[avatar,space_background,username,age,new Date(born_at),gender,introduce,phone,user_id]);
    if(affectedRows){
        res.send({ code:200,data:{ msg:'修改成功' } })
    }else{
        res.send({ code:201,msg:'修改失败' })
    }
}
// 获取前n个热门用户标签 √
async function UserTagTop(req,res){
    const { count } = req.body;
    const [ hot_user_tags ] = await db.query('SELECT * FROM user_tag_total JOIN user ON user_tag_total.creator_id=user.user_id ORDER BY total DESC LIMIT ?',count || 100);
    res.send({ code:200,data:{ hot_user_tags } });
}
// 获取用户的标签 √
async function UserTagInfo(req,res){
    const { user_id } = req.body;
    const [ user_tags ] = await db.query('SELECT * FROM user_tag WHERE user_id=?',user_id);
    res.send({ code:200,data:{ user_tags } });
}
// 搜索用户标签 √
async function UserTagSearch(req,res){
    const { keywords } = req.body;
    if(!keywords.trim()) return res.send({code:201,msg:'请输入搜索内容！'});
    const [[user_info]] = await db.query('SELECT * FROM user WHERE username=?',keywords);
    const [ user_tags ] = await db.query('SELECT * FROM user_tag_total JOIN user ON user_tag_total.creator_id=user.user_id WHERE creator_id=? OR tag_name like ?',[user_info?.user_id,'%' + keywords + '%']);
    res.send({code:200,data:{user_tags}});
}
// 创建标签 √
async function UserTagAdd(req,res){
    const { tag_name,tag_color,text_color,border_style } = req.body;
    const { user_id } = req.parse;
    const [[have_tag]] = await db.query('SELECT * FROM user_tag_total WHERE tag_name=?',tag_name);
    // 如果已有标签，则将用户指向该标签。如果没有，则创建标签
    if(!have_tag){
        const [{affectedRows}] = await db.query('INSERT INTO user_tag_total(creator_id,tag_name,total,first_tag_color,first_text_color,first_border_style,created_at) VALUES(?,?,0,?,?,?,NOW())',[user_id,tag_name,tag_color,text_color,border_style]);
        if(affectedRows){
            const [{affectedRows}] = await db.query('INSERT INTO user_tag(user_id,tag_name,tag_color,text_color,border_style,created_at) VALUES(?,?,?,?,?,NOW())',[user_id,tag_name,tag_color,text_color,border_style]);
            await db.query('UPDATE user_tag_total SET total=total+1 WHERE tag_name=?',tag_name);
            if(affectedRows){
                res.send({ code:200,data:{ msg:'创建标签成功' } });
            }else{
                res.send({ code:201,msg:'在插入标签时失败！' })
            }
        }else{
            return res.send({ code:201,msg:'在创建标签时失败！' });
        }
    }else{
        const [[is_used]] = await db.query('SELECT * FROM user_tag WHERE tag_name=? AND user_id=?',[tag_name,user_id]);
        if(is_used){
            const [{affectedRows}] = await db.query('UPDATE user_tag SET tag_color=?,text_color=?,border_style=? WHERE tag_name=? AND user_id=?',[tag_color,text_color,border_style,tag_name,user_id]);
            if(affectedRows){
                res.send({code:200,data:{msg:'存在该标签，且在使用中，已修改样式'}})
            }else{
                res.send({code:201,msg:'存在该标签，且在使用中，修改样式失败'})
            }
        }else{
            const [{affectedRows}] = await db.query('INSERT INTO user_tag(user_id,tag_name,tag_color,text_color,border_style,created_at) VALUES(?,?,?,?,?,NOW())',[user_id,tag_name,tag_color,text_color,border_style]);
            if(affectedRows){
                res.send({code:200,data:{msg:'存在该标签，已使用'}})
            }else{
                res.send({code:201,msg:'存在该标签，使用时失败'})
            }
        }
    }

}
// 获取用户创建的所有标签 √
async function UserCreateTagList(req,res){
    const { user_id } = req.parse;
    const [ user_tags ] = await db.query('SELECT * FROM user_tag_total JOIN user ON user_tag_total.creator_id=user.user_id WHERE creator_id=?',user_id);
    res.send({ code:200,data:{ user_tags } });
}
// 修改用户使用中的标签 √
async function UserTagUpdate(req,res){
    const { tag_name,tag_color,text_color,border_style } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('UPDATE user_tag SET tag_color=?,text_color=?,border_style=? WHERE tag_name=? AND user_id=?',[tag_color,text_color,border_style,tag_name,user_id]);
    if(affectedRows){
        res.send({ code:200,data:{ msg:'修改使用标签样式成功' } });
    }else{
        res.send({ code:201,msg:'修改使用标签样式失败！' })
    }
}
// 使用标签 √
async function UserTagUse(req,res){
    const { tag_name,tag_color,text_color,border_style } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('INSERT INTO user_tag(user_id,tag_name,tag_color,text_color,border_style,created_at) VALUES(?,?,?,?,?,NOW())',[user_id,tag_name,tag_color,text_color,border_style]);
    if(affectedRows){
        const [{affectedRows}] = await db.query('UPDATE user_tag_total SET total=total+1 WHERE tag_name=?',tag_name);
        if(affectedRows){
            res.send({ code:200,data:{ msg:'使用标签成功' } });
        }else{
            res.send({ code:200,data:{ msg:'使用标签成功，但在更新统计数据时失败' } });
        }
    }else{
        res.send({ code:201,msg:'使用标签失败！' })
    }
}
// 移除标签 √
async function UserTagRemove(req,res){
    const { tag_name } = req.body;
    const { user_id } = req.parse;
    const [{affectedRows}] = await db.query('UPDATE user_tag_total SET total=total-1 WHERE tag_name=?',tag_name);
    if(!affectedRows){
        res.send({ code:201,msg:'在减少标签统计数量时失败！' });
    }else{
        // if(total <= 0){
        //     const [{affectedRows}] = await db.query('DELETE FROM user_tag_total WHERE tag_name=?',tag_name)
        //     if(!affectedRows) return res.send({ code:201,msg:'在移除标签时失败！' });
        // }
        const [{affectedRows}] = await db.query('DELETE FROM user_tag WHERE tag_name=? AND user_id=?',[tag_name,user_id]);
        if(affectedRows){
            res.send({ code:200,data:{msg:'移除标签成功！' }});
        }else{
            res.send({ code:201,msg:'在移除用户与标签的关系时失败！' });
        }
    }
}
// 获取随机标签 √
async function UserTagRandomList(req,res){
    const { count } = req.body;
    const [ random_user_tags ] = await db.query('SELECT * FROM user_tag_total JOIN user ON user_tag_total.creator_id=user.user_id ORDER BY RAND() LIMIT ?',count || 100)
    res.send({code:200,data:{random_user_tags}})
}
// 获取用户所有贴纸 √
async function UserStickers(req,res){
    const { user_id } = req.body;
    const [ user_stickers_list ] = await db.query('SELECT * FROM user_stickers WHERE user_id=?',user_id);
    await Promise.all(user_stickers_list.map(async sticker => {
        const [[sticker_info]] = await db.query('SELECT * FROM stickers WHERE sticker_id=?',sticker.sticker_id)
        sticker.sticker_info = sticker_info;
    }))
    res.send({code:200,data:{ user_stickers_list }});
}
// 所有贴纸图鉴 √
async function UserStickersGuide(req,res){
    const [ stickers_list ] = await db.query('SELECT * FROM stickers');
    res.send({code:200,data:{stickers_list}})
}
// 获取用户的贴纸rank √
async function UserStickersInfo(req,res){
    const { user_id } = req.body;
    const [[user_stickers_info]] = await db.query('SELECT * FROM user_stickers_info WHERE user_id=?',user_id)
    res.send({ code:200,data:{user_stickers_info} });
}
// 获取用户贴纸rank排行 √
async function UserStickersRank(req,res){
    const { user_id } = req.body;
    const [user_stickers_rank] = await db.query('SELECT * FROM user_stickers_info ORDER BY point DESC');
    // 遍历排行，获取排行上所有用户的信息
    await Promise.all(user_stickers_rank.map(async rank => {
        const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',rank.user_id);
        rank.user_info = user_info;
    }))
    // 查询到用户在排行中位列第几名
    const [[{self_rank}]] = await db.query('SELECT COUNT(*) AS self_rank FROM user_stickers_info WHERE point > ( SELECT point FROM user_stickers_info WHERE user_id = ? )',user_id)
    const [[{point}]] = await db.query('SELECT point FROM user_stickers_info WHERE user_id=?',user_id)
    // 获取自身的信息
    const [[user_info]] = await db.query('SELECT * FROM user WHERE user_id=?',user_id);
    self_rank.user_info = user_info;

    user_stickers_rank.self_rank = self_rank
    res.send({code:200,data:{user_stickers_rank:{
        list:user_stickers_rank,
        self_rank:{
            point,
            order:self_rank,
            user_info:user_info
        },
    }}});
}
module.exports = {
    UserLevelUpdate,

    FindUser,
    UpdateSpaceCard,
    
    Login,
    Register,
    UserInfo,
    UserInfoById,
    SearchUser,
    UserUpdate,
    UpdateUserAvatar,
    
    // 邮件
    UserMailList,
    UserMailReply,

    // 黑名单
    UserBanList,
    UserBanAppend,
    UserBanRemove,
    
    // 空间
    UserSpaceAuthByFriend,
    UserSpaceAuthByGlobal,
    UserSpace,
    UserSpaceMomentsList,
    UserSpaceMomentsAppend,
    UserSpaceMomentsRemove,
    UserSpaceMomentsReply,
    UserSpaceMomentsReplyList,
    UserSpaceMomentsThumbToggle,
    UserSpaceVisitList,
    UserSpaceMomentsThumbList,

    // 相册
    UserPhotoCreate,
    UserPhotoAppend,
    UserPhotoList,
    UserPhotoRemove,
    UserPhotoDelete,
    UserPhotoUpdate,
    
    // 标签
    UserTagTop,
    UserTagInfo,
    UserTagAdd,
    UserCreateTagList,
    UserTagRemove,
    UserTagSearch,
    UserTagUpdate,
    UserTagUse,
    UserTagRandomList,

    // 贴纸
    UserStickers,
    UserStickersGuide,
    UserStickersInfo,
    UserStickersRank,
    UseSticker,
}