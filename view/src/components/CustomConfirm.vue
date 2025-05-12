<template>
    <transition appear name="fast_animation" enter-active-class="custom_fadeIn" leave-active-class="custom_fadeOut">
        <div v-if="props.modelValue"  @click.stop ref="confirm_elem"  @click.stop.self="cancel" :class="{ confirm_mask:!props.noMask }">
            <div class="card_box confirm_box center" :id="id" :style="style">
                <slot name="custom">
                    <header class="title">
                        <!-- 标题 -->
                        <slot name="header">
                            <span class="iconfont">{{ props.icon || '&#xe63f;' }}</span>
                            <span v-html="props.title"></span>
                        </slot>
                    </header>

                    <div :class="{ card_container: true, container: true, center_container: props.center }">
                        <!-- 内容 -->
                        <slot name="content">
                            <div class="content">
                                <span v-html="props.content"></span>
                            </div>
                        </slot>
                    </div>
                    <slot name="footer">
                        <div class="card_footer footer">
                            <!-- 按钮 -->
                            <div class="buttons">
                                <button @click="ok" class="custom_button success">
                                    <span class="iconfont">&#xe641;</span>
                                    <span>确认</span>
                                </button>
                                <button @click="cancel" class="custom_button normal">
                                    <span>取消</span>
                                    <span class="iconfont">&#xe867</span>
                                </button>
                            </div>
                        </div>
                    </slot>
                </slot>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['modelValue','title','content','icon','center','ok','cancel','style','noMask','id'])
const emit = defineEmits(['update:modelValue']);

const confirm_elem = ref();

// 按钮的默认方法
const ok = (e) => {
    if (props.ok) props.ok(e);
    emit('update:modelValue', false);
};

const cancel = (e) => {
    if (props.cancel) props.cancel(e);
    emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
.confirm_mask {
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0px;
    left:0px;
    background-color: rgba(0, 0, 0, .3);
    display:flex;
    align-items: center;
    justify-content: center;
}

.confirm_box {
    position: relative;
}

</style>