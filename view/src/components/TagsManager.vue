<template>
        <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue" :center="true"
            style="width:800px;">
            <template #custom>
                <header class="title" style="height:125px;">
                    <span class="iconfont">&#xe6a4;</span>
                    <span>标签管理器</span>
                </header>
                <div class="container" style="width:100%;height: 440px;">
                    <div class="container_content">
                        <div class="user_tag_list">
                            <div class="user_tag_list_desc">
                                <span class="iconfont">&#xe679;</span>
                                <span style="vertical-align: -1.5px;">你的标签</span>
                            </div>
                            <CustomTags :tags="userStore.user_info.tags" :clickCallback="clickTagCallback" :delStatus="del" :delCallback="unUseCallback" :add="false" box-style="width:85%;"></CustomTags>
                            <!-- <div class="tag_list">
                                <ul ref="tag_list_box" class="tag_list_box" v-show="userStore.user_info.tags?.length" :class="{base_info_tag:true,tag_list:true}" style="margin-top:10px;">
                                    <li class="tag"  @click="clickTagCallback(tag)" v-for="tag in userStore.user_info.tags" :style="{ backgroundColor:tag.tag_color,color:tag.text_color,borderColor:tag.border_style  }">{{ tag.tag_name }}</li>
                                </ul>
                                <CustomTips v-show="!userStore.user_info.tags?.length" :hiddenIcon="true" value="该用户没有任何Tag" style="width: 100%;"></CustomTips>
                                <button v-if="showMore" ref="more" @click="nextPageTag" class="min_button" style="margin-left:0;">
                                    &#xe634;
                                </button>
                                <li v-if="add" @click="showTagsManager=true" class="iconfont min_button">&#xe610;</li>
                                <TagsManager v-if="add" v-model="showTagsManager"></TagsManager>
                            </div> -->
                            <button v-if="del" @click="del=false" class="min_button noDel">&#xe867;</button>
                            <button v-else @click="del=true" class="min_button del">&#xe707;</button>
                            <CustomAvatar :src="userStore.user_info.avatar" background-color="var(--dark)" size="50px">
                            </CustomAvatar>
                        </div>
                        <div class="net_tag_list">
                            <header class="net_tag_list_tabber">
                                <div @click="active_tabber = 'top'" :active="active_tabber == 'top'"
                                    class="net_tag_list_tabber_item">
                                    <span class="iconfont">&#xe782;</span>
                                    <span>常用排行</span>
                                </div>
                                <div @click="active_tabber = 'find'" :active="active_tabber == 'find'"
                                    class="net_tag_list_tabber_item">
                                    <span class="iconfont">&#xe65e;</span>
                                    <span>搜索发现</span>
                                </div>
                                <div @click="active_tabber = 'create'" :active="active_tabber == 'create'"
                                    class="net_tag_list_tabber_item">
                                    <span class="iconfont">&#xe662;</span>
                                    <span>我创建的</span>
                                </div>
                            </header>
                            <div v-if="active_tabber == 'top'" class="list_box">
                                <CustomTips value="这是常用标签的排行(1~100名)"></CustomTips>
                                <hr class="custom_hr">
                                <ul class="list tag_list">
                                    <li v-for="tag in hot_user_tags" @click="clickTagCallback(tag)" class="item">
                                        <dl class="item_desc">
                                            <dd>
                                                <span class="iconfont">&#xeb7d;</span>
                                                <span class="value">{{ tag.total }}人在用</span>
                                            </dd>
                                        </dl>
                                        <div class="item_face">
                                            <div class="tag"
                                                :style="{ backgroundColor: tag.first_tag_color, color: tag.first_text_color }">
                                                {{ tag.tag_name }}</div>
                                        </div>
                                        <div class="item_creator">
                                            <CustomAvatar :circle="true" background-color="white" :src="tag.avatar"
                                                size="30px"></CustomAvatar>
                                            <span class="name">{{ tag.username }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="active_tabber == 'find'" class="list_box">
                                <div class="list_header">
                                    <CustomTips style="flex-grow:1;" value="在这里可以搜索和发现新的标签"></CustomTips>
                                    <a-input-search v-model="keywords" @search="searchCallback"
                                        :style="{ margin: '4px 0px', width: '220px', border: '1px solid var(--light)', borderRadius: '6px' }"
                                        placeholder="输入标签名/用户名" />
                                </div>
                                <hr class="custom_hr">
                                <!-- <header class="list_title">随机推荐</header> -->
                                <template v-if="!search_user_tags && random_user_tags.length">
                                    <header>随机推荐</header>
                                    <ul  class="list tag_list">
                                        <li v-for="tag in random_user_tags" @click="clickTagCallback(tag)" class="item">
                                            <dl class="item_desc">
                                                <dd>
                                                    <span class="iconfont">&#xeb7d;</span>
                                                    <span class="value">{{ tag.total }}人在用</span>
                                                </dd>
                                            </dl>
                                            <div class="item_face">
                                                <div class="tag"
                                                    :style="{ backgroundColor: tag.first_tag_color, color: tag.first_text_color }">
                                                    {{ tag.tag_name }}</div>
                                            </div>
                                            <div class="item_creator">
                                                <CustomAvatar :circle="true" background-color="white" :src="tag.avatar"
                                                    size="30px"></CustomAvatar>
                                                <span class="name">{{ tag.username }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </template>
                                <div v-if="search_user_tags?.length === 0" class="empty_tips">
                                    <span class="iconfont" style="font-size:1.4rem;">&#xe673;</span>
                                    <span>找不到该标签,换个关键字试试？</span>
                                </div>
                                <ul v-else class="list tag_list">
                                    <li v-for="tag in search_user_tags" @click="clickTagCallback(tag)" class="item">
                                        <dl class="item_desc">
                                            <dd>
                                                <span class="iconfont">&#xeb7d;</span>
                                                <span class="value">{{ tag.total }}人在用</span>
                                            </dd>
                                        </dl>
                                        <div class="item_face">
                                            <div class="tag"
                                                :style="{ backgroundColor: tag.first_tag_color, color: tag.first_text_color }">
                                                {{ tag.tag_name }}</div>
                                        </div>
                                        <div class="item_creator">
                                            <CustomAvatar :circle="true" background-color="white" :src="tag.avatar"
                                                size="30px"></CustomAvatar>
                                            <span class="name">{{ tag.username }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="active_tabber == 'create'" class="list_box">
                                <div class="list_header">
                                    <CustomTips value="这是你创建的标签仓库"></CustomTips>
                                    <div>
                                        <button @click="showCreateDialog=true" class="custom_button success" style="padding:0 10px;width:auto;"><span
                                                class="iconfont" style="font-size:1rem;">&#xe657;</span>创建标签</button>
                                    </div>
                                </div>
                                <hr class="custom_hr">
                                <div v-if="created_user_tags?.length === 0" class="empty_tips">
                                    <span class="iconfont" style="font-size:1.4rem;">&#xe673;</span>
                                    <span>点击右上角按钮创建第一个属于你的标签吧</span>
                                </div>
                                <ul v-else class="list tag_list">
                                    <li v-for="tag in created_user_tags" @click="clickTagCallback(tag)" class="item">
                                        <dl class="item_desc">
                                            <dd>
                                                <span class="iconfont">&#xeb7d;</span>
                                                <span class="value">{{ tag.total }}人在用</span>
                                            </dd>
                                        </dl>
                                        <div class="item_face">
                                            <div class="tag"
                                                :style="{ backgroundColor: tag.first_tag_color, color: tag.first_text_color }">
                                                {{ tag.tag_name }}</div>
                                        </div>
                                        <div class="item_creator">
                                            <CustomAvatar :circle="true" background-color="white"
                                                :src="userStore.user_info.avatar" size="30px"></CustomAvatar>
                                            <span class="name">{{ userStore.user_info.username }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </CustomConfirm>
        <!-- 添加标签面板 -->
        <CustomConfirm class="button_no_auto" style="width:280px;background-color: var(--mostLight);" v-model="showAddDialog">
            <template #custom>
                <header class="title" style="height:50px;background-color:var(--dark);">
                    <span class="iconfont">&#xe667;</span>
                    <span>使用标签</span>
                </header>
                <div class="container dialog" style="width:280px;height:170px;">
                    <div class="preview_box">
                        <div class="tag_list">
                            <div class="tag"
                                :style="{ backgroundColor: addTagForm.tag_color, color: addTagForm.text_color,borderColor:addTagForm.border_style }">{{
            addTagForm.tag_name }}</div>
                        </div>
                    </div>
                    <div class="form">
                        <a-color-picker @click.stop v-model="addTagForm.tag_color" size="mini">
                            背景:
                            <a-tag :color="addTagForm.tag_color">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ addTagForm.tag_color }}
                            </a-tag>
                        </a-color-picker>
                        <a-color-picker @click.stop v-model="addTagForm.text_color" size="mini">
                            文字:
                            <a-tag :color="addTagForm.text_color">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ addTagForm.text_color }}
                            </a-tag>
                        </a-color-picker>
                        <a-color-picker @click.stop v-model="addTagForm.border_style" size="mini">
                            边框:
                            <a-tag :color="addTagForm.border_style">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ addTagForm.border_style }}
                            </a-tag>
                        </a-color-picker>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="showAddDialog=false" class="custom_button normal">
                        <span class="iconfont">&#xe671;</span>
                        <span>取消</span>
                    </button>
                    <button @click="useTag" class="custom_button success">
                        <span>使用</span>
                        <span class="iconfont">&#xe623;</span>
                    </button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 修改标签面板 -->
        <CustomConfirm class="button_no_auto" style="width:300px;background-color: var(--mostLight);" v-model="showUpdateDialog" title="修改使用中的标签">
            <template #custom>
                <header class="title" style="height:50px;background-color:var(--dark);">
                    <span class="iconfont">&#xe7e5;</span>
                    <span>修改使用中的标签</span>
                </header>
                <CustomTips value="正在使用，可在下方修改使用样式"></CustomTips>
                <div class="container dialog" style="width:280px;height:170px;">
                    <div class="preview_box">
                        <div class="tag_list">
                            <div class="tag"
                                :style="{ backgroundColor: updateTagForm.tag_color, color: updateTagForm.text_color,borderColor:updateTagForm.border_style }">{{
            updateTagForm.tag_name }}</div>
                        </div>
                    </div>
                    <div class="form">
                        <a-color-picker @click.stop v-model="updateTagForm.tag_color" size="mini">
                            背景:
                            <a-tag :color="updateTagForm.tag_color">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ updateTagForm.tag_color }}
                            </a-tag>
                        </a-color-picker>
                        <a-color-picker @click.stop v-model="updateTagForm.text_color" size="mini">
                            文字:
                            <a-tag :color="updateTagForm.text_color">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ updateTagForm.text_color }}
                            </a-tag>
                        </a-color-picker>
                        <a-color-picker @click.stop v-model="updateTagForm.border_style" size="mini">
                            边框:
                            <a-tag :color="updateTagForm.border_style">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ updateTagForm.border_style }}
                            </a-tag>
                        </a-color-picker>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="showUpdateDialog=false" class="custom_button normal">
                        <span class="iconfont">&#xe671;</span>
                        <span>取消</span>
                    </button>
                    <button @click="updateTag" class="custom_button success">
                        <span>修改</span>
                        <span class="iconfont">&#xe7e5;</span>
                    </button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 创建标签面板  -->
        <CustomConfirm class="button_no_auto" style="width:300px;background-color: var(--mostLight);" v-model="showCreateDialog" title="创建新的标签">
            <template #custom>
                <header class="title" style="height:50px;">
                    <span class="iconfont">&#xe7e5;</span>
                    <span>创建新的标签</span>
                </header>
                <div style="padding:5px;width: 258px;">
                    <a-input v-model="createTagForm.tag_name">
                        <template #prepend>
                            <span style="font-size:.8rem;color:var(--dark);">标签名</span>
                        </template>
                    </a-input>
                </div>
                <div class="container dialog" style="width:280px;height:170px;padding-top:0px;">
                    <div class="preview_box" style="padding:0;">
                        <div class="tag_list" style="display:flex;justify-content: center;">
                            <div class="tag" :style="{ backgroundColor: createTagForm.tag_color, color: createTagForm.text_color,borderColor:createTagForm.border_style }">{{createTagForm.tag_name }}</div>
                        </div>
                    </div>
                    <div class="form">
                        <a-color-picker @click.stop v-model="createTagForm.tag_color" size="mini">
                            背景:
                            <a-tag :color="createTagForm.tag_color">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ createTagForm.tag_color }}
                            </a-tag>
                        </a-color-picker>
                        <a-color-picker @click.stop v-model="createTagForm.text_color" size="mini">
                            文字:
                            <a-tag :color="createTagForm.text_color">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ createTagForm.text_color }}
                            </a-tag>
                        </a-color-picker>
                        <a-color-picker @click.stop v-model="createTagForm.border_style" size="mini">
                            边框:
                            <a-tag :color="createTagForm.border_style">
                                <template #icon>
                                    <icon-bg-colors style="color: #fff;" />
                                </template>
                                {{ createTagForm.border_style }}
                            </a-tag>
                        </a-color-picker>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="showCreateConfirm=true" class="custom_button success" style="background-color:var(--blue)">
                        <span class="iconfont">&#xe654;</span>
                        <span>创建</span>
                    </button>
                    <button @click="showCreateDialog=false" class="custom_button normal">
                        <span class="iconfont">&#xe671;</span>
                        <span>取消</span>
                    </button>
                </div>
            </template>
        </CustomConfirm>
        <CustomConfirm class="button_no_auto" v-model="showUnuseConfirm" title="从使用标签中移出" :content="`确定不再使用标签<em>${unUseTagName}</em>吗`" :ok="unUseTag"></CustomConfirm>
        <CustomConfirm class="button_no_auto" v-model="showCreateConfirm" :ok="createTag" title="创建标签" :content="`
            <h4 style='color:var(--dark)'>创建的标签将公开给所有用户使用，第一次选择的颜色将被记录</h4>
            <ul class='custom_ul'>
                <li class='custom_li'><em style='color:var(--red);'>不可删除</em></li>
                <li class='custom_li'><em style='color:var(--highBlue);'>不可更改</em></li>
            </ul>
            <h4 style='color:var(--dark)'>即便这样还要创建吗？</h4>
        `" ></CustomConfirm>
</template>

<script setup>
import { onMounted, ref,toRaw } from 'vue';
import CustomAvatar from './CustomAvatar.vue';
import CustomConfirm from './CustomConfirm.vue'
import CustomTags from './CustomTags.vue';
import CustomTips from './CustomTips.vue';
import useUserStore from '@/stores/user';
import customMessage from '@/utils/customMessage';
const userStore = useUserStore();
const { modelValue } = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue']);
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};

const showAddDialog = ref(false);
const showUpdateDialog = ref(false);
const showCreateDialog = ref(false);
const showUnuseConfirm = ref(false);
const showCreateConfirm = ref(false);
const keywords = ref('');
const border_style_option = ['solid', 'double']
const del = ref(false);
// 修改标签的表单
const updateTagForm = ref({
    tag_name: '',
    tag_color: '',
    text_color: '',
    border_style: '',
})
// 使用标签的表单
const addTagForm = ref({
    tag_name: '',
    tag_color: '',
    text_color: '',
    border_style: '',
})
// 创建标签的表单
const createTagForm = ref({
    tag_name: '标签名',
    tag_color: '#1E6ED0',
    text_color: '#FFFFFF',
    border_style: '#FFFFFF',
})
// 不在使用标签的标签名
const unUseTagName = ref('');
// 不再使用该标签的回调
const unUseCallback = (tag) => {
    unUseTagName.value = tag.tag_name;
    showUnuseConfirm.value = true;
}
const reload = async () => {
    await userStore.userInfo();
    hot_user_tags.value = await userStore.userTagTop(100);
    created_user_tags.value = await userStore.userTagAddList();
    random_user_tags.value = await userStore.userTagRandom(100);
}
// 不在使用该标签
const unUseTag = () => {
    userStore.userTagRemove(unUseTagName.value)
    .then(async msg => {
        userStore.userInfo();
        customMessage({type:'normal',value:msg})
        reload();
    })
    .catch(data => {
        customMessage({type:'error',value:data.msg})
    })
    .finally(() => {
        unUseTagName.value = '';
        showCreateDialog.value = false;
    })
}
// 搜索回调
const searchCallback = async () => {
    if (!keywords.value.trim()) return customMessage({ type: 'error', value: '请输入搜索内容' })
    search_user_tags.value = await userStore.userTagSearch(keywords.value);
}
// 点击标签时的回调
const clickTagCallback = (target_tag) => {
    // 如果用户已使用该标签，则显示修改面板
    const exist = userStore.user_info.tags.find(tag => tag.tag_name == target_tag.tag_name);
    if (exist) {
        updateTagForm.value.tag_name = target_tag.tag_name;
        updateTagForm.value.tag_color = exist.tag_color;
        updateTagForm.value.text_color = exist.text_color;
        updateTagForm.value.border_style = exist.border_style;

        showUpdateDialog.value = true;
    } else {


        addTagForm.value.tag_name = target_tag.tag_name;
        addTagForm.value.tag_color = target_tag.first_tag_color;
        addTagForm.value.text_color = target_tag.first_text_color;
        addTagForm.value.border_style = target_tag.first_border_style;

        showAddDialog.value = true;
    }
}
// 修改使用标签
const updateTag = () => {
    userStore.updateUserTag(toRaw(updateTagForm.value))
    .then(msg => {
        reload();
        customMessage({type:'normal',value:msg})
    })
    .catch(data => {
        customMessage({type:'error',value:data.msg})
    })
    .finally(() => {
        showUpdateDialog.value = false;
    })
}
// 使用标签
const useTag = () => {
    userStore.userUseTag(toRaw(addTagForm.value))
    .then(msg => {
        reload();
        customMessage({type:'normal',value:msg})
    })
    .catch(data => {
        customMessage({type:'error',value:data.msg})
    })
    .finally(() => {
        showAddDialog.value = false;
    })
}
// 创建标签
const createTag = () => {
    if(!createTagForm.value.tag_name.trim()) return customMessage({type:'error',value:'请输入标签名'});
    if(!createTagForm.value.tag_name == '标签名') return customMessage({type:'error',value:'请输入你自己的标签名'});
    userStore.userTagAdd(toRaw(createTagForm.value))
    .then(async msg => {
        reload();
        customMessage({type:'normal',value:msg})
    })
    .catch(data => {
        customMessage({type:'error',value:data.msg})
    })
    .finally(() => {
        showCreateDialog.value = false;
    })
}
const active_tabber = ref('top');
const hot_user_tags = ref(null);
const search_user_tags = ref(null);
const created_user_tags = ref(null);
const random_user_tags = ref(null);
onMounted(async () => {
    reload();
})
</script>

<style lang="scss" scoped>

.container{
    user-select:none;
}

.container.dialog {
    display: flex;
}
.tag{
    cursor: pointer;
}
.buttons{
    display: flex;
    transform: translateY(120%);
    .custom_button{
        margin: 0 4px;
        &.success{
            background-color: var(--dark);
        }
    }
    .iconfont{
        margin:0 4px;
    }
}
.preview_box {
    width: 130px;
    border-radius: 4px;
    box-shadow: 2px 2px 1px 0px var(--light);
    background-color: var(--someWhite);
    border: 1px solid var(--light);
    display: flex;
    align-items: center;
    justify-content: center;
    .tag_list{
        justify-content: center;
    }
}
.del{
    background-color: var(--red);
    color: var(--white);
    width: 30px;
    height: 30px;
}
.noDel{
    background-color: var(--blue);
    color: var(--white);
    width: 30px;
    height: 30px;
}
.form {
    color:var(--black);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 10px;
}

.list {
    width: 100%;
    overflow-y: auto;
    overflow-x: auto;
    align-items: start;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .item {
        margin-top: 12px;
        position: relative;
        width: 120px;
        flex-shrink: 0;
        background-color: var(--blue);
        padding: 10px;
        border-radius: 3px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 3px double var(--blue);
        border-radius: 4px;
        background-color: var(--white);
        box-shadow: 4px 4px 0px 0px var(--blue);
        padding-left: 2px;
        cursor: pointer;
        transition: all .3s;

        &:hover {
            .item_desc {
                background-color: var(--highBlue);
            }

            border-color: var(--highBlue);
            box-shadow: 4px 4px 0px 0px var(--highBlue);
        }

        >div {
            display: flex;
        }
    }

    .item_creator {
        display: flex;
        font-size: .8rem;
        align-items: center;

        .name {
            color: var(--highBlue);
            font-weight: bold;
            margin-left: 10px;
        }
    }

    .item_face {
        margin: 3px 0;
    }

    .item_desc {
        text-transform: uppercase;
        font-size: 0.8rem;
        position: absolute;
        top: 0px;
        left: 0px;
        transform: translateY(-50%);
        background-color: var(--blue);
        color: var(--white);
        border-radius: 3px;
        padding: 0 4px;
    }
}

.list_title {
    margin-left: 10px;
    color: var(--dark);
    font-size: .8rem;
    font-weight: bold;
}

.list_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.empty_tips {
    width: 100%;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    color: var(--lightDark);
}

.container {
    background-color: var(--mostLight);
    padding: 14px;

    .container_content {
        height: calc(100% + 50px);
        transform: translateY(-50px);
        display: flex;
        flex-direction: column;

        >div {
            width: 100%;
        }
    }

    .user_tag_list {
        height: 72px;
        border-radius: 3px;
        background-color: var(--white);
        box-shadow: 1px 4px 4px var(--light);
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        padding-bottom: 0;
        padding-right: 10px;

        .user_tag_list_desc {
            position: absolute;
            top: 0px;
            left: 10px;
            transform: translateY(-50%);
            padding: 4px 30px;
            background-color: var(--dark);
            color: var(--white);
            border-radius: 3px;
        }
    }

    .net_tag_list {
        margin-top: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        .list_box {
            padding: 8px 12px;
            flex-grow: 1;
            background-color: var(--white);
            display: flex;
            flex-direction: column;
            max-height: 330px;
            overflow-y: auto;
        }
    }

    .custom_hr {
        box-shadow: inset 0 0 1px var(--light);
    }

    .net_tag_list_tabber {
        display: flex;
        transform: translateY(1px);

        .net_tag_list_tabber_item {
            border-top: 6px solid var(--mostLightDark);
            background-color: var(--someWhite);
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            margin-right: 6px;
            height: 40px;
            width: 120px;
            text-align: center;
            color: var(--lightDark);
            font-weight: bold;
            cursor: pointer;

            &[active=true],
            &:hover {
                border-top: 6px solid var(--blue);
                color: var(--blue);
                background-color: var(--white);
            }
        }
    }
}
</style>