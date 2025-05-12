<template>
    <div class="theme_view">
        <div class="theme_menu">
            <header class="header">调色板</header>
            <div>
                <p>主色</p>
                <a-color-picker @change="updateColor('--blue',$event)" defaultValue="#165DFF" showText disabledAlpha/>
            </div>
            <div>
                <p>反差色</p>
                <span>一般</span>
                <a-color-picker @change="updateColor('--white',$event)" defaultValue="#165DFF" showText disabledAlpha/>
                <span>差别小</span>
                <a-color-picker @change="updateColor('--someWhite',$event)" defaultValue="#165DFF" showText disabledAlpha/>
                <span>差别大</span>
                <a-color-picker @change="updateColor('--mostWhite',$event)" defaultValue="#165DFF" showText disabledAlpha/>
            </div>
            <div>
                <p>文本颜色</p>
                <span>普通</span>
                <a-color-picker @change="updateColor('--dark',$event)" defaultValue="#165DFF" showText disabledAlpha/>
                <span>平色</span>
                <a-color-picker @change="updateColor('--lightDark',$event)" defaultValue="#165DFF" showText disabledAlpha/>
                <span>浅色</span>
                <a-color-picker @change="updateColor('--light',$event)" defaultValue="#165DFF" showText disabledAlpha/>
            </div>
            <div>
                <p>表单颜色</p>
                <a-color-picker @change="updateColor('--formColor',$event)" defaultValue="#165DFF" showText disabledAlpha/>
            </div>
            <button @click="appStore.resetTheme" class="custom_button success" style="margin-left:300px;">重置</button>
        </div>
    </div>
</template>

<script setup>
import useAppStore from '@/stores/app';
const appStore = useAppStore();

const updateColor = (vari,color) => {
    document.body.style.setProperty(vari, color);
    appStore.saveTheme();
}
</script>

<style lang="scss" scoped>
.theme_view{
    display:flex;
    height:100%;
    width:100%;
}
.theme_menu{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background-color: var(--white);
    box-shadow: 0 0 8px var(--light);
    padding:20px;
    border-radius: 6px;
    color:var(--dark);
    .header{
        height:50px;
        background-color: var(--blue);
        font-size:1.2rem;
        padding-left:10px;
        color:var(--white);
    }
    span{
        line-height:1;
        vertical-align: 5px;
    }
    &:deep(.arco-color-picker){
        margin-right:8px;
        background-color: var(--formColor);
    }
}
</style>