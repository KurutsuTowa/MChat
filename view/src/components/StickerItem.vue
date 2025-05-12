<template>
    <div @click="showStickerItemInfo=true" class="sticker_bubble message_bubble" :style="{ 
        backgroundColor:sticker.background_color,
        color:sticker.text_color,
        backgroundImage:`url(${appStore.getServerSticker(sticker.image_url)})`,
        boxShadow:getRarityStyle(sticker.rarity)
        }">
        <span>{{ sticker.title }}</span>
    </div> 
    
    <CustomConfirm v-model="showStickerItemInfo" style="width: 350px;">
        <template #custom>
            <CollectCard v-model="showStickerItemInfo" card_title="贴纸图鉴" :get_method="sticker.get_method" :content_rare="sticker.rarity" :content_title="sticker.title" :content_desc="sticker.description">
                <template #face>
                    <div class="sticker_bubble message_bubble preview" :style="{ 
                        backgroundColor:sticker.background_color,
                        backgroundImage:`url(${appStore.getServerSticker(sticker.image_url)})`,
                        boxShadow: `${getRarityStyle(sticker.rarity)}` }">
                    </div>
                </template>
            </CollectCard>
            <button @click="showStickerItemInfo=false" class="custom_button success">
                <span>确认</span>
            </button>
        </template>
    </CustomConfirm>
</template>

<script setup>
import CustomConfirm from './CustomConfirm.vue';
import CollectCard from './CollectCard.vue';
import { ref } from 'vue';
const {sticker} = defineProps(['sticker'])
import useAppStore from '@/stores/app';
const appStore = useAppStore();
const showStickerItemInfo = ref(false);
const getRarityStyle = (rarity) => {
    const map = {
        '传说':'red 0 0 12px',
        '史诗':'#bdc900 0 0 4px',
        '稀有':'#ce11fd 0px 0px 4px',
        '普通':'#5e9db1 0 0 4px',
    }
    return map[rarity]
}
</script>

<style lang="scss" scoped>
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