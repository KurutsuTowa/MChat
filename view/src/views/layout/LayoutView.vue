<template>
    <div class="layout_view">
        <LayoutTabber></LayoutTabber>
        <main class="layout_inner">
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup>
import LayoutTabber from './LayoutTabber.vue'
import useAppStore from '@/stores/app';
import useUserStore from '@/stores/user';
import useRoomStore from '@/stores/room';
import { onMounted,ref,nextTick } from 'vue';
const appStore = useAppStore();
const userStore = useUserStore();
// 
</script>

<style lang="scss" scoped>
.layout_view{
    box-sizing: border-box;
    background-color: var(--uiColor);
    height: 100vh;
    width: 100vw;
    display: flex;
}
.layout_inner{
    position:relative;
    flex-grow: 1;
    box-sizing:border-box;
    >*{
        width: 100%;
        height:100%;
        display: flex;
        >*{
            flex-shrink: 0;
        }
    }
}
</style>