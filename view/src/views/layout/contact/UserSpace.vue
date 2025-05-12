<template>
    <div v-if="!loading" id="user_space" @scroll="scrollCallback" ref="user_space_elem"
        :style="{ backgroundImage: `url(${appStore.getServerImage(user_space?.user_info.space_background)})` }">
        <transition appear name="animate__animated animate_bounce" enter-active-class="slideDownReturn">
            <div class="user_space_cotainer">
                <!-- 回到顶部按钮 -->
                <transition appear name="animate__animated animate_bounce" enter-active-class="animate__fadeIn"
                    leave-active-class="animate__fadeOut">
                    <div @click="toTop" v-show="showTopButton" class="to_top custom_button success"><span
                            class="iconfont">&#xe748;</span></div>
                </transition>
                <header class="container_header">
                    <div class="container_avatar">
                        <a-popover position="right" trigger="click">
                            <CustomAvatar class="user_space_avatar" background-color="var(--white)" :circle="true"
                                :border="true" size="100px" :src="user_space.user_info.avatar"></CustomAvatar>
                            <template #content>
                                <UserCard :user_id="user_space.user_info.user_id"></UserCard>
                            </template>
                        </a-popover>

                    </div>
                    <div class="container_base_info">

                        <p class="base_info_name">
                            <span>
                                {{ user_space.user_info.username }}
                            </span>
                        </p>
                        <p class="base_info_id">
                            <span>
                                {{ user_space.user_info.introduce }}
                            </span>
                        </p>
                        <CustomTags style="margin-top:6px;" v-if="user_space.user_info.tags.length" :add="false"
                            textClass="base_info_tag" :noTips="true" :tags="user_space.user_info.tags">
                        </CustomTags>
                    </div>
                </header>
                <span @click="settingUser = true" class="setting min_button">&#xe620;</span>

                <a-drawer :visible="settingUser" @cancel="settingUser = false" :footer="false">
                    <template #title> 用户设置 </template>
                    <ul class="custom_ul options">
                        <div style="font-size:.9rem;font-weight:500;">个人设置:</div>
                        <tempalte v-if="isSelf">
                            <a-upload :show-file-list="false" :action="appStore.server + '/upload/image/'" @success="uploadSpaceCardSuccess">
                                <template #upload-button>
                                    <li class="custom_li" style="width:217px;">
                                        <span>空间背景更换</span>
                                        <span class="iconfont">&#xe634;</span>
                                    </li>
                                </template>
                            </a-upload>
                            
                            <li @click="showGlobalAuthDialog = true" class="custom_li">
                                <span>空间访问全局权限</span>
                                <span class="iconfont">&#xe634;</span>
                            </li>
                            <li @click="showBanUserList = true" class="custom_li">
                                <span>黑名单列表</span>
                                <span class="iconfont">&#xe634;</span>
                            </li>
                        </tempalte>
                        <tempalte v-else>
                            <li v-if="isFriend()" @click="showAuthDialog = true" class="custom_li">
                                <span>访问你空间的权限</span>
                                <span class="iconfont">&#xe634;</span>
                            </li>
                            <li v-if="isBan" @click="userBanRemoveCallback" class="custom_li">
                                <span>移出黑名单</span>
                                <span class="iconfont">&#xe6a7;</span>
                            </li>
                            <li v-else @click="showBanAddConfirm = true" class="custom_li ban_li">
                                <span>加入黑名单</span>
                                <span class="iconfont">&#xe71b;</span>
                            </li>
                            <li v-if="isFriend()" @click="startTalk" class="custom_li start_li">
                                <span>开始会话</span>
                                <span class="iconfont">&#xe6a7;</span>
                            </li>
                            <li v-if="!isFriend()" @click="showAddUserDialogCallback(user_space.user_info)" class="custom_li start_li">
                                <span>添加好友</span>
                                <span class="iconfont">&#xe631;</span>
                            </li>
                            <CustomConfirm v-model="showBanAddConfirm" :ok="userBanAppendCallback" title="加入黑名单" content="你确定要将对方加入黑名单吗？你将无法发送消息给对方"></CustomConfirm>
                        </tempalte>
                        <!-- 添加好友 -->
                        <CustomConfirm v-model="showAddUserDialog" :center="true" title="添加好友" icon="&#xe7e5;"
                            style="width:520px;">
                            <template #custom>
                                <header class="title" style="height:50px;">
                                    <span class="iconfont">&#xe631;</span>
                                    <span>添加好友</span>
                                </header>
                                <div class="content">
                                    <CustomTips value="在添加好友之前，你需要填写一些信息"></CustomTips>
                                    <CustomCard class="padding" title="介绍(Introduce)">
                                        <template #content>
                                            <CustomTextarea v-model="form.introduce" placeholder="介绍一下你自己吧"
                                                :max-length="40" auto-size height="50px" />
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
                                                <a-radio-group v-model="chose_user_group"
                                                    class="friend_group_select_list"
                                                    style="width:230px;overflow-y:auto;overflow-x:hidden;">
                                                    <CustomTips v-if="friendStore.friend_group?.length"
                                                        :value="'你目前创建了' + friendStore.friend_group.length + '个分组'"
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
                                                        class="custom-radio-card friend_group_manager"
                                                        :class="{ 'custom-radio-card-checked': checked }">
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
                                                        <CustomAvatar :src="chose_user.avatar" :no-border="true"
                                                            :circle="true" size="30px">
                                                        </CustomAvatar>
                                                        <span>{{ form.remark }}({{ chose_user.username }})</span>
                                                        <span class="last_text"
                                                            style="color:white;margin-right: 10px;font-size:.8rem;">将会加入</span>
                                                    </li>
                                                    <li v-for="friend in choseFriendGroupInnerList"
                                                        class="friend_group_inner_item">
                                                        <CustomAvatar :src="friend.friend_info.avatar" :no-border="true"
                                                            :circle="true" size="30px">
                                                        </CustomAvatar>
                                                        <span>{{ friend.friend_info.username }}</span>
                                                        <span class="iconfont last_text">&#xe64f;</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </template>
                                    </CustomCard>
                                    <button @click="sendFriendRequestCallback"
                                        class="custom_button custom_button_unique success">
                                        <span class="iconfont">&#xe641;</span>
                                        <span>发送</span>
                                    </button>
                                </div>
                            </template>
                        </CustomConfirm>
                        <!-- 好友分组管理器 -->
                        <GroupManager v-model="showGroupManagerDialog"></GroupManager>
                        <!-- 个人空间访问权限 -->
                        <CustomConfirm v-model="showAuthDialog" class="no_shadow" :center="true" title="个人空间访问权限"
                            icon="&#xe7e5;">
                            <template #custom>
                                <header class="title" style="height:55px;">
                                    <span class="iconfont">&#xe6a6;</span>
                                    <span>个人空间访问权限</span>
                                </header>
                                <div class="container" style="width:100%;max-height: 500px;overflow: auto;">
                                    <CustomTips value="个人空间的访问权限,应用到该好友身上" />
                                    <a-radio-group @change="userSpaceAuthByFriendCallback" v-model="friend_space_auth">
                                        <a-radio value="default">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            默认
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            一般情况下，好友能访问你的个人空间
                                                        </a-typography-text>
                                                    </div>
                                                </a-space>
                                            </template>
                                        </a-radio>
                                        <a-radio value="allow">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            特别允许
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            当你开启访问验证时，对方也能访问你的个人空间
                                                        </a-typography-text>
                                                    </div>
                                                </a-space>
                                            </template>
                                        </a-radio>
                                        <a-radio value="noPass">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            禁止访问
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            对方无法访问你的个人空间
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
                                    <button @click="reGenderCallback" class="custom_button success"
                                        style="width: 100%">保存</button>
                                </div>
                            </template>
                        </CustomConfirm>
                        <!-- 个人空间全局访问权限 -->
                        <CustomConfirm v-model="showGlobalAuthDialog" class="no_shadow" :center="true"
                            title="个人空间全局访问权限" icon="&#xe7e5;">
                            <template #custom>
                                <header class="title" style="height:55px;">
                                    <span class="iconfont">&#xe6a6;</span>
                                    <span>个人空间全局访问权限</span>
                                </header>
                                <div class="container" style="width:100%;max-height: 500px;overflow: auto;">
                                    <CustomTips value="个人空间的全局访问权限,应用到每个人身上" />
                                    <a-radio-group @change="userSpaceAuthByGlobalCallback" v-model="global_space_auth">
                                        <a-radio value="allow">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            无限制
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            所有人都能访问你的个人空间
                                                        </a-typography-text>
                                                    </div>
                                                </a-space>
                                            </template>
                                        </a-radio>
                                        <a-radio value="onlyFriend">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            仅限好友
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            只有好友能访问你的个人空间
                                                        </a-typography-text>
                                                    </div>
                                                </a-space>
                                            </template>
                                        </a-radio>
                                        <a-radio value="onlyRequest">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            访问验证
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            只有经过你允许的好友能访问你的个人空间
                                                        </a-typography-text>
                                                    </div>
                                                </a-space>
                                            </template>
                                        </a-radio>
                                        <a-radio value="noPass">
                                            <template #radio="{ checked }">
                                                <a-space align="start" class="custom-radio-card"
                                                    :class="{ 'custom-radio-card-checked': checked }">
                                                    <div>
                                                        <div className="custom-radio-card-title">
                                                            无法访问
                                                        </div>
                                                        <a-typography-text type="secondary">
                                                            任何人都无法访问你的个人空间，除了你
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
                                    <button @click="reGenderCallback" class="custom_button success"
                                        style="width: 100%">保存</button>
                                </div>
                            </template>
                        </CustomConfirm>
                        <!-- 黑名单列表 -->
                        <CustomConfirm v-model="showBanUserList" :center="true" style="width:460px;">
                            <template #custom>
                                <div class="photo_onlyUi">
                                    <header class="photo_header">
                                        <p class="photo_title">
                                            <span class="iconfont">&#xe71b;</span>
                                            <span>黑名单列表</span>
                                        </p>
                                    </header>
                                    <div v-if="user_ban_list.length" class="photo_desc" style="margin-left:20px;">
                                        对方将无法跟你对话</div>
                                    <div class="dialog"
                                        style="display:flex;width:100%;max-height: 500px;overflow: auto;align-items: center;">
                                        <ul style="width:100%;">
                                            <li v-for="ban_user in user_ban_list"
                                                style="margin-bottom:10px;display:flex;justify-content: space-between;align-items: center;width:100%;">
                                                <div style="display:flex;align-items: center">
                                                    <span class="iconfont" style="color:var(--black);">&#xe71b;</span>
                                                    <a-popover position="right" trigger="click">
                                                        <CustomAvatar size="30px" :src="ban_user.avatar" :circle="true">
                                                        </CustomAvatar>
                                                        <template #content>

                                                            <UserCard :user_id="ban_user.user_id"></UserCard>
                                                        </template>
                                                    </a-popover>
                                                    <span style="margin-left:10px;color:var(--dark);">{{
        ban_user.username }}</span>
                                                </div>
                                                <div class="thumb_at" style="color:var(--lightDark);font-size:.85rem">{{
        formatTime(ban_user.created_at) }}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="photo_footer" style="justify-content:center;">
                                        <p v-if="!user_ban_list?.length" class="no_thumb_up">黑名单无人</p>
                                        <p v-else>
                                            共{{ user_ban_list?.length }}人
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </CustomConfirm>
                    </ul>
                </a-drawer>
                <div class="no_pass_tips" v-if="user_space.pass == false">{{ user_space.msg }}</div>
                <a-tabs v-else>
                    <a-tab-pane key="主页">
                        <template #title>
                            <icon-home />
                            <span class="tab_title">主页</span>
                        </template>
                        <div class="container">
                            <div>
                                <template v-if="isSelf">
                                    <header class="header">
                                        <div>
                                            <span class="iconfont">&#xe67b;</span>
                                            <span>我的相册</span>
                                        </div>
                                    </header>
                                    <ul ref="photo_ul" @wheel="customScroll"
                                        :class="{ home_photo_list: true, first_photo: !user_space.user_photo_list.length }">
                                        <li @click="showCreatePhotoDialog = true" class="create_photo">
                                            <div>
                                                <span class="iconfont">&#xe610;</span>
                                                <span>创建一个相册</span>
                                            </div>
                                        </li>
                                        <li v-for="photo in user_space.user_photo_list"
                                            @click="showPhotoDialogCallback(photo)">
                                            <template v-if="!photo.photo_size && !photo.photo_cover">
                                                <div class="photo_empty"></div>
                                            </template>
                                            <template v-else-if="!photo.photo_cover">
                                                <div class="photo_cover"
                                                    :style="{ backgroundImage: `url(${appStore.getServerImage(photo?.image_list[0]?.image)})` }">
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="photo_cover"
                                                    :style="{ backgroundImage: `url(${appStore.getServerImage(photo.photo_cover)})` }">
                                                </div>
                                            </template>
                                            <p>
                                                <span>{{ photo.photo_name }}</span>
                                                <span class="count">
                                                    <span style="margin-right:4px;"
                                                        v-if="photo.photo_size">{{ photo.photo_size }}张</span>
                                                    <span style="margin-right:4px;" v-else>空的</span>
                                                    <span class="iconfont">&#xe89f;</span>
                                                </span>
                                            </p>
                                        </li>
                                    </ul>
                                </template>
                                <template v-else>
                                    <header class="header">
                                        <div v-if="user_space.user_photo_list.length">
                                            <span class="iconfont">&#xe67b;</span>
                                            <span>TA的相册</span>
                                        </div>
                                        <span class="tips" v-if="!user_space.user_photo_list.length">该用户还没有创建相册</span>
                                    </header>
                                    <ul ref="photo_ul" @wheel="customScroll"
                                        :class="{ home_photo_list: true, first_photo: !user_space.user_photo_list.length }">
                                        <li v-for="photo in user_space.user_photo_list"
                                            @click="showPhotoDialogCallback(photo)">
                                            <template v-if="!photo.photo_size && !photo.photo_cover">
                                                <div class="photo_empty"></div>
                                            </template>
                                            <template v-else-if="!photo.photo_cover">
                                                <div class="photo_cover"
                                                    :style="{ backgroundImage: `url(${appStore.getServerImage(photo?.image_list[0]?.image)})` }">
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="photo_cover"
                                                    :style="{ backgroundImage: `url(${appStore.getServerImage(photo.photo_cover)})` }">
                                                </div>
                                            </template>
                                            <p>
                                                <span>{{ photo.photo_name }}</span>
                                                <span class="count">
                                                    <span style="margin-right:4px;"
                                                        v-if="photo.photo_size">{{ photo.photo_size }}张</span>
                                                    <span style="margin-right:4px;" v-else>空的</span>
                                                    <span class="iconfont">&#xe89f;</span>
                                                </span>
                                            </p>
                                        </li>
                                    </ul>
                                </template>
                                <hr class="custom_hr">
                            </div>
                            <div>
                                <header class="header">
                                    <div v-if="user_space.user_moments_list.length">
                                        <span class="iconfont">&#xe677;</span>
                                        <span v-if="isSelf">我的动态</span>
                                        <span v-else>TA的动态</span>
                                    </div>
                                    <span class="tips" v-if="!user_space.user_moments_list.length">该用户还没有发布动态</span>
                                </header>
                                <div v-if="isSelf" class="text-box">
                                    <div class="box-container">
                                        <a-textarea v-model="momentsAppendContent" max-length="1500"
                                            style="width:100%;min-height:120px;" class="textarea"
                                            placeholder="发布你的今日动态吧"></a-textarea>
                                        <div>
                                            <div class="formatting">
                                                <button type="button">
                                                    <span class="iconfont">&#xe687;</span>
                                                </button>
                                                <a-upload :key="uploadKey" accept="image/*,video/*"
                                                    :file-list="fileList" :default-file-list="fileList"
                                                    @before-upload="beforeMediaUpload"
                                                    :on-before-remove="uploadMediaRemove" @success="uploadMediaSuccess"
                                                    @error="uploadMediaError"
                                                    :action="appStore.server + '/upload/media/'">
                                                    <template #upload-button>
                                                        <button type="button">
                                                            <span class="iconfont"
                                                                style="font-size:1.4rem;">&#xe71a;</span>
                                                        </button>
                                                    </template>
                                                </a-upload>
                                                <button @click="momentsAppend" type="submit" class="send" title="Send">
                                                    <span class="iconfont">&#xe692;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="upload_media_list">
                                        <template v-for="{ filename, type, minetype } in momentsUploadMediaList">
                                            <a-image v-if="type == 'image'" :src="appStore.getServerMedia(filename)"
                                                height="240px"
                                                style="max-width:300px;margin-right:4px;padding: 6px;border: 1px solid var(--blue);border-radius: 5px;" />
                                            <div v-else-if="type == 'video'" @fullscreenchange="handleFullscreenChange"
                                                style="max-width:400px;height:240px;">
                                                <video :ref="el => players.push(el)" playsinline controls
                                                    class="js-plyr">
                                                    <source :src="appStore.getServerMedia(filename)" :type="minetype" />
                                                </video>
                                            </div>
                                        </template>
                                    </div>
                                    <header v-if="momentsUploadMediaList.length" style="color:var(--lightDark)">
                                        <span class="iconfont" style="margin-right:4px;">&#xe6f4;</span>
                                        <span>{{ momentsUploadMediaList.length }}/3</span>
                                    </header>
                                </div>
                                <hr v-if="isSelf" class="custom_hr">

                                <ul>
                                    <MomentsCard :remove="momentsRemove" v-for="moments in user_space.user_moments_list" :used_sticker="used_sticker"
                                        :moments>
                                    </MomentsCard>
                                </ul>
                                <hr class="custom_hr">
                            </div>
                            <div>
                                <header class="header">
                                    <div>
                                        <span class="iconfont"></span>
                                        <span v-if="isSelf">我的访客</span>
                                        <span v-else>TA的访客</span>
                                    </div>
                                    <span class="tips" v-if="!user_space.user_visit_list.length">你是第一个访问的</span>
                                </header>
                                <div class="custom_ul" v-for="(visits, group) in groupedVisits" :key="group">
                                    <header class="header custom_li">
                                        <div>
                                            <span>{{ group }} <span style="color:var(--lightDark);">({{ visits.length
                                                    }}人)</span></span>
                                        </div>
                                    </header>
                                    <ul style="display:flex;flex-wrap:wrap;padding:10px;">
                                        <a-popover v-for="visit_user in visits" position="right" trigger="click">
                                            <li class="visit_item" :key="visit_user.id">
                                                <CustomAvatar background-color="var(--white)"
                                                    :src="visit_user.visit_info.avatar">
                                                </CustomAvatar>
                                                <p>{{ visit_user.visit_info.username }}</p>
                                            </li>
                                            <template #content>
                                                <UserCard :user_id="visit_user.visit_info.user_id"></UserCard>
                                            </template>
                                        </a-popover>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="动态">
                        <template #title>
                            <icon-calendar />
                            <span class="tab_title">动态</span>
                        </template>
                        <div class="container">
                            <div>
                                <header class="header">
                                    <div>
                                        <span class="iconfont">&#xe677;</span>
                                        <span v-if="isSelf">我的动态</span>
                                        <span v-else>TA的动态</span>
                                    </div>
                                    <span class="tips" v-if="!user_space.user_moments_list.length">该用户还没有发布动态</span>
                                </header>
                                <div v-if="isSelf" class="text-box">
                                    <div class="box-container">
                                        <a-textarea v-model="momentsAppendContent" max-length="1500"
                                            style="width:100%;min-height:120px;" class="textarea"
                                            placeholder="发布你的今日动态吧"></a-textarea>
                                        <div>
                                            <div class="formatting">
                                                <button type="button">
                                                    <span class="iconfont">&#xe687;</span>
                                                </button>
                                                <a-upload :key="uploadKey" accept="image/*,video/*"
                                                    :file-list="fileList" :default-file-list="fileList"
                                                    @before-upload="beforeMediaUpload"
                                                    :on-before-remove="uploadMediaRemove" @success="uploadMediaSuccess"
                                                    @error="uploadMediaError"
                                                    :action="appStore.server + '/upload/media/'">
                                                    <template #upload-button>
                                                        <button type="button">
                                                            <span class="iconfont"
                                                                style="font-size:1.4rem;">&#xe71a;</span>
                                                        </button>
                                                    </template>
                                                </a-upload>
                                                <button @click="momentsAppend" type="submit" class="send" title="Send">
                                                    <span class="iconfont">&#xe692;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="upload_media_list">
                                        <template v-for="{ filename, type, minetype } in momentsUploadMediaList">
                                            <a-image v-if="type == 'image'" :src="appStore.getServerMedia(filename)"
                                                height="240px"
                                                style="max-width:300px;margin-right:4px;padding: 6px;border: 1px solid var(--blue);border-radius: 5px;" />
                                            <div v-else-if="type == 'video'" @fullscreenchange="handleFullscreenChange"
                                                style="max-width:400px;height:240px;">
                                                <video :ref="el => players.push(el)" playsinline controls
                                                    class="js-plyr">
                                                    <source :src="appStore.getServerMedia(filename)" :type="minetype" />
                                                </video>
                                            </div>
                                        </template>
                                    </div>
                                    <header v-if="momentsUploadMediaList.length" style="color:var(--lightDark)">
                                        <span class="iconfont" style="margin-right:4px;">&#xe6f4;</span>
                                        <span>{{ momentsUploadMediaList.length }}/3</span>
                                    </header>
                                </div>
                                <hr v-if="isSelf" class="custom_hr">
                                <ul>
                                    <MomentsCard :remove="momentsRemove" v-for="moments in user_space.user_moments_list"
                                        :moments>
                                    </MomentsCard>
                                </ul>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="个人相册">
                        <template #title>
                            <icon-image />
                            <span class="tab_title">个人相册</span>
                        </template>
                        <div class="container">

                            <header class="header">
                                <div>
                                    <span class="iconfont">&#xe67b;</span>
                                    <span>相册列表({{ user_space.user_photo_list.length }}册)</span>
                                </div>
                            </header>
                            <ul
                                :class="{ home_photo_list: true, column: true, first_photo: !user_space.user_photo_list.length }">
                                <li v-for="photo in user_space.user_photo_list" @click="showPhotoDialogCallback(photo)">
                                    <template v-if="!photo.photo_size && !photo.photo_cover">
                                        <div class="photo_empty"></div>
                                    </template>
                                    <template v-else-if="!photo.photo_cover">
                                        <div class="photo_cover"
                                            :style="{ backgroundImage: `url(${appStore.getServerImage(photo?.image_list[0]?.image)})` }">
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="photo_cover"
                                            :style="{ backgroundImage: `url(${appStore.getServerImage(photo.photo_cover)})` }">
                                        </div>
                                    </template>
                                    <p>
                                        <span>{{ photo.photo_name }}</span>
                                        <span class="count">
                                            <div style="display:flex;justify-content: space-between">
                                                <div>

                                                    <span style="margin-right:4px;"
                                                        v-if="photo.photo_size">{{ photo.photo_size
                                                        }}张</span>
                                                    <span style="margin-right:4px;" v-else>空的</span>
                                                    <span class="iconfont">&#xe89f;</span>
                                                </div>
                                                <span style="font-size:.9rem;">
                                                    <span>{{ adapParseDate(photo.created_at) }}</span>
                                                    <span class="iconfont" style="margin-left:4px;">&#xe63a;</span>
                                                </span>
                                            </div>
                                        </span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="访客记录">
                        <template #title>
                            <icon-clock-circle />
                            <span class="tab_title">访客记录({{ user_space.user_visit_list.length }}人)</span>
                        </template>
                        <div class="container">
                            <div class="custom_ul" v-for="(visits, group) in groupedVisits" :key="group">
                                <header class="header custom_li">
                                    <div>
                                        <span>{{ group }} <span style="color:var(--lightDark);">({{ visits.length
                                                }}人)</span></span>
                                    </div>
                                </header>
                                <ul style="display:flex;flex-wrap:wrap;padding:10px;">
                                    <a-popover v-for="visit_user in visits" position="right" trigger="click">
                                        <li class="visit_item" :key="visit_user.id">
                                            <CustomAvatar background-color="var(--white)"
                                                :src="visit_user.visit_info.avatar">
                                            </CustomAvatar>
                                            <p>{{ visit_user.visit_info.username }}</p>
                                        </li>
                                        <template #content>
                                            <UserCard :user_id="visit_user.visit_info.user_id"></UserCard>
                                        </template>
                                    </a-popover>
                                </ul>
                            </div>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>

        </transition>
    </div>
    <CustomConfirm v-model="showCreatePhotoDialog" :center="true" style="width:460px;">
        <template #custom>
            <div class="photo_onlyUi">
                <header class="photo_header">
                    <p class="photo_title">
                        <span class="iconfont">&#xe89f;</span>
                        <span>创建相册</span>
                    </p>
                </header>
                <div class="dialog" style="display:flex;width:100%;max-height: 500px;overflow: auto;">
                    <a-upload accept="image/*" @success="successUploadCreatePhotoCover"
                        :action="appStore.server + '/upload/image/'" :show-file-list="false">
                        <template #upload-button>
                            <div :class="{ photo_empty: !photoCreateForm.photo_cover, photo_cover: photoCreateForm.photo_cover }"
                                :style="{ backgroundImage: `url(${appStore.getServerImage(photoCreateForm?.photo_cover)})`, width: '250px', height: '165px' }">
                            </div>
                        </template>
                    </a-upload>
                    <div style="margin-left:10px;">
                        <CustomCard title="相册名">
                            <template #content>
                                <a-input v-model="photoCreateForm.photo_name" placeholder="最多不超过12字"
                                    max-length="12"></a-input>
                            </template>
                        </CustomCard>
                        <CustomCard title="相册简介">
                            <template #content>
                                <a-textarea v-model="photoCreateForm.photo_desc" max-length="50"
                                    placeholder="最多不超过50字"></a-textarea>
                            </template>
                        </CustomCard>
                    </div>
                </div>
                <div class="photo_footer" style="justify-content:center;">
                    <!-- 按钮 -->
                    <span @click="userPhotoCreateCallback" style="margin:0 40px;cursor:pointer;">
                        <span class="iconfont">&#xe641;</span>
                        <span>确认</span>
                    </span>
                    <span @click="showCreatePhotoDialog = false" style="margin:0 40px;cursor:pointer;">
                        <span>取消</span>
                        <span class="iconfont">&#xe867</span>
                    </span>
                </div>
            </div>
        </template>
    </CustomConfirm>
    <CustomConfirm v-model="showPhotoDialog" :center="true" style="width:760px;">
        <template #custom>
            <div class="photo">
                <header class="photo_header">
                    <p class="photo_title"><span class="iconfont">&#xe67b;</span>{{ showPhotoForm.photo_name }}</p>
                    <span class="photo_info">{{ showPhotoForm.photo_size }}张照片</span>
                </header>
                <hr class="custom_hr">
                <div class="photo_mid">
                    <p class="photo_desc">{{ showPhotoForm.photo_desc }}</p>
                </div>
                <ul class="photo_list">
                    <span v-if="!showPhotoForm.photo_size" class="photo_tips">
                        <span class="iconfont">&#xe673;</span>
                        <br>
                        <span>这个相册还没有存放图片</span>
                    </span>
                    <div v-for="(group, key) in groupPhotosByDate(showPhotoForm.image_list)">
                        <h3 class="photo_date">{{ key }}</h3>
                        <a-image v-for="image in group" :src='appStore.getServerImage(image.image)' width="100"
                            style="margin-right: 17px;width: 100px;height: 100px;margin-bottom:10px; vertical-align: top;border-radius:6px;"
                            footer-position="inner" :preview-visible="image.visible"
                            @preview-visible-change="() => { image.visible = false }">
                            <template #extra>
                                <span @click="() => { image.visible = true }"
                                    class="action iconfont preview-icon">&#xe7d0;</span>
                                <span v-if="isSelf" @click="userPhotoRemoveCallback(image)"
                                    class="action iconfont del">&#xe652;</span>
                            </template>
                        </a-image>
                    </div>
                </ul>
                <div class="photo_footer">
                    <div v-if="isSelf">
                        <a-upload accept="image/*" @success="userPhotoAppendCallback"
                            :action="appStore.server + '/upload/image/'" :show-file-list="false">
                            <template #upload-button>
                                <span class="iconfont">&#xe681;</span>
                                <span>上传图片</span>
                            </template>
                        </a-upload>
                    </div>
                    <div v-if="isSelf" @click="showPhotoDrawerCallback">
                        <span class="iconfont">&#xe7e5;</span>
                        <span>编辑相册</span>
                    </div>
                </div>
            </div>
            <a-drawer popup-container=".photo" :visible="visible" @cancel="visible = false">
                <template #title> 编辑相册 </template>
                <CustomCard title="更换封面">
                    <template #content>
                        <div style="padding:10px;">

                            <a-upload accept="image/*" style="width:100%" @success="successUploadUpdatePhotoCover"
                                :action="appStore.server + '/upload/image/'" :show-file-list="false">
                                <template #upload-button>
                                    <div :class="{ photo_empty: !photoUpdateForm.photo_cover, photo_cover: photoUpdateForm.photo_cover }"
                                        :style="{ backgroundImage: `url(${appStore.getServerImage(photoUpdateForm?.photo_cover)})`, width: '100%' }">
                                    </div>
                                </template>
                            </a-upload>
                        </div>
                    </template>
                </CustomCard>
                <CustomCard title="修改相册名">
                    <template #content>
                        <a-input v-model="photoUpdateForm.photo_name" max-length="50" placeholder="最多不超过50字"></a-input>
                    </template>
                </CustomCard>
                <CustomCard title="修改简介">
                    <template #content>
                        <a-textarea v-model="photoUpdateForm.photo_desc" max-length="50"
                            placeholder="最多不超过50字"></a-textarea>
                    </template>
                </CustomCard>

                <template #footer>
                    <div class="center">
                        <button @click="updatePhotoCallback" class="custom_button">保存修改</button>
                        <button @click="showDelPhotoConfirm = true" class="custom_button danger">删除相册</button>
                    </div>
                </template>
            </a-drawer>
        </template>
    </CustomConfirm>
    <CustomConfirm v-model="showDelPhotoConfirm" :ok="delPhotoCallback" title="删除相册"
        content="你确定要删除相册吗？这将<em style='color:var(--red)'>清空你相册中的所有图片</em>"></CustomConfirm>
    <CustomConfirm v-model="showDelMomentsfirm" :ok="momentsRemoveHandler" title="删除动态" content="你确定要删除这条动态吗？">
    </CustomConfirm>

</template>

<script setup>
import Plyr from 'plyr';
import CustomAvatar from '@/components/CustomAvatar.vue';
import CustomTags from '@/components/CustomTags.vue';
import CustomCard from '@/components/CustomCard.vue';
import useUserStore from '@/stores/user';
import useFriendStore from '@/stores/friend';
import useAppStore from '@/stores/app';
import CustomConfirm from '@/components/CustomConfirm.vue';
import CustomTips from '@/components/CustomTips.vue';
import GroupManager from '@/components/GroupManager.vue';
import MomentsCard from '@/components/MomentsCard.vue';
import CustomTextarea from '@/components/CustomTextarea.vue';
import CustomInput from '@/components/CustomInput.vue';
import { adapParseDate, formatTime } from '@/utils/datetime.js';
import UserCard from '@/components/UserCard.vue';
import { onMounted, ref, toRaw, watch, reactive, nextTick, computed } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate,useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import customMessage from '@/utils/customMessage';
import useRoomStore from '@/stores/room';

const roomStore = useRoomStore();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const friendStore = useFriendStore();
const appStore = useAppStore();
const friend_space_auth = ref('');
const global_space_auth = ref('');
const user_id = ref(null);
const user_space = ref();
const loading = ref(true)
const type = ref();
const isSelf = ref(false);
const showBanUserList = ref(false);
const showDelMomentsfirm = ref(false);
const showGlobalAuthDialog = ref(false);
const showAuthDialog = ref(false);
const showBanAddConfirm = ref(false);
const players = reactive([]);
const momentsUploadMediaList = reactive([]);
const uploadKey = ref(0);
const showTopButton = ref(false);
const user_space_elem = ref();
const settingUser = ref(false);
const user_ban_list = ref();
const showAddUserDialog = ref(false);
const showGroupManagerDialog = ref(false);
const chose_user = ref();
const chose_user_group = ref();
const form = ref({

})

async function startTalk(){
  if(!type.value) return;
  const room_id = await roomStore.getRoomIdByFriend(user_space.value.user_info.user_id);
  const room_info = await roomStore.appendRoom(room_id);
  // 跳转到聊天界面
  router.push('/layout/chat/room?room_id=' + room_info.room_id);
}
const sendFriendRequestCallback = () => {
    friendStore.sendFriendRequest({ ...toRaw(form.value), friend_group_id: chose_user_group?.value?.friend_group_id })
        .then(data => customMessage({ type: 'normal', value: data }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(() => {
            showAddUserDialog.value = false;
        })
}
// 显示好友添加面板
const showAddUserDialogCallback = (user) => {
    form.value.target_id = user.user_id;
    form.value.remark = user.username;
    chose_user.value = user;
    showAddUserDialog.value = true;
}
const isBan = computed(() => {
    if (!user_ban_list.value?.length) return;
    return user_ban_list.value.some(ban_user => ban_user.user_id == user_id.value)
})
const isFriend = () => friendStore.friend_list.find(friend => {
    return friend.friend_id == user_id.value;
})
const userBanAppendCallback = () => {
    userStore.userBanAppend(user_id.value)
        .then(msg => {
            customMessage({ type: 'normal', value: msg })
            reload();
        })
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
const userBanRemoveCallback = () => {
    userStore.userBanRemove(user_id.value)
        .then(msg => {
            customMessage({ type: 'normal', value: msg })
            reload();
        })
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
const userSpaceAuthByFriendCallback = (value) => {
    userStore.userSpaceAuthByFriend({ friend_id: user_id.value, space_auth: value })
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
const userSpaceAuthByGlobalCallback = (value) => {
    userStore.userSpaceAuthByGlobal(value)
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
const scrollCallback = e => {
    showTopButton.value = e.target.scrollTop > 400;
}
const toTop = e => {
    user_space_elem.value.scrollTo({ behavior: 'smooth', top: 0 });
}
const removeMomentsId = ref();
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
const uploadSpaceCardSuccess = (e) => {
    const { filename, mimetype } = e.response.data;

    userStore.updateSpaceCard(filename)
    .then((msg) => {
        customMessage({type:'normal',value:msg})
        reload();
    })
}
// 发送动态的文本内容
const momentsAppendContent = ref('');
// 发送动态
const momentsAppend = () => {
    if (!momentsAppendContent.value.trim()) return customMessage({ type: 'error', value: '发送的动态内容不能为空' });
    userStore.userSpaceMomentsAppend({ content: momentsAppendContent.value, moments_media_list: toRaw(momentsUploadMediaList) })
        .then(msg => {
            customMessage({ type: 'normal', value: msg });
            momentsAppendContent.value = '';
            momentsUploadMediaList.splice(0, momentsUploadMediaList.length);
            players.splice(0, players.length);
            // 动态改变key以重新挂载媒体上传组件
            uploadKey.value++;
            reloadMomments();
        })
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
// 删除动态
const momentsRemove = (comments_id) => {
    showDelMomentsfirm.value = true;
    removeMomentsId.value = comments_id
}
const momentsRemoveHandler = () => {
    userStore.userSpaceMomentsRemove(removeMomentsId.value)
        .then(msg => {
            customMessage({ type: 'normal', value: msg });
            momentsAppendContent.value = '';
            momentsUploadMediaList.splice(0, momentsUploadMediaList.length);
            players.splice(0, players.length);
            // 动态改变key以重新挂载媒体上传组件
            uploadKey.value++;
            reloadMomments();
        })
        .catch(data => customMessage({ type: 'error', value: data.msg }))
}
const groupedVisits = computed(() => {
    const grouped = {};
    user_space.value.user_visit_list.forEach(visit_user => {
        const group = getTimeGroup(visit_user.visited_at);
        if (!grouped[group]) {
            grouped[group] = [];
        }
        grouped[group].push(visit_user);
    });
    return grouped;
})
// 获取访客时间记录
const getTimeGroup = (visitedAt) => {
    const now = new Date();
    const visitDate = new Date(visitedAt);
    const diffTime = now - visitDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return '今天';
    } else if (diffDays === 1) {
        return '1天前';
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else if (diffDays < 14) {
        return '1周前';
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}周前`;
    } else if (diffDays < 45) {
        return '半个月前';
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months}月前`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years}年前`;
    }
}
// 视频相关事件
const handleFullscreenChange = (e) => {
    const video = e.target.querySelector('video');
    const plyr = video.plyr;
    if (plyr.fullscreen.active) {
        showVideoCtrls(video.parentElement.parentElement);
    } else {
        hiddenVideoCtrls(video.parentElement.parentElement);
    }
}

// 删除媒体回调
const uploadMediaRemove = (e) => {
    const obj = momentsUploadMediaList.find(media => media.filename == e.response.data.filename);
    return momentsUploadMediaList.splice(obj, 1);
}
// 隐藏控件
const hiddenVideoCtrls = (elem) => {
    elem.querySelector('.plyr__progress__container').hidden = true;
    elem.querySelector('.plyr__time').hidden = true;
    elem.querySelector('.plyr__volume').hidden = true;
    elem.querySelector('.plyr__control').hidden = true;
}
// 显示控件
const showVideoCtrls = (elem) => {
    elem.querySelector('.plyr__progress__container').hidden = false;
    elem.querySelector('.plyr__time').hidden = false;
    elem.querySelector('.plyr__volume').hidden = false;
    elem.querySelector('.plyr__control').hidden = false;
}
// 媒体上传前的校验
const beforeMediaUpload = (e) => {
    if (momentsUploadMediaList.length >= 3) {
        customMessage({ type: 'error', value: '上传失败！最多只能上传3个媒体文件' })
        return false;
    } else {
        return true;
    }
}
const uploadMediaSuccess = (e) => {
    const { filename, mimetype } = e.response.data;
    let type;
    if (mimetype.includes('video')) {
        type = 'video';
        nextTick(() => {
            const res = players[players.length - 1].plyr = new Plyr(players[players.length - 1], {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            });
            hiddenVideoCtrls(players[players.length - 1].parentElement.parentElement);
        })
    } else if (mimetype.includes('image')) {
        type = 'image';
    }
    momentsUploadMediaList.push({
        filename,
        type,
        media_type: type,
    });
};
const uploadMediaError = (e) => {
    customMessage({ type: 'error', value: '上传失败，图片不能超过30MB，视频不能超过100MB' })
};

const showPhotoDialog = ref(false);
const showCreatePhotoDialog = ref(false);
const visible = ref(false);
const showDelPhotoConfirm = ref(false);
const photo_ul = ref();
watch(() => showPhotoDialog.value, (newVal) => {
    if (!newVal) visible.value = false;
})
const photoCreateForm = ref({
    photo_cover: '',
    photo_name: '',
    photo_desc: '',
})
const photoUpdateForm = ref({
    photo_id: '',
    photo_cover: '',
    photo_name: '',
    photo_desc: '',
})
const customScroll = (e) => {
    if (photo_ul.value.scrollWidth == photo_ul.value.offsetWidth) return;
    // 阻止默认事件（即阻止页面滚动）
    e.preventDefault();
    // 根据鼠标滚轮的滚动方向，计算滚动量
    const scrollAmount = e.deltaY > 0 ? 50 : -50;
    // 应用滚动到a元素
    photo_ul.value.scrollLeft += scrollAmount;
}
// 图片日期分组函数
function groupPhotosByDate(photos) {
    const groupedPhotos = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisYear = now.getFullYear();

    photos.forEach(photo => {
        const date = new Date(photo.upload_at);
        let formattedDate;

        // 检查是否是今天
        if (date.toDateString() === today.toDateString()) {
            formattedDate = '今天';
        } else if (date.getFullYear() === thisYear) { // 检查是否是今年
            formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
        } else { // 不是今年
            formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        }

        // 将图片添加到对应日期的分组中
        if (!groupedPhotos[formattedDate]) {
            groupedPhotos[formattedDate] = [];
        }
        groupedPhotos[formattedDate].push(photo);
    });

    return groupedPhotos;
}
const successUploadUpdatePhotoCover = (e) => {
    const { filename } = e.response.data;
    photoUpdateForm.value.photo_cover = filename;

}
const successUploadCreatePhotoCover = (e) => {
    const { filename, webPath } = e.response.data;
    photoCreateForm.value.photo_cover = filename;
}
const showPhotoForm = ref(null)
const showPhotoDialogCallback = (photo) => {
    showPhotoForm.value = photo;
    showPhotoDialog.value = true;
}
const showPhotoDrawerCallback = () => {
    photoUpdateForm.value.photo_cover = showPhotoForm.value.photo_cover;
    photoUpdateForm.value.photo_id = showPhotoForm.value.photo_id;
    photoUpdateForm.value.photo_name = showPhotoForm.value.photo_name;
    photoUpdateForm.value.photo_desc = showPhotoForm.value.photo_desc;
    visible.value = true;
}
// 创建回调
const userPhotoCreateCallback = () => {
    const { photo_name, photo_desc } = photoCreateForm.value;
    if (!photo_name.trim() || !photo_desc.trim()) customMessage({ type: 'error', value: '请填写完表单' });

    userStore.userPhotoCreate(toRaw(photoCreateForm.value))
        .then(msg => customMessage({ type: 'normal', value: msg }))
        .catch(data => customMessage({ type: 'error', value: data.msg }))
        .finally(async () => {
            await reloadPhoto();
            showCreatePhotoDialog.value = false;
        })
}
// 上传回调
const userPhotoAppendCallback = (e) => {
    const data = e.response.data;
    userStore.userPhotoAppend({ photo_id: showPhotoForm.value.photo_id, image: data.filename })
        .then(async () => {
            customMessage({ type: 'normal', value: '上传成功' })
            await reloadPhoto();
        })
}
// 删除图片回调
const userPhotoRemoveCallback = (image) => {
    userStore.userPhotoRemove({ photo_id: image.photo_id, image_id: image.image_id })
        .then(async msg => {
            customMessage({ type: 'normal', value: msg });
            await reloadPhoto();
        })
        .catch(data => {
            customMessage({ type: 'error', value: data.msg })
        })
}
// 删除相册回调
const delPhotoCallback = () => {
    userStore.userPhotoDelete(showPhotoForm.value.photo_id)
        .then(async msg => {
            customMessage({ type: 'normal', value: msg });
            showPhotoDialog.value = false;
            visible.value = false;
            await reloadPhoto();
        })
        .catch(data => {
            customMessage({ type: 'error', value: data.msg })
        })
}
// 修改回调
const updatePhotoCallback = () => {
    userStore.userPhotoUpdate(toRaw(photoUpdateForm.value))
        .then(async msg => {
            customMessage({ type: 'normal', value: msg });
            visible.value = false;
            await reloadPhoto();
        })
        .catch(data => {
            customMessage({ type: 'error', value: data.msg })
        })
}
const reloadPhoto = async () => {
    user_space.value.user_photo_list = await userStore.userPhotoList(user_id.value);
    if (showPhotoForm.value) {
        showPhotoForm.value = user_space.value.user_photo_list.find(photo => photo.photo_id == showPhotoForm.value.photo_id);
    }
}
const reloadMomments = async () => {
    console.log(user_space.value.user_moments_list)
    user_space.value.user_moments_list = await userStore.userSpaceMomentsList(user_id.value);
    console.log(user_space.value.user_moments_list)
}
const used_sticker = ref({});
const reload = async () => {
    loading.value = true;
    friendStore.open_friend_space = user_id.value;
    user_space.value = await userStore.getUserSpace(user_id.value);
    isSelf.value = userStore.user_info.user_id == user_id.value;
    loading.value = false;
    const friend = isFriend();
    if (friend) {
        friend_space_auth.value = friend.space_auth;
    } else if (isSelf) {
        global_space_auth.value = userStore.user_info.space_auth;
    }
    user_ban_list.value = await userStore.userBanList()
    const temp_used_sticker = await userStore.getUsedSticker(user_id.value);
    used_sticker.value = temp_used_sticker;
}
onMounted(async () => {
    user_id.value = route.query.user_id;
    type.value = route.query.type;
    await reload();
})
onBeforeRouteUpdate(async (to, from) => {
    user_id.value = to.query.user_id;
    type.value = to.query.type;
    await reload();
    settingUser.value = showBanUserList.value = false;
})
onBeforeRouteLeave(() => {
    loading.value = true;
})
</script>

<style lang="scss" scoped>
.no_pass_tips {
    position: absolute;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    color: var(--dark);
    font-size: 1.1rem;
    font-weight: bold;

    &::before {
        content: "\e6a8";
        font-family: "iconfont";
        font-size: 2rem;
        vertical-align: -4px;
        margin-right: 8px;
    }
}

.custom_ul.options {
    margin-left: 0;

    .custom_li {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        padding: 6px 10px;
        // background-color: var(--formColor);
        border-radius: 6px;
        box-shadow: 3px 3px 0px var(--blue);
        border: 1px solid var(--blue);
        cursor: pointer;

        &:hover {
            background-color: var(--highBlue);
            color: var(--white);
            box-shadow: 3px 3px 0px var(--darkBlue);
        }

        &.start_li {
            background-color: var(--blue);
            color: var(--white);
            box-shadow: 3px 3px 0px var(--darkBlue);
        }
    }

    .ban_li {
        background-color: var(--black);
        color: var(--white);
        box-shadow: 3px 3px 0px var(--lightDark);
    }
}

.to_top {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 30px;
    text-align: center;
    line-height: 40px;
    position: fixed;
    bottom: 30px;
    right: 50px;
    z-index: 1;
}

.visit_item {
    cursor: pointer;
    box-shadow: 0 0 4px var(--blue);
    flex-shrink: 0;
    margin-right: 20px;
    padding: 4px;
    width: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 124px;
    box-shadow: 0 0 4px var(--light);
    justify-content: center;
    border-radius: 8px;
    background-color: var(--formColor);
    color: var(--dark);
    font-weight: 500;

    &:hover {
        background-color: var(--blue);
        color: var(--white);
    }
}

.upload_media_list {
    display: flex;

    >div {
        margin-right: 10px;
        border-radius: 6px;
        overflow: hidden;
    }
}

.home_photo_list.column {
    flex-direction: column;

    li {
        width: 100%;
        flex-direction: row;
        padding: 10px;
        border-bottom: 1px solid var(--light);
        border-radius: 0;
        margin: 0;

        p {
            display: flex;
            flex-direction: column;
            flex-grow: 1;

            >:first-child {
                font-size: 1.4rem;
            }
        }
    }
}

.photo,
.photo_onlyUi {
    width: 100%;
    padding: 20px;
    position: relative;
    overflow: hidden;
    padding-bottom: 60px;

    .actions-inner {
        display: flex;
        justify-content: end;

        .del {
            margin-left: 10px;
            color: var(--red);
        }
    }

    .photo_footer {
        padding: 0 10px;
        position: absolute;
        left: 0px;
        bottom: 0px;
        height: 50px;
        width: 100%;
        border-top: 1px solid var(--light);
        // background-color: var(--someWhite);
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        color: var(--dark);
        display: flex;
        justify-content: space-around;
        align-items: center;

        >div {
            cursor: pointer;
            line-height: 1;
            text-align: center;
            color: var(--black);

            &:hover {
                color: var(--blue);
            }

            :first-child {
                font-size: 1.2rem;
            }

            :last-child {
                margin-top: 4px;
                font-size: .8rem;
            }
        }
    }

    .photo_header,
    .photo_mid,
    .photo_list {
        color: var(--dark);
    }

    .photo_list {
        position: relative;
        min-height: 400px;
        max-height: 500px;
        overflow-y: auto;

        .photo_tips {
            position: absolute;
            top: 50%;
            width: 100%;
            transform: translateY(-50%);
            text-align: center;

            .iconfont {
                color: var(--lightDark);
                font-size: 5rem;
            }
        }
    }

    .photo_header {
        height: 100px;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
    }

    .photo_title {
        font-size: 1.6rem;
        font-weight: bold;
        color: var(--black);
    }

    .photo_info,
    .photo_desc {
        color: var(--lightDark);
        font-size: .9rem;
    }

    .photo_desc {
        margin-top: 5px;
    }

    .photo_date {
        margin: 10px 0;
        font-size: .95rem;
        color: var(--black);
    }
}

.photo_onlyUi {
    .photo_header {
        height: 60px;
    }

    .photo_footer span {
        &:hover {
            color: var(--blue);
        }
    }
}

.dialog {
    padding: 15px;
    align-items: center;
}

.photo_cover {
    background-size: cover;
    width: 220px;
    height: 150px;
    border-radius: 6px;
    box-shadow: 0 0 8px var(--light);
}

.photo_empty {
    width: 250px;
    height: 165px;
    background-color: var(--formColor);
    border-radius: 6px;
    position: relative;
    box-shadow: 0 0 2px var(--light);

    &::before {
        content: "\e673";
        font-family: 'iconfont';
        color: var(--lightDark);
        font-size: 2.5rem;
        position: absolute;
        top: 50%;
        width: 100%;
        text-align: center;
        transform: translateY(-50%);
    }
}

// 相册
.home_photo_list {
    display: flex;
    overflow-x: auto;

    &.first_photo {
        background-image: url(/src/assets/images/photo_tips.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: right;
    }

    .photo_empty,
    .create_photo {
        height: 150px;
    }

    .create_photo {
        width: 250px;
    }

    .photo_empty {
        width: 220px;

        &:hover {
            border: 1px solid var(--blue);
        }
    }

    &::-webkit-scrollbar {
        height: 3px;
    }

    li {
        flex-shrink: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 220px;
        // background-color: var(--formColor);
        border-radius: 6px;
        margin-right: 10px;
        cursor: pointer;

        p {
            padding-left: 6px;
            font-size: 1rem;
            color: var(--dark);
            display: flex;
            justify-content: space-between;

            .count {
                font-size: .9rem;
                color: var(--lightDark)
            }
        }
    }

    .create_photo {
        border: 2px dashed var(--light);
        position: relative;
        color: var(--lightDark);
        cursor: pointer;

        &:hover {
            color: var(--blue);
            border-color: var(--blue);
        }

        >div {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;

            .iconfont {
                font-size: 1.5rem;
            }
        }
    }
}


.container {
    padding: 0 10px;
    padding-bottom: 40px;

    .custom_hr {
        margin: 10px 0;
    }

    .header {
        display: flex;
        height: 45px;
        font-size: 1.1rem;
        color: var(--dark);
        position: relative;

        .iconfont {
            margin-right: 4px;
        }

        .tips {
            top: 5px;
            font-size: .9rem;
            color: var(--lightDark);
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}

#user_space {
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

.user_space_avatar {
    background-color: var(--blue) !important;
    border: 4px solid var(--white) !important;
    box-shadow: 0 0 10px var(--blue) !important;
}

.user_space_cotainer {
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

.container_header {
    display: flex;
    position: absolute;
    top: 0px;
    transform: translateY(-130%);
    left: 30px;

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

.tab_title {
    margin-left: 4px;
}
</style>