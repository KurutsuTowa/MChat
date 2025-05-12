<template>
    <div class="layout_tabber">
        <ul class="tabber_list">
            <li class="self_card"  @click.stop>
                <a-popover :popup-visible="showUserCard" position="right" trigger="click" @click="userStore.userInfo">
                    <div class="avatar_box_wrapper">
                        <CustomAvatar @click="showUserCard=true" :src="userStore.user_info?.avatar" :circle="true" size="50px" style="box-shadow: none;"></CustomAvatar>
                    </div>
                    <template #content>
                        <UserCard :user_id="userStore.user_info?.user_id"></UserCard>
                    </template>
                </a-popover>
            </li>
            <!-- <li class="tabber_item">
                <router-link to="/layout/home">
                    <span class="iconfont">&#xe650;</span>
                </router-link>
            </li> -->
            <li class="tabber_item">
                <router-link to="/layout/chat">
                    <span class="iconfont">&#xe75e;</span>
                </router-link>
            </li>
            <li class="tabber_item">
                <router-link to="/layout/contact">
                    <span class="iconfont">&#xe60c;</span>
                </router-link>
            </li>
        </ul>
        <ul class="tabber_list">
            <li class="tabber_item">
                <router-link to="/layout/theme">
                    <span class="iconfont">&#xe886;</span>
                </router-link>
            </li>            
            <a-popover trigger="click" position="right">
                    <li class="tabber_item" style="width:auto;">
                            <span class="iconfont">&#xe620;</span>
                    </li>
                    <template #content>
                        <div class="popover_container blue">
                            <ul class="more_list">
                                <li class="more_item">
                                    <a-button @click="loginout" type="primary" long>
                                        <template #icon>
                                            <span class="iconfont span">&#xe661;</span>
                                        </template>
                                        <span class="span">退出登录</span>
                                    </a-button>
                                </li>
                            </ul>
                        </div>
                    </template>
            </a-popover>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps(['clickSpace'])
import useUserStore from '@/stores/user';
import useAppStore from '@/stores/app';
import useFriendStore from '@/stores/friend';
import useGroupStore from '@/stores/group';
import useRoomStore from '@/stores/room';
import CustomAvatar from '@/components/CustomAvatar.vue';
import UserCard from '@/components/UserCard.vue';
import { ref,reactive,toRaw,onMounted,onUnmounted } from 'vue';
const userStore = useUserStore();
const appStore = useAppStore();
const friendStore = useFriendStore();
const groupStore = useGroupStore();
const roomStore = useRoomStore();
const showUserCard = ref(false)
const close = () => {
    showUserCard.value = false;
}
const loginout = async () => {
    userStore.logout();
    friendStore.logout();
    groupStore.logout();
    roomStore.logout();
    location.assign('/#/')
}
onMounted(() => {
    document.querySelector('.layout_view')?.addEventListener('click',close)
    userStore.getSelfInfo();
})
onUnmounted(() => {
    document.querySelector('.layout_view')?.removeEventListener('click',close)
})
</script>

<style lang="scss" scoped>
.layout_tabber{
    z-index: 4;
    box-shadow: 2px 0px 17px var(--blue);
    flex-shrink: 0;
    padding:40px 0;
    width:80px;
    height: 100%;
    position:relative;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--blue);
    background-image: url(/src/assets/images/base.jpg);
    background-blend-mode: multiply;
}
.self_card{
    display:flex;
    justify-content: center;
    margin-bottom:30px;
    margin-bottom: 80px;
    margin-top: 30px;
}
.tabber_list{
    width:100%;
    display: flex;
    flex-direction:column;
    align-items: center
}
.avatar_box_wrapper{
    position:relative;
    .avatar_box{
        border:3px solid var(--white);
        box-shadow:0 0 7px var(--darkBlue);
    }
    &::before{
        content: "";
        position: absolute;
        left: 3px;
        top: -3px;
        width: 15px;
        height: 15px;
        background-color: var(--blue);
        border-radius: 50%;
        border: 2px solid var(--white);
        z-index: 1;
        box-shadow:0 0 7px var(--darkBlue);
    }
}
.tabber_item{
    cursor: pointer;
    height: 3rem;
    margin-bottom: 1.5rem;
    width: 100%;
    color:var(--white);
    .iconfont{
        color: inherit;
        font-size:1.6rem;
    }
    a{
        width:100%;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position:relative;
        &.router-link-active{
            
            &::before{
                content:"";
                background-color: var(--someWhite);
                width: 4px;
                border-radius: 6px;
                position:absolute;
                left:0px;
                height:100%;
                box-shadow: 4px 0px 6px 0px var(--highBlue), 4px 0px 13px 0px var(--highBlue), 9px 0px 18px 8px var(--highBlue), 6px 0px 15px 0px var(--white);
            }
        }
    }
}

</style>