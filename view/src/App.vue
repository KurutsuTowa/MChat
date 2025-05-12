<script setup>
import { RouterView } from 'vue-router';
import LoadView from './LoadView.vue';
import useAppStore from './stores/app';
const appStore = useAppStore();
</script>

<template>
  <div class="wrapper">
    <!-- 窗口菜单栏 -->
    <div class="title_bar" v-if="appStore.showTitleBar">
      <ul class="title_bar_list">
        <li class="index-min">
            <span class="icon">&#xe604;</span>
        </li>
        <li class="index-max">
            <span class="icon">&#xe621;</span>
        </li>
        <li class="index-close">
            <span class="icon" style="margin-top:-1px;">&#xe62b;</span>
        </li>
      </ul>
    </div>
    <router-view v-show="!appStore.globalLoadding" v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
  </div>
  <transition appear name="animate__animated animate_bounce" enter-active-class="vanishIn" leave-active-class="vanishOut">
    <LoadView v-if="appStore.globalLoadding"></LoadView>
  </transition>
</template>

<style lang="scss" scoped>

  .wrapper > div{
    margin: 0 auto;
  }

  .title_bar {
      transition: width .3s;
      // width: var(--appWidth);
      height: 20px;
      justify-content: space-between;
      top: 4px;
      z-index: 99999;
      position: absolute;
      right: 0px;
      margin: auto;
      user-select: noen;
      -webkit-user-select: none;
      -webkit-app-region: drag;
      color:#c2c2c2;
  }
  .title_bar,
  .title_bar_list,
  .title_bar-icon {
      display: flex;
      align-items: center;
  }
  .title_bar-icon{
      padding: 0 20px;
  }
  .title_bar-icon > img{
      height: 20px;
      margin-right: 8px;
  }
  .title_bar-icon > span{
      font-size: 16px;
  }
  .title_bar_list > li {
      font-family: 'iconfont';
      flex-grow: 1;
      -webkit-app-region: no-drag;
      width: 34px;
      height: 30px;
      transition: background-color .3s,color .3s;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon{
        font-style: normal;
      }
      &:not(.index-max){
        font-size: 17px;
      }
      &.index-max{
        font-size: 16px;
      }
      &.index-close:hover{
        background-color: rgb(206, 38, 38);
        &:deep(.el-icon){
          color: white;
        }
      }
      &:hover{
        background-color: rgb(var(--primary-5));
      }
      &:hover:deep(.el-icon){
        color: white;
      }
  }
</style>
