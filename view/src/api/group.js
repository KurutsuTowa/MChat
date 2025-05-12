import request from '../utils/request';
const API = {
    GROUP_SEARCH:'/group/search',
    GROUP_LIST:'/group/list',
    GROUP_INFO:'/group/info',
    GROUP_REQUEST:'/group/request',
    GROUP_REQUEST_SEND:'/group/request/send',
    GROUP_REQUEST_INVITE:'/group/request/invite',
    GROUP_REQUEST_SEND_REPLY:'/group/request/send/reply',
    GROUP_REQUEST_INVITE_REPLY:'/group/request/invite/reply',
    GROUP_SET:'/group/set',
    GROUP_LEAVE:'/group/leave',
    GROUP_CREATE:'/group/create',
    GROUP_REMOVE_MEMBER:'/group/member/remove',
    GROUP_SET:'/group/set',
    GROUP_UPDATE:'/group/update',
    GROUP_POSITION_SET:'/group/position/set',
    GROUP_BAN_TALK:'/group/ban/talk',
    GROUP_LEVEL_SET:'/group/level/set',

    GROUP_PHOTO_CREATE:'/group/photo/create',
    GROUP_PHOTO_DELETE:'/group/photo/delete',
    GROUP_PHOTO_APPEND:'/group/photo/append',
    GROUP_PHOTO_REMOVE:'/group/photo/remove',
    GROUP_PHOTO_LIST:'/group/photo/list',

    GROUP_FILE_LIST:'/group/file/list',
    GROUP_FILE_APPEND:'/group/file/append',
    GROUP_FILE_REMOVE:'/group/file/remove',

    GROUP_ANNOUNCE_LIST:'/group/announce/list',
    GROUP_ANNOUNCE_APPEND:'/group/announce/append',
}
// 群聊等级设置
export const groupLevelSetRequest = async ({ level_list,group_id }) => await request.post(API.GROUP_LEVEL_SET,{ level_list,group_id });
// 群聊禁言设置
export const banTalkGroupRequest = async ({ member_list,ban_talk,group_id }) => await request.post(API.GROUP_BAN_TALK,{ member_list,ban_talk,group_id });
// 群聊职位设置
export const setPositionRequest = async ({ target_id,position,group_id }) => await request.post(API.GROUP_POSITION_SET,{ target_id,position,group_id });
// 修改群聊
export const updateGroupRequest = async ({ group_id,group_name,avatar,description,space_background,auth,auth_query,all_ban_talk,tags }) => await request.post(API.GROUP_UPDATE,{ group_id,group_name,avatar,description,space_background,auth,auth_query,all_ban_talk,tags });
// 移出群成员
export const removeMemberRequest = async ({ target_id,group_id }) => await request.post(API.GROUP_REMOVE_MEMBER,{ target_id,group_id });
// 用户对群的个人设置
export const setGroupRequest = async ({ group_id,no_disturb,top_up,ignored }) => await request.post(API.GROUP_SET,{ group_id,no_disturb,top_up,ignored });
// 发布群公告
export const announceAppendRequest = async ({ group_id,announce }) => await request.post(API.GROUP_ANNOUNCE_APPEND,{ group_id,announce });
// 群公告列表
export const announceListRequest = async ({group_id}) => await request.post(API.GROUP_ANNOUNCE_LIST,{group_id});
// 群聊查询请求
export const groupSearchRequest = async ({ keywords }) => await request.post(API.GROUP_SEARCH,{ keywords });
// 群聊列表请求
export const groupListRequest = async () => await request.post(API.GROUP_LIST);
// 群聊信息
export const groupInfoRequest = async ({ group_id }) => await request.post(API.GROUP_INFO,{ group_id });
// 群聊请求列表请求
export const groupRequestListRequest = async () => await request.post(API.GROUP_REQUEST);
// 设置群聊请求
export const groupSetRequest = async ({ group_id,no_disturb,top_up,ignored }) => await request.put(API.GROUP_SET,{ group_id,no_disturb,top_up,ignored })
// 加入群聊请求
export const groupRequestSendRequest = async ({ group_id,introduce }) => await request.post(API.GROUP_REQUEST_SEND,{ group_id,introduce });
// 邀请加入群聊请求
export const groupRequestInviteRequest = async ({ group_id,introduce,receiver_id }) => await request.post(API.GROUP_REQUEST_INVITE,{ group_id,introduce,receiver_id });
// 回应他人加入群聊请求
export const groupRequestReplySendRequest = async ({ request_id,group_id,status }) => await request.post(API.GROUP_REQUEST_SEND_REPLY,{ request_id,group_id,status });
// 回应他人邀请加群请求
export const groupRequestReplyInviteRequest = async ({ request_id,group_id,status }) => await request.post(API.GROUP_REQUEST_INVITE_REPLY,{ request_id,group_id,status });
// 退出群聊
export const groupLeaveRequest = async ({ group_id }) => await request.post(API.GROUP_LEAVE,{ group_id });
// 创建群聊
export const groupCreateRequest = async ({ group_name,avatar,description,background,tags,auth,members }) => await request.post(API.GROUP_CREATE,{ group_name,avatar,description,background,tags,auth,members });
// 群聊相册创建
export const GroupPhotoCreateRequest = async ({ group_id,photo_name,photo_desc }) => await request.post(API.GROUP_PHOTO_CREATE,{ group_id,photo_name,photo_desc });
// 群聊相册删除
export const GroupPhotoDeleteRequest = async ({ photo_id }) => await request.delete(API.GROUP_PHOTO_DELETE,{ photo_id });
// 群聊相册图片添加
export const GroupPhotoAppendRequest = async ({ photo_id,image }) => await request.post(API.GROUP_PHOTO_APPEND,{ photo_id,image });
// 群聊相册图片删除
export const GroupPhotoRemoveRequest = async ({ photo_id,image_id }) => await request.delete(API.GROUP_PHOTO_REMOVE,{ photo_id,image_id });
// 群聊相册列表
export const GroupPhotoListRequest = async ({ group_id }) => await request.post(API.GROUP_PHOTO_LIST,{ group_id });
// 群聊文件列表
export const GroupFileListRequest = async ({ group_id }) => await request.post(API.GROUP_FILE_LIST,{ group_id });
// 群聊文件添加
export const GroupFileAppendRequest = async ({ group_id,file_name,file_type,file_size }) => await request.post(API.GROUP_FILE_APPEND,{ group_id,file_name,file_type,file_size });
// 群聊文件删除
export const GroupFileRemoveRequest = async ({ file_id,group_id }) => await request.post(API.GROUP_FILE_REMOVE,{ file_id,group_id });
