import request from '../utils/request';
const API = {
    ROOM_INFO:'/room/info',
    ROOM_BY_FRIEND:'/room/by/friend',
    ROOM_BY_GROUP:'/room/by/group',
    ROOM_READED:'/room/readed',
    ROOM_UNREAD_LIST:'/room/unread/list',
}
// 房间信息请求
export const roomInfoRequest = async ({ room_id }) => await request.post(API.ROOM_INFO,{ room_id });

// 根据用户好友获取房间号请求
export const roomByFriendRequest = async ({ friend_id }) => await request.post(API.ROOM_BY_FRIEND,{ friend_id });

// 根据群聊获取房间号请求
export const roomByGroupRequest = async ({ group_id }) => await request.post(API.ROOM_BY_GROUP,{ group_id });

// 房间已读
export const roomReadedRequest = async ({ room_id }) => await request.post(API.ROOM_READED,{ room_id });

// 获取所有未读信息
export const getAllUnreadMessageRequest = async () => await request.post(API.ROOM_UNREAD_LIST,);