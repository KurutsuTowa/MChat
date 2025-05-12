<template>
    <div class="footer_option">
        <div @click="showGroupManagerDialog=true" class="iconfont">
            <span>&#xe64f;</span>
        </div>
        <div @click="showNotifyDialog=true" class="iconfont">
            <span>&#xe6c1;</span>
        </div>
        <div @click="showMailDialog=true" class="iconfont">
            <span>&#xe6b0;</span>
        </div>
        <div @click="showPackDialog=true" class="iconfont">
            <span>&#xe7e4;</span>
        </div>
    </div>
    <!-- 邮箱 -->
    <CustomConfirm v-model="showMailDialog" style="width:500px;background-color: var(--someWhite);">
        <template #custom>
            <header class="title" style="height:55px;font-size:1.4rem;height:130px;">
                <span class="iconfont" style="font-size:1.8rem;vertical-align:-2px;">&#xe6b0;</span>
                <span>邮箱</span>
            </header>
            <div class="mail_header" style="height:120px;background-color:var(--white);width:90%;border-radius:6px;transform: translateY(-60px);box-shadow:0 0 4px var(--light);">
                <span class="mail_count">
                    <span>{{ userStore.user_mail?.length }}</span>
                    <span class="iconfont">&#xe6b0;</span>
                </span>
                <div class="mail_header_icon iconfont">
                    &#xe6a9;
                </div>
                <p class="mail_header_text">
                    这是你的邮箱，请注意查收
                </p>
            </div>
            <div class="container">
                <dl v-for="mail in userStore.user_mail" :class="{mail_item:true,lose:mail.status != '生效'}">
                    <dt>
                        <CustomAvatar src="mail.png" size="70px" background-color="var(--light)" :noBorder="true" borderRadius="2px" style="box-shadow: none;"></CustomAvatar>
                    </dt>
                    <dd class="mail_text" style="width:60%;flex-shrink: 0;flex-grow: 1;">
                        <p class="mail_time">距离过期还剩{{ calculateTimeDifference(mail.created_at,mail.expire_at) }}</p>
                        <p class="mail_content">{{ mail.mail_content }}</p>
                    </dd>
                    <dd style="display: flex;flex-direction: column;align-items: center;">
                        <!-- <div class="sticker_bubble preview" :style="{backgroundImage:`url(${appStore.getServerSticker(mail.stickers_info.image_url)})`,}"></div> -->
                        <StickerItem :sticker="mail.stickers_info"></StickerItem>
                        <div>
                            <button v-if="mail.status=='生效'" @click="userMailReplyCallback(mail.mail_id)" class="custom_button success" style="width:80px;margin-top:6px;height:26px;line-height:26px;">
                                <span class="iconfont">&#xe64d;</span>
                                <span>领取</span>
                            </button>
                            <span v-else style="width:60px;margin-top:4px;height:26px;line-height:26px;color:var(--lightDark);font-size:.9rem;">已{{ mail.status }}</span>
                        </div>
                    </dd>
                </dl>
            </div>
            <div style="transform: translateY(-10px);position:absolute;bottom:0px;right:16px;">
                <button class="custom_button success">
                    <span class="iconfont">&#xe611;</span>
                    <span>全部领取</span>
                </button>
            </div>
        </template>
    </CustomConfirm>
    <!-- 好友分组管理器 -->
    <GroupManager v-model="showGroupManagerDialog"></GroupManager>
    <!-- 贴纸背包 -->
    <StickerPack v-model="showPackDialog"></StickerPack>
    <!-- 通知 -->
    <UserNotify v-model="showNotifyDialog"></UserNotify>
</template>

<script setup>
import { ref } from 'vue';
import CustomConfirm from '@/components/CustomConfirm.vue';
import CustomAvatar from '@/components/CustomAvatar.vue';
import StickerItem from '@/components/StickerItem.vue';
import GroupManager from '@/components/GroupManager.vue';
import StickerPack from '@/components/StickerPack.vue';
import UserNotify from '@/components/UserNotify.vue';
import { onMounted } from 'vue';
import { calculateTimeDifference } from '@/utils/datetime';
import useUserStore from '@/stores/user';
import useAppStore from '@/stores/app';
import customMessage from '@/utils/customMessage';
const userStore = useUserStore();
const appStore = useAppStore();
const showMailDialog = ref(false);
const showGroupManagerDialog = ref(false);
const showPackDialog = ref(false);
const showNotifyDialog = ref(false);
const userMailReplyCallback = (mail_id) => {
    console.log(mail_id)
    userStore.userMailReply(mail_id)
    .then(msg => {
        userStore.userMailList();
        customMessage({type:'normal',value:msg});
    })
    .catch(data => customMessage({type:'error',value:data.msg}))
}
onMounted(() => {
    userStore.userMailList();
})
</script>

<style lang="scss" scoped>
.container{
    min-height: 400px;
    width: 90%;
    border-radius: 6px;
    margin-top: -50px;
    box-shadow: 0 0 4px var(--light);
    margin-bottom: 59px;
}
.footer_option{
    width:100%;
    height:100%;
    color:var(--white);
    display:flex;
    padding:10px 20px;
    font-size:1.5rem;
    justify-content: space-between;
    line-height:1;
    >*{
        cursor:pointer;
        margin:0 10px;
        transition:all .3s;
        &:hover{
            opacity:.6;
        }
    }
}
.sticker_bubble{
    width:55px;
    height:50px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
}
.mail_item{
    height: 90px;
    align-items: center;
    display:flex;
    padding: 6px 2px;
    background-color: var(--mostWhite);
    box-shadow: 0 0 4px var(--light);
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 4px solid var(--blue);
    &.lose{
        opacity:.7;
    }
    .mail_text{
        margin-left:4px;
        height:100%;
    }
    .mail_time{
        color:var(--lightDark);
        font-size:.85rem;
        font-weight:bold;
    }
    .mail_content{
        color:var(--dark);
        font-weight:bold;
    }
}
.mail_header{
    position:relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.mail_count{
    position:absolute;
    top:4px;
    right:4px;
    color:var(--lightDark);
}
.mail_header_icon{
    color:var(--blue);
    font-size:5.5rem;
    line-height:1;
}
.mail_header_text{
    color:var(--dark);
    font-weight:500;
    font-size:.9rem;
}
</style>