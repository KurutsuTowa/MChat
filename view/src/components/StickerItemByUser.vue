<template>
    <div style="position:relative;">
        <div @click="showStickerItemInfo=true" :class="{sticker_bubble:true, message_bubble:true,used:sticker.used}" :style="{ 
            backgroundColor:sticker.sticker_info.background_color,
            color:sticker.sticker_info.text_color,
            backgroundImage:`url(${appStore.getServerSticker(sticker.sticker_info.image_url)})`,
            boxShadow:getRarityStyle(sticker.sticker_info.rarity)
         }">
            <span>{{ sticker.sticker_info.title }}</span>
        </div>
        <span v-if="sticker.used" class="in_use">使用中</span>
        <CustomConfirm v-if="!noPreview" v-model="showStickerItemInfo" style="width: 350px;">
            <template #custom>
                <CollectCard v-model="showStickerItemInfo" :used="sticker.used" :get_method="sticker.sticker_info.get_method" card_title="用户贴纸" :content_rare="sticker.sticker_info.rarity" :id="sticker.user_sticker_id" :content_title="sticker.sticker_info.title" content_status="已获得" :content_desc="sticker.sticker_info.description" :get_time="sticker.get_at">
                    <template #face>
                        <div class="sticker_bubble message_bubble preview" :style="{ 
                            backgroundColor:sticker.sticker_info.background_color,
                            backgroundImage:`url(${appStore.getServerSticker(sticker.sticker_info.image_url)})`,
                            boxShadow: `0px 0px 20px ${sticker.sticker_info.background_color}` }">
                        </div>
                    </template>
                </CollectCard>
                <button v-if="!useMenu" @click="showStickerItemInfo=false" class="custom_button success">
                    <span>确认</span>
                </button>
                <button v-if="useMenu && !sticker.used" @click="useStickerCallback" class="custom_button success">
                    <span>使用贴纸</span>
                </button>
            </template>
        </CustomConfirm>
    </div>

</template>

<script setup>
import useAppStore from '@/stores/app';
import useUserStore from '@/stores/user';
import CustomConfirm from './CustomConfirm.vue';
import CollectCard from './CollectCard.vue';
import { ref } from 'vue';
import customMessage from '@/utils/customMessage';
const appStore = useAppStore();
const userStore = useUserStore();
const { sticker,noPreview } = defineProps(['sticker','noPreview','useMenu'])
const showStickerItemInfo = ref(false);
const getRarityStyle = (rarity) => {
    const map = {
        '传说':'red 0 0 4px',
        '史诗':'#bdc900 0 0 4px',
        '稀有':'#ce11fd 0px 0px 4px',
        '普通':'#5e9db1 0 0 4px',
    }
    return map[rarity]
}
const useStickerCallback = () => {
    console.log(sticker.user_sticker_id)
    userStore.useSticker(sticker.user_sticker_id)
    .then(msg => {
        customMessage({type:'normal',value:msg});
        userStore.userStickers(userStore.user_info.user_id)
        .then(list => {
            userStore.user_stickers_info = list;
            console.log(userStore.user_stickers_info)
        })
        showStickerItemInfo.value=false
    })
}
</script>

<style lang="scss" scoped>

.in_use{
    position:absolute;
    top:50%;
    color:var(--white);
    font-weight: bold;
    left:50%;
    transform: translate(-50%,-50%);
    white-space: nowrap;
    text-shadow: 0 0 10px var(--dark);
    pointer-events: none;
}
.sticker_bubble{
    min-width:80px;
    height:40px;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    background-blend-mode: multiply;
    font-size: .9rem;
    background-size: cover;
    margin:4px;
    padding:0 4px;
    cursor: pointer;
    user-select: none;
    transition: all .2s;
    &.used{
        filter:brightness(0.5) blur(2px);
    }
    &:hover{
        opacity: .6;
    }
    &.preview{
        width: 150px;
        height: 90px;
        background-blend-mode: normal;
        background-position: center cetner;
    }
}
.custom_button{
    width: 90%;
    position: absolute;
    bottom: 0px;
    transform: translateY(60%);
    &:hover{
        opacity: 1;
    }
}
</style>