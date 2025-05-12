<template>
    <div ref="tag_list_box" class="tag_list_box" :style="boxStyle">
        <ul v-show="tags?.length" ref="tag_list" :class="{base_info_tag:true,tag_list:true,no_add:!add}" :style="style">
            <li @click="clickCallback && clickCallback(tag)" class="tag" v-for="tag in tags" :style="{ backgroundColor:tag.tag_color,color:tag.text_color,borderColor:tag.border_style  }">
                {{ tag.tag_name }}
                <transition appear name="animate__animated animate_bounce" leave-active-class="vanishOut">
                    <span v-if="delStatus" @click.stop="delCallback(tag)" class="del_btn iconfont">&#xe867;</span>
                </transition>
            </li>
        </ul>
        <CustomTips v-if="!noTips" :textClass="textClass" v-show="!tags?.length" :hiddenIcon="true" value="该用户没有任何Tag" style="width: 100%;"></CustomTips>
        <button v-if="showMore" ref="more" @click="nextPageTag" class="min_button" style="margin-left:0;">
            &#xe634;
        </button>
        <li v-if="add" @click="showTagsManager=true" class="iconfont min_button">&#xe610;</li>
        <TagsManager v-if="add" v-model="showTagsManager"></TagsManager>
    </div>
</template>

<script setup>
import useAppStore from '@/stores/app';
import CustomTips from './CustomTips.vue';
import TagsManager from './TagsManager.vue';
import { nextTick } from 'vue';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
const appStore = useAppStore();
const { tags,add,style } = defineProps(['tags','add','style','box-style','clickCallback','delStatus','delCallback','textClass','noTips']);
const tag_list_box = ref();
const tag_list = ref();
const more = ref();
const showTagsManager = ref(false);
// 是否显示右拉按钮
const showMore = ref(true);
// 标签翻页
const nextPageTag = (e) => {
    e.target.innerHTML = '&#xe634;'
    const offsetWidth = tag_list.value.offsetWidth;
    const scrollWidth = tag_list.value.scrollWidth - offsetWidth;
    if(tag_list.value.scrollLeft < scrollWidth){
        tag_list.value.scrollTo({
            left: tag_list.value.scrollLeft + 80, // 滚动到页面的垂直位置
            behavior: 'smooth' // 平滑滚动
        });
        if(tag_list.value.scrollLeft + 80 >= scrollWidth){
            e.target.innerHTML = '&#xe636;'
        }
    }else{
        tag_list.value.scrollTo({
            left: 0,
            behavior: 'smooth' // 平滑滚动
        });
    }
}
const checkTagOutBound = () => {
    nextTick(() => {
        const boxWidth = tag_list_box.value.offsetWidth;
        showMore.value = boxWidth < tag_list.value.scrollWidth;
    })
}

// 对列表元素的监听
const observer = ref(null);
onMounted(() => {
    if(appStore.globalLoadding == false){
        checkTagOutBound()
    }else{
        watch(() => appStore.globalLoadding,(val) => {
            checkTagOutBound()
        })
    }
    observer.value = new MutationObserver(checkTagOutBound);
    observer.value.observe(tag_list.value,{ attributes: true, childList: true, subtree: true });
})
</script>

<style lang="scss" scoped>
.tag{
    cursor:pointer;
    position:relative;
    margin-right:6px;
}
.del_btn{
    margin: 0;
    position: absolute;
    right: -7px;
    top: -3px;
    background-color: var(--red);
    color: var(--white);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    line-height: 14px;
    font-size: .7rem;
    text-align: center;
    box-shadow: 0 0 8px 1px var(--dark);
}
.min_button{
    text-align: center;
    margin-right: 0;
    background-color: var(--someWhite);
}
.no_add{
    width:100%;
}
</style>