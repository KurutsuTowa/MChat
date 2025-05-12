<template>
    <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue">
        <template #custom>
            <div class="stickers_statistic_box">
                <header class="stickers_statistic_header">
                    <span class="stickers_statistic_header_title">贴纸图鉴</span>
                </header>
                <div class="stickers_statistic_content">
                    <div class="stickers_statistic_content_header">
                        <div>
                            <button @click="activeStickers=$event.target.textContent" class="min_button dark text" :active="activeStickers=='ALL'">ALL</button>
                            <button @click="activeStickers=$event.target.textContent" class="min_button dark text" :active="activeStickers=='传说'">传说</button>
                            <button @click="activeStickers=$event.target.textContent" class="min_button dark text" :active="activeStickers=='史诗'">史诗</button>
                            <button @click="activeStickers=$event.target.textContent" class="min_button dark text" :active="activeStickers=='稀有'">稀有</button>
                            <button @click="activeStickers=$event.target.textContent" class="min_button dark text" :active="activeStickers=='普通'">普通</button>
                        </div>
                        <div class="stickers_statistic_content_header_title">
                            <span style="font-size:.8rem;line-height:1;vertical-align: 0px;">共{{ stickers_list?.length }}项</span>
                        </div>
                    </div>
                    <ul class="stickers_statistic_list">
                        <StickerItem v-for="sticker in stickers_list" :sticker v-show="activeStickers=='ALL' || activeStickers==sticker.rarity" :have="haveThisSticker(sticker.sticker_id)"  class="guide_item" ></StickerItem>
                    </ul>
                </div>
            </div>
        </template>
    </CustomConfirm>
</template>

<script setup>
import { onMounted } from 'vue';
import CustomConfirm from './CustomConfirm.vue'
import useUserStore from '@/stores/user';
import StickerItem from './StickerItem.vue'
import { ref } from 'vue';
const userStore = useUserStore();
const { modelValue,user_id } = defineProps(['modelValue','user_id'])
const emit = defineEmits(['update:modelValue']);
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};
const activeStickers = ref('ALL');
const stickers_list = ref(null)
const user_sticker_list = ref(null)
const haveThisSticker = (sticker_id) => user_sticker_list.value.some(sticker => sticker.sticker_id == sticker_id);
onMounted(async () => {
    const temp_stickers_list = await userStore.userStickersGuide();
    stickers_list.value = temp_stickers_list;
    const { list } = await userStore.userStickers(user_id);
    user_sticker_list.value = list;
})
</script>

<style lang="scss" scoped>
.stickers_statistic_content{
    max-height: 500px;
    min-height: 400px;
    overflow-y: auto;
    
    .stickers_statistic_list{
        overflow: initial;
        max-height:none!important;
        margin-top:30px;
        .guide_item{
            font-size: 1rem;
            min-width: 100px;
            height: 45px;
            line-height: 45px;
            filter:brightness(0.5);
            &[have=true]{
                filter:brightness(1);
            }
        }
    }
}
.stickers_statistic_box{
    width:500px;
}
.stickers_statistic_header{
    height: 35px;
    line-height: 35px;
    &::before{
        height:9px;
    }
}
.stickers_statistic_header_title{
    font-size: 1rem;
}
</style>