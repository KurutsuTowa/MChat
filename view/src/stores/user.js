import { defineStore } from "pinia";
import { ref } from "vue";
import { 
    userLoginRequest,userRegisterRequest,userInfoRequest,userInfoByIdRequest,userSearchRequest,userSpaceRequest,userUpdateRequest,
    userTagTopRequest, userTagInfoRequest,userTagAddRequest,userTagRemoveRequest,userStickersRequest,userStickersGuideRequest,userStickersInfoRequest,userStickersRankRequest,
    userTagSearchRequest,userTagAddListRequest,userTagUpdateRequest,userTagUseRequest,userTagRandomRequest,userPhotoUpdateRequest,
    userPhotoCreateRequest,userPhotoListRequest,userPhotoAppendRequest,userPhotoRemoveRequest,userPhotoDeleteRequest,userSpaceMomentsListRequest,
    userSpaceMomentsAppendRequest,userSpaceMomentsRemoveRequest,userSpaceMomentsReplyRequest,userSpaceMomentsThumbToggleRequest,userSpaceMomentsThumbListRequest,
    userSpaceVisitListRequest,userSpaceMomentsReplyListRequest,userBanListRequest,userBanAppendRequest,userBanRemoveRequest,userSpaceAuthByFriendRequest,userSpaceAuthByGlobalRequest,
    userMailListRequest,userMailReplyRequest,findUserRequest,UseStickerRequest,updateSpaceCardRequest,updateUserAvatarRequest
} from '@/api/user';
import useFriendStore from './friend.js';
// 存储用户数据的仓库
const useUserStore = defineStore('user',() => {
    const token = ref(null);
    const user_info = ref(null);
    const user_stickers_info = ref(null);
    const user_mail = ref(null);
    const friendStore = useFriendStore();
    // 在刚进入程序时读取缓存的账号信息
    loadAccountInfo();
    // 缓存账号信息
    async function saveAccountInfo(){
        localStorage.token = sessionStorage.token = token.value;
        localStorage.user_info = sessionStorage.user_info = JSON.stringify(user_info.value);
    }
    // 读取账号信息
    async function loadAccountInfo(){
        token.value = localStorage.token || sessionStorage.token || null;
        user_info.value = JSON.parse(localStorage.user_info || sessionStorage.user_info || 'null');
    }
    // 退出登录
    async function logout(){
        user_mail.value = null;
        token.value = null;
        user_stickers_info.value = null;
        user_info.value = null;
        saveAccountInfo();
    }
    // 获取自身相关信息
    async function getSelfInfo(){
        await userInfo();
        await friendStore.getFriendList();
        await friendStore.friendGroupList();
        const user_tags = await userTagInfo(user_info.value.user_id);
        const stickers_info = await userStickers(user_info.value.user_id);
        user_info.value.user_tags = user_tags;
        user_info.value.stickers_info = stickers_info;
    }
    // 更换个人空间背景
    async function updateSpaceCard(space_background){
        const data = await updateSpaceCardRequest({space_background});
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 更换个人头像
    async function updateUserAvatar(avatar){
        const data = await updateUserAvatarRequest({avatar});
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    
    // 发现好友
    async function findUser({tags, age, gender}){
        const data = await findUserRequest({tags, age, gender});
        if(data.code == 200){
            return Promise.resolve(data.data.user_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 访问邮件列表
    async function userMailList(){
        const data = await userMailListRequest();
        if(data.code == 200){
            user_mail.value = data.data.mail_list;
            return Promise.resolve(data.data.mail_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 回应邮件，使邮件失效(已领取/已读)
    async function userMailReply(mail_id){
        const data = await userMailReplyRequest({mail_id});
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 好友访问个人空间的权限
    async function userSpaceAuthByFriend({friend_id,space_auth}){
        const data = await userSpaceAuthByFriendRequest({friend_id,space_auth});
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 个人空间全局访问权限
    async function userSpaceAuthByGlobal(space_auth){
        const data = await userSpaceAuthByGlobalRequest({space_auth});
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 黑名单列表
    async function userBanList(){
        const data = await userBanListRequest();
        if(data.code == 200){
            return Promise.resolve(data.data.user_ban_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 加入黑名单
    async function userBanAppend(user_id){
        const data = await userBanAppendRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 移出黑名单
    async function userBanRemove(user_id){
        const data = await userBanRemoveRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态列表
    async function userSpaceMomentsList(user_id){
        const data = await userSpaceMomentsListRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.user_moments_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态发布
    async function userSpaceMomentsAppend({ content,moments_media_list }){
        const data = await userSpaceMomentsAppendRequest({ content,moments_media_list });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态删除
    async function userSpaceMomentsRemove(moments_id){
        const data = await userSpaceMomentsRemoveRequest({ moments_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态回复
    async function userSpaceMomentsReply({ moments_id,content,received_user_id }){
        const data = await userSpaceMomentsReplyRequest({ moments_id,content,received_user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态回复列表请求
    async function userSpaceMomentsReplyList(moments_id){
        const data = await userSpaceMomentsReplyListRequest({ moments_id });
        if(data.code == 200){
            return Promise.resolve(data.data.reply_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态点赞
    async function userSpaceMomentsThumbToggle({ moments_id,thumb_up }){
        const data = await userSpaceMomentsThumbToggleRequest({ moments_id,thumb_up });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 动态点赞列表
    async function userSpaceMomentsThumbList(moments_id){
        const data = await userSpaceMomentsThumbListRequest({ moments_id });
        if(data.code == 200){
            return Promise.resolve(data.data.thumb_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 访客记录
    async function userSpaceVisitList(user_id){
        const data = await userSpaceVisitListRequest(user_id);
        if(data.code == 200){
            return Promise.resolve(data.data.visit_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 登录方法
    async function userLogin({ account,password }){
        const data = await userLoginRequest({ account,password });
        if(data.code == 200){
            token.value = data.data.token
            saveAccountInfo();
            // 登录前加载一些必要信息
            await getSelfInfo();
            // 登录成功
            return Promise.resolve(data.data);
        }else{
            return Promise.reject(data);
        }
    }
    // 注册方法
    async function userRegister({ account,password }){
        const data = await userRegisterRequest({ account,password });
        if(data.code == 200){
            token.value = data.data.token
            saveAccountInfo();
            return Promise.resolve(data.data);
        }else{
            return Promise.reject(data);
        }
    }
    // 获取用户卡片信息
    async function getUserCardInfo(user_id){
        const this_user_info = await userInfoById(user_id);
        const this_friend_list = await friendStore.getFriendListById(user_id);
        const this_user_stickers = await userStickers(user_id);
        return {
            user_info:this_user_info,
            friend_list:this_friend_list,
            user_stickers:this_user_stickers
        }
    }
    // 根据id获取用户信息
    async function userInfoById(user_id){
        const data = await userInfoByIdRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.user_info);
        }else{
            return Promise.reject(data);
        }
    }
    // 获取用户自身信息
    async function userInfo(){
        const data = await userInfoRequest();
        if(data.code == 200){
            user_info.value = data.data.user_info;
            saveAccountInfo();
            return Promise.resolve(data.data);
        }else{
            return Promise.reject(data);
        }
    }
    // 用户搜索
    async function searchUser({ keywords }){
        const data = await userSearchRequest({ keywords });
        if(data.code == 200){
            return Promise.resolve(data.data.user_list);
        }else{
            return Promise.reject(data);
        }
    }
    // 获取用户个人空间信息
    async function getUserSpace(user_id){
        const data = await userSpaceRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.user_space);
        }else{
            return Promise.reject(data);
        }
    }
    // 修改个人信息
    async function updateUser({ avatar,space_background,username,phone,born_at,age,gender,tags,introduce }){
        const data = await userUpdateRequest({ avatar,space_background,username,phone,born_at,age,gender,tags,introduce });
        if(data.code == 200){
            // 更新本地信息
            await userInfo();
            return Promise.resolve(data.data);
        }else{
            return Promise.reject(data);
        }
    }
    // 创建相册
    async function userPhotoCreate({ photo_name,photo_desc,photo_cover }){
        const data = await userPhotoCreateRequest({ photo_name,photo_desc,photo_cover });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 修改相册
    async function userPhotoUpdate({ photo_name,photo_desc,photo_cover,photo_id }){
        const data = await userPhotoUpdateRequest({ photo_name,photo_desc,photo_cover,photo_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        }
    }
    // 相册列表
    async function userPhotoList(user_id){
        const data = await userPhotoListRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.user_photo_list);
        }else{
            return Promise.reject(data);
        } 
    }
    // 上传图片
    async function userPhotoAppend({ photo_id,image }){
        const data = await userPhotoAppendRequest({ photo_id,image });
        if(data.code == 200){
            return Promise.resolve(data.data.user_photo_list);
        }else{
            return Promise.reject(data);
        } 
    }
    // 删除图片
    async function userPhotoRemove({ photo_id,image_id }){
        const data = await userPhotoRemoveRequest({ photo_id,image_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        } 
    }
    // 删除相册
    async function userPhotoDelete(photo_id){
        const data = await userPhotoDeleteRequest({ photo_id });
        if(data.code == 200){
            return Promise.resolve(data.data.msg);
        }else{
            return Promise.reject(data);
        } 
    }
    // 热门标签
    async function userTagTop(count){
        const data = await userTagTopRequest({count});
        if(data.code == 200){
            return Promise.resolve(data.data.hot_user_tags)
        }else{
            return Promise.reject(data);
        }
    }
    // 随机标签
    async function userTagRandom(count){
        const data = await userTagRandomRequest({count});
        if(data.code == 200){
            return Promise.resolve(data.data.random_user_tags)
        }else{
            return Promise.reject(data);
        }
    }
    // 用户标签搜索
    async function userTagSearch(keywords){
        const data = await userTagSearchRequest({keywords});
        if(data.code == 200){
            return Promise.resolve(data.data.user_tags)
        }else{
            return Promise.reject(data);
        }
    }
    // 用户标签查询
    async function userTagInfo(user_id){
        const data = await userTagInfoRequest({ user_id });
        if(data.code == 200){
            return Promise.resolve(data.data.user_tags)
        }else{
            return Promise.reject(data);
        } 
    }
    // 用户创建的标签列表
    async function userTagAddList(){
        const data = await userTagAddListRequest();
        if(data.code == 200){
            return Promise.resolve(data.data.user_tags)
        }else{
            return Promise.reject(data);
        } 
    }
    // 修改用户使用的标签
    async function updateUserTag({ tag_name,tag_color,text_color,border_style }){
        const data = await userTagUpdateRequest({ tag_name,tag_color,text_color,border_style })
        if(data.code == 200){
            return Promise.resolve(data.data.msg)
        }else{
            return Promise.reject(data);
        } 
    }
    // 使用标签
    async function userUseTag({ tag_name,tag_color,text_color,border_style }){
        const data = await userTagUseRequest({ tag_name,tag_color,text_color,border_style });
        if(data.code == 200){
            return Promise.resolve(data.data.msg)
        }else{
            return Promise.reject(data);
        } 
    }
    // 标签创建
    async function userTagAdd({ tag_name,tag_color,text_color,border_style }){
        const data = await userTagAddRequest({ tag_name,tag_color,text_color,border_style });
        if(data.code == 200){
            return Promise.resolve(data.data.msg)
        }else{
            return Promise.reject(data);
        } 
    }
    // 使用标签移除
    async function userTagRemove(tag_name){
        const data = await userTagRemoveRequest({ tag_name });
        if(data.code == 200){
            return Promise.resolve(data.data.msg)
        }else{
            return Promise.reject(data);
        } 
    }

    // 使用用户贴纸
    async function useSticker(user_sticker_id){
        const data = await UseStickerRequest({ user_sticker_id })
        if(data.code == 200){
            return Promise.resolve(data.data.msg)
        }else{
            return Promise.reject(data);
        } 
    }
    // 获取对方使用的贴纸
    async function getUsedSticker(user_id){
        const stickers_info = await userStickers(user_id)
        return stickers_info.list.find(sticker => {
            return sticker.used
        });
    }
    // 用户贴纸查询
    async function userStickers(user_id){
        const data = await userStickersRequest({ user_id })
        if(data.code == 200){
            const { user_stickers_info } = await userStickersInfo(user_id);
            const rarity_map = {
                '普通':1,
                '稀有':2,
                '史诗':3,
                '传说':4
            }
            // 对贴纸进行一个排序
            const list = data.data.user_stickers_list;
            list.sort((a,b) => rarity_map[a.sticker_info.rarity] - rarity_map[b.sticker_info.rarity])
            const stickers_info = {
                list,
                point: (user_stickers_info && user_stickers_info.point) || 0
            }
            return Promise.resolve(stickers_info)
        }else{
            return Promise.reject(data);
        } 
    }
    // 贴纸图鉴查询
    async function userStickersGuide(){
        const data = await userStickersGuideRequest()
        if(data.code == 200){
            return Promise.resolve(data.data.stickers_list)
        }else{
            return Promise.reject(data);
        } 
    }
    // 用户贴纸信息查询
    async function userStickersInfo(user_id){
        const data = await userStickersInfoRequest({ user_id });
        if(data.code == 200){
            // 更新本地信息
            return Promise.resolve(data.data);
        }else{
            return Promise.reject(data);
        }
    }
    // 贴纸排行
    async function userStickersRank(user_id){
        const data = await userStickersRankRequest({ user_id });
        if(data.code == 200){
            // 更新本地信息
            return Promise.resolve(data.data.user_stickers_rank);
        }else{
            return Promise.reject(data);
        }
    }
    return {
        token,
        user_info,
        user_mail,
        user_stickers_info,
        userLogin,
        userRegister,
        userInfo,
        userInfoById,
        getUserCardInfo,
        searchUser,
        getUserSpace,
        updateUser,
        findUser,
        updateUserAvatar,
        
        // 邮件
        userMailList,
        userMailReply,

        // 黑名单
        userBanList,
        userBanAppend,
        userBanRemove,

        // 用户相册
        userPhotoCreate,
        userPhotoList,
        userPhotoAppend,
        userPhotoRemove,
        userPhotoDelete,
        userPhotoUpdate,
        userSpaceMomentsList,
        // 动态
        userSpaceMomentsAppend,
        userSpaceMomentsRemove,
        userSpaceMomentsReply,
        userSpaceMomentsReplyList,
        userSpaceMomentsThumbToggle,
        userSpaceMomentsThumbList,
        userSpaceVisitList,
        // 个人空间权限
        userSpaceAuthByFriend,
        userSpaceAuthByGlobal,
        // userSpaceMsgLeave,
        // userSpaceMsgList,

        userTagTop,
        userTagInfo,
        userTagAdd,
        userTagRemove,
        userTagSearch,
        userTagAddList,
        userTagTop,
        userUseTag,
        userTagRandom,



        updateUserTag,
        userStickers,
        userStickersGuide,
        getSelfInfo,
        userStickersRank,
        useSticker,
        getUsedSticker,

        updateSpaceCard,
        logout,
    }
})
export default useUserStore;