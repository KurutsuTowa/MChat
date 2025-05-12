<template>
  <!-- <div class="loading_box">
    <a-spin class="loading_icon" dot />
  </div> -->
  <div v-if="!loading" id="group_space"
    :style="{ backgroundImage: `url(${appStore.getServerImage(group_space.space_background)})` }">
    <transition appear name="animate__animated animate_bounce" enter-active-class="slideDownReturn">

      <div class="group_space_cotainer space_view">
        <div class="space_container">
          <div class="space_content" style="margin-top:10px;">
            <div class="user_card" style="height:100%;">
              <div class="front-content">
                    <div style="display: flex;">
                      <div>
                        <CustomAvatar class="space_avatar" background-color="var(--white)" :circle="true"
                            :border="true" size="100px" :src="group_space.avatar"></CustomAvatar>
                      </div>
                      <div style="align-self: center;margin-left: 18px;">
                        <p class="title" style="font-size: 1.4rem;">{{ group_space.group_name }}</p>
                        <a-tag color="var(--blue)" size="small">
                          ID:{{ group_space?.group_id }}
                        </a-tag>
                      </div>
                </div>
              </div>
              <div class="front-content">
                <small class="badge">档案</small>
                <div class="description">
                  <div class="title">
                    <div style="display: flex;">
                      <div class="tags">
                        <a-tag v-if="group_space?.tags?.length" v-for="tag in group_space?.tags?.split(',')" class="tag"
                          color="gray">
                          {{ tag }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="front-content">
                <small class="badge">群用户 ( <span style="font-weight: bold;">{{ group_space.member_total }}</span> / {{
    group_space.member_max }} )
                  人</small>
                <div class="description">
                  <div class="member_list">
                    <ul>
                      <li v-for="user in group_space.group_members"
                        :style="`display:flex;flex-direction:column;align-items: center;padding: 10px;border-radius: 4px;`">
                        <a-avatar v-if="user.avatar" style="width:4rem;height: 4rem;">
                          <img alt="avatar" :src="appStore.getServerImage(user.avatar)" />
                        </a-avatar>
                        <a-avatar v-else
                          :style="{ backgroundColor: 'var(--blue)', color: 'var(--white)' }">{{
    user.nickname || user.username }}</a-avatar>
                        <a-tag class="tag" style="color:var(--white);font-weight:bold;font-size:.9rem;background-color: var(--red);margin-top:10px;"
                          v-if="user.position == '群主'">
                          <template #icon>
                            <icon-user />
                          </template>
                          群主
                        </a-tag>
                        <a-tag class="tag" style="color:var(--white);font-weight:bold;font-size:.9rem;background-color: var(--blue);margin-top:10px;"
                          v-else-if="user.position == '管理员'">
                          <template #icon>
                            <icon-user />
                          </template>
                          管理
                        </a-tag>
                      </li>
                    </ul>
                    <a-button class="member_more_btn" type="primary" @click="showMebersDialog = true">
                      <template #icon>
                        <icon-more class="member_more" />
                      </template>
                    </a-button>
                  </div>
                </div>
              </div>
              <hr>
              <div class="front-content">
                <small class="badge">数据</small>
                <div class="description message_box">
                  <div class="no_recent"
                    style="text-align:center;display:flex;justify-content: center;overflow:hidden;">
                    <div ref="gender_total" style="height:200px;width:200px;"></div>
                    <div ref="level_total" style="height:200px;width:200px;"></div>
                    <div ref="age_total" style="height:200px;width:200px;"></div>
                  </div>
                </div>
              </div>
              <a-button v-if="type != 'member'" class="join_btn" style="margin-left:0;margin-right: 0;" @click="showAddGroupDialogCallback" long>加入群聊</a-button>
            </div>
          </div>
          <div v-if="type == 'member'" class="friend_setting" :style="{ marginRight: '40px', marginTop: '20px' }">

            <div style="padding:8px;">
              <header style="margin-left:10px;margin-top:10px;">群聊设置</header>
              <ul class="friend_setting_card">
                <li class="friend_setting_item">
                  <span>群聊置顶</span>
                  <a-switch v-model="updateForm.top_up" @change="uploadUpdate" />
                </li>
                <li class="friend_setting_item">
                  <span>消息免打扰</span>
                  <a-switch v-model="updateForm.no_disturb" @change="uploadUpdate" />
                </li>
                <li class="friend_setting_item">
                  <span>忽略</span>
                  <a-switch v-model="updateForm.ignored" @change="uploadUpdate" />
                </li>
              </ul>
              <ul class="friend_setting_card setting_btn">
                <li class="friend_setting_item" style="justify-content: center;" @click="deleteCallback">
                  退出群聊
                </li>
              </ul>
            </div>
            <div
              :style="`margin-top:20px;padding:8px;border-radius:8px;background-color:var(--white);backdrop-filter:blur(8px)`">
              <header style="margin-left:10px;margin-top:10px;">聊天设置</header>
              <ul class="friend_setting_card setting_btn">
                <li class="friend_setting_item" style="justify-content: center;">
                  删除聊天缓存
                </li>
              </ul>
              <li @click="startTalk" class="friend_setting_item custom_li start_li">
                  <span>开始会话</span>
                  <span class="iconfont">&#xe6a7;</span>
              </li>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <CustomConfirm v-model="leaveConfirm" title="退出群聊" content="你真的要退出群聊吗" :ok="leaveGroup"></CustomConfirm>
  <!-- 成员列表 -->
  <CustomConfirm :id="parentId" class="card_box" v-model="showMebersDialog" :center="true" icon="&#xe679;" style="width:460px;">
      <template #custom>
          <header class="title" style="height:55px;">
              <span class="iconfont">&#xe679;</span>
              <span>群聊成员列表</span>
          </header>
          <div class="container" style="width:100%;max-height: 500px;overflow: auto;">
            <UserList :user_list="group_space?.group_members" :parentId="parentId"></UserList>
          </div>
      </template>
  </CustomConfirm>
  <!-- 加入群聊 -->
  <CustomConfirm v-model="showGroupUserDialog" :center="true" title="加入群聊" icon="&#xe7e5;"
      style="width:520px;">
      <template #custom>
          <header class="title" style="height:50px;">
              <span class="iconfont">&#xe631;</span>
              <span>加入群聊</span>
          </header>
          <div class="content">
              <CustomTips value="你需要经过对方同意才能加群"></CustomTips>
              <CustomCard v-if="group_space.auth == 'query'" class="padding" title="对方的问题(Query)">
                  <template #content>
                      <div style="text-align:center;color:var(--dark);font-size:.95rem;font-weight:bold;">
                        {{ group_space.auth_query || '对方没有填写询问内容' }}
                      </div>
                  </template>
              </CustomCard>
              <CustomCard class="padding" title="介绍(Introduce)">
                  <template #content>
                      <CustomTextarea v-model="addForm.introduce" :placeholder="group_space.auth_query || '介绍一下你自己为什么加入该群聊'"
                          :max-length="40" auto-size height="50px" />
                  </template>
              </CustomCard>
              <button @click="sendGroupRequestCallback"
                  class="custom_button custom_button_unique success">
                  <span class="iconfont">&#xe641;</span>
                  <span>发送</span>
              </button>
          </div>
      </template>
  </CustomConfirm>
</template>

<script setup>
const parentId = 'parent-' + Math.random().toString(36).substring(2, 15);
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import CustomAvatar from '@/components/CustomAvatar.vue';
import UserList from '@/components/UserList.vue';
import CustomConfirm from '@/components/CustomConfirm.vue';
import CustomTextarea from '@/components/CustomTextarea.vue';
import CustomTips from '@/components/CustomTips.vue';
import CustomInput from '@/components/CustomInput.vue';
import CustomCard from '@/components/CustomCard.vue';
import { useRouter } from 'vue-router';
import customMessage from '@/utils/customMessage';
const router = useRouter();
const showAddDialog = ref(false);
const updateForm = reactive({
})
const addForm = reactive({
  introduce: '你好，我想加入群聊'
})

const showGroupUserDialog = ref(false);
const showAddGroupDialogCallback = (user) => {
    showGroupUserDialog.value = true;
}
async function uploadUpdate() {
  await groupStore.groupSet({
    no_disturb: +updateForm.no_disturb,
    top_up: +updateForm.top_up,
    ignored:+updateForm.ignored,
    group_id: group_space.value.group_id,
  });
  const room_id = await roomStore.getRoomIdByGroup(group_space.value.group_id);
  const room_info = await roomStore.appendRoom(room_id);
}
const leaveConfirm = ref(false);
const leaveGroup = async () => {
  groupStore.groupLeave(group_space.value.group_id)
    .then(async (data) => {
      customMessage({type:'normal',value:data});
      await groupStore.getGroupList();
      router.replace('/layout/contact/');
    })
    .catch(data => ElMessage.error(data.msg))
}
async function deleteCallback() {
  leaveConfirm.value = true;
}
function sendGroupRequestCallback() {
  groupStore.groupRequestSend({ group_id: group_space.value.group_id, introduce: addForm.introduce })
    .then(msg => customMessage({type:'normal',value:msg}))
    .catch(data => customMessage({type:'error',value:data.msg}))
    .finally(() => showGroupUserDialog.value = false)
}

import { onBeforeRouteUpdate, onBeforeRouteLeave, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { getYears } from '@/utils/datetime';
import useUserStore from '@/stores/user';
import useFriendStore from '@/stores/friend';
import useGroupStore from '@/stores/group';
import useAppStore from '@/stores/app';
import useRoomStore from '@/stores/room';
const roomStore = useRoomStore();
const userStore = useUserStore();
const friendStore = useFriendStore();
async function startTalk() {
  const room_id = await roomStore.getRoomIdByGroup(group_space.value.group_id);
  roomStore.appendRoom(room_id)
  // 跳转到聊天界面
  router.push('/layout/chat/room?room_id=' + room_id);
}
const gender_total = ref();
const level_total = ref();
const age_total = ref();
const route = useRoute();
const groupStore = useGroupStore();
const appStore = useAppStore();
const loading = ref(true);
const group_space = ref(null);
const type = ref(null);
const showMebersDialog = ref(false);
async function loadingGroupSpace(group_id) {
  loading.value = true;
  if (!group_id) return;
  friendStore.open_friend_space = null;
  const data = await groupStore.getGroupInfo({ group_id });
  data.group_members.sort((a, b) => {
    const positionOrder = { '群主': 1, '管理员': 2, '成员': 3 };
    return positionOrder[a.position] - positionOrder[b.position];
  });
  group_space.value = data;
  groupStore.open_group_space = group_id;
  if(type.value == 'member'){
    const self_member_info = group_space.value.group_members.find(member => member.user_id == userStore.user_info.user_id);
    updateForm.no_disturb = Boolean(self_member_info.no_disturb);
    updateForm.top_up = Boolean(self_member_info.top_up);
    updateForm.ignored = Boolean(self_member_info.ignored);
  }
  await groupStore.getGroupList();
  loading.value = false;
  nextTick(() => {
    const members = group_space.value.group_members;
    // 统计性别
    let secrecy = 0, maleCount = 0, femaleCount = 0;
    const age_obj = {}, level_obj = {};

    members.forEach(member => {
      // 性别统计
      switch (member.gender) {
        case '保密':
          secrecy++;
          break;
        case '男':
          maleCount++;
          break;
        case '女':
          femaleCount++;
          break;
      }
      // 年龄统计
      if (member.age !== undefined) {
        age_obj[member.age] = (age_obj[member.age] || 0) + 1;
      } else {
        age_obj['保密'] = (age_obj['保密'] || 0) + 1;
      }
      // 等级统计
      if (member.level !== undefined) {
        level_obj[member.level] = (level_obj[member.level] || 0) + 1;
      }
    });

    // 展示性别分布
    const genderCounts = { '男': maleCount, '女': femaleCount, '保密': secrecy };
    const mostCommonGender = Object.keys(genderCounts).reduce((a, b) => genderCounts[a] > genderCounts[b] ? a : b);
    loadGauge(gender_total.value, mostCommonGender, Math.floor(genderCounts[mostCommonGender] / members.length * 100), '性别');

    // 展示年龄分布
    let mostCommonAge = ['保密', 0];
    for (let key in age_obj) {
      if (mostCommonAge[1] < age_obj[key]) mostCommonAge = [key, age_obj[key]];
    }
    loadGauge(age_total.value, mostCommonAge[0], Math.floor(mostCommonAge[1] / members.length * 100), '年龄');

    // 展示等级分布
    for (let level in level_obj) {
      const percentage = Math.floor(level_obj[level] / members.length * 100);
      loadGauge(level_total.value, `等级 ${level}`, percentage, '等级分布');
    }
  });
}
// echarts
import * as echarts from 'echarts';
import { onUpdated } from 'vue';
import { nextTick } from 'vue';
function loadGauge(elem, name, value, title) {
  const style = window.getComputedStyle(document.body);
  const blue = style.getPropertyValue('--blue');
  const white = style.getPropertyValue('--white');
  const light = style.getPropertyValue('--light');
  const gaugeData = [
    {
      value: value,
      name: name,
      title: {
        offsetCenter: ['0%', '-50%'],
        color: blue,
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%'],
        color: blue,
        formatter: function (value) {
          return value + '%'; // 将数值转换为百分比形式
        },
      }
    },
  ];
  const option = {
    title: {
      text: title, // 图表的标题
      left: 'center',
      top: 'top',
      textStyle: {
        color: blue,
        fontSize: 16 // 可以根据需要调整字体大小
      }
    },
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: blue,
            borderWidth: 1,
            borderColor: white
          }
        },
        axisLine: {
          lineStyle: {
            color: [[1, light]],
            width: 10
          }
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
      }
    ]
  };
  echarts.init(elem).setOption(option);
}

onMounted(() => {
  const group_id = route.query.group_id;
  type.value = route.query.type;
  loadingGroupSpace(group_id)
})
onBeforeRouteUpdate((to, from) => {
  const group_id = to.query.group_id;
  type.value = to.query.type;
  loadingGroupSpace(group_id)
})
onBeforeRouteLeave(() => {
  groupStore.open_group_space = null;
})
</script>

<style lang="scss" scoped>
#group_space {
  margin: 20px;
  height: 100%;
  background-size: cover;
  background-position: center center;
  transition: background-image .3s;
  position: relative;
  overflow: auto;
  box-shadow: 0px 187px 75px var(--blue);

  &::-webkit-scrollbar {
    width: 0px;
    /* 设置滚动条的宽度 */
  }
}
.custom_li{
      margin:0 9px;
      margin-top:10px;
      display:flex;
      justify-content:space-between;
      padding: 6px 10px;
      // background-color: var(--formColor);
      border-radius: 6px;
      box-shadow: 3px 3px 0px var(--blue);
      border: 1px solid var(--blue);
      cursor:pointer;
      &.start_li{
          background-color:var(--blue);
          color:var(--white);
          &:hover{
            background-color:var(--highBlue);
            color:var(--white);
            box-shadow: 3px 3px 0px var(--darkBlue);
        }
      }
}
.join_btn{
  margin: 0 30px;
  margin-bottom:40px;
  background-color: var(--blue);
  color:var(--white);
  &:hover{
    background-color: var(--highBlue);
    color:var(--white);
  }
}
.group_space_cotainer {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 60%;
  background-color: var(--white);
  position: absolute;
  top: 50%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-top: 10px solid var(--blue);

  .setting {
    position: absolute;
    right: 20px;
    top: 5px;
    background-color: var(--blue);
    color: var(--white);
    font-size: 1rem;
    width: 30px;
    height: 30px;
    line-height: 30px;
    z-index: 1;
    text-align: center;
  }
}
.container{
  background-color: var(--white);
  background-blend-mode: multiply;
  background-image: url(/src/assets/images/base.jpg);
  background-size: auto 100%;
  padding: 8px 10px;
  columns: var(--dark);
}
.container_header {
  .container_avatar {
    // transform: translateY(-25%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container_base_info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
    width: 568px;
    text-shadow: 0 0 4px var(--blue), 0 0 4px var(--blue), 0 0 4px var(--blue), 0 0 4px var(--blue), 0 0 4px var(--blue), 0 0 4px var(--blue);

    .base_info_name {
      // color: var(--dark);
      color: var(--white);
      font-weight: bold;
      font-size: 1.6rem;
      line-height: 1.5;
    }

    .base_info_id {
      font-size: 1rem;
      // color: var(--lightDark);
      color: var(--someWhite);
      line-height: 1;
      font-weight: bold;
    }
  }
}

.front-content {
  color: var(--black);
}

.member_list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  ul {
    display: flex;

    >* {
      margin: 0 4px;
    }
  }

  .member_more {
    font-size: 2rem;
    color: inherit;
  }

  &:deep(.arco-tag-icon) {
    color: inherit !important;
  }
}

.loading_box {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, .6);

  .loading_icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.space_view {

  /* 隐藏Webkit浏览器的滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* 隐藏IE和Edge的滚动条 */
  -ms-overflow-style: none;
  /* IE 10+ */

  /* 隐藏Firefox的滚动条 */
  scrollbar-width: none;

  /* Firefox */
  .space_container {
    display: flex;
    position: relative;

    .friend_setting {
      top: 0px;
      position: sticky;
      padding-top: 30px;
      width: 20%;
      min-width: 200px;
      font-size: 1rem;
      color: var(--dark);
    }

    .friend_setting_card {
      border-radius: 8px;
      margin: 15px 8px;
      padding: 0px 15px;
      background-color: var(--formColor);

      &.setting_btn:hover {
        cursor: pointer;
        background-color: var(--blue);
        color: var(--white);
      }

      .friend_setting_item {
        padding: 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:not(:last-child) {
          border-bottom: 1px solid var(--formColor);
        }

        &:deep(.arco-switch-checked) {
          background-color: var(--blue);
        }
      }
    }
  }

  .tags {
    .tag {
      margin-right: 4px;
    }
  }

  .recent_box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .no_recent {
      text-align: center;
      color: inherit;

      p {
        opacity: 0.7;
      }
    }
  }

  &:deep(.info) {
    color: var(--dark);
    font-size: .8rem;
    margin: 1rem 25%;
  }

  &:deep(.name) {
    color: var(--dark);
  }

  &:deep(a) {
    color: var(--dark);
  }

  &:deep(>svg) {
    width: 22px;
    height: 22px;
  }
}

.card {
  overflow: visible;
  width: 100%;
  height: 100%;
}

.front-content {
  width: 100%;
  padding: 10px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.front-content .badge {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 1.2rem;
  padding: 2px 10px;
  width: fit-content;

}

.description {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border-top-left-radius: 0;
}

.card-footer {
  margin-top: 5px;
  font-size: .7rem;

  &:deep(.arco-tag-custom-color) {
    >* {
      color: var(--white);
    }
  }
}

.img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

hr {
  opacity: .7;
  border-color: var(--formColor);
  margin: 10px;
}

.custom-card-item {
  position: relative;
  display: flex;
  font-size: 1rem;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    border-color: var(--hoverColor);
    box-shadow: 0 0 4px var(--hoverColor);
  }

  .custom-content {
    margin-left: 6px;
    display: flex;
    flex-direction: column;
  }

  .usersign {
    font-size: .8rem;
    filter: brightness(0.6);
  }

  &:deep(.arco-tag-icon) {
    color: inherit !important;
  }
}

.chat_add {
  .tag {
    font-size: 0.8rem;
    position: absolute;
    right: 10px;
    top: 50%;
    background-color: transparent;
    border: 1px solid;
    transform: translateY(-50%);

    &:deep(.arco-tag-icon) {
      font-size: .9rem;
    }
  }

  .join {
    position: absolute;
    font-size: 0.8rem;
    bottom: 0px;
    right: 4px;
  }

  .search-tabs:deep(.el-tabs__nav-wrap) {
    &::after {
      display: none
    }

    .el-tabs__active-bar {
      height: 100%;
      width: 100%;
      z-index: -1;
    }

    .el-tabs__item {
      position: relative;
      z-index: 1;
    }

    $paddingY: 3px;
    $paddingX: 12px;
    overflow: hidden;
    border-radius: 4px;
    background-color: transparent;
    height: 33px;
    display: flex;
    align-items: center;

    >* {
      flex-grow: 1;
    }

    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }

    .el-tabs__active-bar {
      top: $paddingY;
      bottom: $paddingY;
      height: auto;
      border-radius: 4px;
    }

    .el-tabs__nav {
      width: 100%;

      .el-tabs__item {
        flex-grow: 1;
        height: 30px;
        padding: 0;
        z-index: 999;
      }
    }
  }

  .user-id {
    font-size: .9rem;
    font-style: normal;
    position: absolute;
    right: 4px;
  }

  .custom-card-item {
    display: flex;
    font-size: 1rem;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 4px;

    .custom-content {
      margin-left: 6px;
      display: flex;
      flex-direction: column;
    }

    .usersign {
      font-size: .8rem;
    }
  }
}
</style>