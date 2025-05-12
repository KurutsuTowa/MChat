<template>
    <template v-if="loading">
        <div @click.stop class="user_card card_box">
            <header class="title">
                <span class="iconfont">&#xe63f;</span>
                <span>用户信息</span>
            </header>
            <div class="container">
                <!-- 头像与基本信息 -->
                <header class="container_header">
                    <div class="container_avatar">
                        
                            <a-upload :show-file-list="false" :action="appStore.server + '/upload/image/'" @success="uploadAvatarSuccess">
                                <template #upload-button>
                                    <CustomAvatar background-color="var(--white)" :circle="true" :border="true" size="100px"
                            :src="user_card_info.user_info.avatar"></CustomAvatar>
                                </template>
                            </a-upload>
                    </div>
                    <div class="container_base_info">
                        <CustomTags :add="isSelf"
                            :tags="user_card_info.user_info.user_id == userStore.user_info.user_id ? userStore.user_info.tags : user_card_info.user_info.tags">
                        </CustomTags>
                        <p class="base_info_name">
                            <span>
                                {{ user_card_info.user_info.username }}
                            </span>
                            <button v-if="isSelf" @click="showRenameDialog = true" class="min_button">
                                &#xe618;
                            </button>
                        </p>
                        <p class="base_info_id">
                            <span>
                                ID:{{ user_card_info.user_info.user_id }}
                            </span>
                            <button @click="copyId" class="min_button">
                                &#xe60b;
                            </button>
                        </p>
                    </div>
                </header>
                <!-- 介绍 -->
                <CustomRow style="cursor: pointer;">
                    <template #content>
                        <div class="center">
                            <span class="introduce_inner"> {{ user_card_info.user_info.introduce || '未填写个人简介' }}</span>
                            <span v-if="isSelf" @click="showIntroduceDialog = true" class="iconfont abs_middle"
                                style="font-size: 1.2rem;position: absolute;right:10px;">&#xe618;</span>
                        </div>
                    </template>
                </CustomRow>
                <!-- 主要的个人信息 -->
                <CustomCard>
                    <template #header>
                        <div class="main_info_header middle" style="font-weight: bold;">
                            <p class="title">主要</p>
                            <div class="info_box middle between" style="flex-grow: 1;">
                                <div>
                                    <span v-html="getGenderParseElem(user_card_info.user_info.gender)"></span>
                                    <span>|</span>
                                    <span>{{ getUserAge(user_card_info.user_info.age) }}</span>
                                    <span>|</span>
                                    <span>{{ getConstellation(user_card_info.user_info.born_at) }}</span>
                                </div>
                                <button @click="showInfoDialog = true" class="min_button">&#xe63f;</button>
                            </div>
                        </div>
                    </template>
                </CustomCard>
                <!-- ta的好友列表 -->
                <CustomCard>
                    <template #header>
                        <div class="main_info_header middle" style="font-weight: bold;">
                            <p class="title">有关好友</p>
                        </div>
                    </template>
                    <template #content>
                        <hr>
                        <div class="custom_card_content_inner">
                            <div class="recent_user_list">
                                <template v-if="user_card_info.friend_list.length">
                                    <dl v-for="friend in user_card_info.friend_list.slice(0, 4)"
                                        class="rencent_user_item">
                                        <dt>
                                            <CustomAvatar size="50px" :src="friend.friend_info.avatar"></CustomAvatar>
                                        </dt>
                                        <dd>{{ friend.friend_info.username }}</dd>
                                    </dl>
                                    <dl @click="showFriendList = true" class="recent_user_more rencent_user_item">
                                        <button class="min_button"
                                            style="width:50px;height:50px;font-size:2rem;background-color: var(--dark);color:var(--white)">&#xe66e;</button>
                                    </dl>
                                </template>
                                <template v-else>
                                    <CustomTips value="该用户没有添加任何好友" style="width: 100%;justify-content: center;">
                                    </CustomTips>
                                </template>
                            </div>
                            <CustomRow style="background-color:rgb(222 238 239);box-shadow:none;border:none;">
                                <template #content>
                                    <div class="center">
                                        <CustomStatistic title="贴纸图鉴"
                                            :value="user_card_info.user_stickers.list?.length + '/' + stickers_guide?.length">
                                        </CustomStatistic>
                                        <CustomStatistic title="好友数" :value="user_card_info.friend_list.length">
                                        </CustomStatistic>
                                        <CustomStatistic title="群聊数" value="13"></CustomStatistic>
                                    </div>
                                </template>
                            </CustomRow>
                        </div>
                    </template>
                </CustomCard>
                <!-- 前往个人空间 -->
                <CustomCard :noIcon="true">
                    <template #header>
                        <div @click="openUserSpace" class="main_info_header no_icon middle" style="font-weight: bold;">
                            <p class="title">前往个人空间</p>
                            <span class="iconfont" style="flex-grow:1;text-align:right;">&#xe634;</span>
                        </div>
                    </template>
                </CustomCard>
                <!-- 添加好友（如果不是好友） -->
                <CustomCard v-if="!isFriend() && userStore.user_info.user_id != user_card_info.user_info.user_id" :noIcon="true">
                    <template #header>
                        <div @click="showAddUserDialogCallback" class="main_info_header no_icon middle" style="font-weight: bold;">
                            <p class="title">添加好友</p>
                            <span class="iconfont" style="flex-grow:1;text-align:right;">&#xe631;</span>
                        </div>
                    </template>
                </CustomCard>
                <!-- 用户注册时间 -->
                <CustomCard>
                    <template #header>
                        <div class="main_info_header middle" style="font-weight: bold;">
                            <p class="title">加入时间</p>
                            <div class="info_box middle between"
                                style="flex-grow: 1;padding-left: 10px;margin-left:10px;">
                                <span>
                                    {{ parseAllDate(user_card_info.user_info.created_at) }}
                                </span>
                            </div>
                        </div>
                    </template>
                </CustomCard>
                <!-- 用户的贴纸 -->
                <div class="stickers_statistic_box">
                    <header class="stickers_statistic_header">
                        <span class="stickers_statistic_header_title">收集贴纸</span>
                        <p>
                            <button @click="showStickerRankDialog = true" class="dark_button">
                                <span class="iconfont" style="margin:0;vertical-align: -1px;">&#xe638;</span>
                                记录排行榜
                            </button>
                            <button @click="showStickerGuideDialog = true" style="color:var(--white)"
                                class="iconfont dark_button">&#xe7c8;</button>
                        </p>
                    </header>
                    <div class="stickers_statistic_content">
                        <div class="stickers_statistic_content_header">
                            <div>
                                <button @click="activeStickers = $event.target.textContent" class="min_button dark text"
                                    :active="activeStickers == 'ALL'">ALL</button>
                                <button @click="activeStickers = $event.target.textContent" class="min_button dark text"
                                    :active="activeStickers == '传说'">传说</button>
                                <button @click="activeStickers = $event.target.textContent" class="min_button dark text"
                                    :active="activeStickers == '史诗'">史诗</button>
                                <button @click="activeStickers = $event.target.textContent" class="min_button dark text"
                                    :active="activeStickers == '稀有'">稀有</button>
                                <button @click="activeStickers = $event.target.textContent" class="min_button dark text"
                                    :active="activeStickers == '普通'">普通</button>
                            </div>
                            <div @click="showPointDialog = true" class="stickers_statistic_content_header_title">
                                <span class="iconfont">
                                    &#xe63d;
                                </span>
                                <span style="font-size:1rem;line-height:1;vertical-align: -2px;">{{user_card_info.user_stickers.point }}</span>
                            </div>
                        </div>
                        <ul class="stickers_statistic_list">
                            <StickerItemByUser v-for="sticker in user_card_info.user_stickers.list"
                                v-show="activeStickers == 'ALL' || activeStickers == sticker?.sticker_info.rarity"
                                :sticker>
                            </StickerItemByUser>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 主要信息 -->
        <CustomConfirm v-model="showInfoDialog" :center="true" title="主要信息" icon="&#xe679;">
            <template #custom>
                <header class="title">
                    <span class="iconfont">&#xe63f;</span>
                    <span>详细信息</span>
                </header>
                <div class="container" style="width:100%">
                    <CustomCard style="padding-bottom: 10px">
                        <template #header>
                            <div class="main_info_header middle " style="font-weight: bold;">
                                <p class="title">简介</p>
                                <div style="flex-grow:1;text-align:right;">
                                    <span v-if="isSelf" @click="showIntroduceDialog = true"
                                        style="font-size:1rem;color:var(--lightDark);cursor:pointer;"
                                        class="iconfont">&#xe618;</span>
                                </div>
                            </div>
                            <CustomArea v-model="introduce" placeholder="对方还没有介绍" :max-length="50" auto-size />
                        </template>
                    </CustomCard>
                    <CustomCard>
                        <template #header>
                            <div class="main_info_header middle" style="font-weight: bold;">
                                <p class="title">用户名</p>
                                <div class="info_box middle" style="flex-grow: 1;">
                                    <div>
                                        <span>{{ user_card_info.user_info.username }}</span>
                                    </div>
                                    <span v-if="isSelf" @click="showRenameDialog = true"
                                        style="font-size:1rem;color:var(--lightDark);cursor:pointer;"
                                        class="iconfont">&#xe618;</span>
                                </div>
                            </div>
                        </template>
                    </CustomCard>
                    <CustomCard>
                        <template #header>
                            <div class="main_info_header middle" style="font-weight: bold;">
                                <p class="title">年龄</p>
                                <div class="info_box middle" style="flex-grow: 1;">
                                    <div>
                                        <span>{{ getUserAge(user_card_info.user_info.age) }}</span>
                                    </div>
                                    <span v-if="isSelf" @click="showAgeDialog = true"
                                        style="font-size:1rem;color:var(--lightDark);cursor:pointer;"
                                        class="iconfont">&#xe618;</span>
                                </div>
                            </div>
                        </template>
                    </CustomCard>
                    <CustomCard>
                        <template #header>
                            <div class="main_info_header middle" style="font-weight: bold;">
                                <p class="title">性别</p>
                                <div class="info_box middle" style="flex-grow: 1;">
                                    <div>
                                        <span>{{ user_card_info.user_info.gender }}</span>
                                    </div>
                                    <span v-if="isSelf" @click="showGenderDialog = true"
                                        style="font-size:1rem;color:var(--lightDark);cursor:pointer;"
                                        class="iconfont">&#xe618;</span>
                                </div>
                            </div>
                        </template>
                    </CustomCard>
                    <CustomCard>
                        <template #header>
                            <div class="main_info_header middle" style="font-weight: bold;">
                                <p class="title">手机号</p>
                                <div class="info_box middle" style="flex-grow: 1;">
                                    <div>
                                        <span>{{ user_card_info.user_info.phone || '未填写' }}</span>
                                    </div>
                                    <span v-if="isSelf" @click="showPhoneDialog = true"
                                        style="font-size:1rem;color:var(--lightDark);cursor:pointer;"
                                        class="iconfont">&#xe618;</span>
                                </div>
                            </div>
                        </template>
                    </CustomCard>
                    <CustomCard>
                        <template #header>
                            <div class="main_info_header middle" style="font-weight: bold;">
                                <p class="title">状态</p>
                                <div class="info_box middle" style="flex-grow: 1;">
                                    <div>
                                        <span>{{ user_card_info.user_info.online_status }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </CustomCard>
                </div>
            </template>
        </CustomConfirm>
        <!-- 重命名 -->
        <CustomConfirm v-model="showRenameDialog" :center="true" title="用户名变更" icon="&#xe7e5;">
            <template #content>
                <CustomInput v-model="username" placeholder="请输入你要修改的用户名" />
                <CustomTips value="你输入的用户名长度必须在2~8之间" />
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="renameCallback" class="custom_button success" style="width: 100%">保存</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 年龄修改 -->
        <CustomConfirm v-model="showAgeDialog" :center="true" title="年龄变更" icon="&#xe7e5;">
            <template #content>
                <div class="age_wrapper">
                    <CustomTips value="输入你的年龄" />
                    <a-input-number v-model="age" min="0" placeholder="保密" mode="button" size="large"
                        class="input-demo" />
                    <a-radio-group v-model="age">
                        <a-radio value="保密">
                            <template #radio="{ checked }">
                                <a-space align="start" class="custom-radio-card"
                                    :class="{ 'custom-radio-card-checked': checked }">
                                    <div className="custom-radio-card-mask">
                                        <div className="custom-radio-card-mask-dot" />
                                    </div>
                                    <div>
                                        <div className="custom-radio-card-title">
                                            保密
                                        </div>
                                        <a-typography-text type="secondary">
                                            不透露你的年龄
                                        </a-typography-text>
                                    </div>
                                </a-space>
                            </template>
                        </a-radio>
                    </a-radio-group>
                </div>
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="reAgeCallback" class="custom_button success" style="width: 100%">保存</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 性别修改 -->
        <CustomConfirm v-model="showGenderDialog" :center="true" title="重新设置性别" icon="&#xe7e5;">
            <template #content>
                <CustomTips value="选择你的性别" />
                <a-radio-group v-model="gender">
                    <a-radio value="保密">
                        <template #radio="{ checked }">

                            <a-typography-text type="secondary">
                                <span class="chose_gender" v-html="getGenderParseElem('保密')"></span>
                            </a-typography-text>
                            <a-space align="start" class="custom-radio-card"
                                :class="{ 'custom-radio-card-checked': checked }">
                                <div className="custom-radio-card-mask">
                                    <div className="custom-radio-card-mask-dot" />
                                </div>
                                <div>
                                    <div className="custom-radio-card-title">
                                        保密
                                    </div>
                                </div>
                            </a-space>
                        </template>
                    </a-radio>
                    <a-radio value="男">
                        <template #radio="{ checked }">

                            <a-typography-text type="secondary">
                                <span class="chose_gender" v-html="getGenderParseElem('男')"></span>
                            </a-typography-text>
                            <a-space align="start" class="custom-radio-card"
                                :class="{ 'custom-radio-card-checked': checked }">
                                <div className="custom-radio-card-mask">
                                    <div className="custom-radio-card-mask-dot" />
                                </div>
                                <div>
                                    <div className="custom-radio-card-title">
                                        男性
                                    </div>
                                </div>
                            </a-space>

                        </template>
                    </a-radio>
                    <a-radio value="女">
                        <template #radio="{ checked }">

                            <a-typography-text type="secondary">
                                <span class="chose_gender" v-html="getGenderParseElem('女')"></span>
                            </a-typography-text>
                            <a-space align="start" class="custom-radio-card"
                                :class="{ 'custom-radio-card-checked': checked }">
                                <div className="custom-radio-card-mask">
                                    <div className="custom-radio-card-mask-dot" />
                                </div>
                                <div>
                                    <div className="custom-radio-card-title">
                                        女性
                                    </div>
                                </div>
                            </a-space>

                        </template>
                    </a-radio>
                </a-radio-group>
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="reGenderCallback" class="custom_button success" style="width: 100%">保存</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 设置简介 -->
        <CustomConfirm v-model="showIntroduceDialog" :center="true" title="自我介绍变更" icon="&#xe7e5;">
            <template #content>
                <CustomTips value="点击下方窗口以输入内容" />
                <CustomTextarea v-model="introduce" placeholder="请输入2~50字之间的自我介绍" :max-length="50" auto-size />
                <div v-show="introduce" style="width:100%;font-size:.9rem;">
                    <span style="font-weight: bold">预览(PREVIEW):</span>
                    <p>{{ introduce }}</p>
                </div>
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="reIntroduceCallback" class="custom_button success" style="width: 100%">保存</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 手机号修改 -->
        <CustomConfirm v-model="showPhoneDialog" :center="true" title="手机号变更" icon="&#xe7e5;">
            <template #content>
                <CustomTips value="输入新的手机号码"></CustomTips>
                <div class="middle" style="width:240px;flex-direction:column;">
                    <CustomInput v-model="phone" placeholder="输入的手机号" />
                    <a-input-search placeholder="输入验证码" button-text="发送验证码" search-button style="margin-top:10px;" />
                </div>
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="rePhoneCallback" class="custom_button success" style="width: 100%">保存</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 好友列表 -->
        <CustomConfirm :id="parentId" v-model="showFriendList" :center="true" icon="&#xe679;" style="width:460px;;">
            <template #custom>
                <header class="title" style="height:55px;">
                    <span class="iconfont">&#xe679;</span>
                    <span v-if="user_card_info.user_info.user_id != userStore.user_info.user_id">对方的好友</span>
                    <span v-else>你的好友</span>
                </header>
                <div class="container" style="width:100%;max-height: 500px;overflow: auto;">
                    <FriendList :friend_list="user_card_info.friend_list" :parentId="parentId"></FriendList>
                </div>
            </template>
        </CustomConfirm>
        <!-- 收藏点数 -->
        <CustomConfirm v-model="showPointDialog" :center="true" title="收藏点数" icon="&#xe64b;">
            <template #content>
                <div style="width:100%;font-size:.9rem;">
                    <CustomTips value="这是你的收藏点数,点数来源于你获得的贴纸" style="font-weight: bold;" />
                    <span style="font-weight: bold">计算方式如下:</span>
                    <ul class="custom_ul">
                        <li class="custom_li"><span
                                style="color:#5e9db1;margin-right:3px;">普通(NORMAL)</span>品质：增加<em>1</em>分</li>
                        <li class="custom_li"><span
                                style="color:#ce11fd;margin-right:3px;">稀有(RARE)</span>品质：增加<em>2</em>分
                        </li>
                        <li class="custom_li"><span
                                style="color:#bdc900;margin-right:3px;">史诗(EPIC)</span>品质：增加<em>3</em>分
                        </li>
                        <li class="custom_li"><span
                                style="color:red;margin-right:3px;">传说(LEGEND)</span>品质：增加<em>4</em>分
                        </li>
                    </ul>
                </div>
            </template>
            <template #footer>
                <div class="custom_footer">
                    <button @click="showPointDialog = false" class="custom_button success"
                        style="width: 100%">确认</button>
                </div>
            </template>
        </CustomConfirm>
        <!-- 收藏点数排行榜 -->
        <StickerRank v-model="showStickerRankDialog" :user_id="user_card_info.user_info.user_id"></StickerRank>
        <!-- 贴纸图鉴 -->
        <StickerGuide v-model="showStickerGuideDialog" :user_id="user_card_info.user_info.user_id"></StickerGuide>


        <!-- 添加好友相关 -->
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
    </template>
</template>

<script setup>
// 生成一个唯一的 ID
const parentId = 'parent-' + Math.random().toString(36).substring(2, 15);
import { ref,computed  } from 'vue';
import useUserStore from '@/stores/user.js';
import CustomAvatar from './CustomAvatar.vue';
import Message from '@/utils/customMessage.js'
import CustomConfirm from './CustomConfirm.vue';
import CustomTextarea from './CustomTextarea.vue';
import CustomArea from './CustomArea.vue';
import CustomRow from './CustomRow.vue';
import CustomTips from './CustomTips.vue';
import CustomInput from './CustomInput.vue';
import CustomCard from './CustomCard.vue';
import FriendList from './FriendList.vue';
import CustomTags from './CustomTags.vue';
import CustomStatistic from './CustomStatistic.vue';
import StickerItemByUser from './StickerItemByUser.vue';
import StickerRank from './StickerRank.vue'
import StickerGuide from './StickerGuide.vue'
import GroupManager from './GroupManager.vue';
const friend_list_elem = ref();
import { getUserAge, getConstellation, parseAllDate } from '@/utils/datetime';
import useFriendStore from '@/stores/friend';
import useAppStore from '@/stores/app';
import { onMounted } from 'vue';
import customMessage from '@/utils/customMessage.js';
const userStore = useUserStore();
const appStore = useAppStore();
const friendStore = useFriendStore();
const user_card_info = ref({})
const showAddUserDialog = ref(false);
const showGroupManagerDialog = ref(false);
const showRenameDialog = ref(false);
const form = ref({
    target_id: '',
    introduce: '',
    remark: '',
  });
const showIntroduceDialog = ref(false);
const showAgeDialog = ref(false);
const showGenderDialog = ref(false);
const showPhoneDialog = ref(false);
const showInfoDialog = ref(false);
const showFriendList = ref(false);
const showPointDialog = ref(false);
const showStickerRankDialog = ref(false);
const showStickerGuideDialog = ref(false);
const loading = ref(false);
const isSelf = ref(false);
const username = ref();
const introduce = ref();
const age = ref();
const gender = ref();
const phone = ref();
const activeStickers = ref('ALL')
const stickers_guide = ref([]);
const chose_user = ref(null);
const chose_user_group = ref('no_group');
function openUserSpace(){
    location.assign(location.origin + '/#/layout/contact/user/space?user_id=' + props.user_id);
}
const uploadAvatarSuccess = (e) => {
    const { filename, mimetype } = e.response.data;
    userStore.updateUserAvatar(filename)
    .then(msg => {
        customMessage({type:'normal',value:msg});
        userStore.userInfo();
        userStore.getUserCardInfo(props.user_id)
        .then(async temp_user_card_info => {
            const temp_stickers_guide = await userStore.userStickersGuide();
            stickers_guide.value = temp_stickers_guide;
            user_card_info.value = temp_user_card_info;
            const { user_info } = temp_user_card_info;
            username.value = user_info.username;
            phone.value = user_info.phone;
            age.value = user_info.age;
            gender.value = user_info.gender;
            introduce.value = user_info.introduce;
            loading.value = true;
            isSelf.value = temp_user_card_info.user_info.user_id == userStore.user_info.user_id
        })
    })
}
const isFriend = () => {
    return friendStore.friend_list?.some(friend => {
        return friend.friend_id == user_card_info.value.user_info.user_id
    })
}
// 显示好友添加面板
const showAddUserDialogCallback = () => {
    console.log(user_card_info.value.user_info)
    form.value.target_id = user_card_info.value.user_info.user_id;
    form.value.remark = user_card_info.value.user_info.username;
    chose_user.value = user_card_info.value.user_info;
    showAddUserDialog.value = true;
}
// 获取选中分组下的所有好友列表
const choseFriendGroupInnerList = computed(() => {
if (!chose_user_group.value) {
    return [];
} else if (chose_user_group.value == 'no_group') {
    return friendStore.friend_list;
} else {
    return friendStore.friend_list.filter(friend => {
        return chose_user_group.value.list.find(item => item.friend_relation_id == friend.friend_relation_id)
    })
}

})
// 重新读取个人信息
const reloadOnlyUserInfo = async () => {
    const user_info = await userStore.userInfoById(props.user_id);
    user_card_info.value.user_info = user_info;
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
// 重命名
const renameCallback = async (e) => {
    await userStore.updateUser({
        ...user_card_info.value.user_info,
        username: username.value
    })
        .then(msg => {
            Message({
                type: 'normal',
                value: '用户名修改成功'
            })
        }).catch(data => {
            Message({
                type: 'error',
                value: '用户名修改失败'
            })
        }).finally(() => {
            reloadOnlyUserInfo();
            showRenameDialog.value = false;
        })
}
// 修改介绍
const reIntroduceCallback = async (e) => {
    userStore.updateUser({
        ...user_card_info.value.user_info,
        introduce: introduce.value
    })
        .then(msg => {
            Message({
                type: 'normal',
                value: '自我介绍修改成功'
            })
        }).catch(data => {
            Message({
                type: 'error',
                value: '自我介绍修改失败'
            })
        }).finally(() => {
            reloadOnlyUserInfo();
            showIntroduceDialog.value = false;
        })
}
// 修改年龄
const reAgeCallback = async (e) => {
    userStore.updateUser({
        ...user_card_info.value.user_info,
        age: age.value || '保密'
    })
        .then(msg => {
            Message({
                type: 'normal',
                value: '年龄修改成功'
            })
        }).catch(data => {
            Message({
                type: 'error',
                value: '年龄修改失败'
            })
        }).finally(() => {
            reloadOnlyUserInfo();
            showAgeDialog.value = false;
        })
}
// 修改性别
const reGenderCallback = async (e) => {
    userStore.updateUser({
        ...user_card_info.value.user_info,
        gender: gender.value || '保密'
    })
        .then(msg => {
            Message({
                type: 'normal',
                value: '性别修改成功'
            })
        }).catch(data => {
            Message({
                type: 'error',
                value: '性别修改失败'
            })
        }).finally(() => {
            reloadOnlyUserInfo();
            showGenderDialog.value = false;
        })
}
// 修改手机号
const rePhoneCallback = async (e) => {
    userStore.updateUser({
        ...user_card_info.value.user_info,
        phone: phone.value || '保密'
    })
        .then(msg => {
            Message({
                type: 'normal',
                value: '手机号修改成功'
            })
        }).catch(data => {
            Message({
                type: 'error',
                value: '手机号修改失败'
            })
        }).finally(() => {
            reloadOnlyUserInfo();
            showPhoneDialog.value = false;
        })
}
// id复制
const copyId = async (e) => {
    try {
        await navigator.clipboard.writeText(user_card_info.value.user_info.user_id);
        Message({
            type: 'normal',
            value: '文本已复制到剪贴板',
            duration: 2000,
        });
    } catch (err) {
        Message({
            type: 'error',
            title: '无法复制文本',
            value: err.value,
            duration: 2000,
        });

    }
};
const props = defineProps(['user_id'])
onMounted(() => {
    userStore.userInfo();
    userStore.getUserCardInfo(props.user_id)
        .then(async temp_user_card_info => {
            const temp_stickers_guide = await userStore.userStickersGuide();
            stickers_guide.value = temp_stickers_guide;
            user_card_info.value = temp_user_card_info;
            const { user_info } = temp_user_card_info;
            username.value = user_info.username;
            phone.value = user_info.phone;
            age.value = user_info.age;
            gender.value = user_info.gender;
            introduce.value = user_info.introduce;
            loading.value = true;
            isSelf.value = temp_user_card_info.user_info.user_id == userStore.user_info.user_id
        })
})
</script>

<style lang="scss" scoped>
.user_card>.title {
    height: 100px;
    background-image: repeating-linear-gradient(50deg, var(--highBlue), rgb(0 117 236) 87px);
    background-image: url(/src/assets/images/card.jpg);
    background-size: cover;
    background-position: center;
    background-blend-mode: screen;
}

.age_wrapper {
    display: flex;
    flex-direction: column;
}

.container {
    background-color: var(--white);
    background-blend-mode: multiply;
    background-image: url(/src/assets/images/base.jpg);
    background-size: auto 100%;
    padding: 8px 10px;
    columns: var(--dark);

    * {
        vertical-align: middle;
    }

    .container_header {
        display: flex;

        .container_avatar {
            transform: translateY(-25%);
        }

        .container_base_info {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            width: 268px;

            .base_info_name {
                color: var(--dark);
                font-weight: bold;
                font-size: 1.2rem;
                line-height: 1.5;
            }

            .base_info_id {
                font-size: .8rem;
                color: var(--lightDark);
                line-height: 1;
                font-weight: bold;
            }
        }
    }

    .introduce_inner {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 300px;
    }

    .main_info_header {
        height: 34px;

        span {
            margin-left: 10px;
            font-weight: bold;
        }

        &::before {
            content: "\e695";
            font-family: 'iconfont'
        }
        &.no_icon{
            color:var(--lightDark);
            cursor: pointer;
            &:hover{
                color:var(--blue);
            }
        }
        .info_box {
            height: 70%;
            margin-left: 36px;
            border-left: 4px solid var(--dark);
            height: 50%;
            display: flex;
            justify-content: space-between;
        }
    }
}

.custom_card_content_inner {
    padding: 12px;
    min-height: 100px;

    .recent_user_list {
        padding: 0 24px;
        display: flex;

        .rencent_user_item {
            margin-right: 14px;

            dd {
                text-align: center;
                font-size: .7rem;
                font-weight: bold;
                color: var(--dark);
            }
        }
    }
}

.arco-radio {
    margin: 0;
    padding: 0;
    width: 100%;
}

.custom-radio-card {
    width: 100%;
}

.custom_hr_column {
    height: 60px;
}

.chose_gender {
    font-size: 2rem;
    font-weight: bold;
}
</style>