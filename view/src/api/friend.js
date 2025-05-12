import request from '../utils/request';
const API = {
    FRIEND_LIST:'/friend/list',
    FRIEND_REQUEST:'/friend/request',
    FRIEND_REQUEST_REPLY:'/friend/request/reply',
    FRIEND_REQUEST_SEND:'/friend/request/send',
    FRIEND_SET:'/friend/set',
    FRIEND_DELETE:'/friend/delete',

    FRIEND_GROUP_LIST:'/friend/group/list',
    FRIEND_LIST_BY_ID:'/friend/group/list/id',
    FRIEND_GROUP_CREATE:'/friend/group/create',
    FRIEND_GROUP_DELETE:'/friend/group/delete',
    FRIEND_GROUP_RENAME:'/friend/group/rename',
    FRIEND_GROUP_APPEND:'/friend/group/append',
    FRIEND_GROUP_REMOVE:'/friend/group/remove',

    FRIEND_SET:'/friend/set'
}
// 设置好友请求
export const friendSetRequest = async ({friend_id,top_up,no_disturb,ignored,remark}) => await request.post(API.FRIEND_SET,{friend_id,top_up,no_disturb,ignored,remark});

// 好友列表请求
export const friendListRequest = async () => await request.post(API.FRIEND_LIST);
// 根据id获取好友列表请求
export const friendListByIdRequest = async ({ user_id }) => await request.post(API.FRIEND_LIST_BY_ID,{ user_id });
// 好友请求列表请求
export const friendRequestListRequest = async () => await request.post(API.FRIEND_REQUEST);
// 好友请求回复请求
export const friendRequestReplyRequest = async ({ id,status }) => await request.post(API.FRIEND_REQUEST_REPLY,{ id,status });
// 好友请求发出请求
export const friendRequestSendRequest = async ({ target_id,introduce,remark,friend_group_id }) => await request.post(API.FRIEND_REQUEST_SEND,{ target_id,introduce,remark,friend_group_id });
// 删除好友请求
export const friendDeleteRequest = async ({ friend_id }) => await request.post(API.FRIEND_DELETE,{ friend_id })

// 用户分组列表
export const friendGroupListRequest = async () => await request.post(API.FRIEND_GROUP_LIST);
// 用户分组创建
export const friendGroupCreateRequest = async ({ friend_group_name }) => await request.post(API.FRIEND_GROUP_CREATE,{ friend_group_name });
// 好友分组重命名
export const friendGroupRenameRequest = async ({ friend_group_id,friend_group_name }) => await request.post(API.FRIEND_GROUP_RENAME,{ friend_group_id,friend_group_name });
// 用户分组删除
export const friendGroupDeleteRequest = async ({ friend_group_id }) => await request.post(API.FRIEND_GROUP_DELETE,{ friend_group_id });
// 用户分组添加好友
export const friendGroupAppendRequest = async ({ friend_list }) => await request.post(API.FRIEND_GROUP_APPEND,{ friend_list });
// 用户分组移出好友
export const friendGroupRemoveRequest = async ({ friend_list }) => await request.post(API.FRIEND_GROUP_REMOVE,{ friend_list });