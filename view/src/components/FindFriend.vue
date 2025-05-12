<template>
    <!-- 发现好友 -->
    <CustomConfirm @update:modelValue="onUpdateModelValue" :model-value="modelValue" :center="true" icon="&#xe679;" style="width:560px;overflow: hidden;">
        <template #custom>
            <header class="title" style="height:55px;">
                <span class="iconfont">&#xe679;</span>
                <span>发现好友</span>
            </header>
            <div ref="container" class="container" style="width:100%;min-height: 450px;">

                <div id="find-friends-form" style="height:100%;">
                    <div class="form-group">
                    <br>
                    <CustomTips value="这里可以通过选择的类型来发现新的好友"></CustomTips>
                    <a-input-tag v-model="tags" @press-enter="addTag" @remove="removeTag" @clear="clearTags" :default-value="['爱看电影']" :style="{width:'380px'}" placeholder="输入用户标签" allow-clear/>
                    <ul class="list tag_list" style="margin-top:10px;">
                        <li v-for="tag in hot_user_tags" @click="toggleTag(tag.tag_name)" class="item">
                            <div class="item_face">
                                <div class="tag"
                                    :style="{ backgroundColor: tag.first_tag_color, color: tag.first_text_color }">
                                    {{ tag.tag_name }}</div>
                            </div>
                        </li>
                    </ul>
                    </div>
                    <div class="form-group">
                    <a-radio-group v-model="gender" style="display:flex;">
                        <a-radio value="保密">
                            <template #radio="{ checked }">
                                <a-space align="start" class="custom-radio-card"
                                    :class="{ 'custom-radio-card-checked': checked }">
                                    <div className="custom-radio-card-mask">
                                        <div className="custom-radio-card-mask-dot" />
                                    </div>
                                    <div style="display:flex;align-items: center;">
                                        <span style="text-shadow: 0 0 6px var(--white),0 0 6px var(--white);" class="chose_gender" v-html="getGenderParseElem('保密')"></span>
                                        <div className="custom-radio-card-title">
                                            保密
                                        </div>
                                    </div>
                                </a-space>
                            </template>
                        </a-radio>
                        <a-radio value="男">
                            <template #radio="{ checked }">
                                <a-space align="start" class="custom-radio-card"
                                    :class="{ 'custom-radio-card-checked': checked }">
                                    <div className="custom-radio-card-mask">
                                        <div className="custom-radio-card-mask-dot" />
                                    </div>
                                    <div style="display:flex;align-items: center;">
                                    <span style="text-shadow: 0 0 6px var(--white),0 0 6px var(--white);" class="chose_gender" v-html="getGenderParseElem('男')"></span>
                                        <div className="custom-radio-card-title">
                                            男性
                                        </div>
                                    </div>
                                </a-space>

                            </template>
                        </a-radio>
                        <a-radio value="女">
                            <template #radio="{ checked }">
                                <a-space align="start" class="custom-radio-card"
                                    :class="{ 'custom-radio-card-checked': checked }">
                                    <div className="custom-radio-card-mask">
                                        <div className="custom-radio-card-mask-dot" />
                                    </div>
                                    <div style="display:flex;align-items: center;" >
                                    <span style="text-shadow: 0 0 6px var(--white),0 0 6px var(--white);" class="chose_gender" v-html="getGenderParseElem('女')"></span>
                                        <div className="custom-radio-card-title">
                                            女性
                                        </div>
                                    </div>
                                </a-space>

                            </template>
                        </a-radio>
                    </a-radio-group>
                    </div>
                    <div class="form-group">
                        <a-radio-group v-model="age" style="display:flex;">
                            <a-radio value="1">
                                <template #radio="{ checked }">
                                    <a-space align="start" class="custom-radio-card"
                                        :class="{ 'custom-radio-card-checked': checked }">
                                        <div className="custom-radio-card-mask">
                                            <div className="custom-radio-card-mask-dot" />
                                        </div>
                                        <div style="display:flex;align-items: center;">
                                            <span style="text-shadow: 0 0 6px var(--white),0 0 6px var(--white);" class="chose_gender"></span>
                                            <div className="custom-radio-card-title">
                                                年龄不限
                                            </div>
                                        </div>
                                    </a-space>
                                </template>
                            </a-radio>
                            <a-radio value="">
                                <template #radio="{ checked }">
                                    <a-space align="start" class="custom-radio-card"
                                        :class="{ 'custom-radio-card-checked': checked }">
                                        <div className="custom-radio-card-mask">
                                            <div className="custom-radio-card-mask-dot" />
                                        </div>
                                        <div style="display:flex;align-items: center;">
                                        <span style="text-shadow: 0 0 6px var(--white),0 0 6px var(--white);" class="chose_gender"></span>
                                            <div className="custom-radio-card-title">
                                                年龄保密
                                            </div>
                                        </div>
                                    </a-space>

                                </template>
                            </a-radio>
                        </a-radio-group>
                    </div>
                    <div style="display: flex;justify-content: space-between;">
                    <hr class="custom_hr">
                    <button @click="findFriendCallback" class="custom_button success" style="margin-top:76px;">
                        <span>搜索</span>
                        <span class="iconfont">&#xe68f;</span>
                    </button>
                </div>
                </div>
                <div class="find_list" style="align-self: start;">
                    <ul style="display:flex;flex-wrap: wrap;">
                        <template v-if="user_list?.length" v-for="user in user_list" >
                            <a-popover position="right" trigger="click">
                                <dl class="friend_item contact_item" style="flex-shrink:0;">
                                    <dt>
                                        <CustomAvatar :src="user.avatar" background-color="white"
                                            circle="true" size="50px" />
                                    </dt>
                                    <dd class="friend_item_content">
                                        <div class="friend_item_content_text">
                                            <p class="friend_name">{{user.username}}</p>
                                            <hr class="custom_hr">
                                            <p v-if="user.user_id == userStore.user_info.user_id" class="friend_introduce" style="color:var(--blue)">这是你自己</p>
                                            <p v-else class="friend_introduce">{{user.introduce}}</p>
                                        </div>
                                        <button v-if="!isFriend(user.user_id) && user.user_id != userStore.user_info.user_id" @click.stop="showAddFriendDialogCallback(user)" class="custom_button custom_button_uniqued success iconfont">&#xe631;</button>
                                    </dd>
                                </dl>
                                <template #content>
                                    <UserCard :user_id="user.user_id"></UserCard>
                                </template>
                            </a-popover>
                        </template>
                        <div v-else style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                            <span class="iconfont">&#xe673;</span>
                            <span>
                                没有搜索到任何信息
                            </span>
                        </div>
                    </ul>
                    <button @click="container.style.transform = 'translateX(0%)'" class="custom_button te_custom_button success">
                        <span class="iconfont">&#xe696;</span>
                        <span>返回</span>
                    </button>
                </div>
            </div>
        </template>
    </CustomConfirm>
    <CustomConfirm v-model="showAddFriendDialog" :center="true" title="添加好友" icon="&#xe7e5;" style="width:520px;">
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
                  <a-radio-group v-model="chose_friend_group" class="friend_group_select_list"
                    style="width:230px;overflow-y:auto;overflow-x:hidden;">
                    <CustomTips v-if="friendStore.friend_group?.length" :value="'你目前创建了' + friendStore.friend_group.length + '个分组'"
                      style="margin-top:0px" />
                    <CustomTips v-else :value="'你还没有创建好友分组'" style="margin-top:0px" />

                    <a-radio value="no_group">
                      <template #radio="{ checked }">
                        <a-space align="start" class="custom-radio-card"  style="width:220px;"
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
                            :class="{ 'custom-radio-card-checked': checked }" style="width:220px;">
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
                      class="custom-radio-card friend_group_manager" :class="{ 'custom-radio-card-checked': checked }" style="width:220px;">
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
                      <CustomAvatar :src="chose_friend.avatar" :no-border="true" :circle="true" size="30px">
                      </CustomAvatar>
                      <span>{{ form.remark }}({{ chose_friend.username }})</span>
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
</template>

<script setup>
import { onMounted,ref,reactive,computed } from 'vue';
import CustomConfirm from './CustomConfirm.vue'
import CustomAvatar from './CustomAvatar.vue'
import CustomTextarea from './CustomTextarea.vue'
import CustomInput from './CustomInput.vue'
import CustomTips from './CustomTips.vue'
import CustomCard from './CustomCard.vue'
import UserCard from './UserCard.vue'
import GroupManager from './GroupManager.vue'
import useUserStore from '@/stores/user';
import useFriendStore from '@/stores/friend';
import { toRaw } from 'vue';
import customMessage from '@/utils/customMessage';
const { modelValue } = defineProps(['modelValue'])
const friendStore = useFriendStore();
const showAddFriendDialog = ref(false);
const showGroupManagerDialog = ref(false);
const emit = defineEmits(['update:modelValue']);
const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
};
const form = ref({
  target_id: '',
  introduce: '',
  remark: '',
});
const chose_friend = ref(null);
const chose_friend_group = ref('no_group');
const isFriend = (friend_id) => friendStore.friend_list.some(friend => {
  return friend.friend_id == friend_id
})
// 显示好友添加面板
const showAddFriendDialogCallback = (friend_info) => {
  form.value.target_id = friend_info.user_id;
  form.value.remark = friend_info.username;
  chose_friend.value = friend_info;
  showAddFriendDialog.value = true;
}
// 获取选中分组下的所有好友列表
const choseFriendGroupInnerList = computed(() => {
  if (!chose_friend_group.value) {
    return [];
  } else if (chose_friend_group.value == 'no_group') {
    return friendStore.friend_list;
  } else {
    return friendStore.friend_list.filter(friend => {
      return chose_friend_group.value.list.find(item => item.friend_relation_id == friend.friend_relation_id)
    })
  }

})
const sendFriendRequestCallback = () => {
  friendStore.sendFriendRequest({ ...toRaw(form.value), friend_group_id: chose_friend_group?.value?.friend_group_id })
    .then(data => customMessage({ type: 'normal', value: data }))
    .catch(data => customMessage({ type: 'error', value: data.msg }))
    .finally(() => {
      showAddFriendDialog.value = false;
    })
}
const container = ref();
const userStore = useUserStore();
const hot_user_tags = ref(null);
const user_list = ref();
const tags = reactive([]);
const gender = ref('');
const age = ref('');
const findFriendCallback = () => {
    userStore.findUser({
        age:age.value,
        gender:gender.value,
        tags:toRaw(tags)
    })
    .then((list) => {
        user_list.value = list;
        container.value.style.transform = 'translateX(-100%)';
    })
}
const addTag = value => {
    toggleTag(value)
}
const clearTags = () => {
    tags.splice(0,tags.length)
}
const removeTag = value => {
    toggleTag(value)
}
const toggleTag = (tag) => {
    if(!tags.includes(tag)){
        console.log(tag);
        tags.push(tag);
    }else{
        tags.splice(tags.indexOf(tag),1);
    }
}
// 获取性别
const getGenderParseElem = (gender) => {
    if (gender == '保密') {
        return '<span class="iconfont" style="color:green;font-size:1.2rem;">&#xeaf0;</span>'
    } else if (gender == '男') {
        return '<span class="iconfont" style="color:var(--blue);font-size:1.2rem;">&#xe617;</span>'
    } else if (gender == '女') {
        return '<span class="iconfont" style="color:var(--red);font-size:1.2rem;">&#xe616;</span>'
    }
}
onMounted(async () => {
    hot_user_tags.value = await userStore.userTagTop(5);
})
</script>

<style lang="scss" scoped>
.custom_button_uniqued.custom_button_uniqued {
  margin: 0 auto;
  display: block;
  top: 21px;
width: 26px;
height: 26px;
font-size: .9rem;
right: 5px;
color: var(--blue);
background-color: transparent;
}
.contact_item {
    cursor: pointer;
    color: var(--dark);
    $padding: 10px;
    border: 1px solid var(--blue);
    box-shadow: 4px 5px 1px 0px var(--blue);
    display: flex;
    position: relative;
    margin-top: 16px;
    margin-right:20px;
    width:240px;
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
        .custom_button_uniqued{
            color:var(--white)!important;
        }
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
.custom-radio-card{
    width:120px;
}
.find_list{
    color:var(--dark);
    z-index: 1;
    height:457px!important;
    overflow-y: auto;
    position:relative;
    .te_custom_button{
        position:absolute;
        bottom: 26px;
        left: 25px;
        margin: 0;
    }
}
  .container {
    padding:0;
    display: flex;
    align-items: center;
    max-width: 600px;
    margin: auto;
    color:var(--dark);
    font-weight:500;
    transition:all .4s;
    >*{
        flex-shrink: 0;
        width:100%;
        padding: 20px;
        height:100%;
    }
    h3{
        font-size: 1.4rem;
    }
    .custom_button{
        line-height: 1;
        box-shadow:none;
    }
  }
  .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .tag_list{
        width: auto;
    }
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input[type="text"],
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .tag-input {
    display: flex;
    flex-wrap: wrap;
  }
  .tag {
    background-color: #6c7ae0;
    color: white;
    padding: 5px 10px;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 15px;
    cursor: pointer;
  }
  .tag:hover {
    opacity: 0.8;
  }
  .hot-tags {
    margin-top: 10px;
  }

</style>