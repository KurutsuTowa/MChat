import request from '../utils/request';
const API = {
    USER_LOGIN:'/user/login',
    USER_REGISTER:'/user/register',
    USER_INFO:'/user/info',
    USER_INFO_BY_ID:'/user/info/id',
    USER_SEARCH:'/user/search',
    USER_SPACE:'/user/space',
    USER_TAG_TOP:'/user/tag/top',
    USER_TAG_INFO:'/user/tag/info',
    USER_TAG_ADD:'/user/tag/add',
    USER_TAG_REMOVE:'/user/tag/remove',
    USER_TAG_SEARCH:"/user/tag/search",
    USER_TAG_ADD_LIST:'/user/tag/add/list',
    USER_TAG_UPDATE:'/user/tag/update',
    USER_TAG_USE:'/user/tag/use',
    USER_TAG_RANDOM_LIST:'/user/tag/random/list',
    USER_STICKERS:'/user/stickers',
    USER_STICKERS_GUIDE:'/user/stickers/guide',
    USER_STICKERS_INFO:'/user/stickers/info',
    USER_STICKERS_RANK:'/user/stickers/rank',
    USER_STICKERS_USE:'/user/sticker/use',

    USER_PHOTO_CREATE:'/user/photo/create',
    USER_PHOTO_DELETE:'/user/photo/delete',
    USER_PHOTO_APPEND:'/user/photo/append',
    USER_PHOTO_REMOVE:'/user/photo/remove',
    USER_PHOTO_LIST:'/user/photo/list',
    USER_PHOTO_UPDATE:'/user/photo/update',

    USER_MOMENTS_LIST:'/user/space/moments',
    USER_MOMENTS_APPEND:'/user/space/moments/append',
    USER_MOMENTS_REMOVE:'/user/space/moments/remove',
    USER_MOMENTS_REPLY:'/user/space/moments/reply',
    USER_MOMENTS_REPLY_LIST:'/user/space/moments/reply/list',
    USER_MOMENtS_THUMB:'/user/space/moments/thumb',
    USER_MOMENtS_THUMB_LIST:'/user/space/moments/thumb/list',

    USER_SPACE_VISIT:'/user/space/visit/list',
    USER_SPACE_AUTH_FRIEND:'/user/space/auth/friend',
    USER_SPACE_AUTH_GLOBAL:'/user/space/auth/global',

    USER_BANK_LIST:'/user/ban/list',
    USER_BANK_ADD:'/user/ban/add',
    USER_BANK_REMOVE:'/user/ban/remove',

    USER_MAIL_LIST:'/user/mail/list',
    USER_MAIL_REPLY:'/user/mail/reply',

    USER_FIND:'/user/find',
    USER_SPACE_CARD:'/user/space/card/update',

    USER_AVATAR_UPDATE:'/user/avatar/update',
    USER_UPDATE:'/user/update/info',
}
// 头像更换
export const updateUserAvatarRequest = async ({avatar}) => await request.post(API.USER_AVATAR_UPDATE,{avatar});
// 用户个人空间卡片更换
export const updateSpaceCardRequest = async ({space_background}) => await request.post(API.USER_SPACE_CARD,{space_background});
// 发现好友
export const findUserRequest = async ({tags, age, gender}) => await request.post(API.USER_FIND,{tags, age, gender});

// 访问邮件列表
export const userMailListRequest = async () => await request.post(API.USER_MAIL_LIST,);
// 回应邮件，使邮件失效(已领取/已读)
export const userMailReplyRequest = async ({mail_id}) => await request.post(API.USER_MAIL_REPLY,{mail_id});

// 好友访问个人空间的权限
export const userSpaceAuthByFriendRequest = async ({friend_id,space_auth}) => await request.post(API.USER_SPACE_AUTH_FRIEND,{friend_id,space_auth});
// 个人空间全局访问权限
export const userSpaceAuthByGlobalRequest = async ({space_auth}) => await request.post(API.USER_SPACE_AUTH_GLOBAL,{space_auth});


// 黑名单列表请求
export const userBanListRequest = async () => await request.post(API.USER_BANK_LIST,);
// 加入黑名单请求
export const userBanAppendRequest = async ({ user_id }) => await request.post(API.USER_BANK_ADD,{ user_id });
// 移出黑名单请求
export const userBanRemoveRequest = async ({ user_id }) => await request.post(API.USER_BANK_REMOVE,{ user_id });

// 动态列表请求
export const userSpaceMomentsListRequest = async ({ user_id }) => await request.post(API.USER_MOMENTS_LIST,{ user_id });
// 动态发送请求
export const userSpaceMomentsAppendRequest = async ({ content,moments_media_list }) => await request.post(API.USER_MOMENTS_APPEND,{ content,moments_media_list });
// 动态删除请求
export const userSpaceMomentsRemoveRequest = async ({ moments_id }) => await request.post(API.USER_MOMENTS_REMOVE,{ moments_id });
// 动态回复请求
export const userSpaceMomentsReplyRequest = async ({ moments_id,content,received_user_id }) => await request.post(API.USER_MOMENTS_REPLY,{ moments_id,content,received_user_id });
// 动态回复列表请求 
export const userSpaceMomentsReplyListRequest = async ({ moments_id }) => await request.post(API.USER_MOMENTS_REPLY_LIST,{ moments_id });
// 动态点赞请求
export const userSpaceMomentsThumbToggleRequest = async ({ moments_id,thumb_up }) => await request.post(API.USER_MOMENtS_THUMB,{ moments_id,thumb_up });
// 动态点赞列表请求 
export const userSpaceMomentsThumbListRequest = async ({ moments_id }) => await request.post(API.USER_MOMENtS_THUMB_LIST,{ moments_id });
// 访客记录
export const userSpaceVisitListRequest = async ({ user_id }) => await request.post(API.USER_SPACE_VISIT,{ user_id });

// 登录请求
export const userLoginRequest = async ({ account,password }) => await request.post(API.USER_LOGIN,{ account,password });
// 注册请求
export const userRegisterRequest = async ({ account,password }) => await request.post(API.USER_REGISTER,{ account,password });
// 用户信息请求
export const userInfoRequest = async () => await request.get(API.USER_INFO);
// 通过id请求用户信息
export const userInfoByIdRequest = async ({ user_id }) => await request.post(API.USER_INFO_BY_ID,{ user_id });
// 用户查询请求
export const userSearchRequest = async ({ keywords }) => await request.post(API.USER_SEARCH,{ keywords });
// 用户空间
export const userSpaceRequest = async ({ user_id }) => await request.post(API.USER_SPACE,{ user_id });
// 用户修改
export const userUpdateRequest = async ({ avatar,space_background,username,phone,born_at,age,gender,tags,introduce }) => await request.post(API.USER_UPDATE,{ avatar,space_background,username,phone,born_at,age,gender,tags,introduce });
// 热门标签
export const userTagTopRequest = async ({count}) => await request.post(API.USER_TAG_TOP,{count});
// 随机标签推荐
export const userTagRandomRequest = async ({count}) => await request.post(API.USER_TAG_RANDOM_LIST,{count});
// 用户标签查询
export const userTagInfoRequest = async ({ user_id }) => await request.post(API.USER_TAG_INFO,{ user_id });
// 用户标签创建
export const userTagAddRequest = async ({ tag_name,tag_color,text_color,border_style }) => await request.post(API.USER_TAG_ADD,{ tag_name,tag_color,text_color,border_style });
// 使用用户标签
export const userTagUseRequest = async ({ tag_name,tag_color,text_color,border_style }) => await request.post(API.USER_TAG_USE,{ tag_name,tag_color,text_color,border_style });
// 用户标签移除
export const userTagRemoveRequest = async ({ tag_name }) => await request.post(API.USER_TAG_REMOVE,{ tag_name });
// 用户标签修改
export const userTagUpdateRequest = async ({ tag_name,tag_color,text_color,border_style }) => await request.post(API.USER_TAG_UPDATE,{ tag_name,tag_color,text_color,border_style })
// 用户标签搜索
export const userTagSearchRequest = async ({ keywords }) => await request.post(API.USER_TAG_SEARCH,{ keywords });
// 用户创建的标签列表
export const userTagAddListRequest = async () => await request.post(API.USER_TAG_ADD_LIST);
// 用户贴纸
export const userStickersRequest = async ({ user_id }) => await request.post(API.USER_STICKERS,{ user_id });
// 贴纸图鉴
export const userStickersGuideRequest = async () => await request.post(API.USER_STICKERS_GUIDE);
// 用户贴纸信息
export const userStickersInfoRequest = async ({ user_id }) => await request.post(API.USER_STICKERS_INFO,{ user_id });
// 用户贴纸排行
export const userStickersRankRequest = async ({ user_id }) => await request.post(API.USER_STICKERS_RANK,{ user_id });
// 用户贴纸使用
export const UseStickerRequest = async ({ user_sticker_id }) => await request.post(API.USER_STICKERS_USE,{ user_sticker_id });

// 用户相册创建
export const userPhotoCreateRequest = async ({ photo_name,photo_desc,photo_cover }) => await request.post(API.USER_PHOTO_CREATE,{ photo_name,photo_desc,photo_cover });
// 用户相册删除
export const userPhotoDeleteRequest = async ({ photo_id }) => await request.post(API.USER_PHOTO_DELETE,{ photo_id });
// 用户相册修改
export const userPhotoUpdateRequest = async ({ photo_name,photo_desc,photo_cover,photo_id }) => await request.post(API.USER_PHOTO_UPDATE,{ photo_name,photo_desc,photo_cover,photo_id });
// 用户相册图片添加
export const userPhotoAppendRequest = async ({ photo_id,image }) => await request.post(API.USER_PHOTO_APPEND,{ photo_id,image });
// 用户相册图片删除
export const userPhotoRemoveRequest = async ({ photo_id,image_id }) => await request.post(API.USER_PHOTO_REMOVE,{ photo_id,image_id });
// 用户相册列表
export const userPhotoListRequest = async ({ user_id }) => await request.post(API.USER_PHOTO_LIST,{ user_id });
