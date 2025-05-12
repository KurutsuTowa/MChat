<template>
        <template v-if="isShow">
            <transition appear name="animate__animated animate_bounce" enter-active-class="spaceInUp" leave-active-class="swashOut">
                <div v-show="animation" name="error" class="message_box error" v-if="props.type == 'error'">
                    <div class="icon">
                        <span class="iconfont">&#xe685;</span>
                    </div>
                    <div class="content">
                        <header class="title">{{ props.title || 'ERROR' }}</header>
                        <p>{{ props.value || '未知错误' }}</p>
                    </div>
                    <div class="error_line_top">
                        <span></span>
                        <span></span>
                    </div>
                    <div class="error_line_bottom">
                        <span></span>
                        <span></span>
                    </div>
                    <div class="error_line_left">
                        <span></span>
                        <span></span>
                    </div>
                    <div class="error_line_right">
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </transition>
            <transition appear name="animate__animated animate_bounce custom_animation" enter-active-class="normalScaleIn" leave-active-class="normalScaleOut">
                <div v-show="animation" name="noraml" class="message_box normal" v-if="props.type == 'normal'">
                    <div class="icon">
                        <span class="iconfont">&#xe7b3;</span>
                    </div>
                    <span class="value">{{ props.value }}</span>
                </div>
            </transition>
        </template>
</template>

<script lang="js" setup>
    import { ref } from 'vue';

    let isShow = ref(true);
    const animation = ref(true);
    const props = defineProps({
        unmount:Function,
        title:String,
        type:{
            type:String,
            default:'normal'
        },
        value:{
            type:String,
            default:''
        },
        duration:{
            type:Number,
            default:3000
        },
        title:{

        },
        top:String
    })

    setTimeout(() => {
        animation.value = false;
        setTimeout(() => {
            isShow.value = false;
            if(props.unmount)props.unmount();
        },1000)
    },props.duration)
</script>

<style lang="scss" scoped>
    .message_box.normal{
        margin-top:50px;
        width: 400px;
        background-color: var(--white);
        border-radius: 15px;
        display:flex;
        white-space: nowrap;
        overflow: hidden;
        box-shadow: 0 0 30px var(--light);
        .icon{
            // background-color: rgb(1 180 251);
            background-color: var(--blue);
            width:30px;
            height:30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            overflow: hidden;
            color:var(--white);
            vertical-align: middle;
            flex-shrink: 0;
            z-index: 1;
            border: 1px solid var(--blue);
            .iconfont{
                font-size: 20px;
                font-weight: bold;
            }
        }
        .value{
            flex-grow:1;
            text-align: center;
            margin-left: -30px;
            line-height: 30px;
            color:var(--dark);
        }
    }
    .message_box.error{
        height: 80px;
        min-width: 300px;
        background-color: rgb(0 0 0 / 82%);
        backdrop-filter: blur(10px);
        position: relative;
        box-shadow: 0 0 60px black;
        background: linear-gradient(45deg, var(--black),var(--black), rgba(77, 2, 5, 0.82),var(--black), var(--black));
        background-size: 600% 600%; /* 增加背景大小以获得更平滑的过渡 */

        .icon{
            z-index: 1;
            border: 3px double rgb(245, 4, 13);
            width:20px;
            height:20px;
            line-height: 20px;
            text-align: center;
            position: absolute;
            top:0px;
            left:50%;
            transform: translate(-50%,-50%) rotate(45deg);
            background-color: rgb(0 0 0 / 65%);
            .iconfont{
                position: absolute;
                left:50%;
                top:50%;
                font-size: 18px;
                transform: translate(-50%,-50%) rotate(-45deg);
                color: rgb(245 4 13);
            }
        }
        .content{
            width:100%;
            height:100%;
            padding:4px 24px;
            text-align: center;
            color:rgb(245 4 13);
            .title{
                margin-top:16px;
                font-weight: bold;
            }
        }
        .error_line_top,
        .error_line_bottom,
        .error_line_left,
        .error_line_right{
            position: absolute;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgb(245 4 13);
            span{
                background-color: rgb(245 4 13);
                width: 6px;
                height: 6px;
            }
        }
        .error_line_top,
        .error_line_bottom{
            width:100%;
            height: 1px;
            
        }
        .error_line_top{
            top:0px;
        }
        .error_line_bottom{
            bottom: 0px;
        }
        .error_line_left,
        .error_line_right{
            width:1px;
            height: 80%;
            top:50%;
            transform: translateY(-50%);
            flex-direction: column;
        }
        .error_line_left{
            left:20px;
        }
        .error_line_right{
            right:20px;
        }
    }
    svg{
        margin-right: 10px;
    }
    .custom-msg{
        height: 25px;
        line-height: 25px;
        border-radius: 4px;
        display: flex;
        padding: 4px 30px;
        text-align: center;
        transition: all 1s ease-in;
        *{
            vertical-align: middle;
        }
        .custom-msg-title{
            font-size: 18px;
            font-weight: bold;
        }
        .custom-msg-value{
            font-size: 16px;
            white-space: nowrap;
            margin-top: 2px;
        }
    }
    .light-style{
        border: 1px solid white;
        background: linear-gradient(45deg, white, #d0faff);
        .custom-msg-value{
            // color: rgb(50 111 150);
            color: rgb(97 132 154);
        }
    }
    .right-style{
        @extend .light-style;
        .custom-msg-value{
            color: gray;
        }
    }
    
    .normalScaleIn {
        animation-delay: .2s;
        animation-name: normalScaleIn;
        animation-duration: 0.5s; 
    }

    .normalScaleOut {
        animation-name: normalScaleOut;
        animation-duration: 0.5s; 
    }
    @keyframes normalScaleIn {
        from{
            width: 29px;
        }
        to{
            width:400px;
        }
    }
    @keyframes normalScaleOut{
        from{
            width: 400px;
        }
        to{
            width:29px;
        }
    }
</style>