<template>
    <!-- 好友选择器   该组件允许父组件传递一个(筛选后的)好友列表，用户会在该好友列表中选择一些好友，点击确认按钮后会触发ok回调函数，该函数的第一个参数为用户选择的好友列表 -->
    <div v-if="modelValue">
            <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue" style="width:600px;">
                <template #custom>
                    <header class="title" style="height:50px;">
                        <span class="iconfont">&#xe679;</span>
                        <span>好友选择</span>
                    </header>
                    <div ref="friend_option" class="friend_option">
                        <div class="left_part">
                            <!-- A-Z书签 -->
                            <div class="alphabet">
                                <button v-for="letter in alphabet" :key="letter" @click="scrollToLetter(letter)"
                                    :class="{ active: activeLetter.includes(letter) }" v-show="hasFriendsForLetter(letter)">
                                    {{ letter }}
                                </button>
                            </div>
                            <ul class="friend_list">
                                <CustomTips :value="`你有${filter_list?.length}位好友可选择`"></CustomTips>
                                <CustomInput v-model="filterKeywords" placeholder="通过好友名筛选" />
                                <div v-for="group in groupedFriendsWithFriends" :key="group.letter"
                                    :id="'group-' + group.letter" :ref="setGroupRef" :data-first-letter="group.letter">
                                    <h2 class="letter_group">{{ group.letter }}</h2>
                                    <dl v-for="friend in group.friends"  :class="{ selected: isSelectedFriend(friend) }" :key="friend.friend_info.user_id" class="friend_item"
                                        @click.stop="toggleFriendSelection(friend)">
                                        <dt>
                                            <CustomAvatar :src="friend.friend_info.avatar" background-color="white" circle="true" size="50px" />
                                        </dt>
                                        <dd class="friend_item_content"
                                            >
                                            <div class="friend_item_content_text">
                                                <p class="friend_name">{{ friend.remark || friend.friend_info.username }}<span v-if="friend.remark">({{ friend.friend_info.username }})</span></p>
                                                <hr class="custom_hr">
                                                <p class="friend_introduce">{{ friend.friend_info.introduce || '该用户无介绍' }}</p>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </ul>
                        </div>
                        <div class="right_part">
                            <header style="color:var(--black)">
                                <span>选择的好友</span>
                                <span>({{ select_friend_list.length }}/{{ filter_list.length }})</span>
                            </header>
                            <div style="height: 430px;margin-bottom: 10px;overflow-y: auto;padding-right:15px;">
                                <dl v-for="friend in select_friend_list" :key="friend.friend_info.user_id"  class="friend_item">
                                    <dt>
                                        <CustomAvatar :src="friend.friend_info.avatar" background-color="white" :circle="true" size="50px" />
                                    </dt>
                                    <dd class="friend_item_content">
                                        <div class="friend_item_content_text">
                                            <p class="friend_name">{{ friend.remark || friend.friend_info.username }}</p>
                                            <hr class="custom_hr">
                                            <p class="friend_introduce">{{ friend.friend_info.introduce || '该用户无介绍' }}</p>
                                        </div>
                                    </dd>
                                    <span @click.stop="toggleFriendSelection(friend)" class="iconfont out">&#xe658;</span>
                                </dl>
                            </div>
                            <footer>
                                <button @click="okCallback" class="custom_button success" style="width: 94%;margin: 0;">确认</button>
                            </footer>
                        </div>
                    </div>
                </template>
            </CustomConfirm>
    </div>
</template>

<script setup>
import pinyin from 'pinyin';
import CustomConfirm from './CustomConfirm.vue';
import CustomAvatar from './CustomAvatar.vue';
import CustomTips from './CustomTips.vue';
import CustomInput from './CustomInput.vue';
import useFriendStore from '@/stores/friend';
import { onMounted, ref, computed, onUnmounted, toRaw, watch, nextTick } from 'vue';
const props = defineProps(['modelValue', 'friend_list', 'ok']);
const emit = defineEmits(['update:modelValue']);
const filterKeywords = ref('');
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};
const friendStore = useFriendStore();
const select_friend_list = ref([]);
const friend_option = ref();
const isSelectedFriend = (friend) => {
    return select_friend_list.value.includes(friend);
};
const filter_list = computed(() => {
    const keywords = filterKeywords.value;
    observer.disconnect();
    startObserver();
    return props.friend_list.filter(friend => friend.remark?.includes(keywords) || friend.friend_info.username.includes(keywords))
})
const toggleFriendSelection = (friend) => {
    const index = select_friend_list.value.indexOf(friend);
    if (index > -1) {
        select_friend_list.value.splice(index, 1);
    } else {
        select_friend_list.value.push(friend);
    }
};
const okCallback = () => {
    if(select_friend_list.value.length) props.ok([...toRaw(select_friend_list.value)])
    emit('update:modelValue', false);
}
watch(() => props.modelValue, (newValue, oldValue) => {
    if (newValue) {
        startObserver();
    } else {
        select_friend_list.value.splice(0,select_friend_list.value.length)
        observer.disconnect();
    }
});
// 好友索引相关
const activeLetter = ref([]);
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
// 存储每个字母组的DOM引用
const groupRefs = ref([]);

const setGroupRef = (el, index) => {
    if (el) {
        groupRefs.value.push(el);
    }
};
const groupedFriendsWithFriends = computed(() => {
    return groupedFriends.value.filter(group => group.friends.length > 0);
});
// 观察器设置
const observer = new IntersectionObserver(
    (entries) => {
        const result = [];
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const firstLetter = entry.target.dataset.firstLetter;
                result.push(firstLetter);
            }
        });
        if (result.length) activeLetter.value = result;
    },
    {
        // 根据需要调整root和rootMargin
        root: null, // 默认为null，表示观察视口
        rootMargin: '0px',
        threshold: 1// 根据需要调整触发条件
    }
);

const groupedFriends = computed(() => {
    const groups = alphabet.map(letter => ({
        letter,
        friends: []
    }));
    toRaw(filter_list.value).forEach(friend => {
        const firstLetter = getFirstLetter(friend.friend_info.username).toUpperCase();
        const index = alphabet.indexOf(firstLetter);
        if (index !== -1) {
            groups[index].friends.push(friend);
        } else {
            groups[groups.length - 1].friends.push(friend); // 最后一个分组用于其他字符
        }
    });

    return groups;
});


function getFirstLetter(str) {
    const match = str.match(/[A-Za-z\u4e00-\u9fa5]/);
    if (match) {
        const firstChar = match[0];
        if (/[\u4e00-\u9fa5]/.test(firstChar)) {
            return pinyin(firstChar, { style: pinyin.STYLE_FIRST_LETTER })[0][0];
        }
        return firstChar;
    }
    return '#';
}

function scrollToLetter(letter) {
    const element = friend_option.value.querySelector('#group-' + letter);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function hasFriendsForLetter(letter) {
    return groupedFriends.value.some(group => group.letter === letter && group.friends.length > 0);
}
const startObserver = () => {
    nextTick(() => {
        observer.disconnect();
        const elem = friend_option.value;
        groupedFriendsWithFriends.value.forEach((item) => {
            console.log(friend_option)
            const element = elem.querySelector(`[data-first-letter="${item.letter}"]`);
            if (element) {
                observer.observe(element);
            }
        });
    })
}
onMounted(() => {
    console.log(props.friend_list)
    setTimeout(() => {
        startObserver();
    },1000)
})
onUnmounted(() => {
    observer.disconnect();
})
</script>

<style lang="scss" scoped>
.friend_option {
    padding: 10px 20px;
    display: flex;
    width: 100%;
    height:520px;
    padding-right:0px;
}

.friend_list {
    max-height: 500px;
    overflow-y: auto;
    width: 310px;
    padding-bottom: 20px;

    >div {
        padding-right: 20px;
        cursor: pointer;
    }
}

.friend_item {
    border: 1px solid var(--light);
    transition: all .3s;
    &.selected{
        background-color: var(--blue);
        border-style:double;
        border-color:var(--white);
        box-shadow: 2px 4px 0px 0px var(--blue);
        .friend_name{
            color:var(--white);
        }
        .friend_introduce{
            color:var(--white);
        }
    }
}
.out{
    flex-shrink: 0;
    color:var(--dark);
    margin-right: 0;
    margin-left: 10px;
    cursor: pointer;
}
.letter_group {
    height: 20px;
    font-size: 1.2rem;
    border-left-width: 6px;
}

.left_part {
    transform: translateY(0px);
    position: relative;
}

.right_part {
    max-height: 500px;
    overflow-y: auto;
    padding-left: 10px;
    flex-grow: 1;
    width:270px;
}
</style>