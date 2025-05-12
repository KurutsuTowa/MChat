const express = require('express');
const router = express.Router();
const user = require('../container/user');


module.exports = function(){
    router.post('/login',user.Login)
    router.post('/register',user.Register)
    router.get('/info',user.UserInfo)
    router.post('/info/id',user.UserInfoById)
    router.post('/search',user.SearchUser)
    router.post('/space/card/update',user.UpdateSpaceCard)
    router.post('/avatar/update',user.UpdateUserAvatar)
    router.post('/update/info',user.UserUpdate)
    // 发现好友
    router.post('/find',user.FindUser)
    // 邮件
    router.post('/mail/list',user.UserMailList);
    router.post('/mail/reply',user.UserMailReply);
    // 黑名单
    router.post('/ban/list',user.UserBanList)
    router.post('/ban/add',user.UserBanAppend)
    router.post('/ban/remove',user.UserBanRemove)
    // 用户空间
    router.post('/space/auth/friend',user.UserSpaceAuthByFriend)
    router.post('/space/auth/global',user.UserSpaceAuthByGlobal)
    router.post('/space',user.UserSpace)
    router.post('/space/moments',user.UserSpaceMomentsList)
    router.post('/space/moments/append',user.UserSpaceMomentsAppend)
    router.post('/space/moments/remove',user.UserSpaceMomentsRemove)
    router.post('/space/moments/reply',user.UserSpaceMomentsReply)
    router.post('/space/moments/reply/list',user.UserSpaceMomentsReplyList)
    router.post('/space/moments/thumb',user.UserSpaceMomentsThumbToggle)
    router.post('/space/moments/thumb/list',user.UserSpaceMomentsThumbList)
    router.post('/space/visit/list',user.UserSpaceVisitList)
    // 标签 √
    router.post('/tag/top',user.UserTagTop)
    router.post('/tag/info',user.UserTagInfo)
    router.post('/tag/add',user.UserTagAdd)
    router.post('/tag/remove',user.UserTagRemove)
    router.post('/tag/add/list',user.UserCreateTagList)
    router.post('/tag/search',user.UserTagSearch)
    router.post('/tag/update',user.UserTagUpdate)
    router.post('/tag/use',user.UserTagUse)
    router.post('/tag/random/list',user.UserTagRandomList)
    // 贴纸 √
    router.post('/stickers',user.UserStickers)
    router.post('/stickers/guide',user.UserStickersGuide)
    router.post('/stickers/info',user.UserStickersInfo)
    router.post('/stickers/rank',user.UserStickersRank)
    router.post('/sticker/use',user.UseSticker)
    // 相册 √
    router.post('/photo/list',user.UserPhotoList)
    router.post('/photo/create',user.UserPhotoCreate)
    router.post('/photo/delete',user.UserPhotoDelete)
    router.post('/photo/append',user.UserPhotoAppend)
    router.post('/photo/remove',user.UserPhotoRemove)
    router.post('/photo/update',user.UserPhotoUpdate)
    return router;
}