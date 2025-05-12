<template>
    <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue" style="width: 480px;">
        <template #custom>
            <header class="title">
                <span class="iconfont">&#xe782</span>
                <span>大收藏家排行</span>
            </header>
            <div class="container" style="width:100%;height: 500px;">
                <CustomTips value="排行榜数据只展示前100名用户" style="color:var(--dark)"></CustomTips>
                <ul class="rank_ul">
                    <li v-for="(rank,i) in stickers_rank?.list" class="rank_li custom_user_card_item" :is_user="rank.user_info.user_id==stickers_rank.self_rank.user_info.user_id" :rank="i">
                        <div class="rank_order">
                            {{ new String(i + 1).padStart(2,0) }}
                        </div>
                        <div class="rank_name">
                            <CustomAvatar :src="rank.user_info.avatar" backgroundColor="var(--white)" :border="true" size="45px" :circle="true"></CustomAvatar>
                            <div style="margin-left:10px;display: flex;flex-direction: column;line-height: 1;justify-content: center;">
                                <span>{{ rank.user_info.username }}</span>
                                <span class="desc" :rank="i">{{ getRankDesc(i) }}</span>
                            </div>
                        </div>
                        <div class="rank_point">
                            <span class="iconfont">&#xe6bf;</span>
                            <span class="text">
                                {{ rank.point }}
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="rank_self">
                    <div class="shift">
                        <div class="rank_order">{{ stickers_rank?.self_rank.order + 1 }}</div>
                        <CustomAvatar class="avatar" :src="stickers_rank?.self_rank.user_info.avatar" backgroundColor="var(--white)" :border="true" size="55px" :circle="true"></CustomAvatar>
                    </div>
                    <div class="top_area">
                        <span>{{ stickers_rank?.self_rank.user_info.username }}</span>
                        <span class="desc" :rank="stickers_rank?.self_rank.order">{{ getRankDesc(stickers_rank?.self_rank.order) }}</span>
                    </div>
                    <div class="bottom_area">
                        <span class="iconfont">&#xe6bf;</span>
                        <span class="text">
                            {{ stickers_rank?.self_rank.point }}
                        </span>
                    </div>
                    <!-- <div class="rank_order">
                        {{ stickers_rank.self_rank.order }}
                    </div>
                    <div class="rank_name">
                        <CustomAvatar :src="stickers_rank.self_rank.user_info.avatar" backgroundColor="var(--white)" :border="true" size="45px" :circle="true"></CustomAvatar>
                        <span>{{ stickers_rank.self_rank.user_info.username }}</span>
                    </div>
                    <div class="rank_point">
                        <span class="iconfont">&#xe62f;</span>
                        <span class="text">
                            {{ stickers_rank.self_rank.point }}
                        </span>
                    </div> -->
                </div>
            </div>
        </template>
    </CustomConfirm>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import CustomConfirm from './CustomConfirm.vue';
import useUserStore from '@/stores/user';
import CustomAvatar from './CustomAvatar.vue';
import CustomTips from './CustomTips.vue';
const { modelValue,user_id } = defineProps(['modelValue','user_id'])
const emit = defineEmits(['update:modelValue']);
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};
const userStore = useUserStore();
const stickers_rank = ref(null);
const getRankDesc = (i) => {
    if(i == 0){
        return '王之宝库·吉尔伽美什'
    }else if(i == 1){
        return '收藏界的奥林匹斯主神'
    }else if(i == 2){
        return '历史宝库的印第安纳·琼斯'
    }else if(i >= 3 && i <= 30){
        return '时光宝库的圆桌骑士'
    }else if(i >= 31 && i <= 50){
        return '古董市场的十字军骑士'
    }else if(i >= 51 && i <= 80){
        return '历史宝藏的威尼斯商人'
    }else if(i >= 81 && i <= 100){
        return '业余历史博物馆馆长'
    }
}
onMounted(async () => {
    const temp_stickers_rank = await userStore.userStickersRank(user_id);
    stickers_rank.value = temp_stickers_rank;
})
</script>

<style lang="scss" scoped>
.title{
    height: 50px;
    background-color: #11113f;
    color: var(--white);
    border-bottom: 1px solid;
    background-image: url(/src/assets/images/base.jpg);
    background-blend-mode: soft-light;
}
.container{
    transform: translateY(0px);
}
.rank_self{
    // width: 85%;
    // position:fixed;
    // bottom:10px;
    // left: 50%;
    // transform: translateX(-50%);
    // border-radius: 4px;
    // box-shadow: 0 0 3px var(--light);
    position: sticky;
    bottom: 10px;
    transform: translateX(1%);
    border-radius: 4px;
    box-shadow: 0 0 3px var(--light);
    width: 98%;
    .desc{
        position: absolute;
        right: 6px;
        line-height: 24px;
    }
    .shift{
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        height:30px;
        align-items: center;
        .rank_order{
            background-color: var(--blue);
            color:var(--white);
            border-radius: 4px;
            width: 55px;
            text-align: center;
            padding-right: 10px;
            font-size: 0.9rem;
            font-family: FZZY-dospy;
            font-weight: normal;
        }
        .avatar{
            transform:translateX(-20px);
        }
    }
    .top_area,
    .bottom_area{
        font-weight:bold;
        height:35px;
        line-height: 35px;
        display: flex;
        padding-left:85px;
        .iconfont{
            margin-left:0;
        }
    }
    .top_area{
        color:var(--dark);
        background-color: var(--white);

    }
    .bottom_area{
        color:var(--white);
        background-color: var(--darkBlue);
    }
}
.desc{
    font-size:.8rem;
    margin-top:8px;
    color:var(--lightDark);
}

.desc[rank="0"]{
    color:red;
}
.desc[rank="1"]{
    color: goldenrod;
}
.desc[rank="2"]{
    color: rgb(159, 216, 159);
}
.rank_ul{
    padding:0 10px;
    padding-bottom: 80px;
}
.rank_li{
    display: flex;
    line-height: 45px;
    margin-bottom: 20px;
    background-color: rgb(231 243 245);
    border: 2px solid var(--white);
    position: relative;
    &[is_user="true"]{
        outline:2px solid var(--blue);
    }
    &[rank="0"],&[rank="1"],&[rank="2"]{
        .rank_order{
            padding-left:7px;
        }
        &::before{
            content:"";
            position:absolute;
            top: -2px;
            left: -2px;
            width: 15px;
            height: 106%;
            background-color: rgb(230, 199, 25);
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
        }
        &[rank="1"]{
            &::before{
                background-color: silver;
            }
        }
        &[rank="2"]{
            &::before{
                background-color: rgb(159, 216, 159);
            }
        }
    }
}
.rank_order{
    font-size: 1.3rem;
    color: var(--lightDark);
    font-family: FZZY-dospy;
    min-width: 30px;
}
.rank_name{
    margin-left:10px;
    display: flex;
    color:var(--dark);
    font-weight: bold;
    font-size: 1rem;
    >span{
        margin-left:10px;
    }
}
.rank_desc{
    flex-grow:1;
    text-align: center;
}
.rank_point{
    flex-grow: 1;
    text-align: right;
    .iconfont{
        font-size: 1.3rem;
        margin-right: 4px;
        color: #ffb203;
        font-weight: bold;
    }
    .text{
        font-weight: bold;
        width: 40px;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        color: goldenrod;
        text-align: center;
        border-radius: 6px;
        font-size: 1.3rem;
    }
}
.container{
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: var(--white);
    background-blend-mode: multiply;
    background-image: url(/src/assets/images/base.jpg);
    background-size: cover;
    overflow-y: auto;
}
</style>