<template>
    <div class="contact_tab">
        <div class="contact_select_box">
            <div class="contact_select_item" :active="contact_chose_type == '好友'" @click="contact_chose_type = '好友'">好友
            </div>
            <div class="contact_select_item" :active="contact_chose_type == '群聊'" @click="contact_chose_type = '群聊'">群聊
            </div>
            <!-- 选择指针 -->
            <div class="contact_select_arrow"
                :style="{ transform: `translateX(${contact_arrow_left_offset[contact_chose_type]})` }"></div>
        </div>
        <div class="concat_content" style="flex-grow:1;">
            <div style="height:100%;">
                <!-- 好友列表 -->
                <a-spin :loading="friend_loading" style="width:100%;min-height:100%;" name="1" class="concat_list"
                    v-show="contact_chose_type == '好友'">
                    <a-menu :open-keys="friend_group_opened">
                        <a-sub-menu key="我的好友">
                            <template #icon><span class="iconfont" style="margin-left:2px;">&#xe60c;</span></template>
                            <template #title>
                                <div @click="toggleFriendGroupOpen('我的好友')" class="friend_group_name">
                                    <span>我的好友</span>
                                    <span style="margin-right: 3px;font-weight: bold;">{{ friendStore.friend_list.length
                                        }}</span>
                                </div>
                            </template>
                            <transition-group appear name="animate__animated animate_bounce"
                                enter-active-class="animate__fadeIn" leave-active-class="opacityDown">
                                <dl v-if="friend_group_opened.includes('我的好友')" @click="openFriendSpace(friend.friend_id)" :style="`animation-delay:${i * 80}ms `"
                                    v-for="(friend, i) in friendStore.friend_list"
                                    :class="{ 'contact_item': true, 'active': friendStore.open_friend_space == friend.friend_info.user_id }"
                                    :key="friend.friend_group_id" class="friend_item">
                                    <dt>
                                        <CustomAvatar :src="friend.friend_info.avatar" background-color="white"
                                            circle="true" size="50px" />
                                    </dt>
                                    <dd class="friend_item_content">
                                        <div class="friend_item_content_text">
                                            <p class="friend_name">{{ friend.remark || friend.friend_info.username
                                                }}<span v-if="friend.remark">({{
                friend.friend_info.username }})</span></p>
                                            <hr class="custom_hr">
                                            <p class="friend_introduce">{{ friend.friend_info.introduce || '该用户无介绍' }}
                                            </p>
                                        </div>
                                    </dd>
                                </dl>
                            </transition-group>
                        </a-sub-menu>
                        <a-sub-menu v-for="friend_group_item in friendStore.friend_group"
                            :key="friend_group_item.friend_group_id">
                            <template #icon><span class="iconfont" style="margin-left:2px;">&#xe60c;</span></template>
                            <template #title>
                                <div @click="toggleFriendGroupOpen(friend_group_item.friend_group_id)"
                                    class="friend_group_name">
                                    <span>{{ friend_group_item.friend_group_name }}</span>
                                    <span style="margin-right: 3px;font-weight: bold;">{{ friend_group_item.list.length
                                        }}</span>
                                </div>
                            </template>
                            <transition-group appear name="animate__animated animate_bounce"
                                enter-active-class="animate__fadeIn" leave-active-class="opacityDown">
                                <dl v-if="friend_group_opened.includes(friend_group_item.friend_group_id)" @click="openFriendSpace(friend.friend_id)"
                                    :style="`animation-delay:${i * 80}ms `" v-for="(friend, i) in friendStore.friend_list.filter((friend => {
                const friends_id = friend_group_item.list.map(item => item.friend_relation_id);
                return friends_id.includes(friend.friend_relation_id)
            }))" :class="{ 'contact_item': true, 'active': friendStore.open_friend_space == friend.friend_info.user_id }"
                                    :key="friend.friend_group_id" class="friend_item">
                                    <dt>
                                        <CustomAvatar :src="friend.friend_info.avatar" background-color="white"
                                            circle="true" size="50px" />
                                    </dt>
                                    <dd class="friend_item_content">
                                        <div class="friend_item_content_text">
                                            <p class="friend_name">{{ friend.remark || friend.friend_info.username
                                                }}<span v-if="friend.remark">({{ friend.friend_info.username }})</span>
                                            </p>
                                            <hr class="custom_hr">
                                            <p class="friend_introduce">{{ friend.friend_info.introduce || '该用户无介绍' }}
                                            </p>
                                        </div>
                                    </dd>
                                </dl>
                            </transition-group>
                        </a-sub-menu>
                    </a-menu>
                </a-spin>
                <!-- 群聊列表 -->
                <a-spin :loading="group_loading" style="width:100%;min-height:100%;" name="1" class="concat_list"
                    v-show="contact_chose_type == '群聊'">
                    <a-menu :open-keys="group_group_opened">
                        <a-sub-menu v-for="g_g_name in group_group_name" :key="g_g_name">
                            <template #icon><span class="iconfont" style="margin-left:2px;">&#xe60c;</span></template>
                            <template #title>
                                <div @click="toggleGroupGroupOpen(g_g_name)" class="friend_group_name">
                                    <span>{{ g_g_name }}</span>
                                    <span style="margin-right: 3px;font-weight: bold;">{{  group_group_list[g_g_name]?.length }}</span>
                                </div>
                            </template>
                            <transition-group appear name="animate__animated animate_bounce"
                                enter-active-class="animate__fadeIn" leave-active-class="opacityDown">
                                <dl v-if="group_group_opened.includes(g_g_name)" :style="`animation-delay:${i * 80}ms `" @click="openGroupSpace(group.group_id)"
                                    v-for="(group, i) in group_group_list[g_g_name]"
                                    :class="{ 'contact_item': true, 'active': groupStore.open_group_space == group.group_id }"
                                    :key="group.group_id" class="friend_item group_type">
                                    <dt>
                                        <CustomAvatar :src="group.group_info.avatar" background-color="white"
                                            circle="true" size="50px" />
                                    </dt>
                                    <dd class="friend_item_content">
                                        <div class="friend_item_content_text">
                                            <p class="friend_name">{{ group.group_info.group_name }}</p>
                                            <hr class="custom_hr">
                                            <p class="friend_introduce">{{ group.group_info.description || '该群聊无介绍' }}
                                            </p>
                                        </div>
                                    </dd>
                                    <span class="text_other">
                                        {{ group.group_info.member_total }}/{{ group.group_info.member_max }}
                                    </span>
                                </dl>
                            </transition-group>
                        </a-sub-menu>
                    </a-menu>
                </a-spin>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useGroupStore from '@/stores/group';
import useFriendStore from '@/stores/friend';
import useAppStore from '@/stores/app';
import useUserStore from '@/stores/user';
import CustomAvatar from '@/components/CustomAvatar.vue';
import { reactive,onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
const router = useRouter();
const groupStore = useGroupStore();
const friendStore = useFriendStore();
const appStore = useAppStore();
const userStore = useUserStore();
const friend_loading = ref(true);
const group_loading = ref(true);
const contact_chose_type = ref('好友');
const contact_arrow_left_offset = {
    '好友': '0%',
    '群聊': '100%',
}
const friend_group_opened = ref(['我的好友']);
const toggleFriendGroupOpen = (friend_group_id) => {
    if (friend_group_opened.value.includes(friend_group_id)) {
        const index = friend_group_opened.value.indexOf(friend_group_id);
        if (index > -1) {
            friend_group_opened.value.splice(index, 1);
        }
    } else {
        friend_group_opened.value.push(friend_group_id)
    }
}
const group_group_opened = ref(['我加入的群聊']);
const toggleGroupGroupOpen = (group_group_id) => {
    if (group_group_opened.value.includes(group_group_id)) {
        const index = group_group_opened.value.indexOf(group_group_id);
        if (index > -1) {
            group_group_opened.value.splice(index, 1);
        }
    } else {
        group_group_opened.value.push(group_group_id)
    }
}
const group_group_name = ['我创建的群聊', '我加入的群聊', '我管理的群聊'];
const group_group_list = computed(() => {
    const _group = {
        '我创建的群聊': null,
        '我加入的群聊': null,
        '我管理的群聊': null,
    }
    _group['我创建的群聊'] = groupStore.group_list?.filter(group => group.group_info.creator_id == group.user_id);
    _group['我管理的群聊'] = groupStore.group_list?.filter(group => ['群主', '管理员'].includes(group.position));
    _group['我加入的群聊'] = groupStore.group_list?.filter(group => group.position == '成员');
    return _group;
})
function openFriendSpace(user_id){
    location.assign(location.origin + '/#/layout/contact/user/space?type=friend&user_id=' + user_id);
}
function openGroupSpace(group_id){
    location.assign(location.origin + '/#/layout/contact/group/space?type=member&group_id=' + group_id);
}
new Promise(async (resolve) => {
    await friendStore.getFriendList();
    await friendStore.friendGroupList();
    resolve()
})
    .then(() => friend_loading.value = false);

groupStore.getGroupList().then(() => {
    group_loading.value = false;
});

onUnmounted(() => {
    friendStore.open_friend_space = null;
    groupStore.open_group_space = null;
})
</script>

<style lang="scss" scoped>
.contact_tab {
    --baseMargin: 7px;
    --baseHeight: 2.5rem;
    margin: 20px 12px;
    margin-left: 4px;
    font-size: .9rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.contact_select_box {
    border-radius: 18px;
    position: relative;
    display: flex;
    width: 100%;
    height: var(--baseHeight);
    line-height: calc(var(--baseHeight) / 1.5);
    // background-color: var(--formColor);
    text-align: center;
}

.contact_select_item {
    transition: .2s;
    flex-grow: 1;
    width: 50%;
    margin: var(--baseMargin);
    z-index: 1;
    color: var(--dark);
    width: 40%;
    cursor: pointer;

    &[active=true] {
        color: var(--white);
    }
}

.contact_select_arrow {
    border-radius: 12px;
    margin: var(--baseMargin);
    width: calc(50% - var(--baseMargin));
    height: calc(100% - (var(--baseMargin) * 2));
    position: absolute;
    background-color: var(--blue);
    z-index: 0;
    transition: all .3s;
}

.concat_content {
    margin: 6px;
    margin-top: 20px;
}

.friend_group_name {
    display: flex;
    justify-content: space-between;
}

.contact_item {
    cursor: pointer;
    color: var(--dark);
    $padding: 10px;
    border: 1px solid var(--blue);
    box-shadow: 4px 5px 1px 0px var(--blue);
    margin: $padding 0;
    display: flex;
    position: relative;
    margin-top: 16px;

    &:not(.group_type) {

        .friend_introduce,
        .friend_name {
            width: 100%;
        }
    }

    &:hover,
    &.active {
        transition: all .3s;
        background-color: var(--blue);
        box-shadow: 4px 5px 1px 0px var(--highBlue);

        .custom_hr {
            box-shadow: inset 0 0 1px var(--white);
        }

        .friend_introduce,
        .friend_name,
        .text_other {
            color: var(--white);
        }
    }

    dd {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: .6rem;

        *:first-child {
            font-size: .95rem;
        }
    }

    .text_other {
        color: var(--blue);
        font-size: .75rem;
        // filter: brightness(.8);
        position: absolute;
        right: $padding * 2;
        top: 10px;
    }
}

.opacityDown {
    transition: .2s;
    opacity: 0;
}
</style>