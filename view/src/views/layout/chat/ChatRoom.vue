<template>
    <a-spin ref="chat_room" class="chat_room" :loading="loading" tip="正在装填信息">
        <div class="img"><div class="circle"></div><div class="circle" id="right"></div><div class="circle" id="bottom"></div></div>
        <div class="chat_room_messages" style="margin-bottom:100px;">
            <p style="color:white;">
            </p>
            <template v-for="(bubble,index) in roomStore.talk_list[props.room_info?.room_id]?.bubble_list">
                <!-- 时间分隔符 -->
                <div v-if="showTimeDivider(index, bubble)" class="tips_item tip_time">
                    {{ formatTime(bubble.created_at) }}
                </div>
                <dl v-if="bubble.media_type=='文本'" :class="{'message_item':true,'self':bubble.sender_info.user_id == userStore.user_info.user_id}" >
                    <!-- <a-avatar image-url="/src/assets/images/auth/auth.png" style="width:2.8rem;height:2.8rem;flex-shrink: 0;" shape="square"></a-avatar> -->
                    <a-popover position="right" trigger="click">
                        <CustomAvatar :src="bubble.sender_info.avatar" size="3.5rem" background-color="var(--white)" :circle="true" style="flex-shrink: 0"></CustomAvatar>
                        <template #content>
                            <UserCard :user_id="bubble.sender_info.user_id"></UserCard>
                        </template>
                    </a-popover>
                    
                    <div class="message_container">
                        <div class="message_firstline">
    
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id != userStore.user_info.user_id">
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                            </template>
                            <span class="message_username">{{bubble.sender_info.username}}</span>
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id == userStore.user_info.user_id">
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                            </template>
                        </div>
                        <dd class="message_bubble" :style="{ 
                            backgroundColor:bubble.sticker?.sticker_info.background_color,
                            backgroundImage:`url(${appStore.getServerSticker(bubble.sticker?.sticker_info.image_url)})`,
                            color:bubble.sticker?.sticker_info.text_color,
                        }">
                            <p class="message_content">{{ bubble.content }}</p>
                        </dd>
                    </div>
                    <button v-if="bubble.failed" @click="resend(bubble)" class="min_button failed">&#xe61b;</button>
                </dl>
                <dl v-else-if="bubble.media_type=='表情'" :class="{'image_item':true,'message_item':true,'self':bubble.sender_info.user_id == userStore.user_info.user_id}" >
                    <!-- <a-avatar image-url="/src/assets/images/auth/auth.png" style="width:2.8rem;height:2.8rem;flex-shrink: 0;" shape="square"></a-avatar> -->
                       <a-popover position="right" trigger="click">
                        <CustomAvatar :src="bubble.sender_info.avatar" size="3.5rem" background-color="var(--white)" :circle="true" style="flex-shrink: 0"></CustomAvatar>
                        <template #content>
                            <UserCard :user_id="bubble.sender_info.user_id"></UserCard>
                        </template>
                    </a-popover>
                    <div class="message_container">
                        <div class="message_firstline">
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id != userStore.user_info.user_id">
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                            </template>
                            <span class="message_username">{{bubble.sender_info.username}}</span>
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id == userStore.user_info.user_id">
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                            </template>
                        </div>
                        <dd class="message_bubble" :style="{ 
                            backgroundColor:bubble.sticker?.sticker_info.background_color,
                            backgroundImage:`url(${appStore.getServerSticker(bubble.sticker?.sticker_info.image_url)})`,
                            color:bubble.sticker?.sticker_info.text_color,
                        }">
                            <a-image
                                height="140"
                                :src="appStore.getServerEmoji(bubble.content)"
                            />
                        </dd>
                    </div>
                    <button v-if="bubble.failed" @click="resend(bubble)" class="min_button failed">&#xe61b;</button>
                </dl>
                <dl v-else-if="bubble.media_type=='媒体'" :class="{'image_item':true,'message_item':true,'self':bubble.sender_info.user_id == userStore.user_info.user_id}" >
                    <!-- <a-avatar image-url="/src/assets/images/auth/auth.png" style="width:2.8rem;height:2.8rem;flex-shrink: 0;" shape="square"></a-avatar> -->
                       <a-popover position="right" trigger="click">
                        <CustomAvatar :src="bubble.sender_info.avatar" size="3.5rem" background-color="var(--white)" :circle="true" style="flex-shrink: 0"></CustomAvatar>
                        <template #content>
                            <UserCard :user_id="bubble.sender_info.user_id"></UserCard>
                        </template>
                    </a-popover>
                    <div class="message_container">
                        <div class="message_firstline">
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id != userStore.user_info.user_id">
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                            </template>
                            <span class="message_username">{{bubble.sender_info.username}}</span>
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id == userStore.user_info.user_id">
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                            </template>
                        </div>
                        <dd class="message_bubble" :style="{ 
                            backgroundColor:bubble.sticker?.sticker_info.background_color,
                            backgroundImage:`url(${appStore.getServerSticker(bubble.sticker?.sticker_info.image_url)})`,
                            color:bubble.sticker?.sticker_info.text_color,
                        }">
                            <div v-if="isVideo(bubble.content)" @fullscreenchange="handleFullscreenChange"
                                style="max-width:400px;height:240px;">
                                <video :ref="el => players.push(el)" playsinline controls
                                    class="js-plyr">
                                    <source :src="appStore.getServerMedia(bubble.content)" />
                                </video>
                            </div>
                            <a-image v-else
                                height="140"
                                :src="appStore.getServerMedia(bubble.content)"
                            />
                        </dd>
                    </div>
                    <button v-if="bubble.failed" @click="resend(bubble)" class="min_button failed">&#xe61b;</button>
                </dl>
                <dl v-else-if="bubble.media_type=='文件'" :class="{'image_item':true,'file_item':true,'message_item':true,'self':bubble.sender_info.user_id == userStore.user_info.user_id}" >
                    <!-- <a-avatar image-url="/src/assets/images/auth/auth.png" style="width:2.8rem;height:2.8rem;flex-shrink: 0;" shape="square"></a-avatar> -->
                       <a-popover position="right" trigger="click">
                        <CustomAvatar :src="bubble.sender_info.avatar" size="3.5rem" background-color="var(--white)" :circle="true" style="flex-shrink: 0"></CustomAvatar>
                        <template #content>
                            <UserCard :user_id="bubble.sender_info.user_id"></UserCard>
                        </template>
                    </a-popover>
                    <dd @click="appStore.openFile(bubble.content)" style="display: flex;">
                        <div class="message_container">
                            <div class="message_firstline">
                                <template v-if="room_info?.group_status && bubble.sender_info.user_id != userStore.user_info.user_id">
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                            </template>
                            <span class="message_username">{{bubble.sender_info.username}}</span>
                            <template v-if="room_info?.group_status && bubble.sender_info.user_id == userStore.user_info.user_id">
                                <a-tag size="min" class="tag level" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.level">
                                    LV{{ bubble.sender_info.level }}:{{ room_info.group_status.group_level[bubble.sender_info.level - 1].level_name }}
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="bubble.sender_info.position == '群主'">
                                    群主
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="bubble.sender_info.position == '管理员'">
                                    管理员
                                </a-tag>
                                <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="bubble.sender_info.position == '成员'">
                                    成员
                                </a-tag>
                            </template>
                            </div>
                            <div class="file_box message_bubble" :style="{ 
                            backgroundColor:bubble.sticker?.sticker_info.background_color,
                            backgroundImage:`url(${appStore.getServerSticker(bubble.sticker?.sticker_info.image_url)})`,
                            color:bubble.sticker?.sticker_info.text_color,
                        }">
                                <div class="left" style="width:140px;height:160px;display:flex;flex-direction:column;justify-content: center;align-items: center;text-align: center">
                                    <icon-drive-file  style="font-size: 4rem;"/>
                                    <p style="white-space: wrap;">
                                        {{ bubble.content }}
                                    </p>
                                    <p style="color:var(--accentColor);margin-top:10px;font-weight: bold;">
                                        {{ (bubble.file_size / 1024 ).toFixed(1) + 'KB' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </dd>
                    <button v-if="bubble.failed" @click="resend(bubble)" class="min_button failed">&#xe61b;</button>
                </dl>
                <dl v-else-if="bubble.media_type=='警告'" class="tips_item tip_failed" >
                    <span class="iconfont">&#xe609;</span>
                    <span>{{bubble.content}}</span>
                </dl>
                <dl v-else-if="bubble.media_type=='通知'" class="tips_item" >
                    <span class="iconfont">&#xe7b3;</span>
                    <span>{{bubble.content}}</span>
                </dl>
            </template>

        </div>
        <div class="chat_room_talk" style="">
            <div class="chat_room_talk_header">
                <a-popover trigger="click" class="no_arrow">
                    <a-button type="primary" shape="circle" style="background-color: var(--blue);">
                        <span class="iconfont">&#xe730;</span>
                    </a-button>
                    <template #content>
                        <div class="emoji-content popover_container blue">
                            <ul class="more_list">
                                <li class="more_item">
                                    <li class="more_item">
                                        <a-upload :action="appStore.server+'/upload/media/'" :show-file-list="false" @success="successUploadImage" @error="ElMessage.error('媒体文件上传失败！')">
                                            <template #upload-button>
                                                <a-button class="more_item_btn" type="primary" long>
                                                    <template #icon>
                                                        <icon-image />
                                                    </template> 
                                                    <span>发送媒体</span>
                                                </a-button>
                                            </template>
                                        </a-upload>
                                    </li>
                                    <a-upload :action="appStore.server+'/upload/file/'" :show-file-list="false" @success="successUploadFile"  @error="ElMessage.error('文件上传失败！')">
                                        <template #upload-button>
                                            <a-button class="more_item_btn" type="primary" long>
                                                <template #icon>
                                                    <icon-drive-file />
                                                </template> 
                                                <span>发送文件</span>
                                            </a-button>
                                        </template>
                                    </a-upload>
                                </li>
                            </ul>
                        </div>
                    </template>
                </a-popover>
            </div>
            <div class="chat_room_talk_inner">
                <a-textarea class="talk_textarea" v-model="textarea" auto-size max-length="1000" show-word-limit></a-textarea>
            </div>
            <div class="chat_room_talk_footer">
                <a-button class="talk_btn outline" type="primary" shape="circle" style="background-color:transparent;">
                    <a-popover class="talk_emoji_box no_arrow" style="transform:translate(-18%,-20px)" trigger="click">
                        <icon-face-smile-fill/>
                        <template #content>
                            <!-- 表情分组选项卡 -->
                            <div class="emoji-content">
                                <!-- 选择显示的表情组的选项卡 -->
                                <ul class="emoji-header row">
                                    <div class="row">
                                        <li v-for="group in emojiGroup" @click="activeEmojiGroup = group.name" :class="{ 'emoji-group-header':true,'active':activeEmojiGroup == group.name }">
                                            <el-tooltip :show-arrow="false" :content="group.name" placement="top">
                                                <component v-if="group.iconType == 'icon'" :is='group.icon' style="font-size: 25px;"></component>
                                                <a-image v-else  width="25" height="25" fit="cover" :preview="false" :src="appStore.getServerEmoji(group.dir + group.icon)">
                                                </a-image>
                                            </el-tooltip>
                                        </li>
                                    </div>
                                    <li :class="{ 'emoji-group-header':true, }">
                                        <el-tooltip :show-arrow="false" content="表情商城" placement="top">
                                            <el-icon style="line-height:1;font-size: 25px;vertical-align: middle;"><Shop /></el-icon>
                                        </el-tooltip>
                                    </li>
                                </ul>
                                <!-- 表情组的内容 -->
                                <div v-for="group in emojiGroup" v-show="activeEmojiGroup == group.name" class="emoji-group">
                                    <a-image @click="sendAvatar(group.baseName(n))" :preview="false" class="emoji-item" v-for="n in group.length" :src="appStore.getServerEmoji(group.baseName(n))" fit="cover" width="80" height="80"></a-image>
                                </div>
            
                            </div>
                        </template>
                    </a-popover>
                </a-button>
                <a-button v-if="room_info?.friend_status" @click="callRemote" class="talk_btn outline" type="primary" shape="circle" style="background-color:transparent;">
                    <template #icon>
                        <span class="iconfont" style="font-size:1.6rem">&#xe6bb;</span>
                    </template>
                </a-button>
                <a-button class="talk_btn" type="primary" style="font-size: 1.2rem;" @click="sendText">
                    <template #icon>
                        <icon-send />
                    </template>
                </a-button>
            </div>
        </div>
    </a-spin>
    <teleport to="body">
        <div v-show="calling || communicating" class="call_filter" >
            <div class="call_box">
                <div class="localVideoBox">
                    <video id="localVideo"></video>
                </div>
                <div class="remoteVideoBox">
                    <video id="remoteVideo"></video>
                </div>
                <div v-if="caller && calling" class="calling">
                    <CustomAvatar :src="room_info?.friend_status?.friend_info?.avatar"></CustomAvatar>
                    <p class="mb-4 text-white">等待对方接听</p>
                    <button @click="hangUp" class="min_button danger close_call">&#xe6b7;</button>
                </div>
                <div v-if="called && calling" class="calling">
                    <CustomAvatar :src="room_info?.friend_status?.friend_info?.avatar"></CustomAvatar>
                    <p>收到视频邀请</p>
                    <div class="flex">
                    <button class="min_button danger close_call" style="background-color: var(--blue);margin-right:8px;" @click="acceptCall">
                        &#xe6b5;
                    </button>
                    <button class="min_button danger close_call" @click="hangUp">
                        &#xe6b7;
                    </button>
                    </div>
                </div>
                <div v-if="communicating" class="calling_footer">
                    <button @click="hangUp" class="min_button danger close_call">&#xe6b7;</button>
                </div>
            <div>
            <!-- <button @click="callRemote" style="margin-right: 10px">发起视频</button>
            <button @click="hangUp" style="margin-left: 10px">挂断视频</button> -->
            </div>
        </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref } from 'vue';
import useRoomStore from '@/stores/room';
import useAppStore from '@/stores/app';
import useUserStore from '@/stores/user';
import UserCard from '@/components/UserCard.vue';
import CustomAvatar from '@/components/CustomAvatar.vue';
import { formatTime } from '@/utils/datetime';
const appStore = useAppStore();
const userStore = useUserStore();
import { ElMessage } from 'element-plus';
import { onMounted,watch } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import customMessage from '@/utils/customMessage';
import { nextTick } from 'vue';
import { reactive } from 'vue';
const props = defineProps(['room_info']);
const more_setting = ref(false);

watch(() => props.room_info,() => {
    reloadRoom();
})


import io from 'socket.io-client';
const roomStore = useRoomStore()
// 定义响应式变量
const wsSocket = ref(null);
const called = ref(false);// 是否是接收方
const caller = ref(false);// 是否是发起方
const calling = ref(false);// 呼叫中
const communicating = ref(false);// 视频通话中
const localVideo = ref(null);
const remoteVideo = ref(null);
const peer = ref(null);
const localStream = ref(null);

// 发起方发起视频请求
const callRemote = async () => {
    caller.value = true;
    calling.value = true;
    await getLocalStream();
    wsSocket.value.emit('callRemote', props.room_info.room_id);
    textarea.value = '📞发起了视频聊天'
    sendText()
};

// 接收方同意视频请求
const acceptCall = () => {
    wsSocket.value.emit('acceptCall', props.room_info.room_id);
};

// 挂断视频
const hangUp = () => {
    wsSocket.value.emit('hangUp', props.room_info.room_id);
    reset();
};

// 重置状态
const reset = () => {
    called.value = false;
    caller.value = false;
    calling.value = false;
    communicating.value = false;
    peer.value = null;
    if (localVideo.value) localVideo.value.srcObject = null;
    if (remoteVideo.value) remoteVideo.value.srcObject = null;
    localStream.value = null;
    console.log('挂断结束视频');
};

// 获取本地音视频流
const getLocalStream = async () => {
    const constraints = { audio: true, video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (localVideo.value) {
    localVideo.value.srcObject = stream;
    localVideo.value.play();
    }
    localStream.value = stream;
    return stream;
};
// 重新连接房间号
const reloadRoom = async () => {
    const sock = io('localhost:8081');
    if(wsSocket.value)wsSocket.value.close();
    wsSocket.value = sock;
    sock.on('connectionSuccess', () => {
    console.log('连接成功');
    });
    console.log(props.room_info.room_id);
    sock.emit('joinRoom', props.room_info.room_id);

    sock.on('callRemote', () => {
    if (!caller.value) {
        called.value = true;
        calling.value = true;
    }
    });

    sock.on('acceptCall', async () => {
    if (caller.value) {
        peer.value = new RTCPeerConnection();
        peer.value.addStream(localStream.value);

        peer.value.onicecandidate = (event) => {
        if (event.candidate) {
            sock.emit('sendCandidate', { roomId:props.room_info.room_id, candidate: event.candidate });
        }
        };

        peer.value.onaddstream = (event) => {
        calling.value = false;
        communicating.value = true;
        if (remoteVideo.value) {
            remoteVideo.value.srcObject = event.stream;
            remoteVideo.value.play();
        }
        };

        const offer = await peer.value.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
        });
        await peer.value.setLocalDescription(offer);
        sock.emit('sendOffer', { offer, roomId:props.room_info.room_id });
    }
    });

    sock.on('sendOffer', async (offer) => {
    if (called.value) {
        peer.value = new RTCPeerConnection();
        const stream = await getLocalStream();
        peer.value.addStream(stream);

        peer.value.onicecandidate = (event) => {
        if (event.candidate) {
            sock.emit('sendCandidate', { roomId:props.room_info.room_id, candidate: event.candidate });
        }
        };

        peer.value.onaddstream = (event) => {
        calling.value = false;
        communicating.value = true;
        if (remoteVideo.value) {
            remoteVideo.value.srcObject = event.stream;
            remoteVideo.value.play();
        }
        };

        await peer.value.setRemoteDescription(offer);
        const answer = await peer.value.createAnswer();
        await peer.value.setLocalDescription(answer);
        sock.emit('sendAnswer', { answer, roomId:props.room_info.room_id });
    }
    });

    sock.on('sendAnswer', async (answer) => {
    if (caller.value) {
        await peer.value.setRemoteDescription(answer);
    }
    });

    sock.on('sendCandidate', async (candidate) => {
    if (peer.value) {
        await peer.value.addIceCandidate(candidate);
    }
    });

    sock.on('hangUp', () => {
    reset();
    });
}
// 初始化 WebSocket 和事件监听
onMounted(() => {
    nextTick(() => {
        localVideo.value = document.getElementById('localVideo');
        remoteVideo.value = document.getElementById('remoteVideo');
    });
});
const textarea = ref('');
const chat_room = ref();
const loading = ref(true);
const players = reactive([]);
const isVideo = (video) => {

  // 定义一个包含常见视频文件后缀的数组
  const videoExtensions = ['avi', 'mp4', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'mpeg', 'mpg', '3gp', 'asf', 'divx', 'xvid', 'ogv', 'mts'];

  // 将输入字符串转换为小写，并与视频后缀名进行匹配
  const lowerCaseVideo = video.toLowerCase();
  return videoExtensions.some(ext => lowerCaseVideo.endsWith(`.${ext}`));
};
// 设置时间间隔阈值
const timeThreshold = 5 * 60 * 1000; // 5分钟的毫秒数
function showTimeDivider(index, bubble) {
    if (index === 0) {
        // 如果是第一条消息，总是显示时间分隔符
        return true;
    }
    const previousBubble = this.roomStore.talk_list[props.room_info?.room_id]?.bubble_list[index - 1];
    if (!previousBubble) {
        return false;
    }
    // 检查当前气泡和前一个气泡之间的时间差是否超过阈值
    return (new Date(bubble.created_at).getTime() - new Date(previousBubble.created_at).getTime()) > timeThreshold;
}
function resend(bubble){
    roomStore.sendMessage({
        receiver_id:bubble.receiver_id ,
        content:bubble.content,
        media_type:bubble.media_type,
        file_size:bubble?.file_size || 0,
        type:bubble.type,
        room_id:bubble.room_id,
    });
    const list = roomStore.talk_list[bubble.room_id].bubble_list;
    const find = list.find(msg => msg.created_at == bubble.created_at && msg.content == bubble.content);
    // 从记录中删除该条信息
    list.splice(list.indexOf(find),1);
    nextTick(() => {chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;});
}
function sendText(){
    if(textarea.value.trim() == '') return customMessage({type:'normal',value:'请输入内容'});
    roomStore.sendMessage({
        receiver_id:props.room_info.friend_status ? props.room_info.friend_status.friend_id : props.room_info.group_status.group_id ,
        content:textarea.value,
        media_type:'文本',
        file_size:'0',
        type:props.room_info.type,
        room_id:props.room_info.room_id,
    });
    textarea.value = '';
    nextTick(() => {chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;});
}
function sendAvatar(avatar){
    roomStore.sendMessage({
        receiver_id:props.room_info.friend_status ? props.room_info.friend_status.friend_id : props.room_info.group_status.group_id ,
        content:avatar,
        media_type:'表情',
        file_size:'0',
        type:props.room_info.type,
        room_id:props.room_info.room_id,
    });
    setTimeout(() => {chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;},100);
}
function successUploadImage(e){
    roomStore.sendMessage({
        receiver_id:props.room_info.friend_status ? props.room_info.friend_status.friend_id : props.room_info.group_status.group_id ,
        content:e.response.data.filename,
        media_type:'媒体',
        file_size:'0',
        type:props.room_info.type,
        room_id:props.room_info.room_id,
    });
    setTimeout(() => {chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;},100);
}
function successUploadFile(e){
    roomStore.sendMessage({
        receiver_id:props.room_info.friend_status ? props.room_info.friend_status.friend_id : props.room_info.group_status.group_id ,
        content:e.response.data.filename,
        media_type:'文件',
        file_size:e.response.data.size,
        type:props.room_info.type,
        room_id:props.room_info.room_id,
    });
    setTimeout(() => {chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;},100);
}
const activeEmojiGroup = ref('默认');
const emojiGroup = [
    {
        dir:'default',
        iconType:'icon',
        icon:'icon-face-smile-fill',
        prefix:'Clanchat_Emoji_',
        prefix_end:'_Tw',
        suffix:'png',
        name:'默认',
        start:1,
        length:60,
        baseName(index){
            //     表情包目录           图片前缀          图片下标(自动生成)        图片前缀结尾             图片后缀
            return this.dir + '/' + this.prefix + String(index).padStart(2,0) + this.prefix_end + '.' + this.suffix;
        }

    },
    {
        dir:'NEEDYGIRL',
        icon:'/icon.jpg',
        prefix:'girl',
        prefix_end:'',
        suffix:'avif',
        name:'主播女孩重度依赖',
        length:15,
        baseName(index){
            return this.dir + '/' + this.prefix + String(index).padStart(2,0) + this.prefix_end + '.' + this.suffix;
        }
    },
    {
        dir:'NEEDYGIRL',
        icon:'/icon.webp',
        prefix:'girl',
        prefix_end:'',
        suffix:'webp',
        name:'主播女孩重度依赖-动态',
        length:7,
        baseName(index){
            return this.dir + '/' + this.prefix + String(index).padStart(2,0) + this.prefix_end + '.' + this.suffix;
        }
    }
    /**
     * 用Function方法可以执行字符串中的代码，使用arguments获取index参数
     * Function('return this.dir + '/' + this.prefix + String(arguments[0]).padStart(2,0) + this.prefix_end + '.' + this.suffix;')
     * 表情商城中使用的表情具有online标识，不会下载到本地。使用服务器地址
     */
];
onMounted(() => {
    loading.value = false;
    setTimeout(() => {
        chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;
    },300)
})
onBeforeRouteUpdate(() => {
    chat_room.value.$el.scrollTop = chat_room.value.$el.scrollHeight;
})
</script>

<style lang="scss" scoped>
.tag{
    border-radius: 4px;
    margin: 4px;
}
.chat_room{
    flex-grow:1;
    min-width:400px;
}
.chat_room_messages{
    display:flex;
    flex-direction: column;
}
.tips_item{
    align-self: center;
    background-color: var(--mostWhite);
    padding:4px 8px;
    border-radius: 6px;
    font-size:.9rem;
    margin:10px;
    color:var(--dark);
    &.tip_time{
        color: var(--lightDark);
    }
    &.tip_failed{
        color:var(--red);
        background-color: transparent;
    }
    .iconfont{
        margin-right:4px;
    }
}
.img {
    position: absolute;
    width: 100%;
    height: 50%;
    object-fit: cover;
    object-position: center;
    pointer-events: none;
}
.circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #ffbb66;
    position: relative;
    filter: blur(15px);
    animation: floating 2600ms infinite linear;
}
.failed{
    margin-right: 6px;
    box-shadow: none;
    flex-shrink: 0;
    color: var(--red);
    font-size: 1.8rem;
    margin-top: 26px;
    &:active{
        opacity:1;
        background-color: transparent!important;
    }
}
#bottom {
      background-color: #ff8866;
      left: 50px;
      top: 0px;
      width: 150px;
      height: 150px;
      animation-delay: -800ms;
    }
    
    #right {
      background-color: #ff2233;
      left: 160px;
      top: -80px;
      width: 30px;
      height: 30px;
      animation-delay: -1800ms;
    }
.chat_room{
    overflow-y: auto;
    height:100%;
    padding:18px 30px;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
// .image_item{
//     margin: 50px 0;
// }
.file_item{
    .file_box{
        cursor: pointer;
    }
}
.message_item{
    position:relative;
    z-index:0;
    color: var(--blue);
    display: flex;
    margin-bottom:15px;
    align-items: start;
    .message_container{
        display: flex;
        flex-direction: column;
    }
    .message_firstline{
        display:flex;
        padding:0 10px;
        align-items:center;
    }
    .message_username{
        font-size:.94rem;
        font-weight: 500;
        color:var(--dark);
    }
    &.self{
        .message_firstline{
            justify-content: end
        }
        flex-direction: row-reverse;
        .message_bubble{
            align-self: flex-end;
            background-color: var(--blue);
            color: var(--white);
            margin-right: 10px;
            margin-left:0;
        }
    }
    .message_bubble{
        background-size: cover;
        background-blend-mode: multiply;
        margin-left:10px;
        background-color: var(--white);
        border-radius: 6px;
        padding:6px;
        color:var(--dark);
        box-shadow: 0 0 3px var(--light);
        align-self: start;
        video{
            width:100%;
            height:100%;
            object-fit: cover;
            object-position:center;
        }
    }
}
.chat_room_talk{
    flex-shrink: 0;
    display: flex;
    align-items: center;
    position:sticky;
    min-height: 60px;
    border-radius: 6px;
    width: auto;
    left: 0px;
    right: 0px;
    background-color: var(--white);
    box-shadow: 0 0 2px var(--light),0 0 4px var(--light);
    margin: 0 15px;
    bottom: 20px;
}
.chat_room_talk_header{
    margin: 0 8px;
}
.chat_room_talk_footer{
    margin: 0 8px;
    display: flex;
    align-items: center;
}
.chat_room_talk_inner{
    flex-grow: 1;
    margin:10px 0;
    .talk_textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: none;
        background-color: var(--formColor);
        resize: none;
        outline: none;
        padding:4px;
        color: var(--dark);
    }
}
.chat_room_talk_footer{
    .talk_btn{
        margin-right: 4px;
        &.outline{
            font-size: 2rem;
            background-color: transparent;
            color: var(--blue);
            transition: all .3s;
        }
    }
}
@keyframes floating {
    0% {
    transform: translateY(0px);
    }

    50% {
    transform: translateY(10px);
    }

    100% {
    transform: translateY(0px);
    }
}
.row{
    display:flex;
}
.emoji-header{
    background-color: var(--white);
    border-radius: 6px;
    padding: 4px;
    justify-content: space-between;
    svg{
        color:var(--lightDark);
    }
}
.emoji-group-header{
    border-radius: 4px;
    line-height: 1;
    padding: 4px;
    margin-right:4px;
    &.active{
        background-color: var(--blue);
        svg{
            color:var(--white)
        }
    }
}
.emoji-group{
    display: grid;
    gap: 10px;
    grid-auto-rows: minmax(auto, 0);
    grid-template-columns: repeat(6, minmax(0px, 1fr));
    height: 400px;
    overflow: auto;
    background-color: var(--white);
    padding: 10px 4px;
    border-radius: 6px;
    .emoji-item{
        margin:4px;
    }
}
</style>