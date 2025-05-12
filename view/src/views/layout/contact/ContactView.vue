<template>
    <div class="contact_view">
        <div class="contact_left">
            <div class="contact_left_header">
                <a-input-search class="contact_search" placeholder="搜索列表" />
                <a-popover trigger="click">
                    <a-button class="circle_btn" type="primary" size="small" shape="circle">
                        <template #icon>
                            <span class="iconfont">&#xe610;</span>
                        </template>
                    </a-button>
                    <template #content>
                        <div class="popover_container blue">
                            <ul class="more_list">
                                <li class="more_item">
                                    <a-button @click="showFindFriend = true" type="primary" long>
                                        <template #icon>
                                            <span class="iconfont span">&#xe661;</span>
                                        </template>
                                        <span class="span">发现好友</span>
                                    </a-button>
                                    <a-button @click="showAddDialog = true" type="primary" long>
                                        <template #icon>
                                            <span class="iconfont span">&#xe65e;</span>
                                        </template>
                                        <span class="span">用户/群聊</span>
                                    </a-button>
                                    <a-button @click="showCreateGroupDialog = true" type="primary" long>
                                        <template #icon>
                                            <span class="iconfont span">&#xe657;</span>
                                        </template>
                                        <span class="span">创建群聊</span>
                                    </a-button>
                                </li>
                            </ul>
                        </div>
                    </template>
                </a-popover>
            </div>
            <div class="contact_left_content">
                <ContactTab></ContactTab>
            </div>
            <footer class="contact_left_footer">
                <FooterOption></FooterOption>
            </footer>
        </div>
        <div class="contact_right">
            <router-view></router-view>
        </div>
    </div>
    <!-- 搜索好友/群聊 -->
    <CustomConfirm v-model="showAddDialog" style="width:600px;">
        <template #custom>
            <header class="title" style="height:60px;">
                <span class="iconfont">&#xe65e;</span>
                <span>混合查询</span>
            </header>
            <div class="container chat_add" style="min-height:500px;width:100%;">
                <el-input v-model="keywords" placeholder="输入名称/ID进行查询" @keyup="searchCallback" />
            <el-tabs class="search-tabs" v-model="searchTabType">
                <el-tab-pane label="全部" name="all">
                    <el-col v-for="item in mix_list">
                        <a-popover v-if="item.account" position="lb" trigger="click">
                            <div class="custom-card-item" >
                                <CustomAvatar size="2.8rem" background-color="var(--white)" :circle="true" :src="item.avatar" class="avatar"></CustomAvatar>
                                <dd class="custom-content">
                                    <a-tag class="tag" color="var(--blue)" style="right:6px;color:var(--white)">
                                        <span class="iconfont" style="color:var(--white);margin-right:4px;font-size:inherit">&#xe662;</span>
                                        <span>用户</span>
                                    </a-tag>
                                    <p class="username text-ellipsis">
                                        <span>{{ item.username }}</span>
                                        <el-tooltip
                                            class="box-item"
                                            effect="dark"
                                            content="这是该用户的账号id"
                                            placement="right"
                                        >
                                            <i class="user-id" style="position:relative;left:20px;">#{{ item.user_id }}</i>
                                        </el-tooltip>
                                    </p>
                                    <span class="usersign text-ellipsis">{{ item.introduce || '该用户没有签名' }}</span>
                                </dd>
                            </div>
                            <template #content>
                                <UserCard :user_id="item.user_id"></UserCard>
                            </template>
                        </a-popover>
                        <div @click="toGroupSpace(item.group_id)" class="custom-card-item" v-else>
                            <dt class="avatar-box">
                                <CustomAvatar size="2.8rem" background-color="var(--white)" :circle="true" :src="item.avatar" class="avatar"></CustomAvatar>
                            </dt>
                            <dd class="custom-content">
                                <a-tag class="tag" color="var(--red)" style="right:6px;color:var(--white)">
                                    <span class="iconfont" style="color:var(--white);margin-right:4px;font-size:inherit">&#xe6ea;</span>
                                    <span>群聊</span>
                                </a-tag>
                                <p class="username text-ellipsis">
                                    <span>{{ item.group_name }}</span>
                                    <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        content="这是该群聊的id"
                                        placement="right"
                                    >
                                        <i class="user-id" style="position:relative;left:20px;">#{{ item.group_id }}</i>
                                    </el-tooltip>
                                </p>
                                <span class="usersign text-ellipsis">{{ item.description || '该群聊没有简介' }}</span>
                            </dd>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="`这是该群聊人数。当前人数${item.member_total} 上限人数${item.member_max}`"
                                placement="right"
                            >
                                <div class="join" style="display: block;font-weight:500;margin-bottom:6px;color:var(--lightDark)">
                                    <span>{{ item.member_total }}/{{ item.member_max }}</span>
                                    <icon-user-add />
                                </div>
                            </el-tooltip>
                        </div>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="用户" name="user">
                    <el-col v-for="item in user_list">
                        <a-popover v-if="item.account" position="lb" trigger="click">
                            <div class="custom-card-item" >
                                <CustomAvatar size="2.8rem" background-color="var(--white)" :circle="true" :src="item.avatar" class="avatar"></CustomAvatar>
                                <dd class="custom-content">
                                    <a-tag class="tag" color="var(--blue)" style="right:6px;color:var(--white)">
                                        <span class="iconfont" style="color:var(--white);margin-right:4px;font-size:inherit">&#xe662;</span>
                                        <span>用户</span>
                                    </a-tag>
                                    <p class="username text-ellipsis">
                                        <span>{{ item.username }}</span>
                                        <el-tooltip
                                            class="box-item"
                                            effect="dark"
                                            content="这是该用户的账号id"
                                            placement="right"
                                        >
                                            <i class="user-id" style="position:relative;left:20px;">#{{ item.user_id }}</i>
                                        </el-tooltip>
                                    </p>
                                    <span class="usersign text-ellipsis">{{ item.introduce || '该用户没有签名' }}</span>
                                </dd>
                            </div>
                            <template #content>
                                <UserCard :user_id="item.user_id"></UserCard>
                            </template>
                        </a-popover>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="群聊" name="group">
                    <el-col v-for="item in group_list">
                        <div @click="toGroupSpace(item.group_id)" class="custom-card-item">
                            <dt class="avatar-box">
                                <CustomAvatar size="2.8rem" background-color="var(--white)" :circle="true" :src="item.avatar" class="avatar"></CustomAvatar>
                            </dt>
                            <dd class="custom-content">
                                <a-tag class="tag" color="var(--red)" style="right:6px;color:var(--white)">
                                    <span class="iconfont" style="color:var(--white);margin-right:4px;font-size:inherit">&#xe6ea;</span>
                                    <span>群聊</span>
                                </a-tag>
                                <p class="username text-ellipsis">
                                    <span>{{ item.group_name }}</span>
                                    <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        content="这是该群聊的id"
                                        placement="right"
                                    >
                                        <i class="user-id" style="position:relative;left:20px;">#{{ item.group_id }}</i>
                                    </el-tooltip>
                                </p>
                                <span class="usersign text-ellipsis">{{ item.description || '该群聊没有简介' }}</span>
                            </dd>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="`这是该群聊人数。当前人数${item.member_total} 上限人数${item.member_max}`"
                                placement="right"
                            >
                                <div class="join" style="display: block;font-weight:500;margin-bottom:6px;color:var(--lightDark)">
                                    <span>{{ item.member_total }}/{{ item.member_max }}</span>
                                    <icon-user-add />
                                </div>
                            </el-tooltip>
                        </div>
                    </el-col>
                </el-tab-pane>
            </el-tabs>

            </div>
        </template>
    </CustomConfirm>
    <!-- 创建群聊 -->
    <CustomConfirm class="chat_create groupDialog" v-model="showCreateGroupDialog" style="width:600px;">
        <template #custom>
            <header class="title" style="height:60px;">
                <span class="iconfont">&#xe64f;</span>
                <span>创建群聊</span>
            </header>
            <div class="create container" style="display:flex;height:500px;width:100%;">
                <div class="part ctrl-panel">
                    <el-input v-model="createGroupSearchUser" size="small" placeholder="根据用户名筛选用户" style="height:30px;" />
                    <template v-if="createGroupSearchUser">
                        <CustomTips :value="'筛选出' + searchGroupUserList.length + '个用户'"></CustomTips>
                        <div class="friend-card" v-for="friend in searchGroupUserList">
                            <label>
                                <div class="card-content" style="display:flex;margin-bottom:12px;color:var(--contrastiveColor);align-items:center;font-size:1rem;">
                                    <label class="checkbox-label">
                                        <a-checkbox  v-model="choseFriend" :value="friend"></a-checkbox>
                                        <span class="checkbox-custom"></span>
                                    </label>
                                    <dt class="avatar-box" style="margin-left:4px;">
                                        <CustomAvatar background-color="var(--blue)"  class="avatar" :src="friend.friend_info.avatar" size="2.8rem"></CustomAvatar>
                                    </dt>
                                    <dd class="custom-content" style="margin-left:6px;">
                                        <span class="username text-ellipsis">{{ friend.remark || friend.friend_info.username }}</span>
                                    </dd>
                                </div>
                            </label>
                        </div>
                    </template>
                    <el-collapse v-else v-model="activeNames">
                        <el-collapse-item :title="'我的好友' + `(${friendStore.friend_list.length}人)`" name="1">
                            <div class="friend-card" v-for="friend in friendStore.friend_list">
                                <label>
                                    <div class="card-content" style="display:flex;margin-bottom:12px;color:var(--contrastiveColor);align-items:center;font-size:1rem;">
                                        <label class="checkbox-label">
                                            <a-checkbox  v-model="choseFriend" :value="friend"></a-checkbox>
                                            <span class="checkbox-custom"></span>
                                        </label>
                                        <dt class="avatar-box" style="margin-left:4px;">
                                            <CustomAvatar background-color="var(--blue)"  class="avatar" :src="friend.friend_info.avatar" size="2.8rem"></CustomAvatar>
                                        </dt>
                                        <dd class="custom-content" style="margin-left:6px;">
                                            <span class="username text-ellipsis">{{ friend.remark || friend.friend_info.username }}</span>
                                        </dd>
                                    </div>
                                </label>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item :title="item.friend_group_name + `(${item.list.length}人)`" v-for="item in friendStore.friend_group" :key="item">
                            <div class="friend-card" v-for="friend in getFilterGroupFriend(item.list)">
                                <label>
                                    <div class="card-content" style="display:flex;margin-bottom:12px;color:var(--contrastiveColor);align-items:center;font-size:1rem;">
                                        <label class="checkbox-label">
                                            <a-checkbox  v-model="choseFriend" :value="friend"></a-checkbox>
                                            <span class="checkbox-custom"></span>
                                        </label>
                                        <dt class="avatar-box" style="margin-left:4px;">
                                            <CustomAvatar background-color="var(--blue)"  class="avatar" :src="friend.friend_info.avatar" size="2.8rem"></CustomAvatar>
                                        </dt>
                                        <dd class="custom-content" style="margin-left:6px;">
                                            <span class="username text-ellipsis">{{ friend.remark || friend.friend_info.username }}</span>
                                        </dd>
                                    </div>
                                </label>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <el-divider direction="vertical" />
                <div class="part show-panel">
                    <div class="friend-card" v-for="friend in choseFriend" style="padding:0 10px;">
                        <label>
                            <div class="card-content" style="display:flex;margin-bottom:12px;color:var(--contrastiveColor);align-items:center;font-size:1rem;">
                                <dt class="avatar-box" style="margin-left:4px;">
                                    <CustomAvatar background-color="var(--blue)" :src="friend.friend_info.avatar" size="2.8rem" class="avatar"></CustomAvatar>
                                </dt>
                                <dd class="custom-content" style="margin-left:6px;">
                                    <span class="username text-ellipsis">{{ friend.remark || friend.friend_info.username }}</span>
                                </dd>
                                <el-icon @click="removeChose(friend)" style="flex-grow: 1;display: flex;justify-content: end;color:#7f94a8;">
                                    <icon-close />
                                </el-icon>
                            </div>
                        </label>
                    </div>
                    <el-row class="show-panel-btns">
                        <a-button class="create_group_btn" type="outline" style="color:var(--blue);border-color:var(--blue)" @click="createGroupCallback">确认</a-button>
                        <a-button class="create_group_btn" @click="showCreateGroupDialog = false" type="outline" style="margin-left:4px;color:var(--blue);border-color:var(--blue)">取消</a-button>
                    </el-row>
                </div>
            </div>
        </template>
    </CustomConfirm>
    <!-- 发现好友 -->
    <FindFriend v-model="showFindFriend"></FindFriend>
</template>

<script setup>
import { ref,reactive,computed,toRaw } from 'vue';
import ContactTab from './ContactTab.vue'
import FindFriend from '@/components/FindFriend.vue';
import useUserStore from '@/stores/user';
import useFriendStore from '@/stores/friend';
import useGroupStore from '@/stores/group';
import useAppStore from '@/stores/app';
import CustomAvatar from '@/components/CustomAvatar.vue';
import UserCard from '@/components/UserCard.vue';
import CustomConfirm from '@/components/CustomConfirm.vue';
import CustomTips from '@/components/CustomTips.vue';
import customMessage from '@/utils/customMessage';
import FooterOption from '@/components/FooterOption.vue'
const userStore = useUserStore();
const groupStore = useGroupStore();
const friendStore = useFriendStore();
const appStore = useAppStore();
const showFindFriend = ref(false);
const showAddDialog = ref(false);
const showCreateGroupDialog = ref(false);
const showPop = ref(false);
const showDetailDialog = ref(false);
const createGroupSearchUser = ref('');
const choseFriend = ref([]);
const mix_list = reactive([]);
const group_list = reactive([]);
const user_list = reactive([]);
const keywords = ref('');
const searchTabType = ref('all');
const activeNames = ref(['1']);
const form = reactive({
    group_name:'',
    avatar:'',
    description:'',
    background:'',
    tags:[],
    auth:'confirm',
    auth_query:'',
})
// 创建群聊回调
function createGroupCallback(){
    showPop.value = false;
    showCreateGroupDialog.value = showDetailDialog.value = false;
    const t_form = toRaw(form);
    t_form.members = choseFriend.value;
    groupStore.groupCreate(t_form)
    .then(async (data) => {
      customMessage({type:'normal',msg:msg});
      await groupStore.getGroupList();
      router.replace('/layout/concat/group/space?type=member&group_id=' + data.group_id);
    })
    .catch(data => ElMessage.error(data.msg))
}
// 获取群聊选择中查询过滤后的用户
const searchGroupUserList = computed(() => {
    if(!createGroupSearchUser.value) return []
    return friendStore.friend_list.filter(item => {
        return item.friend_info.username.includes(createGroupSearchUser.value);
    });
})
// 筛选指定分组下的好友
const getFilterGroupFriend = (list) => {
    return friendStore.friend_list.filter(item => {
        return list.some(group_item => group_item.friend_relation_id == item.friend_relation_id)
    });
}
// 前往群聊空间
const toGroupSpace = (group_id) => {
    showAddDialog.value = false;
    location.assign('/#/layout/contact/group/space?group_id=' + group_id);
}
// 搜索回调
const searchCallback = async () => {
    console.log(1);
    if(keywords.value.trim() == '') return;
    let temp_user_list,temp_group_list;
    switch(searchTabType.value){
        case 'all':
            temp_user_list = await userStore.searchUser({ keywords:keywords.value });
            temp_group_list = await groupStore.searchGroup({ keywords:keywords.value });
            user_list.splice(0,user_list.length,...temp_user_list);
            group_list.splice(0,group_list.length,...temp_group_list);
            mix_list.splice(0,mix_list.length,...temp_user_list,...temp_group_list);
            break;
        case 'user':
            temp_user_list = await userStore.searchUser({ keywords:keywords.value });
            user_list.splice(0,user_list.length,...temp_user_list);
            break;
        case 'group':
            temp_group_list = await groupStore.searchGroup({ keywords:keywords.value });
            group_list.splice(0,group_list.length,...temp_group_list);
            break;
    }
}
</script>

<style lang="scss" scoped>
.contact_view{
    height:100vh;
    overflow:hidden;
    display:flex;
}
.contact_left {
    height:100vh;
    max-width: 320px;
    min-width: 260px;
    width: 20%;
    display: flex;
    flex-direction: column;
    background-color: var(--white);
    border-top-left-radius: 0px;
    // box-shadow: -4px 0px 20px var(--blue);
    z-index: 3;
    // box-shadow:-3px -1px 9px var(--blue);
    .contact_left_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        padding-right: 6px;
        padding-top: 20px;

        .contact_search {
            color: var(--dark);
            width: 85%;
            border-radius: 4px;
            box-shadow: 0 0 4px 0px var(--light);

            &.arco-input-focus {
                border-color: var(--blue) !important;
                box-shadow: 0 0 4px 0px var(--light) !important;
            }
        }

        .contact_search:deep(.arco-icon-hover):hover {
            &::before {
                background-color: var(--subColor);
            }

            svg {
                color: var(--contrastiveColor);
            }
        }
    }
    .contact_left_content{
        flex-grow: 1;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0px; /* 设置滚动条的宽度 */
        }
    }
    .contact_left_footer{
        height:40px;
        background-color: var(--blue);
        box-shadow:0px -3px 13px var(--blue);
        flex-shrink: 0;
        z-index: 1;
    }
}
.contact_right{
    height:100vh;
    overflow:hidden;
    flex-grow: 1;
    background-color: var(--white);
}
.chat_add{
    width:100px;
    .avatar_box{
        flex-shrink: 0;
        margin-right: 4px;
    }
    .text-ellipsis{
        max-width: 450px;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space:nowrap;
    }
    .card-content{
        color:var(--white);
    }
    .tag{
        font-size: 0.8rem;
        position: absolute;
        right: 32px;
        background-color: transparent;
        border: 1px solid;
        &:deep(.arco-tag-icon){
            font-size: .9rem;
        }
    }
    .join{
        position: absolute;
        font-size: 0.8rem;
        bottom:0px;
        right:4px;
    }
    .search-tabs:deep(.el-tabs__nav-wrap){
        &::after{
            display: none
        }
        .el-tabs__active-bar{
            height: 100%;
            width: 100%;
            z-index: -1;
        }
        .el-tabs__item{
            position:relative;
            z-index: 1;
        }

        $paddingY:3px;
        $paddingX:12px;
        overflow: hidden;
        border-radius: 4px;
        background-color: transparent;
        height: 36px;
        display: flex;
        align-items: center;
        >*{
            flex-grow: 1;
        }
        .el-tabs__nav-wrap::after{
            background-color: transparent;
        }
        .el-tabs__active-bar{
            top: $paddingY;
            bottom: $paddingY;
            height: auto;
            border-radius: 4px;
        }
        .el-tabs__nav{
            width: 100%;
            .el-tabs__item{
                flex-grow: 1;
                height: 34px;
                padding: 0;
                z-index: 999;
            }
        }
    }
    .user-id{
        font-size:1rem;
        font-style:normal;
        position:absolute;
        right:4px;
    }
    .custom-card-item{
        display:flex;
        font-size:1.1rem;
        padding: 5px;
        margin-bottom: 5px;
        border-radius: 4px;
        transition: all .2s;
        &:hover{
            background-color: var(--blue);
            *{
                color:var(--white);
            }
        }
        .custom-content{
            margin-left:6px;
            display:flex;
            flex-direction: column;
        }
    }
    
    .usersign{
        font-size:.9rem;
        color:var(--lightDark);
    }
}
.create{
    *{
        flex-shrink:0;
    }
    .el-divider{
        height: 100%;
    }
    .ctrl-panel{
        width:320px;
        overflow:auto;
    }
    .show-panel{
        flex-grow:1;
    }
    .show-panel-btns{
        position:absolute;
        bottom:10px;
        right:20px;
    }
}
</style>