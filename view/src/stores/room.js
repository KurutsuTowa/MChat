import { defineStore } from "pinia";
import { reactive, ref ,toRaw,watch } from "vue";
import { roomInfoRequest,roomByFriendRequest,roomByGroupRequest,roomReadedRequest,getAllUnreadMessageRequest } from '@/api/room';
import useUserStore from "./user";
import customMessage from "@/utils/customMessage";
// 存储聊天数据的仓库
const useRoomStore = defineStore('room',() => {
    const userStore = useUserStore();
    // 房间集合。key对应room_id
    const room_list = ref({});
    // 聊天记录集合
    const talk_list = ref({});
    // 当前打开的房间号
    const open_room_id = ref(null);
    // 要通话的房间号
    const call_room_id = ref(null);
    // 建立websocket连接
    const ws = new WebSocket('ws://localhost:8080/message/connection?token=' + userStore.token);
    loadRoomInfo();
    getAllUnreadMessage();
    // 当打开某个房间时，使该房间信息已读
    watch(() => open_room_id.value,async (newVal) => {
        if(!newVal) return;
        await roomReadedRequest({room_id:newVal});
        // 重新获取该房间信息
        await getRoomInfo(newVal);
    })
    // websocket连接接收信息事件
    ws.onmessage = async (message) => {
        const bubble = JSON.parse(message.data);
        // 如过没有房间记录，创建房间记录，然后将信息添加
        if(!room_list.value[bubble.room_id]){
            await appendRoom(bubble.room_id);
        }
        if(talk_list.value[bubble.room_id]){
            talk_list.value[bubble.room_id].bubble_list.push(bubble);
        }else{
            talk_list.value[bubble.room_id] = {
                room_id:bubble.room_id,
                type:bubble.type,
                receiver_id:bubble.receiver_id,
                sender_id:bubble.sender_id,
                bubble_list:[bubble]
            }
        }
        const n_type = ['警告'];
        if(!n_type.includes(bubble.media_type) && !bubble.failed){
            switch(bubble.media_type){
                case '文本':
                    room_list.value[bubble.room_id].last_msg = bubble.content;
                    break;
                case '媒体':
                    room_list.value[bubble.room_id].last_msg = '[媒体]';
                    break;
                case '表情':
                    room_list.value[bubble.room_id].last_msg = '[表情]';
                    break;
                case '文件':
                    room_list.value[bubble.room_id].last_msg = '[文件]';
                    break;
            }
            room_list.value[bubble.room_id].last_msg_at = bubble.created_at;
        }
        saveRoomInfo();
        // 如果正在打开该房间，使信息已读
        if(open_room_id.value == bubble.room_id){
            await roomReadedRequest({room_id:bubble.room_id});
        }else{
            (room_list.value[bubble.room_id].friend_status || room_list.value[bubble.room_id].group_status).unread_msg_count ++;
        }
        // 重新获取该房间信息
        await getRoomInfo(bubble.room_id);
    }
    // 缓存
    function saveRoomInfo(){
        localStorage.room_list = sessionStorage.room_list = JSON.stringify(toRaw(room_list.value));
        localStorage.talk_list = sessionStorage.talk_list = JSON.stringify(toRaw(talk_list.value));
    }
    // 读取
    function loadRoomInfo(){
        if(localStorage.room_list && localStorage.room_list != 'null'){
            room_list.value = JSON.parse(localStorage.room_list);
            talk_list.value = JSON.parse(localStorage.talk_list);
        }else if(sessionStorage.room_list && sessionStorage.room_list != 'null'){
            room_list.value = JSON.parse(sessionStorage.room_list);
            talk_list.value = JSON.parse(sessionStorage.talk_list);
        }
    }
    // 退出登录
    async function logout(){
        room_list.value = null;
        talk_list.value = null;
        open_room_id.value = null;
        call_room_id.value = null;
        saveRoomInfo();
    }
    // 发送消息
    function sendMessage({ receiver_id,content,media_type,file_size,room_id,type }){
        const message = {
            sender_id:userStore.user_info.user_id,
            receiver_id,
            content,
            media_type,
            file_size,
            room_id,
            type
        }
        ws.send(JSON.stringify(message));
    }
    // 关闭房间号
    async function closeRoom(group_id){
        const room_id = await getRoomIdByGroup(group_id);
        delete room_list.value[room_id];
        delete talk_list.value[room_id];
        console.log(room_id,room_list.value,talk_list.value)
        saveRoomInfo();
    }
    // 获取所有未读信息
    async function getAllUnreadMessage(){
        const data = await getAllUnreadMessageRequest();
        if(data.code == 200){
            // 更新房间信息
            const room_unread_list = data.data.room_unread_list;
            console.log(room_unread_list);
            room_unread_list.forEach(room => {
                // 如过没有房间记录，创建房间记录
                if(!room_list.value[room.room_id]){
                    appendRoom(room.room_id);
                }
                    // 如果有记录，则插入信息
                if(talk_list.value[room.room_id]){
                    console.log(room.unread_msg_list,talk_list.value)
                    talk_list.value[room.room_id].bubble_list.push(...room.unread_msg_list);
                }else{
                    if(room.unread_msg_list.length){
                        talk_list.value[room.room_id] = {
                            room_id:room.room_id,
                            type:room.unread_msg_list[0].type,
                            receiver_id:room.unread_msg_list[0].receiver_id,
                            sender_id:room.unread_msg_list[0].sender_id,
                            bubble_list:room.unread_msg_list
                        }
                    }
                }
            })
            saveRoomInfo();
            return Promise.resolve(room_unread_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 获取房间信息
    async function getRoomInfo(room_id){
        const data = await roomInfoRequest({room_id});
        if(data.code == 200){
            // 同时更新房间信息
            const room_info = data.data.room_info;
            // 如果房间内没有自己，则提示对方，并删除记录
            if(room_info.group_status){
                if(!room_info.group_status.members.some(member => member.user_id == userStore.user_info.user_id)){
                    if(room_list.value[room_info.room_id]){
                        setTimeout(() => {
                            delete room_list.value[room_info.room_id];
                            delete talk_list.value[room_info.room_id];
                            open_room_id.value = null;
                            location.assign('/#/layout/chat/')
                            customMessage({type:'error',value:'你已不在此群聊中'})
                            saveRoomInfo();
                        },100)
                        return Promise.resolve(room_info);
                    }
                }
            }
            room_list.value[room_info.room_id] = room_info;
            saveRoomInfo();
            return Promise.resolve(room_info);
        }else{
            return Promise.reject(data);
        }
    }
    // 用好友id获取房间号
    async function getRoomIdByFriend(friend_id){
        const data = await roomByFriendRequest({friend_id});
        if(data.code == 200){
            return Promise.resolve(data.data.room_id);
        }else{
            return Promise.reject(data);
        }
    }
    // 用群聊id获取房间号
    async function getRoomIdByGroup(group_id){
        const data = await roomByGroupRequest({group_id});
        if(data.code == 200){
            return Promise.resolve(data.data.room_id);
        }else{
            return Promise.reject(data);
        }
    }
    // 开启/更新一个房间对话
    async function appendRoom(room_id){
        const room_info = await getRoomInfo(room_id);
        room_list.value[room_id] = room_info;
        console.log(room_list.value)
        saveRoomInfo();
        return room_info;
    }
    // 清理缓存
    function deleteCache(room_id){
        talk_list.value[room_id].bubble_list = [];
        saveRoomInfo();
    }
    return {
        room_list,
        talk_list,
        open_room_id,
        call_room_id,
        appendRoom,
        getRoomIdByFriend,
        getRoomIdByGroup,
        getRoomInfo,
        sendMessage,
        closeRoom,
        logout,
        deleteCache,
    }
})
export default useRoomStore;