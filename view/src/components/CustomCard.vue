<template>
    <div class="custom_card">
        <header class="custom_card_header">
            <slot name="header">
                <div class="header">
                    <span class="title">{{ props.title }}</span>
                </div>
            </slot>
        </header>
        <div class="custom_card_content">
            <slot name="content">
                
            </slot>
        </div>
    </div>
</template>

<script setup>
  const props = defineProps({
    title: String,
  });
</script>

<style lang="scss" scoped>
.custom_card{
    width:100%;
    background-color: var(--white);
    margin: 10px 0;
    box-shadow: 0 2px 4px var(--light);
}
.custom_card_header,
.custom_card_content{
    color:var(--dark);

}
.custom_card_header{
    padding: 0 15px;
}
.header{
    height: 34px;
    &::before{
        content:"\e695";
        font-family:'iconfont'
    }
}
.title{
    font-weight: bold;
}
</style>