<template>
    <div class="card">
        <div class="comments">
            <div class="comment_sticker"
                :style="{ backgroundImage: `url(${appStore.getServerSticker(used_sticker?.sticker_info?.image_url)})` }"></div>
            <div class="comment-react">
                <button @click="thumbToggle" :class="{ active:isThumbUp }" style="cursor:pointer;">
                    <svg fill="none" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path fill="var(--mostLightDark)" stroke-linecap="round" stroke-width="2"
                            stroke="var(--mostLightDark)"
                            d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z">
                        </path>
                    </svg>
                </button>
                <hr>
                <span @click="showThumbUpUserList = true" style="cursor:pointer;">{{thumb_list?.length}}</span>
            </div>
            <div class="comment-container">
                <div class="user">
                    <a-popover position="right" trigger="click">
                        <CustomAvatar size="80px" class="user-pic" :circle="true" :src="moments.user_info.avatar"></CustomAvatar>
                        <template #content>
                            <UserCard :user_id="moments.user_info.user_id"></UserCard>
                        </template>
                    </a-popover>
                    <div class="user-info">
                        <span>{{ moments?.user_info?.username }}</span>
                        <p>{{ formatTime(moments?.created_at) }}</p>
                    </div>
                </div>
                <p class="comment-content">
                    {{ moments?.content }}
                </p>
            </div>
        </div>
        <hr class="custom_hr" style="padding:0;">
        <div v-if="moments.media_list.length" class="upload_media_list">
            <template v-for="{ src, media_type } in moments.media_list">
                <a-image v-if="media_type == 'image'" :src="appStore.getServerMedia(src)" height="240px"
                    style="max-width:300px;margin-right:4px;padding: 6px;border: 1px solid var(--blue);border-radius: 5px;" />
                <div v-else-if="media_type == 'video'" @fullscreenchange="handleFullscreenChange"
                    style="max-width:400px;height:240px;">
                    <video :ref="el => players.push(el)" playsinline controls class="js-plyr">
                        <source :src="appStore.getServerMedia(src)" />
                    </video>
                </div>
            </template>
        </div>
        <div class="comment-footer">
            <p @click="replyReceived(null)" class="btn">
                <span class="iconfont" style="margin-right: 2px;">&#xe75e;</span>
            </p>
            <p @click="momentsRemoveCallback" v-if="moments.user_id==userStore.user_info.user_id" class="btn">
                <span class="iconfont" style="margin-right: 2px;">&#xe707;</span>
            </p>
        </div>
        <div class="reply-list">
            <div v-if="moments.reply_list?.length" class="reply_item" v-for="reply in moments.reply_list">
                <div class="reply_avatar_item">
                    <a-popover position="right" trigger="click">
                        <CustomAvatar size="50px" class="user-pic" :circle="true" :src="reply.reply_user_info.avatar"></CustomAvatar>
                        <template #content>
                            <UserCard :user_id="reply.reply_user_id"></UserCard>
                        </template>
                    </a-popover>
                    <div class="reply_container">
                        <p class="reply_username">{{ reply.reply_user_info.username }}</p>
                        <p class="reply_content">
                            <span v-if="reply.received_user_id">
                                回复
                                <a-popover position="right" trigger="click">
                                    <em style="font-weight:500;margin-right: 4px;cursor: pointer;">{{ reply.received_user_info.username }}</em>
                                    <template #content>
                                        <UserCard :user_id="reply.received_user_id"></UserCard>
                                    </template>
                                </a-popover>
                                :
                            </span>
                            <span>{{ reply.content }}</span>
                        </p>
                    </div>
                </div>
                <p class="reply_info">
                    <span class="reply_date">{{ formatTime(reply.created_at) }}</span>
                    <span class="reply_btn">
                        <span @click="replyReceived(reply)">回复</span>
                    </span>
                </p>
            </div>
            <hr v-if="moments.reply_list?.length" class="custom_hr" style="margin-top:10px;">
        </div>
        <div v-if="reply" class="text-box">
            <div ref="reply_textarea" class="box-container">
                <a-textarea class="textarea" v-model="replyForm.content" :placeholder="replyForm.received_user_name || '回复对方'"></a-textarea>
                <div>
                    <div class="formatting">
                        <button type="button">
                            <span class="iconfont">&#xe687;</span>
                        </button>
                        <button @click="momentsReply" type="submit" class="send" title="Send">
                            <span class="iconfont">&#xe692;</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <CustomConfirm v-model="showThumbUpUserList" :center="true" style="width:460px;">
            <template #custom>
                <div class="photo_onlyUi">
                    <header class="photo_header">
                        <p class="photo_title">
                            <span class="iconfont">&#xe68e;</span>
                            <span>点赞列表</span>
                        </p>
                    </header>
                    <div class="dialog"
                        style="display:flex;width:100%;max-height: 500px;overflow: auto;align-items: center;">
                        <ul style="width:100%;">
                            <li v-for="thumb in thumb_list" style="margin-bottom:10px;display:flex;justify-content: space-between;align-items: center;width:100%;">
                                <div style="display:flex;align-items: center">
                                    <span class="iconfont" style="color:var(--red);">&#xe8c3;</span>
                                    <a-popover position="right" trigger="click">
                                        <CustomAvatar size="30px" :src="thumb.avatar" :circle="true"></CustomAvatar>
                                        <template #content>
                                            
                                            <UserCard :user_id="thumb.user_id"></UserCard>
                                        </template>
                                    </a-popover>
                                    <span style="margin-left:10px;color:var(--dark);">{{ thumb.username }}</span>
                                </div>
                                <div class="thumb_at" style="color:var(--lightDark);font-size:.85rem">{{ formatTime(thumb.created_at) }}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="photo_footer" style="justify-content:center;">
                        <p v-if="!thumb_list?.length" class="no_thumb_up">无人点赞</p>
                        <p v-else>
                            {{ thumb_list?.length }}人点赞                        
                        </p>
                    </div>
                </div>
            </template>
        </CustomConfirm>
    </div>

</template>

<script setup>
import Plyr from 'plyr';
import { formatTime } from '@/utils/datetime';
import CustomConfirm from './CustomConfirm.vue';
import { ref,onMounted,reactive,toRaw,nextTick,computed,onUnmounted } from 'vue';
import CustomAvatar from './CustomAvatar.vue';
import useAppStore from '@/stores/app';
import useUserStore from '@/stores/user';
import { userStickersInfoRequest } from '@/api/user';
import customMessage from '@/utils/customMessage';
import UserCard from '@/components/UserCard.vue';
const userStore = useUserStore();
const props = defineProps(['moments','remove','used_sticker']);
const reply = ref(false);
const showThumbUpUserList = ref(false);
const appStore = useAppStore();
const players = reactive([]);
const thumb_list = ref();
const reply_textarea = ref();
const replyForm = ref({ 
    moments_id:'',
    content:'',
    received_user_id:'',
    received_user_name:''
 });
let lastReceivedUserId;
const replyReceived = (r) => {
    // 检查是否有回复对象
    if (r) {
        // 如果r有值，检查是否与上一次点击的是同一个对象
        if (lastReceivedUserId === r.reply_user_id) {
            lastReceivedUserId = '';
            // 如果是同一个对象，隐藏回复框
            reply.value = false;
            return; // 结束函数执行
        }
        // 更新回复表单内容
        replyForm.value.content = '';
        replyForm.value.received_user_id = r.reply_user_id;
        replyForm.value.received_user_name = '回复：' + r.reply_user_info.username;
        lastReceivedUserId = r.reply_user_id; // 更新记录的回复用户ID
    } else {
        // 如果r没有值，检查是否之前没有回复对象（即上一次点击也是没有回复对象）
        if (lastReceivedUserId === '') {
            // 如果是同一个情况，隐藏回复框
            lastReceivedUserId = null;
            reply.value = false;
            return; // 结束函数执行
        }
        // 如果之前有回复对象，现在没有，则重置回复表单
        replyForm.value.content = '';
        replyForm.value.received_user_id = '';
        replyForm.value.received_user_name = ''; // 这里应该设置默认回复动态发布者的名字
        lastReceivedUserId = ''; // 清空记录的回复用户ID
    }

    // 显示回复框
    reply.value = true;

    // 确保DOM更新完成后滚动到textarea
    nextTick(() => {
        reply_textarea.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}
const showUserCard = ref(false)
const close = () => {
    showUserCard.value = false;
}
onMounted(() => {
    document.querySelector('.layout_view')?.addEventListener('click',close)
})
onUnmounted(() => {
    document.querySelector('.layout_view')?.removeEventListener('click',close)
})
// 删除动态
const momentsRemoveCallback = () => {
    props.remove(props.moments.moments_id);
}
// 回复对方
const momentsReply = () => {
    if(!replyForm.value.content.trim()) return customMessage({type:'error',value:'请填写回复内容'});
    userStore.userSpaceMomentsReply(toRaw(replyForm.value))
    .then(msg => {
        reloadReplyList();
        replyForm.value.content = '';
        replyForm.value.received_user_id = '';
        replyForm.value.contreceived_user_nameent = '';
        customMessage({type:'normal',value:msg})
    })
    .catch(data => {
        customMessage({type:'error',value:data.msg})
    })
}
// 是否已点赞
const isThumbUp = computed(() => {
    if(!thumb_list.value) return false;
    const user_id = userStore.user_info.user_id;
    return thumb_list.value.some(thumb => thumb.user_id == user_id);
})
// 点赞
const thumbToggle = () => {
    userStore.userSpaceMomentsThumbToggle({
        thumb_up:isThumbUp.value,
        moments_id:props.moments.moments_id
    })
    .then(msg => {
        reloadThumbList();
    })
    
}
// 视频相关事件
const handleFullscreenChange = (e) => {
    const video = e.target.querySelector('video');
    const plyr = video.plyr;
    if (plyr.fullscreen.active) {
        showVideoCtrls(video.parentElement.parentElement);
    } else {
        hiddenVideoCtrls(video.parentElement.parentElement);
    }
}
// 隐藏控件
const hiddenVideoCtrls = (elem) => {
    elem.querySelector('.plyr__progress__container').hidden = true;
    elem.querySelector('.plyr__time').hidden = true;
    elem.querySelector('.plyr__volume').hidden = true;
    elem.querySelector('.plyr__control').hidden = true;
}
// 显示控件
const showVideoCtrls = (elem) => {
    elem.querySelector('.plyr__progress__container').hidden = false;
    elem.querySelector('.plyr__time').hidden = false;
    elem.querySelector('.plyr__volume').hidden = false;
    elem.querySelector('.plyr__control').hidden = false;
}
// 重新获取回复
const reloadReplyList = () => {
    userStore.userSpaceMomentsReplyList(props.moments.moments_id).then(reply_list => {
        props.moments.reply_list = reply_list;
    })
}
// 重新获取点赞信息
const reloadThumbList = () => {
    userStore.userSpaceMomentsThumbList(props.moments.moments_id).then((list) => {
        thumb_list.value = list;
    })
}
onMounted(() => {
    players.forEach(player => {
        player.plyr = new Plyr(player, {
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        });
        hiddenVideoCtrls(player.parentElement.parentElement);
        reloadThumbList();
    })
    thumb_list.value = props.moments.thumb_list;
    replyForm.value.moments_id = props.moments.moments_id
})
</script>

<style lang="scss" scoped>
.dialog{
    position:relative;
}
.upload_media_list {
    display: flex;
    padding:10px;
    >div {
        margin-right: 10px;
        border-radius: 6px;
        overflow: hidden;
    }
}

.reply-list {
    padding: 16px 34px;
    background-color: var(--white);
    .reply_item{
        margin-bottom:10px;
    }
    .reply_avatar_item {
        display: flex;
        align-items: center;
    }

    .reply_username {
        font-weight: bold;
        font-size: 1rem;
        color: var(--dark);
    }

    .reply_container {
        margin-left: 10px;
    }

    .reply_content {
        font-size: .95rem;
        color: var(--dark);
    }

    .reply_info {
        margin-left: 60px;
        color: var(--lightDark);
        font-size: .85rem;

        .reply_date {
            display: inline-block;
            // width: 120px;
            margin-right:10px;
        }

        .reply_btn {
            cursor: pointer;
        }
    }
}

.comment-media {
    display: flex;
    padding: 10px 70px;

    >* {
        height: 200px;
        margin-right: 10px;
        border-radius: 6px;
    }
}

.comment-footer {
    width: 100%;
    display: flex;
    justify-content: end;
    padding-bottom: 2px;
    padding-right: 20px;

    .btn {
        font-size: 1.1rem;
        color: var(--lightDark);
        padding: 5px;
        border-radius: 4px;

        &:hover {
            cursor: pointer;
            background-color: var(--formColor);
        }
    }
}

.card {
    margin-bottom:30px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    background-color: var(--mostWhite);
    box-shadow: 0 0 6px var(--light);
    border-radius: 17px 17px 27px 27px;
    overflow: hidden;
}


.comments {
    padding: 20px;
    display: flex;
    position: relative;

    >:not(.comment_sticker) {
        z-index: 1;
    }

    .comment_sticker {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        -webkit-mask: linear-gradient(8deg, transparent 63%, black 106%);
        mask: linear-gradient(8deg, transparent 63%, black 106%);
        filter: blur(2px);
    }
}

.comment-react {
    width: 35px;
    height: fit-content;
    display: grid;
    grid-template-columns: auto;
    margin: 0;
    background-color: var(--someWhite);
    border-radius: 5px;
    margin-right: 20px;
    span{
        width: 100%;
    }
}

.comment-react button {
    width: 35px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    outline: none;
}

.comment-react button:after {
    content: '';
    width: 40px;
    height: 40px;
    position: absolute;
    left: -2.5px;
    top: -2.5px;
    background-color: var(--red);
    border-radius: 50%;
    z-index: 0;
    transform: scale(0);
}

.comment-react button svg {
    position: relative;
    z-index: 9;
}
.comment-react button.active:after {
    animation: ripple 0.6s ease-in-out forwards;
}

.comment-react button.active svg,
 {
    fill: var(--red);
}
.comment-react button.active svg{
    filter: drop-shadow(0px 1px 7px var(--red)) drop-shadow(0px 1px 7px var(--red)) ;
}
.comment-react button.active path {
    stroke: var(--red);
    fill: var(--red);
}

.comment-react hr {
    width: 80%;
    height: 1px;
    background-color: var(--mostLightDark);
    margin: auto;
    border: 0;
}

.comment-react span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    font-size: 13px;
    font-weight: 600;
    color: var(--mostLightDark);
}

.comment-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0;
    margin: 0;

    .user {
        display: grid;
        grid-template-columns: 90px 1fr;
    }

    .user .user-pic {
        width: 40px;
        height: 40px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--white);
        border-radius: 50%;
    }

    .user .user-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 3px;
    }

    .user .user-info span {
        font-weight: 700;
        font-size: 1.3rem;
        color: var(--dark);
    }

    .user .user-info p {
        font-weight: 600;
        font-size: .8rem;
        color: var(--lightDark);
    }

    .comment-content {
        font-size: .95rem;
        line-height: 1.5;
        font-weight: 500;
        color: var(--lightDark);
    }
}

.formatting {
    display: grid;
    grid-template-columns: auto 1fr;
}

@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 0.6;
    }

    100% {
        transform: scale(1);
        opacity: 0;
    }
}
</style>