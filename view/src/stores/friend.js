import { defineStore } from "pinia";
import { ref } from "vue";
import useUserStore from "./user";
import { friendListRequest,friendRequestListRequest,friendRequestReplyRequest,friendRequestSendRequest,friendSetRequest,friendDeleteRequest,friendGroupListRequest,friendGroupRemoveRequest,
friendGroupCreateRequest,friendGroupDeleteRequest,friendGroupRenameRequest,friendGroupAppendRequest,friendListByIdRequest } from '@/api/friend';
// 存储应用数据的仓库
const useFriendStore = defineStore('friend',() => {
    const friend_list = ref(null);
    const open_friend_space = ref(null);
    const friend_request = ref();
    const friend_group = ref(null);
    const userStore = useUserStore();
    loadFriendInfo();
    // 缓存好友信息
    async function saveFriendInfo(){
        localStorage.friend_list = sessionStorage.friend_list = JSON.stringify(friend_list.value);
        localStorage.friend_group = sessionStorage.friend_group = JSON.stringify(friend_group.value);
    }
    // 读取好友信息
    async function loadFriendInfo(){
        friend_list.value = JSON.parse(localStorage.friend_list || sessionStorage.friend_list || 'null');
        friend_group.value = JSON.parse(localStorage.friend_group || sessionStorage.friend_group || 'null');
    }
        // 退出登录
    async function logout(){
        friend_list.value = null;
        open_friend_space.value = null;
        friend_request.value = null;
        friend_group.value = null;
        saveFriendInfo();
    }
    // 获取用户自身好友列表
    async function getFriendList(){
        const data = await friendListRequest();
        if(data.code == 200){
            friend_list.value = data.data.friend_list;
            saveFriendInfo();
            return Promise.resolve(friend_list.value);
        }else{
            return Promise.reject(data);
        }
    }
    // 获取对方id获取好友列表
    async function getFriendListById(user_id){
        const data = await friendListByIdRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.friend_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 好友请求
    async function getFriendRequest(){
        const data = await friendRequestListRequest();
        if(data.code == 200){
            friend_request.value = data.data.friend_request.toSorted((a, b) => {
                // 将日期字符串转换为日期对象进行比较
                return new Date(b.updated_at) - new Date(a.updated_at);
            });
            return Promise.resolve(friend_request.value);
        }else{
            return Promise.reject(data);
        }
    }
    // 发出好友请求
    async function sendFriendRequest({ target_id,introduce,remark,friend_group_id }){
        const data = await friendRequestSendRequest({ target_id,introduce,remark,friend_group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 回应好友请求
    async function replyFriendRequest({ id,status }){
        const data = await friendRequestReplyRequest({ id,status });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 设置好友
    async function friendSet({friend_id,top_up,no_disturb,ignored,remark}){
        const data = await friendSetRequest({friend_id,top_up:+top_up,no_disturb:+no_disturb,ignored:+ignored,remark});
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 删除好友
    async function friendDelete(friend_id){
        const data = await friendDeleteRequest({ friend_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 获取好友分组列表
    async function friendGroupList(){
        const data = await friendGroupListRequest();
        if(data.code == 200){
            const user_friend_group = data.data.user_friend_group
            friend_group.value = user_friend_group;
            return Promise.resolve(user_friend_group);
        }else{
            return Promise.reject(data);
        }
    }
    // 创建好友分组
    async function friendGroupCreate(friend_group_name){
        const data = await friendGroupCreateRequest({ friend_group_name });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 删除好友分组
    async function friendGroupDelete(friend_group_id){
        const data = await friendGroupDeleteRequest({ friend_group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 重命名好友分组
    async function friendGroupRename({friend_group_id,friend_group_name}){
        const data = await friendGroupRenameRequest({ friend_group_id,friend_group_name });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 将好友移出分组
    async function friendGroupRemove(friend_list){
        const data = await friendGroupRemoveRequest({ friend_list });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 将好友加入分组
    async function friendGroupAppend(friend_list){
        const data = await friendGroupAppendRequest({ friend_list });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    return {
        friend_request,
        friend_list,
        friend_group,
        getFriendList,
        getFriendRequest,
        open_friend_space,
        sendFriendRequest,
        replyFriendRequest,
        friendSet,
        friendDelete,
        friendGroupList,
        getFriendListById,
        friendGroupCreate,
        friendGroupDelete,
        friendGroupRename,
        friendGroupRemove,
        friendGroupAppend,
        logout,
    }
})
export default useFriendStore;