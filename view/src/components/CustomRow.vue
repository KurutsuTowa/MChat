<template>
    <div class="custom_row" :style="style">
        <slot name="content">

        </slot>
    </div>
</template>

<script setup>
const { style } = defineProps('style')
</script>

<style lang="scss" scoped>
.custom_row{
    background-color: var(--white);
    border: 1px solid var(--light);
    box-shadow: 0 2px 4px var(--light);
    min-height: 36px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .9rem;
    color: var(--lightDark);
    font-weight: bold;
    position: relative;
    
    >*{
        line-height: 1;
    }
}

</style>