<template>
        <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue" :center="true" icon="&#xe679;"
            style="width:700px;">
            <template #custom>
                <header class="title" style="height:55px;">
                    <span class="iconfont">&#xe679;</span>
                    <span>好友分组管理器</span>
                </header>
                <div class="container" style="width:100%;height: 500px;overflow: auto;">
                    <div class="left_part">
                        <header>
                            <button @click="showCreateFriendGroupDialog = true" class="custom_button success"
                                style="padding:0 4px;">
                                <span class="iconfont" style="margin-right:4px;vertical-align: -2px;line-height:1;">&#xe654;</span>
                                <span>创建分组</span>
                            </button>
                        </header>
                        <CustomTip></CustomTip>
                        <a-radio-group v-model="chose_friend_group" class="friend_group_select_list"
                            style="width:230px;overflow-y:auto;overflow-x:hidden;">
                            <CustomTips v-if="user_friend_group?.length"
                                :value="'你目前创建了' + user_friend_group?.length + '个分组'" style="margin-top:0px" />
                            <CustomTips v-else :value="'你还没有创建好友分组'" style="margin-top:0px" />
                            <template v-for="item in user_friend_group" :key="item">
                                <a-radio :value="item">
                                    <template #radio="{ checked }">
                                        <a-space align="start" class="custom-radio-card"
                                            :class="{ 'custom-radio-card-checked': checked }">
                                            <div className="custom-radio-card-mask">
                                                <div className="custom-radio-card-mask-dot" />
                                            </div>
                                            <div>
                                                <div className="custom-radio-card-title">
                                                    {{ item.friend_group_name }}
                                                </div>
                                                <a-typography-text type="secondary">
                                                    共{{ item.list.length }}人
                                                </a-typography-text>
                                            </div>
                                        </a-space>
                                    </template>
                                </a-radio>
                            </template>
                        </a-radio-group>
                    </div>
                    <div class="right_part">
                        <div>
                            <header v-if="chose_friend_group">
                                <button @click="showFriendOption=true" class="custom_button success append ">
                                    <span class="iconfont">&#xe65d;</span>
                                    <span>加入分组</span>
                                </button>
                                <span>好友列表</span>
                            </header>
                            <ul class="friend_group_members">
                                <li v-for="friend in choseFriendGroupInnerList" @click="toggleFriendSelection(friend)" :class="{member:true,active:isSelectedFriend(friend)}">
                                    <CustomAvatar :src="friend.friend_info.avatar" :no-border="true" :circle="true"
                                        size="40px" background-color="var(--white)" CustomAvatar />
                                    <span>{{ friend.remark || friend.friend_info.username }}<span v-if="friend.remark" style="vertical-align:0px;">({{ friend.friend_info.username }})</span></span>
                                    <button v-if="!groupRemove" @click="removeCallback(friend)"
                                        class="min_button last_text">&#xe656;</button>
                                </li>
                            </ul>
                        </div>
                        <footer v-if="chose_friend_group" class="friend_group_ctrl">
                            <div>
                                <button @click="toggleGroupRemoveState" class="min_button remove" :removeGroup="groupRemove" >{{ groupRemove ? '&#xe867;' : '&#xe656;' }}</button>
                            </div>
                                <button @click="removeFriendGroupByMultCallback" class="custom_button normal rightRemove" :show="groupRemove">
                                    <span class="iconfont">&#xe658;</span>
                                    <span>移出群组</span>
                                </button>
                            <div>
                                <button @click="renameCallback" class="min_button edit">&#xe615;</button>
                                <button @click="deleteCallback" class="min_button del">&#xe652;</button>                                
                            </div>
                        </footer>
                    </div>

                </div>
            </template>
        </CustomConfirm>
        <!-- 创建分组 -->
        <CustomConfirm class="button_no_auto" v-model="showCreateFriendGroupDialog" :center="true" title="创建分组"
            icon="&#xe7e5;">
            <template #content>
                <CustomInput v-model="createFriendGroupForm.friend_group_name" max-length="12"
                    placeholder="请输入你要创建的分组名" />
                <CustomTips value="分组名长度必须在2~12之间" />
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="createFriendGroup" class="custom_button success" style="width: 100%">创建</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 修改分组名 -->
        <CustomConfirm class="button_no_auto" v-model="showRenameFriendGroupDialog" :center="true" title="修改分组名"
            icon="&#xe7e5;">
            <template #content>
                <CustomInput v-model="renameFriendGroupForm.friend_group_name" max-length="12"
                    placeholder="请输入你要修改的分组名" />
                <CustomTips value="分组名长度必须在2~12之间" />
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="renameFriendGroup" class="custom_button success" style="width: 100%">修改</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 删除分组 -->
        <CustomConfirm class="button_no_auto" v-model="showDeleteFriendGroupConfirm" title="确认删除分组"
            :content="deleteFriendGroupDesc" :ok="deleteFriendGroup"></CustomConfirm>
        <!-- 将用户移出分组 -->
        <CustomConfirm class="button_no_auto" v-model="showRemoveFriendGroupConfirm" title="移出分组"
            :content="`将<em>${removeFriendGroupForm.name}</em>移出该分组吗？`" :ok="removeFriendGroup"></CustomConfirm>
        <!-- 将多个用户移出分组 -->
        <CustomConfirm class="button_no_auto" v-model="showRemoveFriendGroupByMultConfirm" title="移出分组"
            :content="`将这<em>${select_friend_list.length}</em>名好友移出该分组吗？`" :ok="removeFriendGroupByMult"></CustomConfirm>
        <!-- 好友选择器 -->
        <FriendOption v-model="showFriendOption" :friend_list="choseFriendGroupOuterList" :ok="appendFriendGroup"></FriendOption>
</template>

<script setup>
import { onMounted, ref, computed, toRaw } from 'vue';
import CustomConfirm from './CustomConfirm.vue'
import CustomAvatar from './CustomAvatar.vue';
import CustomInput from './CustomInput.vue';
import CustomTips from './CustomTips.vue';
import FriendOption from './FriendOption.vue';
import useFriendStore from '@/stores/friend';
import customMessage from '@/utils/customMessage';
import { watch } from 'vue';
const friendStore = useFriendStore();
const { modelValue } = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue']);
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};
// 多选移出分组的好友列表
const select_friend_list = ref([]);
// 判断是否被选中
const isSelectedFriend = (friend) => {
    if(!groupRemove.value) return;
    return select_friend_list.value.includes(friend);
};
// 多选好友的方法
const toggleFriendSelection = (friend) => {
    if(!groupRemove.value) return;
    const index = select_friend_list.value.indexOf(friend);
    if (index > -1) {
        select_friend_list.value.splice(index, 1);
    } else {
        select_friend_list.value.push(friend);
    }
};
const showCreateFriendGroupDialog = ref(false);
const showRenameFriendGroupDialog = ref(false);
const showDeleteFriendGroupConfirm = ref(false);
const showRemoveFriendGroupConfirm = ref(false);
const showRemoveFriendGroupByMultConfirm = ref(false);
const showFriendOption = ref(false);
const groupRemove = ref(false);
const user_friend_group = ref(null);
const chose_friend_group = ref(null);
// 每次选择分组发生改变时，重置移出分组选择的好友列表
watch(() => chose_friend_group.value,() => {
    select_friend_list.value = [];
    groupRemove.value = false;
})
const createFriendGroupForm = ref({
    friend_group_name: '',
});
const renameFriendGroupForm = ref({
    friend_group_id: '',
    friend_group_name: '',
});
const removeFriendGroupForm = ref({
    name:'',
    friend_relation_id:'',
    friend_group_id:'',
})
const deleteFriendGroupForm = ref({
    friend_group_id: '',
    friend_group_name: '',
})
const toggleGroupRemoveState = () => {
    groupRemove.value = !groupRemove.value;
}
const removeFriendGroupByMultCallback = () => {
    if(select_friend_list.value.length) showRemoveFriendGroupByMultConfirm.value = true;
}
const renameCallback = () => {
    renameFriendGroupForm.value = {
        ...toRaw(chose_friend_group.value)
    }
    showRenameFriendGroupDialog.value = true;
}
const removeCallback = (friend) => {
    removeFriendGroupForm.value = {
        name:friend.remark || friend.friend_info.username,
        friend_group_id:chose_friend_group.value.friend_group_id,
        friend_relation_id:friend.friend_relation_id
    }
    showRemoveFriendGroupConfirm.value = true;
}
const deleteCallback = () => {
    deleteFriendGroupForm.value = {
        ...toRaw(chose_friend_group.value)
    }
    showDeleteFriendGroupConfirm.value = true;
}
// 获取删除分组描述
const deleteFriendGroupDesc = computed(() => {
    // const chose_friend_group = choseFriendGroupInnerList.value;
    if (!chose_friend_group.value) return null;
    if (chose_friend_group.value.list.length) {
        return `你确定要删除<em>${chose_friend_group.value.friend_group_name}</em>分组吗？分组内的<em>${chose_friend_group.value.list.length}名</em>好友将会被移除该分组，且操作不可逆`;
    } else {
        return '你确定要删除分组吗？此操作不可逆';
    }
})
// 创建分组
const createFriendGroup = () => {
    const friend_group_name = createFriendGroupForm.value.friend_group_name;
    if (friend_group_name.length < 2 || friend_group_name.length > 12) return customMessage({ type: 'error', value: '好友分组名必须在2~12字以内' });
    friendStore.friendGroupCreate(friend_group_name)
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(() => {
            reload();
            showCreateFriendGroupDialog.value = false;
            createFriendGroupForm.value.friend_group_name = '';
        })
}
// 重命名分组
const renameFriendGroup = () => {
    const friend_group_name = renameFriendGroupForm.value.friend_group_name;
    if (friend_group_name.length < 2 || friend_group_name > 8) return customMessage({ type: 'error', value: '好友分组名必须在2~8字以内' });
    friendStore.friendGroupRename({ friend_group_name,friend_group_id:renameFriendGroupForm.value.friend_group_id })
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(() => {
            reload();
            showRenameFriendGroupDialog.value = false;
        })
}
// 删除分组
const deleteFriendGroup = () => {
    friendStore.friendGroupDelete(deleteFriendGroupForm.value.friend_group_id)
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(() => {
            reload();
            showRenameFriendGroupDialog.value = false;
        })
}
// 移出分组
const removeFriendGroup = () => {
    friendStore.friendGroupRemove([toRaw(removeFriendGroupForm.value)])
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(() => {
            reload();
            showRenameFriendGroupDialog.value = false;
        })
}
// 将多人移出分组
const removeFriendGroupByMult = () => {
    const friend_list = toRaw(select_friend_list.value).map(friend => {
        return { friend_relation_id:friend.friend_relation_id,friend_group_id:chose_friend_group.value.friend_group_id };
    })
    friendStore.friendGroupRemove(friend_list)
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(() => {
            reload();
            showRenameFriendGroupDialog.value = false;
        })
}
// 加入分组
const appendFriendGroup = (select_friend_list) => {
    const friend_list = select_friend_list.map(friend => {
        return { friend_relation_id:friend.friend_relation_id,friend_group_id:chose_friend_group.value.friend_group_id }
    })
    friendStore.friendGroupAppend(friend_list)
    .then(msg => customMessage({type:'normal',value:msg}))
    .catch(data => customMessage({type:'error',value:data.msg}))
    .finally(() => reload());
}
// 获取选中分组下的好友列表
const choseFriendGroupInnerList = computed(() => {
    if (!chose_friend_group.value) {
        return [];
    } else if (chose_friend_group.value == 'no_group') {
        return friendStore.friend_list;
    } else {
        const maps = chose_friend_group.value.list.map(item => item.friend_relation_id);
        return friendStore.friend_list.filter(friend => maps.includes(friend.friend_relation_id))
    }

})
// 获取不在选中分组下的好友列表
const choseFriendGroupOuterList = computed(() => {
    if (!chose_friend_group.value) {
        return [];
    } else {
        const maps = chose_friend_group.value.list.map(item => item.friend_relation_id)
        return friendStore.friend_list.filter(friend => !maps.includes(friend.friend_relation_id))
    }
})
const reload = () => {
    friendStore.friendGroupList().then(friend_group => user_friend_group.value = friend_group);
    friendStore.getFriendList();
    chose_friend_group.value = null;
}
onMounted(() => {
    reload();
});
</script>

<style lang="scss" scoped>
.container {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    background-image: url(/src/assets/images/manager.avif);
    background-size: cover;
    background-blend-mode: multiply;
}

.right_part {
    color: var(--dark);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    padding-left: 10px;

    header {
        border-bottom: 1px solid var(--light);
        line-height: 34px;
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        padding-bottom: 7px;
        margin-bottom: 4px;
        padding-right: 10px;

        .append {
            width: auto;
            margin: 0;
            padding: 0 4px;
            padding-right: 10px;
            line-height: 1;
            font-size: .9rem;
        }
    }

    .last_text{
        background-color: transparent;
    }
    .member {
        display: flex;
        margin: 4px;
        padding: 10px;
        background-color: var(--white);
        border-radius: 6px;
        color: var(--dark);
        font-weight: bold;
        font-size: .9rem;
        align-items: center;
        width: 200px;
        // justify-content: space-between;
        box-shadow: 2px 4px 0px 0px var(--mostLight);

        cursor: pointer;
        transition: all .1s;
        border:1px double var(--light);
        >span{
            flex-grow: 1;
            text-align:center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin: 0 4px;
        }
        &:hover,&.active {
            border:1px double var(--blue);
        }
        &.active {
            box-shadow: 2px 4px 0px 0px var(--blue);
        }
    }

    .friend_group_members {
        display: flex;
        max-height: 380px;
        align-items: start;
        overflow-y: auto;
        flex-wrap: wrap;

        >* {
            flex-shrink: 0;
        }
    }

    .min_button {
        box-shadow: 1px 2px 4px 0px var(--lightDark);
    }

    .friend_group_ctrl {
        display: flex;
        justify-content: space-between;

        button {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            padding: 0;
            margin: 0 4px;
            box-shadow: 1px 2px 4px 0px var(--lightDark);
        }

        .del {
            background-color: var(--red);
            color: var(--white);
        }

        .edit {
            background-color: var(--white);
        }
        .remove{
            background-color: var(--white);
            &[removeGroup=true]{
                background-color: var(--blue);
                color:var(--white);
            }
        }
        .rightRemove{
            margin:0;
            overflow: hidden;
            width:0px;
            flex-grow: 0;
            background-color: var(--white);
            color: var(--dark);
            transition: .3s;
            &[show="true"]{
                flex-grow: 1;
            }
        }
    }
}

.left_part {
    border-right: 1px solid var(--light);

    header {
        margin-bottom: 6px;
        padding-right: 10px;
    }
}

.friend_group {
    display: flex;
}

.friend_group_select_list {
    max-height: 420px;

    label {
        padding-left: 0;
    }
}

.custom-radio-card {
    padding: 10px 14px;
    border: 1px solid var(--light);
    width: 220px;
    box-sizing: border-box;
    align-items: center;
    margin-bottom: 3px;
    background-color: var(--white);
    box-shadow: 2px 4px 0px 0px var(--mostLight);
    margin-top: 6px;
    border-radius: 6px;
    transition: all .3s;
}

.custom-radio-card-mask {
    height: 16px;
    width: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid var(--light);
    box-sizing: border-box;
    margin-right: 4px;
}

.custom-radio-card-mask-dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
}

.custom-radio-card-title {
    color: var(--dark);
    font-size: 14px;
    font-weight: bold;
}
.custom-radio-card:hover {
    border-color: var(--blue);
}

.custom-radio-card:hover .custom-radio-card-title {
    color: var(--blue);
}

.custom-radio-card:hover .custom-radio-card-mask {
    border-color: var(--blue);
}

.custom-radio-card-checked {
    background-color: var(--blue);
}

.custom-radio-card-checked .custom-radio-card-title,
.custom-radio-card-checked .arco-typography {
    color: var(--white) !important;
}

.custom-radio-card-checked .custom-radio-card-mask {
    border-color: var(--white) !important;
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
    background-color: var(--white);
}

.custom-radio-card.friend_group_manager,
.custom-radio-card.friend_group_manager .custom-radio-card-title {
    background-color: var(--blue);
    color: var(--white);
    cursor: pointer;
}

.friend_group_manager {
    box-shadow: inset 0 0 8px 0px var(--darkBlue);
}
</style>