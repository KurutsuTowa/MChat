import { defineStore } from "pinia";
import { ref } from "vue";
import useRoomStore from "./room";
import { groupSearchRequest,groupListRequest,groupInfoRequest,groupRequestListRequest,groupRequestSendRequest,announceAppendRequest,announceListRequest,
         groupRequestInviteRequest,groupRequestReplySendRequest,groupRequestReplyInviteRequest,groupLeaveRequest,groupCreateRequest,groupSetRequest,
         removeMemberRequest,setGroupRequest,updateGroupRequest,setPositionRequest,banTalkGroupRequest,groupLevelSetRequest
} from '@/api/group';
// 存储应用数据的仓库
const useGroupStore = defineStore('group',() => {
    const group_list = ref(null);
    const open_group_space = ref(null);
    const group_request = ref();

    const roomStore = useRoomStore();

    // 退出登录
    async function logout(){
        group_list.value = null;
        open_group_space.value = null;
        group_request.value = null;
        saveFriendInfo();
    }
    // 发布群公告
    async function announceAppend({group_id,announce}){
        const data = await announceAppendRequest({ group_id,announce });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 群公告列表
    async function announceList(group_id){
        const data = await announceListRequest({ group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.announce_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 群聊搜索
    async function searchGroup({ keywords }){
        const data = await groupSearchRequest({ keywords });
        if(data.code == 200){
            return Promise.resolve(data.data.group_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 群聊列表
    async function getGroupList(){
        const data = await groupListRequest();
        if(data.code == 200){
            group_list.value = data.data.group_list;
            return Promise.resolve(data.data.group_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 群聊信息
    async function getGroupInfo({ group_id }){
        const data = await groupInfoRequest({ group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.group_info);
        }else{
            return Promise.reject(data);
        }
    }
    // 群聊请求
    async function getGroupRequest(){
        const data = await groupRequestListRequest();
        if(data.code == 200){
            console.log(data.data.group_request)
            group_request.value = data.data.group_request.toSorted((a, b) => {
                // 将日期字符串转换为日期对象进行比较
                return new Date(b.updated_at) - new Date(a.updated_at);
            });
            return Promise.resolve(group_request.value);
        }else{
            return Promise.reject(data);
        }
    }
    // 设置群聊
    async function groupSet({ group_id,no_disturb,top_up,ignored }){
        const data = await groupSetRequest({ group_id,no_disturb,top_up,ignored });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 修改群聊
    async function groupUpdate({ group_id,group_name,avatar,description,space_background,auth,auth_query,all_ban_talk,tags }){
        const data = await updateGroupRequest({ group_id,group_name,avatar,description,space_background,auth,auth_query,all_ban_talk,tags });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 设置群职位
    async function setPosition({ target_id,position,group_id }){
        const data = await setPositionRequest({ target_id,position,group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 群聊禁言
    async function banTalkGroup({ member_list,ban_talk,group_id }){
        const data = await banTalkGroupRequest({ member_list,ban_talk,group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 群等级设置
    async function groupLevelSet({ level_list,group_id }){
        const data = await groupLevelSetRequest({ level_list,group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    
    // 请求加入群聊
    async function groupRequestSend({ group_id,introduce }){
        const data = await groupRequestSendRequest({ group_id,introduce });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 邀请加入群聊
    async function groupRequestInvite({ group_id,introduce,receiver_id }){
        const data = await groupRequestInviteRequest({ group_id,introduce,receiver_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 回应群聊申请
    async function groupRequestReplySend({ request_id,group_id,status }){
        const data = await groupRequestReplySendRequest({ request_id,group_id,status });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 回应群聊邀请
    async function groupRequestReplyInvite({ request_id,group_id,status }){
        const data = await groupRequestReplyInviteRequest({ request_id,group_id,status });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 移出群聊
    async function removeMember({ target_id,group_id }){
        const data = await removeMemberRequest({ target_id,group_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 个人对群聊的设置
    async function setGroup({ group_id,no_disturb,top_up,ignored }){
        const data = await setGroupRequest({ group_id,no_disturb:+no_disturb,top_up:+top_up,ignored:+ignored });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 退出群聊
    async function groupLeave(group_id){
        const data = await groupLeaveRequest({ group_id });
        if(data.code == 200){
            await roomStore.closeRoom(group_id);
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 创建群聊
    async function groupCreate({ group_name,avatar,description,background,tags,auth,members }){
        const data = await groupCreateRequest({ group_name,avatar,description,background,tags,auth,members });
        if(data.code == 200){
            return Promise.resolve(data.data);
        }else{
            return Promise.reject(data);
        }
    }
    return {
        announceAppend,
        announceList, 
        group_request,
        group_list,
        open_group_space,
        searchGroup,
        getGroupList,
        getGroupInfo,
        getGroupRequest,
        groupSet,
        groupRequestSend,
        groupRequestInvite,
        groupRequestReplySend,
        groupRequestReplyInvite,
        groupLeave,
        groupCreate,
        setGroup,
        removeMember,
        groupUpdate,
        setPosition,
        banTalkGroup,
        groupLevelSet,
        logout
    }
})
export default useGroupStore;