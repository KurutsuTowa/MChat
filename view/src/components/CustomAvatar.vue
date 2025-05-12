<template>
    <div :class="{avatar_box:true,noBorder:noBorder}" :style="{ backgroundColor:props.backgroundColor,width:props.size,height:props.size,borderRadius:props.circle ? '50%' : '6px' || props.borderRadius,border:props.border ? '4px double var(--light)' : '',...style }">
        <img v-show="loaded" @load="loaded=true" :src="appStore.getServerImage(props.src)" class="avatar_img">
        <span v-show="!loaded" class="iconfont">
            &#xe6de;
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAppStore from '@/stores/app';
const appStore = useAppStore();
const loaded = ref(false);
const props = defineProps(['style','src','size','borderRadius','circle','border','backgroundColor','noBorder']);
</script>

<style lang="scss" scoped>
.avatar_box{
    cursor:pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    line-height: 1;
    box-shadow: 0 0 2px;
    background-color: var(--white);
    background-color: var(--lightDark);
    text-align: center;
}
.noBorder{
    box-shadow: none;
}
.iconfont{
    font-size:30px;
    color:var(--white);
    margin:0;
    padding:0;
}
.avatar_img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
}
</style>