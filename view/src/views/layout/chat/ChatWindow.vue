<template>
    <div class="chat_right">
        <header class="chat_right_header" style="display:flex;justify-content: space-between;width:100%;">
            <span>{{ (room_info?.friend_status?.remark ||room_info?.friend_status?.friend_info?.username ||  room_info?.group_status?.group_name) }}</span>
            <span @click="more_setting=true" class="iconfont" style="margin-right:10px;font-size:2rem;color:var(--dark);cursor:pointer;">&#xe66e;</span>
        </header>
        <!-- <div class="divider"></div> -->
        <div class="chat_inner">
            <ChatRoom :room_info="room_info" style="flex-grow:1;"></ChatRoom>
            <ChatExtra v-if="room_info?.group_status" :room_info="room_info"></ChatExtra>
        </div>
        <!-- 有关用户的额外设置 -->
        <a-drawer v-if="room_info?.friend_status" :visible="more_setting" @cancel="more_setting = false" :footer="false" width="340px">
            <template #title> 好友设置 </template>
            <div class="friend_setting group" >
                <div style="padding:8px;">
                    <header style="margin-left:10px;">常规设置</header>
                    <ul class="friend_setting_card">
                        <li class="friend_setting_item">
                        <span>好友置顶</span>
                        <a-switch v-model="updateForm.top_up" @change="updateFriend" />
                        </li>
                        <li class="friend_setting_item">
                            <span>消息免打扰</span>
                            <a-switch v-model="updateForm.no_disturb" @change="updateFriend" />
                        </li>
                        <li class="friend_setting_item">
                        <span>忽略</span>
                            <a-switch v-model="updateForm.ignored" @change="updateFriend" />
                        </li>
                    </ul>
                </div>
                <div :style="`margin-top:20px;padding:8px;border-radius:8px;background-color:var(--white);backdrop-filter:blur(8px)`">
                    <header style="margin-left:10px;">账号设置</header>
                    <ul class="friend_setting_card setting_btn">
                        <li v-if="isBan"  @click="userBanRemoveCallback" class="friend_setting_item " style="justify-content: center;">
                            <span>移出黑名单</span>
                        </li>
                        
                        <li v-else @click="showBanAddConfirm=true" class="friend_setting_item " style="justify-content: center;">
                            <span>加入黑名单</span>
                        </li>
                    </ul>
                </div>
                <div :style="`margin-top:20px;padding:8px;border-radius:8px;background-color:var(--white);backdrop-filter:blur(8px)`">
                    <header style="margin-left:10px;">聊天设置</header>
                    <ul @click="deleteLocal" class="friend_setting_card setting_btn">
                        <li class="friend_setting_item" style="justify-content: center;">
                        删除聊天缓存
                        </li>
                    </ul>
                    <ul class="friend_setting_card setting_btn">
                        <li class="friend_setting_item" @click="showRenameDialog=true" style="justify-content: center;">
                        修改备注
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 备注修改 -->
            <CustomConfirm v-model="showRenameDialog" :center="true" title="好友备注变更" icon="&#xe7e5;">
                <template #content>
                    <CustomInput v-model="updateForm.remark" placeholder="请输入你要修改的备注名" />
                    <CustomTips value="长度必须在2~8之间" />
                </template>
                <template #footer>
                    <div class="custom_footer">
                        <button @click="updateFriend(true)" class="custom_button success" style="width: 100%">保存</button>
                    </div>
                </template>
            </CustomConfirm>
            <CustomConfirm v-model="showBanAddConfirm" :ok="userBanAppendCallback" title="加入黑名单" content="你确定要将对方加入黑名单吗？你将无法发送消息给对方"></CustomConfirm>
        </a-drawer>
        <!-- 有关群聊的额外设置 -->
        <a-drawer v-else-if="room_info?.group_status" :visible="more_setting" @cancel="more_setting = false" :footer="false" width="340px">
            <template #title> 群聊设置 </template>
            <!-- 群聊基本信息 -->
            <div class="friend_setting_card" >
                <div class="group-info">
                    <CustomAvatar :src="room_info?.group_status.avatar" size="60px" background-color="var(--white)" :circle="true" :no-border="true"></CustomAvatar>
                        <div class="group-details" style="margin-left:8px">
                        <div class="group-name">{{ room_info.group_status.group_name }}</div>
                        <div class="group-number">群号：{{ room_info.group_status.group_id }}</div>
                    </div>
                </div>
            </div>
            <!-- 群成员 -->
            <div class="friend_setting_card" >
                <div class="members">
                    <div class="member-list">
                        <!-- 显示前15个成员头像 -->
                        <a-popover v-for="member in room_info?.group_status.members.slice(0,15)" position="left" trigger="click">
                            <CustomAvatar :src="member.avatar" :circle="true" no-border="true" size="40px" :style="{marginRight:'10px',marginBottom:'4px'}"></CustomAvatar>
                            <template #content>
                                <UserInGroupCard :group_user_info="member"></UserInGroupCard>
                            </template>
                        </a-popover>
                        <!-- 邀请按钮 -->
                        <div @click="showFriendOption=true" class="member-avatar invite-btn" style="font-weight:bold;">+</div>
                    </div>
                    <div @click="showMebersDialog=true" class="view-all-members">查看全部成员({{ room_info?.group_status.members.length }}人)</div>
                </div>
            </div>
            <!-- 群聊信息设置 -->
            <div class="settings-item">
                <label for="group-name">群聊名称</label>
                <a-input :disabled="!isManager" v-model="managerUpdateForm.group_name" @change="managerUpdateGroup"></a-input>
            </div>
            <div class="settings-item">
                <label for="group-name">群聊简介</label>
                <a-textarea :disabled="!isManager" v-model="managerUpdateForm.description" @change="managerUpdateGroup"></a-textarea>
            </div>
            <div class="settings-item">
                <label for="group-name">标签</label>
                <a-input-tag :disabled="!isManager" v-model="managerUpdateForm.tags"  placeholder="输入标签" @change="managerUpdateGroup" allow-clear/>
            </div>
            
            <!-- 其他设置 -->
            <div style="">
                <header style="margin-left:10px;">常规设置</header>
                <ul class="friend_setting_card">
                    <li class="friend_setting_item">
                    <span>群聊置顶</span>
                    <a-switch v-model="updateForm.top_up" @change="updateGroup" />
                    </li>
                    <li class="friend_setting_item">
                        <span>消息免打扰</span>
                        <a-switch v-model="updateForm.no_disturb" @change="updateGroup" />
                    </li>
                    <li class="friend_setting_item">
                    <span>忽略</span>
                        <a-switch v-model="updateForm.ignored" @change="updateGroup" />
                    </li>
                </ul>
            </div>
            <!-- 加群管理 -->
            <div v-if="isManager" style="">
                <header style="margin-left:10px;">加群管理</header>
                <ul class="friend_setting_card">
                    <li class="friend_setting_item">
                    <span style="width:105px">验证方式</span>
                        <a-select v-model="managerUpdateForm.auth" @change="managerUpdateGroup" :style="{width:'320px'}" placeholder="选择">
                            <a-option>confirm</a-option>
                            <a-option>query</a-option>
                            <a-option>allow</a-option>
                        </a-select>
                    </li>
                    <li class="friend_setting_item">
                        <span style="width:105px">验证问题</span>
                        <a-input v-model="managerUpdateForm.auth_query" @change="managerUpdateGroup" />
                    </li>
                </ul>
            </div>
            <!-- 群聊管理 -->
            <div style="">
                <template v-if="isManager">
                    <header style="margin-left:10px;">发言管理</header>
                    <ul class="friend_setting_card">
                        <li class="friend_setting_item">
                        <span>全员禁言</span>
                        <a-switch v-model="managerUpdateForm.all_ban_talk" @change="managerUpdateGroup" />
                        </li>
                    </ul>
                    <ul @click="showBanTalkDialog=true" class="friend_setting_card setting_btn">
                        <li class="friend_setting_item">
                            <span>成员禁言</span>
                        </li>
                    </ul>
                    <header style="margin-left:10px;">装饰管理</header>
                    <ul class="friend_setting_card setting_btn">
                        <a-upload :show-file-list="false" :action="appStore.server + '/upload/image/'" @success="uploadAvatarSuccess">
                            <template #upload-button>
                                <li class="friend_setting_item" style="justify-content: center;width:100%;">
                                    更换群头像
                                </li>
                            </template>
                        </a-upload>
                    </ul>
                    <ul class="friend_setting_card setting_btn">
                        <a-upload :show-file-list="false" :action="appStore.server + '/upload/image/'" @success="uploadCardSuccess">
                            <template #upload-button>
                                <li class="friend_setting_item" style="justify-content: center;width:100%;">
                                    更换群聊资料卡背景
                                </li>
                            </template>
                        </a-upload>
                    </ul>
                    <header style="margin-left:10px;">其他管理</header>
                    <ul @click="showLevelDialog=true" class="friend_setting_card setting_btn">
                        <li class="friend_setting_item" style="justify-content: center;width:100%;">
                            群等级设置
                        </li>
                    </ul>
                    <ul v-if="isMaster" @click="showAddManager=true" class="friend_setting_card setting_btn">
                        <li class="friend_setting_item" style="justify-content: center;">
                        设置管理员
                        </li>
                    </ul>
                    <ul v-if="isMaster" @click="showRemoveManager=true" class="friend_setting_card setting_btn">
                        <li class="friend_setting_item" style="justify-content: center;">
                        移除管理员
                        </li>
                    </ul>
                </template>
            </div>
            <div :style="`margin-top:20px;border-radius:8px;background-color:var(--white);backdrop-filter:blur(8px)`">
                <header style="margin-left:10px;">聊天设置</header>
                <ul class="friend_setting_card setting_btn">
                    <li class="friend_setting_item" style="justify-content: center;">
                    删除聊天缓存
                    </li>
                </ul>
            </div>
            <!-- 群聊成员列表 -->
            <CustomConfirm v-model="showMebersDialog" :center="true">
                <template #custom>
                    <header class="title" style="height:60px;">
                        <span class="iconfont">&#xe64f;</span>
                        <span>成员列表</span>
                    </header>
                    <div class="container" style="max-height:500px;overflow:auto;">
                        <div class="member-list">
                            <div v-for="member in room_info?.group_status.members" class="member-item">
                                <a-popover  position="left" trigger="click">
                                    <CustomAvatar :src="member.avatar" :circle="true" no-border="true" size="50px" :style="{marginRight:'10px'}"></CustomAvatar>
                                    <template #content>
                                        <UserInGroupCard :group_user_info="member"></UserInGroupCard>
                                    </template>
                                </a-popover>
                                <div class="member-info">
                                <div class="member-name">{{member.username}}</div>
                                <div class="member-position">{{member.position}}</div>
                                </div>
                                <button @click="removeMemberCallback(member.user_id,member.username)" v-if="isManager && member.position != '群主' && member.position != '管理员'" class="remove-btn">移出群聊</button>
                            </div>
                            <!-- 更多成员项可以在这里添加 -->
                        </div>

                    </div>
                </template>
            </CustomConfirm>
            <CustomConfirm v-model="showBanAddConfirm" :ok="userBanAppendCallback" title="加入黑名单" content="你确定要将对方加入黑名单吗？你将无法发送消息给对方"></CustomConfirm>
             <!-- 好友选择器 -->
            <FriendOption v-if="showFriendOption" v-model="showFriendOption" :friend_list="choseFriendGroupOuterList" :ok="sendGroupInvite"></FriendOption>
            <!-- 禁言用户 -->
            <CustomConfirm v-model="showBanTalkDialog" :center="true">
                <template #custom>
                    <header class="title" style="height:60px;">
                        <span class="iconfont">&#xe64f;</span>
                        <span>成员列表</span>
                    </header>
                    <div class="container" style="max-height:500px;overflow:auto;">
                        <div class="member-list">
                            <div v-for="member in room_info?.group_status.members" class="member-item">
                                <a-popover  position="left" trigger="click">
                                    <CustomAvatar :src="member.avatar" :circle="true" no-border="true" size="50px" :style="{marginRight:'10px'}"></CustomAvatar>
                                    <template #content>
                                        <UserInGroupCard :group_user_info="member"></UserInGroupCard>
                                    </template>
                                </a-popover>
                                <div class="member-info">
                                <div class="member-name">{{member.username}}</div>
                                <div class="member-position">{{member.position}}</div>
                                </div>
                                <div v-if="isManager && member.position != '群主'">
                                    <template v-if="member.position == '管理员' && isMaster">
                                        <button v-if="member.ban_talk" @click="noBanUser(member)" class="remove-btn" style="background-color: var(--blue);">解除禁言</button>
                                        <button v-else @click="banUser(member)" class="remove-btn">禁言</button>
                                    </template>
                                    <template v-else-if="member.position != '管理员'">
                                        <button v-if="member.ban_talk" @click="noBanUser(member)" class="remove-btn" style="background-color: var(--blue);">解除禁言</button>
                                        <button v-else @click="banUser(member)" class="remove-btn">禁言</button>
                                    </template>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </template>
            </CustomConfirm>
            <!-- 设置管理员 -->
            <CustomConfirm v-model="showAddManager" :center="true">
                <template #custom>
                    <header class="title" style="height:60px;">
                        <span class="iconfont">&#xe64f;</span>
                        <span>成员列表</span>
                    </header>
                    <div class="container" style="max-height:500px;overflow:auto;">
                        <div class="member-list">
                            <div v-for="member in noManagerMember" class="member-item">
                                <a-popover  position="left" trigger="click">
                                    <CustomAvatar :src="member.avatar" :circle="true" no-border="true" size="50px" :style="{marginRight:'10px'}"></CustomAvatar>
                                    <template #content>
                                        <UserInGroupCard :group_user_info="member"></UserInGroupCard>
                                    </template>
                                </a-popover>
                                <div class="member-info">
                                <div class="member-name">{{member.username}}</div>
                                <div class="member-position">{{member.position}}</div>
                                </div>
                                <button @click="setPositionToManager(member.user_id,member.username)" class="remove-btn" style="background-color: var(--blue);">任命管理员</button>
                            </div>
                            <div v-if="!noManagerMember.length" style="margin:40px;text-align:center;width: 100%;">
                                <span class="iconfont">&#xe694;</span>
                                <span>该群没有可任命成员</span>
                            </div>
                        </div>

                    </div>
                </template>
            </CustomConfirm>
            <!-- 移除管理员 -->
            <CustomConfirm v-model="showRemoveManager" :center="true">
                <template #custom>
                    <header class="title" style="height:60px;">
                        <span class="iconfont">&#xe64f;</span>
                        <span>成员列表</span>
                    </header>
                    <div class="container" style="max-height:500px;overflow:auto;">
                        <div class="member-list">
                            <div v-for="member in isManagerMember" class="member-item">
                                <a-popover  position="left" trigger="click">
                                    <CustomAvatar :src="member.avatar" :circle="true" no-border="true" size="50px" :style="{marginRight:'10px'}"></CustomAvatar>
                                    <template #content>
                                        <UserInGroupCard :group_user_info="member"></UserInGroupCard>
                                    </template>
                                </a-popover>
                                <div class="member-info">
                                <div class="member-name">{{member.username}}</div>
                                <div class="member-position">{{member.position}}</div>
                                </div>
                                <button @click="setPositionToMember(member.user_id,member.username)" class="remove-btn">取消管理员职位</button>
                            </div>
                            <div v-if="!isManagerMember.length" style="margin:40px;text-align:center;width: 100%;">
                                <span class="iconfont">&#xe694;</span>
                                <span>该群还没有管理员</span>
                            </div>
                            <!-- 更多成员项可以在这里添加 -->
                        </div>

                    </div>
                </template>
            </CustomConfirm>
            <!-- 群等级设置 -->
            <CustomConfirm v-model="showLevelDialog" :center="true">
                <template #custom>
                    <header class="title" style="height:60px;">
                        <span class="iconfont">&#xe64e;</span>
                        <span>群等级称号修改</span>
                    </header>
                    <div class="container level_list_con" style="display:flex;">
                        <CustomCard v-for="item in levelForm" :title="item.level + '级(Level ' +item.level + ')'" :style="{flexGrow:item.level == 7 ? 1 : 0}">
                            <template #content>
                                <a-input v-model="item.level_name" @blur="updateGroupLevel"></a-input>
                            </template>
                        </CustomCard>
                        <!-- <CustomCard title="2级(Level 2)">
                            <template #content>
                                <a-input></a-input>
                            </template>
                        </CustomCard>
                        <CustomCard title="3级(Level 3)">
                            <template #content>
                                <a-input></a-input>
                            </template>
                        </CustomCard>
                        <CustomCard title="4级(Level 4)">
                            <template #content>
                                <a-input></a-input>
                            </template>
                        </CustomCard>
                        <CustomCard title="5级(Level 5)">
                            <template #content>
                                <a-input></a-input>
                            </template>
                        </CustomCard>
                        <CustomCard title="6级(Level 6)">
                            <template #content>
                                <a-input></a-input>
                            </template>
                        </CustomCard>
                        <CustomCard title="7级(Level 7)" style="flex-grow:1">
                            <template #content>
                                <a-input></a-input>
                            </template>
                        </CustomCard> -->
                    </div>
                </template>
            </CustomConfirm>
        </a-drawer>
    </div>
</template>

<script setup>
const parentId = 'parent-' + Math.random().toString(36).substring(2, 15);
import { ref,reactive,computed,watch,toRaw } from 'vue';
import { onBeforeRouteUpdate,onBeforeRouteLeave, useRoute } from 'vue-router';

import ChatExtra from './ChatExtra.vue';
import ChatRoom from './ChatRoom.vue';
import { onMounted } from 'vue';
import useRoomStore from '@/stores/room';
import useUserStore from '@/stores/user';
import useAppStore from '@/stores/app';
import { useRouter } from 'vue-router';
import { onUnmounted } from 'vue';
import CustomConfirm from '@/components/CustomConfirm.vue'
import UserInGroupCard from '@/components/UserInGroupCard.vue'
import CustomInput from '@/components/CustomInput.vue'
import CustomTips from '@/components/CustomTips.vue'
import CustomAvatar from '@/components/CustomAvatar.vue'
import FriendOption from '@/components/FriendOption.vue'
import CustomCard from '@/components/CustomCard.vue'
import customMessage from '@/utils/customMessage';
import useFriendStore from '@/stores/friend';
import useGroupStore from '@/stores/group';
const roomStore = useRoomStore();
const userStore = useUserStore();
const groupStore = useGroupStore();
const friendStore = useFriendStore();
const appStore = useAppStore();
const route = useRoute();
const showMebersDialog = ref(false);
const showFriendOption = ref(true);
const showAddManager = ref(false);
const showRemoveManager = ref(false);
const showBanTalkDialog = ref(false);
const showLevelDialog = ref(false);
const more_setting = ref(false);
const room_id = ref(null);
const deleteLocal = () => {
    roomStore.deleteCache(room_id.value);
}
const room_info = computed(() => {
    return roomStore.room_list[room_id.value];
});
const noManagerMember = computed(() => {
    const members = room_info.value.group_status.members;
    return members.filter(member => member.position != '群主' && member.position != '管理员');
})
const isManagerMember = computed(() => {
    const members = room_info.value.group_status.members;
    return members.filter(member => member.position == '管理员');
})
// 禁言
const banUser = (member) => {
    groupStore.banTalkGroup({
        member_list:[member],
        ban_talk:1,
        group_id:room_info.value.group_status.group_id,
    })
    .then(msg => {
        customMessage({type:'normal',value:msg})
        showBanTalkDialog.value = false;
        roomStore.sendMessage({
            receiver_id: room_info.value.group_status.group_id,
            content:member.username + '已被禁言',
            media_type:'通知',
            file_size:'0',
            type:'群聊',
            room_id:room_info.value.room_id,
        });
    })
}
// 取消禁言
const noBanUser = (member) => {
    groupStore.banTalkGroup({
        member_list:[member],
        ban_talk:0,
        group_id:room_info.value.group_status.group_id,
    })
    .then(msg => {
        customMessage({type:'normal',value:msg})
        showBanTalkDialog.value = false;
        roomStore.sendMessage({
            receiver_id: room_info.value.group_status.group_id,
            content:member.username + '已取消禁言',
            media_type:'通知',
            file_size:'0',
            type:'群聊',
            room_id:room_info.value.room_id,
        });
    })
}
const setPositionToMember = (user_id,username) => {
    groupStore.setPosition({
        target_id:user_id,
        position:'成员',
        group_id:room_info.value.group_status.group_id,
    })
    .then(msg => {
        customMessage({type:'normal',value:msg})
        showRemoveManager.value = false;
        roomStore.sendMessage({
            receiver_id: room_info.value.group_status.group_id,
            content:'群主取消了' + username + '的管理员身份',
            media_type:'通知',
            file_size:'0',
            type:'群聊',
            room_id:room_info.value.room_id,
        });
    })
}
const setPositionToManager = (user_id,username) => {
    groupStore.setPosition({
        target_id:user_id,
        position:'管理员',
        group_id:room_info.value.group_status.group_id,
    })
    .then(msg => {
        customMessage({type:'normal',value:msg})
        showRemoveManager.value = false;
        roomStore.sendMessage({
            receiver_id: room_info.value.group_status.group_id,
            content:'群主任命' + username + '为管理员',
            media_type:'通知',
            file_size:'0',
            type:'群聊',
            room_id:room_info.value.room_id,
        });
    })
}
const showRenameDialog = ref(false);
const showBanAddConfirm = ref(false);
const friend_status = ref();
const group_status = ref();
const group_info = ref();
const user_ban_list = ref([]);
// 自己是管理者
const isManager = computed(() => {
    const members = room_info.value.group_status.members;
    const self = members.find(member => member.user_id == userStore.user_info.user_id);
    return self.position == '群主' || self.position == '管理员'
})
// 自己是群主
const isMaster = computed(() => {
    const members = room_info.value.group_status.members;
    const self = members.find(member => member.user_id == userStore.user_info.user_id);
    return self.position == '群主'
})
const updateForm = reactive({
    top_up:'',
    no_disturb:'',
    ignored:'',
    remark:'',
    group_name:'',
})
const managerUpdateForm = reactive({
    group_name:'',
    avatar:'',
    description:'',
    space_background:'',
    auth:'',
    auth_query:'',
    all_ban_talk:'',
    tags:[],
})
const levelForm = reactive([
    
])
const updateGroupLevel = () => {
    groupStore.groupLevelSet({
        level_list:toRaw(levelForm),
        group_id:group_status.value.group_id,
    })
    .then(() => {
        roomStore.getRoomInfo(room_id.value);
    })
}
const isBan = computed(() => {
    if (!user_ban_list.value?.length) return;
    console.log(user_ban_list.value.some(ban_user => ban_user.user_id == friend_status.value.friend_info.user_id))
    return user_ban_list.value.some(ban_user => ban_user.user_id == friend_status.value.friend_info.user_id)
})
const uploadAvatarSuccess = (e) => {
    const { filename, mimetype } = e.response.data;
    managerUpdateForm.avatar = filename;
    managerUpdateGroup().then(msg => {
        customMessage({type:'normal',value:'上传成功'})
    })
};
const uploadCardSuccess = (e) => {
    const { filename, mimetype } = e.response.data;
    managerUpdateForm.space_background = filename;
    managerUpdateGroup().then(msg => {
        customMessage({type:'normal',value:'上传成功'})
    })
};

const managerUpdateGroup = () => {
    return groupStore.groupUpdate({
        ...toRaw(managerUpdateForm),
        group_id:group_status.value.group_id,
    }).then(msg => {
        roomStore.getRoomInfo(room_id.value);
    }).catch(data => {
        customMessage({type:'error',value:data.msg})
    })
}
const updateGroup = () => {
    groupStore.setGroup({
        group_id:group_status.value.group_id,
        top_up:updateForm.top_up,
        no_disturb:updateForm.no_disturb,
        ignored:updateForm.ignored,
    }).then(msg => {
        roomStore.getRoomInfo(room_id.value);
    }).catch(data => {
        customMessage({type:'error',value:data.msg})
    })
}
const updateFriend = (tips) => {
    friendStore.friendSet({
        friend_id:friend_status.value.friend_id,
        top_up:updateForm.top_up,
        no_disturb:updateForm.no_disturb,
        ignored:updateForm.ignored,
        remark:updateForm.remark
    }).then(msg => {
        roomStore.getRoomInfo(room_id.value);
        showRenameDialog.value = false;
    }).catch(data => {
        customMessage({type:'error',value:data.msg})
    })
}
// 移出群成员
const removeMemberCallback = (target_id,username) => {
    groupStore.removeMember({
        target_id,
        group_id:room_info.value.group_status.group_id,
    })
    .then(msg => {
        customMessage({type:'normal',value:msg})
        roomStore.sendMessage({
            receiver_id: room_info.value.group_status.group_id,
            content:username + '被移出群聊',
            media_type:'通知',
            file_size:'0',
            type:'群聊',
            room_id:room_info.value.room_id,
        });
    })
    .catch(data => {
        customMessage({type:'error',value:data.msg})
    })
    .finally(() => {
        roomStore.getRoomInfo(room_info.value.room_id);
        showMebersDialog.value = false;
    })
}
// 发出群聊邀请
const sendGroupInvite = async (list) => {
    list.forEach(item => {
        groupStore.groupRequestInvite({
           group_id:room_info.value.group_status.group_id,
           introduce:'请你加入该群聊',
           receiver_id:item.friend_id
        });
    })
    customMessage({type:'normal',value:'已发出邀请'})
}
// 获取不在选中群聊下的好友列表
const choseFriendGroupOuterList = computed(() => {
    const members = room_info.value.group_status.members;
    if (!members.length) {
        return [];
    } else {
        const maps = members.map(item => item.user_id)
        return friendStore.friend_list.filter(friend => !maps.includes(friend.friend_id))
    }
})
// 加入黑名单
const userBanAppendCallback = () => {
    userStore.userBanAppend(friend_status.value.friend_info.user_id)
        .then(msg => {
            customMessage({ type: 'normal', value: msg })
            reload();
        })
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
// 移出黑名单
const userBanRemoveCallback = () => {
    userStore.userBanRemove(friend_status.value.friend_info.user_id)
        .then(msg => {
            customMessage({ type: 'normal', value: msg })
            reload();
        })
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
const reload = async () => {
    user_ban_list.value = await userStore.userBanList()
    if(room_info.value.friend_status){
        friend_status.value = room_info.value.friend_status
        updateForm.top_up = Boolean(friend_status.value?.top_up);
        updateForm.no_disturb = Boolean(friend_status.value?.no_disturb);
        updateForm.ignored = Boolean(friend_status.value?.ignored);
        updateForm.remark = friend_status.value?.remark;

    }else{
        group_status.value = room_info.value.group_status
        const self = group_status.value.members.find(member => userStore.user_info.user_id == member.user_id);
        group_info.value = room_info.value.group_status.group_info
        updateForm.top_up = Boolean(self.top_up);
        updateForm.no_disturb = Boolean(self.no_disturb);
        updateForm.ignored = Boolean(self.ignored);
        console.log(group_status.value)

        managerUpdateForm.group_name = group_status.value.group_name;
        managerUpdateForm.avatar = group_status.value.avatar;
        managerUpdateForm.description = group_status.value.description;
        managerUpdateForm.space_background = group_status.value.space_background;
        managerUpdateForm.auth = group_status.value.auth;
        managerUpdateForm.auth_query = group_status.value.auth_query;
        managerUpdateForm.all_ban_talk = group_status.value.all_ban_talk;
        managerUpdateForm.tags = group_status.value.tags.split(',');
        levelForm.splice(0,levelForm.length,...group_status.value.group_level)
    }
}
onMounted(async () => {
    room_id.value = route.query.room_id;
    roomStore.open_room_id = room_id.value = route.query.room_id;
    room_info.value = await roomStore.getRoomInfo(route.query.room_id);
    reload();
    showFriendOption.value = false;
})
onBeforeRouteUpdate(async(to,from) => {
    room_id.value = to.query.room_id;
    roomStore.open_room_id = room_id.value = to.query.room_id;
    room_info.value = await roomStore.getRoomInfo(to.query.room_id);
    reload();
})
onUnmounted(() => {
    roomStore.open_room_id = room_id.value = null;
})
</script>

<style lang="scss" scoped>

.chat_left,
.chat_archive{
    flex-shrink: 0;
}
.chat_right{
    flex-grow:1;
    display: flex;
    flex-direction: column;
}
.chat_right_header{
    height: 58px;
    line-height: 75px;
    padding-left: 16px;
    color: var(--dark);
    font-size: 1rem;
    background-color: var(--white);
    box-shadow: -3px -8px 20px var(--blue);
}

.chat_inner{
    position: relative;
    flex-grow:1;
    background-color: var(--darkColor);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
}
.friend_setting {
      top: 0px;
      position: sticky;
      width: 20%;
      min-width: 200px;
      font-size: 1rem;
      color: var(--dark);
      &.group{
        width:100%;
      }
    }

    .setting_btn:hover {
        cursor: pointer;
        background-color: var(--blue);
        color: var(--white);
      }

    .friend_setting_card {
      border-radius: 8px;
      margin: 15px 8px;
      padding: 0px 15px;
      background-color: var(--formColor);

      .friend_setting_item {
        padding: 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:not(:last-child) {
          border-bottom: 1px solid var(--formColor);
        }

        &:deep(.arco-switch-checked) {
          background-color: var(--blue);
        }
      }
    }


    
  .group-info {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .group-details {
    flex: 1;
  }
  .group-name {
    font-size: 18px;
    font-weight: bold;
    color: var(--dark);
  }
  .group-number {
    font-size: 14px;
    color: var(--lightDark);
  }
  .members {
    position: relative;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .member-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .invite-btn {
    border-radius: 50%;
    background: var(--lightDark);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
  }
  .settings-item {
    margin-bottom: 20px;
    padding:0 10px;
    &:deep(.arco-input){
        border-radius: 6px;
    }
  }
  .settings-item label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
  }
  .settings-item input[type="text"],
  .settings-item textarea,
  .settings-item select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .settings-item button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(135deg, #6dd5ed, #2193b0);
    color: var(--white);
    font-size: 16px;
    cursor: pointer;
    margin-top: 5px;
  }
  .view-all-members {
    text-align: center;
    font-size: 14px;
    color: var(--dark);
    cursor: pointer;
    margin-top: 10px;
  }
  .level_list_con{
    flex-wrap:wrap;
    >*{
        width:48%!important;
        margin-left:.8%;
        margin-right:.8%;
    }
  }
  .container{
    width:100%;
    .member-list {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: var(--white);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .member-item {
        display: flex;
        align-items: center;
        padding: 10px;
        justify-content: space-between;
        width: 100%;
        border-radius:4px;
        margin-bottom: 4px;
    }

    .member-item:last-child {
        border-bottom: none;
    }

    .member-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 15px;
        background-size: cover;
        background-position: center;
    }

    .member-info {
        flex: 1;
    }

    .member-name {
        font-size: 16px;
        font-weight: bold;
    }

    .member-position {
        font-size: 14px;
        color: #666;
    }

    .remove-btn {
        font-size:.9rem;
        padding: 5px 10px;
        background-color: var(--red);
        color: var(--white);
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .remove-btn:hover {
        opacity: .6;
    }
  }
</style>