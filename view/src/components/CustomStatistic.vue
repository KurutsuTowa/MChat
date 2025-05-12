<template>
    <div class="custom_statistic">
        <header class="custom_statistic_header">{{ title }}</header>
        <div class="custom_statistic_value">{{ new String(value).padStart(2,0) }}</div>
    </div>
</template>

<script setup>
const { title,value } = defineProps(['title','value']);
</script>

<style lang="scss" scoped>
.custom_statistic{
    text-align: center;
    margin: 10px 15px;
}
.custom_statistic_header{
    color: var(--lightDark);
    font-size: .9rem;
}
.custom_statistic_value{
    font-family: 'HarmonyOS Sans Condensed';
    font-size: 2rem;
    color:var(--dark);
    line-height:1;
    font-style: italic;
}
</style>