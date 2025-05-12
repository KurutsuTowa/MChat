<template>
    <div class="auth_view">
        <div class="form_box">
            <transition appear name="animate__animated animate_bounce" enter-active-class="vanishIn">
                <FormView v-if="showForm"></FormView>
            </transition>
        </div>
        <div class="auth_background_box">
            <video muted autoplay loop ref="videoElement" @canplay="handleViewCanPlay" @loadedmetadata="initializeVideoControl" class="auth_background" disablePictureInPicture  src="/src/assets/videos/auth.mp4" ></video>
        </div>
    </div>
</template>

<script setup>
import FormView from './FormView.vue'
import { ref,onMounted } from 'vue';
import useAppStore from '@/stores/app';
const appStore = useAppStore();
const showForm = ref(false);
appStore.globalLoadding = true;
// 该方法用于处理视频加载
const handleViewCanPlay = () => {
    // 同时播放至少1秒的加载动画
    setTimeout(() => {
        appStore.globalLoadding = false;
        setTimeout(() => {
            showForm.value = true;
        },100)
    },1000)
}
// 该方法用于处理视频播放
const videoElement = ref();
const startSecond = 32; // 视频开始播放的秒数
const endSecond = 70; // 视频循环到结束的秒数
const initializeVideoControl = () => {
    videoElement.value.muted = true;
    videoElement.value.play();
    videoElement.value.addEventListener('timeupdate', checkVideoPosition);
};

const checkVideoPosition = () => {
    if (videoElement.value.currentTime >= endSecond) {
        videoElement.value.currentTime = startSecond;
        videoElement.value.play();
    }
};
onMounted(() => {
    initializeVideoControl();
});
</script>

<style lang="scss" scoped>
    .auth_view{
        width:100vw;
        height:100vh;
        overflow:hidden;
        position:relative;   
        animation: glitch 6000ms infinite linear;
    }
    .form_box,
    .auth_background_box,
    .auth_background{
        width:100%;
        height:100%;
    }
    .form_box{
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .auth_background_box{
        top:0px;
        position:absolute;
        z-index:-1;
        .auth_background{
            object-fit: cover;
            object-position:center center;
        }
    }
    @keyframes glitch {
        from{
            filter: invert(0);
        }
        18%{
            filter: invert(0);
        }
        20%{
            filter: invert(1);
        }
        22%{
            filter: invert(0);
        }
        68%{
            filter: invert(0);
        }
        70%{
            filter: invert(1);
        }
        72%{
            filter: invert(0);
        }
        to{
            filter: invert(0);
        }
    }

</style>