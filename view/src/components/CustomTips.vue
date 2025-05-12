<template>
    <div class="custom_tips">
        <span v-if="!props.hiddenIcon" :class="'iconfont ' + textClass">{{ props.icon || '&#xe606;' }}</span>
        <span :class="textClass">{{ value }}</span>
    </div>
</template>

<script setup>
const props = defineProps(['icon','value','hiddenIcon','textClass'])
</script>

<style lang="scss" scoped>
.custom_tips{
    font-size: .8rem;
    color: var(--lightDark);
    margin:10px 0;
    display: flex;
    >*{
        vertical-align: middle;
    }
}
.iconfont{
    font-size: inherit;
    font-weight: bold;
}
</style>