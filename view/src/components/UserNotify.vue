<template>
    <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue" :center="true"
        style="width:600px;">
        <template #custom>
            <header class="title" style="height:125px;">
                <span class="iconfont">&#xe606;</span>
                <span>用户通知</span>
            </header>
            <div class="container" style="width:100%;height: 540px;">
                <div class="container_content">
                    <div class="net_tag_list">
                        <header class="net_tag_list_tabber">
                            <div @click="active_tabber = 'top'" :active="active_tabber == 'top'"
                                class="net_tag_list_tabber_item">
                                <span class="iconfont">&#xe782;</span>
                                <span>好友通知</span>
                            </div>
                            <div @click="active_tabber = 'find'" :active="active_tabber == 'find'"
                                class="net_tag_list_tabber_item">
                                <span class="iconfont">&#xe65e;</span>
                                <span>群聊通知</span>
                            </div>
                            <div @click="active_tabber = 'sys'" :active="active_tabber == 'sys'"
                                class="net_tag_list_tabber_item">
                                <span class="iconfont">&#xe65e;</span>
                                <span>系统通知</span>
                            </div>
                        </header>
                        <div v-if="active_tabber == 'top'" class="list_box">
                            <CustomTips value="这里是好友通知,可以在这检查好友请求"></CustomTips>
                            <hr class="custom_hr">
                            <div class="notify_list">
                                <a-card v-for="request in friendStore.friend_request" class="notify_item">
                                    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }">
                                        <!-- 如果是自己向别人发起的请求 -->
                                        <template v-if="userStore.user_info.user_id == request.sender_id">
                                            <div :style="{ display: 'flex', alignItems: 'center', }">
                                                    <a-popover position="right" trigger="click">
                                                        <CustomAvatar :src="request.receiver_info.avatar" size="4rem" background-color="var(--white)"></CustomAvatar>
                                                        <template #content>
                                                            <UserCard :user_id="request.receiver_info.user_id"></UserCard>
                                                        </template>
                                                    </a-popover>
                                                <div class="notify_text"
                                                    style="height:4rem;color:var(--dark);display:flex;flex-direction:column;justify-content: space-between">
                                                    <a-typography-text><a-link
                                                            :href="`/#/layout/contact/user/space?type=user&user_id=${request.receiver_info.user_id}`"
                                                             :hoverable="false"
                                                            style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.receiver_info.username }}</a-link><span>正在验证你的请求</span><span
                                                            style="color:var(--lightDark);font-size:.9rem;margin-left:4px;">{{ formatTime(request.updated_at) }}</span></a-typography-text><p class="notify_item_text">
                                                        <a-tag v-if="request.receiver_info.gender == '女'"
                                                            color="rgb(220 99 111)" size="small">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe616;</span>
                                                            </template>
                                                            女性
                                                        </a-tag>
                                                        <a-tag v-else-if="request.receiver_info.gender == '男'"
                                                            color="#168cff" size="small">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe7ac;</span>
                                                            </template>
                                                            男性
                                                        </a-tag>
                                                        <a-tag v-else color="#0fc6c2" size="small">
                                                            <template #icon>
                                                                <span class="iconfont">&#xeaf0;</span>
                                                            </template>
                                                            性别保密
                                                        </a-tag>
                                                        <a-tag color="#86909c" size="small" style="margin-left:4px;">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe605;</span>
                                                            </template>
                                                            {{ request.receiver_info.age == '保密' ? '年龄保密' : request.receiver_info.age + '岁' }}
                                                        </a-tag>
                                                        <a-tag color="#ff5722" size="small" style="margin-left:4px;">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe64d;</span>
                                                            </template>
                                                            {{ request.receiver_info.born_at ? getConstellation(request.receiver_info.born_at) : '星座未知' }}
                                                        </a-tag>
                                                    </p>
                                                </div>
                                            </div>
                                            <p class="notify_item_result">
                                                <span v-if="request.status == '等待'">等待对方回应</span>
                                                <span v-if="request.status == '同意'">已同意</span>
                                                <span v-if="request.status == '拒绝'">已拒绝</span>
                                                <span v-if="request.status == '过期'">已过期</span>
                                            </p>
                                        </template>
                                        <!-- 如果是别人向自己发起的请求 -->
                                        <template v-else>
                                            <div :style="{ display: 'flex', alignItems: 'center', }">
                                                <a-popover position="right" trigger="click">
                                                        <CustomAvatar :src="request.sender_info.avatar" size="4rem" background-color="var(--white)"></CustomAvatar>
                                                        <template #content>
                                                            <UserCard :user_id="request.sender_info.user_id"></UserCard>
                                                        </template>
                                                    </a-popover>
                                                <div class="notify_text"
                                                    style="height:4rem;color:var(--dark);display:flex;flex-direction:column;justify-content: space-between">
                                                    <a-typography-text><a-link
                                                            :href="`/#/layout/contact/user/space?type=user&user_id=${request.sender_info.user_id}`"
                                                             :hoverable="false"
                                                            style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.sender_info.username }}</a-link><span>请求加为好友</span><span
                                                            style="color:var(--lightDark);font-size:.9rem;margin-left:4px;">{{ formatTime(request.updated_at) }}</span></a-typography-text>
                                                    <p class="notify_item_text">
                                                        <a-tag v-if="request.sender_info.gender == '女'"
                                                            color="rgb(220 99 111)" size="small">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe616;</span>
                                                            </template>
                                                            女性
                                                        </a-tag>
                                                        <a-tag v-else-if="request.sender_info.gender == '男'"
                                                            color="#168cff" size="small">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe7ac;</span>
                                                            </template>
                                                            男性
                                                        </a-tag>
                                                        <a-tag v-else color="#0fc6c2" size="small">
                                                            <template #icon>
                                                                <span class="iconfont">&#xeaf0;</span>
                                                            </template>
                                                            性别保密
                                                        </a-tag>
                                                        <a-tag color="#86909c" size="small" style="margin-left:4px;">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe605;</span>
                                                            </template>
                                                            {{ request.sender_info.age == '保密' ? '年龄保密' :
                                                            request.sender_info.age + '岁' }}
                                                        </a-tag>
                                                        <a-tag color="#ff5722" size="small" style="margin-left:4px;">
                                                            <template #icon>
                                                                <span class="iconfont">&#xe64d;</span>
                                                            </template>
                                                            {{ request.sender_info.born_at ?
                                                            getConstellation(request.sender_info.born_at) : '星座未知' }}
                                                        </a-tag>
                                                    </p>
                                                </div>
                                            </div>
                                            <a-dropdown-button v-if="request.status == '等待'"
                                                class="dropdown_btn notify_item_result" size="small">
                                                <span @click="replyCallback(request.id,'同意')">同意</span>
                                                <template #icon>
                                                    <icon-down />
                                                </template>
                                                <template #content>
                                                    <a-button @click="replyCallback(request.id,'拒绝')"
                                                        style="width:80px;border:none;box-shadow: none;background-color: var(--red);color:var(--white);"
                                                        type="warning">拒绝</a-button>
                                                </template>
                                            </a-dropdown-button>
                                            <p v-else class="notify_item_result">
                                                <span v-if="request.status == '同意'">已同意</span>
                                                <span v-if="request.status == '拒绝'">已拒绝</span>
                                                <span v-if="request.status == '过期'">已过期</span>
                                            </p>
                                        </template>
                                    </div>
                                    <p style="margin-top:14px;color:var(--dark);">
                                        <template>
                                            <template v-if="userStore.user_info.user_id == request.sender_id">
                                                你的留言：
                                            </template>
                                            <template v-else>
                                                对方的留言：
                                            </template>
                                        </template>
                                        {{ request.introduce }}
                                    </p>
                                </a-card>
                            </div>
                        </div>
                        <div v-if="active_tabber == 'find'" class="list_box">
                            <div class="list_header">
                                <CustomTips style="flex-grow:1;" value="这里是群聊通知,可以在这检查群聊请求"></CustomTips>
                            </div>
                            <hr class="custom_hr">
                            <div class="notify_list">
                                <a-card v-for="request in groupStore.group_request" class="notify_item">
                                    <!-- 自己申请加入的群聊请求 需管理员同意-->
                                    <div v-if="request.receiver_id == userStore.user_info.user_id && request.sender_id == null" class="notify_content">
                                        <div
                                            :style="{ display: 'flex', alignItems: 'center', }"
                                        >
                                            <CustomAvatar :src="request.group_info.avatar" size="4rem" background-color="var(--white)"></CustomAvatar>
                                            <div class="notify_text" style="height:4rem;color:var(--blue);display:flex;flex-direction:column;">
                                                <a-typography-text>你申请加入<a-link :href="`/#/layout/contact/group/space?group_id=${request.group_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.group_info.group_name }}</a-link>
                                                    <span style="color: var(--lightDark); font-size: 0.9rem; margin-left: 4px;">{{ formatTime(request.updated_at) }}</span>
                                                </a-typography-text>
                                                <p class="notify_item_text">
                                                    <a-tag v-for="tag in request.group_info.tags?.split(',')" size="small" style="margin-left:4px;background-color:var(--blue);color:var(--white)">
                                                        {{ tag }}
                                                    </a-tag>
                                                </p>
                                            </div>
                                            <p class="notify_item_result">
                                                <span v-if="request.status == '等待'">等待对方回应</span>
                                                <span v-if="request.status == '同意'">已同意</span>
                                                <span v-if="request.status == '拒绝'">已拒绝</span>
                                                <span v-if="request.status == '过期'">已过期</span>
                                            </p>
                                        </div>
                                        <p v-if="request.group_info.auth == 'query'" style="margin-top:14px;color:var(--dark);">
                                            <p><span style="background-color:var(--blue);color:var(--white);padding:2px;margin-right:2px;">群聊提问</span>{{request.group_info.auth_query}}</p>
                                            <p><span style="background-color:var(--red);color:var(--white);padding:2px;margin-right:2px;">你的回答</span>{{ request.introduce }}</p>
                                        </p>
                                        <p v-else style="margin-top:14px;color:var(--dark);">你的留言：{{ request.introduce }}</p>
                                    </div>
                                    <!-- 自己邀请他人加入群聊 -->
                                    <div v-else-if="request.sender_id == userStore.user_info.user_id">
                                        <div
                                            :style="{ display: 'flex', alignItems: 'center',justifyContent: 'space-between' }"
                                        >
                                            <CustomAvatar :src="request.group_info.avatar" size="4rem" background-color="var(--white)"></CustomAvatar>
                                            <div class="notify_text" style="height:4rem;color:var(--blue);display:flex;flex-direction:column;">
                                                <a-typography-text>你邀请<a-link :href="`/#/layout/contact/user/space?type=user&user_id=${request.receiver_info.user_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.receiver_info.username }}</a-link>加入<a-link :href="`/#/layout/contact/group/space?group_id=${request.group_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.group_info.group_name }}</a-link>
                                                    <span style="color: var(--lightDark); font-size: 0.9rem; margin-left: 4px;">{{ formatTime(request.updated_at) }}</span>
                                                </a-typography-text>
                                                <p class="notify_item_text">
                                                    <a-tag v-for="tag in request.group_info.tags?.split(',')" size="small" style="margin-left:4px;background-color:var(--blue);color:var(--white)">
                                                        {{ tag }}
                                                    </a-tag>
                                                </p>
                                            </div>
                                            <p class="notify_item_result">
                                                <span v-if="request.status == '等待'">等待对方回应</span>
                                                <span v-if="request.status == '同意'">对方已同意</span>
                                                <span v-if="request.status == '拒绝'">对方已拒绝</span>
                                                <span v-if="request.status == '过期'">已过期</span>
                                            </p>
                                        </div>
                                        <p style="margin-top:14px;color:var(--dark);">你的留言：{{ request.introduce }}</p>
                                    </div>
                                    <!-- 他人邀请自己加入群聊 -->
                                    <div v-else-if="request.receiver_id == userStore.user_info.user_id">
                                        <div
                                            :style="{ display: 'flex', alignItems: 'center',justifyContent: 'space-between' }"
                                        >
                                            <CustomAvatar :src="request.group_info.avatar" size="4rem" background-color="var(--white)"></CustomAvatar>
                                            <div class="notify_text" style="height:4rem;color:var(--blue);display:flex;flex-direction:column;">
                                                <a-typography-text><a-link :href="`/#/layout/contact/user/space?type=user&user_id=${request.sender_info.user_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.sender_info.username }}</a-link>邀请你加入<a-link :href="`/#/layout/contact/group/space?group_id=${request.group_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.group_info.group_name }}</a-link>
                                                    <span style="color: var(--lightDark); font-size: 0.9rem; margin-left: 4px;">{{ formatTime(request.updated_at) }}</span>
                                                </a-typography-text>
                                                <p class="notify_item_text">
                                                    <a-tag v-for="tag in request.group_info.tags?.split(',')" size="small" style="margin-left:4px;background-color:var(--blue);color:var(--white)">
                                                        {{ tag }}
                                                    </a-tag>
                                                </p>
                                            </div>
                                            <p class="notify_item_result">
                                                <a-dropdown-button v-if="request.status == '等待'" class="dropdown_btn notify_item_result" size="small">
                                                    <span @click="replyInviteCallback({request_id:request.request_id,group_id:request.group_info.group_id,status:'同意'})">同意</span>
                                                    <template #icon>
                                                        <icon-down />
                                                    </template>
                                                    <template #content>
                                                        <a-button @click="replyInviteCallback({request_id:request.request_id,group_id:request.group_info.group_id,status:'拒绝'})" style="width:80px;border:none;box-shadow: none;background-color: var(--red);color:var(--white);" type="warning">拒绝</a-button>
                                                    </template>
                                                </a-dropdown-button>
                                                <span v-else-if="request.status == '同意'">你已同意</span>
                                                <span v-else-if="request.status == '拒绝'">你已拒绝</span>
                                                <span v-else-if="request.status == '过期'">已过期</span>
                                            </p>
                                        </div>
                                        <p style="margin-top:14px;color:var(--dark);">对方的留言：{{ request.introduce }}</p>
                                    </div>
                                    <!-- 他人申请加入自己管理的群聊请求 需自己或其他管理员同意 -->
                                    <div v-else>
                                        <div
                                            :style="{ display: 'flex', alignItems: 'center',justifyContent: 'space-between' }"
                                        >
                                            <CustomAvatar :src="request.group_info.avatar" size="4rem" background-color="var(--white)"></CustomAvatar>
                                            <div class="notify_text" style="height:4rem;color:var(--blue);display:flex;flex-direction:column;">
                                                <a-typography-text><a-link :href="`/#/layout/contact/user/space?type=user&user_id=${request.receiver_info.user_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.receiver_info.username }}</a-link>申请加入你管理的<a-link :href="`/#/layout/contact/group/space?group_id=${request.group_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.group_info.group_name }}</a-link>
                                                    <span style="color: var(--lightDark); font-size: 0.9rem; margin-left: 4px;">{{ formatTime(request.updated_at) }}</span>
                                                </a-typography-text>
                                                <p class="notify_item_text">
                                                    <a-tag v-for="tag in request.group_info.tags?.split(',')" size="small" style="margin-left:4px;background-color:var(--blue);color:var(--white)">
                                                        {{ tag }}
                                                    </a-tag>
                                                </p>
                                                <p v-if="request.status != '等待'">
                                                    <template v-if="request.handle_id == userStore.user_info.user_id">
                                                        已被你{{ request.status }}
                                                    </template>
                                                    <template v-else-if="request.handle_info">
                                                        <icon-check-circle-fill />
                                                        由<a-link :href="`/#/layout/contact/user/space?type=user&user_id=${request.handle_info?.user_id}`"  :hoverable="false" style="margin: 0 2px;color:var(--blue);font-size:inherit;">{{ request.handle_info.username }}</a-link>进行{{ request.status }}
                                                    </template>
                                                </p>
                                            </div>
                                            <p class="notify_item_result">
                                                <a-dropdown-button v-if="request.status == '等待'" class="dropdown_btn notify_item_result" size="small">
                                                    <span @click="replySendCallback({request_id:request.request_id,group_id:request.group_info.group_id,status:'同意'})">同意</span>
                                                    <template #icon>
                                                        <icon-down />
                                                    </template>
                                                    <template #content>
                                                        <a-button @click="replySendCallback({request_id:request.request_id,group_id:request.group_info.group_id,status:'拒绝'})" style="width:80px;border:none;box-shadow: none;background-color: var(--red);color:var(--white);" type="warning">拒绝</a-button>
                                                    </template>
                                                </a-dropdown-button>
                                                <span v-else-if="request.status == '过期'">已过期</span>
                                                <span v-else>已处理</span>
                                            </p>
                                        </div>
                                        <p v-if="request.group_info.auth == 'query'" style="margin-top:14px;color:var(--dark);">
                                            <p><span style="background-color:var(--blue);color:var(--white);padding:2px;margin-right:2px;">群聊提问</span>{{request.group_info.auth_query}}</p>
                                            <p><span style="background-color:var(--red);color:var(--white);padding:2px;margin-right:2px;">对方回答</span>{{ request.introduce }}</p>
                                        </p>
                                        <p v-else style="margin-top:14px;color:var(--dark);">对方的留言：{{ request.introduce }}</p>
                                    </div>
                                </a-card>
                            </div>
                        </div>
                        <div v-if="active_tabber == 'sys'" class="list_box">
                            <div class="list_header">
                                <CustomTips value="这是系统通知"></CustomTips>
                            </div>
                            <hr class="custom_hr">
                            <div class="empty_tips">
                                <span class="iconfont" style="font-size:1.4rem;">&#xe673;</span>
                                <span>系统通知为空</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </CustomConfirm>
</template>

<script setup>
import { onMounted, ref, toRaw,watch } from 'vue';
import CustomAvatar from './CustomAvatar.vue';
import CustomConfirm from './CustomConfirm.vue'
import CustomTags from './CustomTags.vue';
import CustomTips from './CustomTips.vue';
import UserCard from './UserCard.vue';
import useUserStore from '@/stores/user';
import customMessage from '@/utils/customMessage';
const userStore = useUserStore();
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue']);
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};
watch(() => props.modelValue,(newVal) => {
    if(newVal){
        friendStore.getFriendRequest()
        groupStore.getGroupRequest()
    }
})
const active_tabber = ref('top');
import useAppStore from '@/stores/app';
import useFriendStore from '@/stores/friend';
import { onBeforeRouteUpdate } from 'vue-router';
import { getConstellation,formatTime } from '@/utils/datetime';
import { ElMessage } from 'element-plus';
import useGroupStore from '@/stores/group';
const friendStore = useFriendStore();
const appStore = useAppStore();
const loading = ref(false);
const groupStore = useGroupStore();
async function replyCallback(id,status){
    await friendStore.replyFriendRequest({ id,status })
    .then(async msg => {
        await friendStore.getFriendRequest();
        customMessage({type:'normal',value:msg})
        friendStore.getFriendList();
    })
    .catch(data => customMessage({type:'error',value:data.msg}))
}
function replyInviteCallback({ request_id,group_id,status }){
    groupStore.groupRequestReplyInvite({ request_id,group_id,status })
    .then(msg => {
        groupStore.getGroupRequest();
        customMessage({type:'normal',value:msg})
        groupStore.getGroupList();
    })
    .catch(data => customMessage({type:'error',value:data.msg}))
}
function replySendCallback({ request_id,group_id,status }){
    groupStore.groupRequestReplySend({ request_id,group_id,status })
    .then(msg => {
        groupStore.getGroupRequest();
        customMessage({type:'normal',value:msg})
        groupStore.getGroupList();
    })
    .catch(data => customMessage({type:'error',value:data.msg}))
}
onMounted(async () => {
    friendStore.getFriendRequest()
    groupStore.getGroupRequest()
})
onBeforeRouteUpdate(async () => {
    friendStore.getFriendRequest()
    groupStore.getGroupRequest()
})
</script>

<style lang="scss" scoped>
.notify_text{
    margin-left:10px;
    flex-grow:1;
}
.container {
    user-select: none;
}

.container.dialog {
    display: flex;
}

.tag {
    cursor: pointer;
}
.notify_item_text{
    color: var(--white);
    .iconfont{
        color: var(--white);
        font-weight:bold;
        margin-right:0;
        margin:0 3px;
    }
}
.buttons {
    display: flex;
    transform: translateY(120%);

    .custom_button {
        margin: 0 4px;

        &.success {
            background-color: var(--dark);
        }
    }

    .iconfont {
        margin: 0 4px;
    }
}

.preview_box {
    width: 130px;
    border-radius: 4px;
    box-shadow: 2px 2px 1px 0px var(--light);
    background-color: var(--someWhite);
    border: 1px solid var(--light);
    display: flex;
    align-items: center;
    justify-content: center;

    .tag_list {
        justify-content: center;
    }
}

.del {
    background-color: var(--red);
    color: var(--white);
    width: 30px;
    height: 30px;
}

.noDel {
    background-color: var(--blue);
    color: var(--white);
    width: 30px;
    height: 30px;
}

.form {
    color: var(--black);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 10px;
}

.list {
    width: 100%;
    overflow-y: auto;
    overflow-x: auto;
    align-items: start;
    flex-wrap: wrap;
    padding-bottom: 10px;

    .item {
        margin-top: 12px;
        position: relative;
        width: 120px;
        flex-shrink: 0;
        background-color: var(--blue);
        padding: 10px;
        border-radius: 3px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 3px double var(--blue);
        border-radius: 4px;
        background-color: var(--white);
        box-shadow: 4px 4px 0px 0px var(--blue);
        padding-left: 2px;
        cursor: pointer;
        transition: all .3s;

        &:hover {
            .item_desc {
                background-color: var(--highBlue);
            }

            border-color: var(--highBlue);
            box-shadow: 4px 4px 0px 0px var(--highBlue);
        }

        >div {
            display: flex;
        }
    }

    .item_creator {
        display: flex;
        font-size: .8rem;
        align-items: center;

        .name {
            color: var(--highBlue);
            font-weight: bold;
            margin-left: 10px;
        }
    }

    .item_face {
        margin: 3px 0;
    }

    .item_desc {
        text-transform: uppercase;
        font-size: 0.8rem;
        position: absolute;
        top: 0px;
        left: 0px;
        transform: translateY(-50%);
        background-color: var(--blue);
        color: var(--white);
        border-radius: 3px;
        padding: 0 4px;
    }
}

.list_title {
    margin-left: 10px;
    color: var(--dark);
    font-size: .8rem;
    font-weight: bold;
}

.list_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.empty_tips {
    width: 100%;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    color: var(--lightDark);
}

.container {
    padding: 0;

    .container_content {
        height: calc(100% + 50px);
        transform: translateY(-50px);
        display: flex;
        flex-direction: column;

        >div {
            width: 100%;
        }
    }

    .user_tag_list {
        height: 72px;
        border-radius: 3px;
        background-color: var(--white);
        box-shadow: 1px 4px 4px var(--light);
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        padding-bottom: 0;
        padding-right: 10px;

        .user_tag_list_desc {
            position: absolute;
            top: 0px;
            left: 10px;
            transform: translateY(-50%);
            padding: 4px 30px;
            background-color: var(--dark);
            color: var(--white);
            border-radius: 3px;
        }
    }

    .net_tag_list {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .list_box {
            padding: 8px 12px;
            flex-grow: 1;
            background-color: var(--white);
            display: flex;
            flex-direction: column;
            max-height: 530px;
            overflow:auto;
        }
    }

    .custom_hr {
        box-shadow: inset 0 0 1px var(--light);
    }

    .net_tag_list_tabber {
        display: flex;

        .net_tag_list_tabber_item {
            flex-grow: 1;
            border-top: 6px solid var(--mostLightDark);
            background-color: var(--someWhite);
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            height: 40px;
            width: 120px;
            text-align: center;
            color: var(--lightDark);
            font-weight: bold;
            cursor: pointer;

            &[active=true],
            &:hover {
                border-top: 6px solid var(--blue);
                color: var(--blue);
                background-color: var(--white);
            }
        }
    }
}
</style>