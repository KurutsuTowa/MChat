<template>
    <div v-if="user_list" class="user_list">
      <CustomTips value="这是用户列表,点击右侧索引可跳转到对应位置" />
      <!-- A-Z书签 -->
      <Teleport v-if="delay" :to="'#' + parentId">

        <div class="alphabet">
          <button v-for="letter in alphabet" :key="letter" @click="scrollToLetter(letter)"
            :class="{ active: activeLetter.includes(letter) }" v-show="hasUsersForLetter(letter)">
            {{ letter }}
          </button>
        </div>
      </Teleport>
      <!-- 好友列表 -->
      <div class="user_list">
        <div v-for="group in groupUsersWithFriends" :key="group.letter" :id="'group-' + group.letter"
          :ref="setGroupRef" :data-first-letter="group.letter">
          <h2 class="letter_group">{{ group.letter }}</h2>
          <dl v-for="user in group.users" :key="user.user_id" class="friend_item">
            <dt>
              <a-popover position="right" trigger="click">
                <CustomAvatar :src="user.avatar" :circle="true" size="70px">
                </CustomAvatar>
                  <template #content>
                      <UserCard :user_id="user.user_id"></UserCard>
                  </template>
              </a-popover>
            </dt>
            <dd class="friend_item_content">
              <div class="between middle">
                <CustomTags :tags="user.tags" class="between" style="width:auto;"></CustomTags>
                <span class="friend_status">离线</span>
              </div>
              <hr class="custom_hr">
              <div class="friend_item_content_text">
                <p class="friend_name">{{ user.username }}</p>
                <p class="friend_introduce">{{ user.introduce || '该用户无介绍' }}</p>
                <!-- v-if="!isUserFriend(friend)" -->
                <span class="isSelf" v-if="isSelf(user.user_id)">这是你！</span>
                <button v-else-if="!isFriend(user.user_id)" @click="showAddUserDialogCallback(user)"
                  class="custom_button custom_button_unique success iconfont">&#xe631;</button>
                <span class="isSelf" v-else>对方是你的好友！</span>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <CustomConfirm v-model="showAddUserDialog" :center="true" title="添加好友" icon="&#xe7e5;" style="width:520px;">
        <template #custom>
          <header class="title" style="height:50px;">
            <span class="iconfont">&#xe631;</span>
            <span>添加好友</span>
          </header>
          <div class="content">
            <CustomTips value="在添加好友之前，你需要填写一些信息"></CustomTips>
            <CustomCard class="padding" title="介绍(Introduce)">
              <template #content>
                <CustomTextarea v-model="form.introduce" placeholder="介绍一下你自己吧" :max-length="40" auto-size
                  height="50px" />
              </template>
            </CustomCard>
            <CustomCard class="padding" title="备注(Remark)">
              <template #content>
                <CustomInput v-model="form.remark" placeholder="好友备注" />
              </template>
            </CustomCard>
            <CustomCard class="padding no_right_padding" title="分组(Group)">
              <template #content>
                <div class="friend_group">
                  <a-radio-group v-model="chose_user_group" class="friend_group_select_list"
                    style="width:230px;overflow-y:auto;overflow-x:hidden;">
                    <CustomTips v-if="friendStore.friend_group?.length" :value="'你目前创建了' + friendStore.friend_group.length + '个分组'"
                      style="margin-top:0px" />
                    <CustomTips v-else :value="'你还没有创建好友分组'" style="margin-top:0px" />

                    <a-radio value="no_group">
                      <template #radio="{ checked }">
                        <a-space align="start" class="custom-radio-card"
                          :class="{ 'custom-radio-card-checked': checked }">
                          <div className="custom-radio-card-mask">
                            <div className="custom-radio-card-mask-dot" />
                          </div>
                          <div>
                            <div className="custom-radio-card-title">
                              不分组
                            </div>
                            <a-typography-text type="secondary">
                              好友数:{{ friendStore.friend_list.length }}
                            </a-typography-text>
                          </div>
                        </a-space>
                      </template>
                    </a-radio>
                    <template v-for="item in friendStore.friend_group" :key="item">
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
                    <a-space @click="showGroupManagerDialog = true" align="start"
                      class="custom-radio-card friend_group_manager" :class="{ 'custom-radio-card-checked': checked }">
                      <div style="margin-left: 5px;">
                        <div className="custom-radio-card-title">
                          <span class="iconfont">&#xe610;</span>
                          <span>管理分组</span>
                        </div>
                      </div>
                    </a-space>
                  </a-radio-group>
                  <ul class="friend_group_inner_list">
                    <li class="friend_group_inner_item target">
                      <CustomAvatar :src="chose_user.avatar" :no-border="true" :circle="true" size="30px">
                      </CustomAvatar>
                      <span>{{ form.remark }}({{ chose_user.username }})</span>
                      <span class="last_text" style="color:white;margin-right: 10px;font-size:.8rem;">将会加入</span>
                    </li>
                    <li v-for="friend in choseFriendGroupInnerList" class="friend_group_inner_item">
                      <CustomAvatar :src="friend.friend_info.avatar" :no-border="true" :circle="true" size="30px">
                      </CustomAvatar>
                      <span>{{ friend.friend_info.username }}</span>
                      <span class="iconfont last_text">&#xe64f;</span>
                    </li>
                  </ul>
                </div>
              </template>
            </CustomCard>
            <button @click="sendFriendRequestCallback" class="custom_button custom_button_unique success">
              <span class="iconfont">&#xe641;</span>
              <span>发送</span>
            </button>
          </div>
        </template>
      </CustomConfirm>
      <!-- 好友分组管理器 -->
      <GroupManager v-model="showGroupManagerDialog"></GroupManager>
    </div>
  </template>
  
  <script setup>
  const delay = ref(false);
  import CustomAvatar from './CustomAvatar.vue';
  import CustomTags from './CustomTags.vue';
  import CustomTips from './CustomTips.vue';
  import CustomConfirm from './CustomConfirm.vue';
  import CustomTextarea from './CustomTextarea.vue'
  import CustomInput from './CustomInput.vue'
  import CustomCard from './CustomCard.vue';
  import UserCard from './UserCard.vue';
  import GroupManager from './GroupManager.vue';
  import { ref, computed, onMounted, onUnmounted, toRaw, nextTick } from 'vue';
  import pinyin from 'pinyin';
  import useFriendStore from '@/stores/friend';
  import useUserStore from '@/stores/user';
  import customMessage from '@/utils/customMessage';
  const friendStore = useFriendStore();
  const userStore = useUserStore();
  const props = defineProps(['user_list','parentId']);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  const activeLetter = ref([]);
  const showAddUserDialog = ref(false);
  const showGroupManagerDialog = ref(false);
  const isFriend = (user_id) => {
    return friendStore.friend_list?.some(friend => {
    return friend.friend_id == user_id
  })
}
  const isSelf = (user_id) => userStore.user_info.user_id == user_id;
  const form = ref({
    target_id: '',
    introduce: '',
    remark: '',
  });
  const chose_user = ref(null);
  const chose_user_group = ref('no_group');
  const sendFriendRequestCallback = () => {
    friendStore.sendFriendRequest({ ...toRaw(form.value), friend_group_id: chose_user_group?.value?.friend_group_id })
      .then(data => customMessage({ type: 'normal', value: data }))
      .catch(data => customMessage({ type: 'error', value: data.msg }))
      .finally(() => {
        showAddUserDialog.value = false;
      })
  }
  // 获取选中分组下的所有好友列表
  const choseFriendGroupInnerList = computed(() => {
    if (!chose_user_group.value) {
      return [];
    } else if (chose_user_group.value == 'no_group') {
      return friendStore.friend_list;
    } else {
      return props.user_list.filter(friend => {
        return chose_user_group.value.list.find(item => item.user_id == friend.user_id)
      })
    }
  
  })
  // 显示好友添加面板
  const showAddUserDialogCallback = (user) => {
    form.value.target_id = user.user_id;
    form.value.remark = user.username;
    chose_user.value = user;
    showAddUserDialog.value = true;
  }
  // 发起好友请求
  const sendFriendRequest = async () => {
    if (form.value.introduce.trim().length > 40) return customMessage({ type: 'error', value: '介绍字数超过40，请缩减字数' })
    friendStore.sendFriendRequest(toRaw(form.value))
      .then(data => customMessage({ type: 'normal', value: data.msg,duration:9999999 }))
      .catch(data => customMessage({ type: 'error', value: data.msg }))
      .finally(() => {
        form.value.target_id = form.value.introduce = form.value.remark = form.value.friend_by_group = '';
      })
  }
  // 存储每个字母组的DOM引用
  const groupRefs = ref([]);
  
  const setGroupRef = (el, index) => {
    if (el) {
      groupRefs.value.push(el);
    }
  };
  
  const groupUsersWithFriends = computed(() => {
    const list = groupUsers.value;
    return list.filter(group => group.users.length > 0);
  });
  // 判断是否是用户的好友
  const isUserFriend = (friend) => props.user_list.some(item => item.user_id == friend.user_id);
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
  
  onMounted(() => {
    nextTick(() =>{
      delay.value = true;
    })
    // 遍历groupUsersWithFriends，并为每个元素设置观察
    groupUsersWithFriends.value.forEach((item) => {
      const element = document.querySelector(`[data-first-letter="${item.letter}"]`);
      if (element) {
        observer.observe(element);
      }
    });
    friendStore.friendGroupList().then(data => {
      console.log(friendStore.friend_list);
    })
  });
  
  onUnmounted(() => {
    // 组件卸载时，断开所有观察
    observer.disconnect();
  });
  
  const groupUsers = computed(() => {
    if(!props.user_list) return [];
    const groups = alphabet.map(letter => ({
      letter,
      users: []
    }));
    props.user_list.forEach(user => {
      const userLetter = getUserLetter(user.username).toUpperCase();
      const index = alphabet.indexOf(userLetter);
      if (index !== -1) {
        groups[index].users.push(user);
      } else {
        groups[groups.length - 1].users.push(user); // 最后一个分组用于其他字符
      }
    });
  
    return groups;
  });
  
  
  function getUserLetter(str) {
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
    const element = document.getElementById('group-' + letter);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  function hasUsersForLetter(letter) {
    return groupUsers.value.some(group => group.letter === letter && group.users.length > 0);
  }
  
  </script>
  
  <style>
  .padding .custom_card_content {
    padding: 6px 16px;
    padding-bottom: 10px;
  }
  
  .no_right_padding .custom_card_content {
    padding-right: 0;
    padding-left: 10px;
  }
  
  .user_list {
    position: relative;
    padding-right: 6px;
  }
  
  .between {
    max-width: 88%;
  }
  
  .custom_button_unique {
    margin: 0 auto;
    display: block;
    width: 100%;
  }
  
  .content {
    padding: 20px;
    width: 100%;
  }
  
  .user_list>.alphabet {
    right: 6px;
    top: 55px;
    margin-top: 26px;
  }
  
  .friend_group_select_list {
    max-height: 220px;
  }
  
  .friend_group_inner_list {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 220px;
  
    .friend_group_inner_item {
      margin-bottom: 4px;
      padding: 3px;
      display: flex;
      height: 34px;
      align-items: center;
      font-size: .8rem;
      position: relative;
  
      &.target {
        background-color: var(--blue);
        color: var(--white);
      }
  
      >span {
        margin-left: 4px;
      }
  
      >.last_text {
        position: absolute;
        right: 14px;
        color: var(--blue);
        font-size: .9rem;
        right: 0px;
      }
    }
  }
  
  .letter_group {
    color: var(--blue);
    margin: 10px;
    border-left: 8px solid;
    padding-left: 6px;
    height: 33px;
    display: flex;
    align-items: center;
    line-height: 33px;
  }
  
  .friend_item {
    background-color: var(--white);
    display: flex;
    box-shadow: 2px 4px 0px 0px var(--mostLight);
    border-radius: 8px;
    padding: 10px;
    align-items: center;
  }
  
  .friend_item_content {
    margin-left: 14px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: calc(100% - 90px);
  
    .custom_button {
      position: absolute;
      width: 36px;
      height: 36px;
      font-size: 1.2rem;
      right: 0px;
      top: 60%;
      transform: translateY(-50%);
      margin-right: 0px;
    }
  }
  
  .friend_status {
    font-weight: bold;
    font-size: .8rem;
    white-space: nowrap;
    color: var(--lightDark);
    margin-left: 10px;
  }
  
  .friend_name {
    font-size: 1rem;
    font-weight: bold;
    color: var(--dark);
  }
  
  .friend_introduce {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--lightDark);
    font-size: .9rem;
    width: 80%;
  }
  
  .friend_item_content_text {
    position: relative;
  }
  
  
  .friend_group {
    display: flex;
  }
  
  .friend_group_select_list {
    label {
      padding-left: 0;
    }
  }
  
  .custom-radio-card {
    padding: 10px 14px;
    border: 1px solid var(--light);
    border-radius: 4px;
    width: 220px;
    box-sizing: border-box;
    align-items: center;
    margin-bottom: 3px;
  
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
  .isSelf{
    font-size: .8rem;
    color: var(--blue);
  }
  /* .custom-radio-card-checked .custom-radio-card-title,
  .custom-radio-card-checked .arco-typography,
  .custom-radio-card-checked,
  .custom-radio-card-checked  .custom-radio-card-mask{
    color:var(--white);
    background-color: var(--blue);
    border-color: var(--blue);
  }
  
  .custom-radio-card-checked{
    border-color: var(--white)
  }
  .custom-radio-card-checked .custom-radio-card-mask-dot{
    background-color: var(--white);
  } */
  </style>