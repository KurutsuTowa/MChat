<template>
  <div class="card">
    <div class="card-header">用户资料</div>
    <a-popover position="left" trigger="click">
      <CustomAvatar :src="group_user_info.avatar" size="100px" alt="用户头像" class="avatar"></CustomAvatar>
      <template #content>
          <UserCard :user_id="group_user_info.user_id"></UserCard>
      </template>
    </a-popover>
    <div class="info">
      <div style="display:flex;align-items:center;">
          <div class="username" style="margin-right:4px;">{{group_user_info.username}}</div>
      </div>      
      <div style="margin-bottom:4px">
        <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="group_user_info.position == '群主'">
              群主
          </a-tag>
          <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="group_user_info.position == '管理员'">
              管理员
          </a-tag>
          <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="group_user_info.position == '成员'">
              成员
          </a-tag>
      </div>
      <div class="group-level">群等级：<span style="color:var(--blue)">{{ group_user_info.level }}级</span></div>
       <!-- 经验条和等级 -->
      <div class="progress-container" style="display: flex; align-items: center;">
        <div class="level-text">{{ group_user_info.exp }}</div>
        <div class="progress-bar-background">
          <div class="progress-bar" :style="{ width: calculateExperienceProgress(group_user_info.exp) + '%' }"></div>
        </div>
        <div class="level-text">{{ calculateRemainingExp(group_user_info.exp) }}</div>
      </div>
      <div class="join-time">加群时间：<span style="color:var(--dark)">{{ formatTime(group_user_info.created_at) }}</span></div>
      <div class="speech-count">发言数：<span style="color:var(--dark)">{{group_user_info.message_total }}</span></div>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '@/utils/datetime';
import CustomAvatar from '@/components/CustomAvatar.vue';
import UserCard from '@/components/UserCard.vue';
const props = defineProps(['group_user_info']); 
// 根据经验计算等级
function calculateLevel(exp) {
  if(exp < 30) return 1;
  else if(exp < 100) return 2;
  else if(exp < 200) return 3;
  else if(exp < 400) return 4;
  else if(exp < 700) return 5;
  else if(exp < 1000) return 6;
  else return 7;
}
// 计算距离下一级还剩多少经验值
function calculateRemainingExp(exp) {
  const level = calculateLevel(exp);
  const thresholds = [30, 100, 200, 400, 700, 1000, Infinity]; // Infinity for the last level
  if (level < 7) {
    return thresholds[level - 1] - exp;
  }
  return 0; // 如果已经是最高等级，则剩余经验为0
}
// 根据经验计算进度条宽度
function calculateExperienceProgress(exp) {
  const level = calculateLevel(exp);
  const thresholds = [30, 100, 200, 400, 700, 1000];
  let progress = 0;
  if (level > 1) {
    progress = ((exp - thresholds[level - 2]) / (thresholds[level - 1] - thresholds[level - 2])) * 100;
  } else {
    progress = (exp / 30) * 100;
  }
  return progress > 100 ? 100 : progress;
}
</script>

<style lang="scss" scoped>
  .card {
    width: 300px;
    background-color: var(--mostWhite);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
  }
  .card-header {
    background-color: var(--blue);
    color: var(--mostWhite);
    padding: 15px;
    text-align: center;
    font-size: 20px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: -50px auto 0;
    display: block;
    border: 4px solid var(--mostWhite);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .info {
    padding: 20px;
  }
  .username {
    font-size: 18px;
    font-weight: bold;
    color: var(--dark);
    margin: 5px 0;
  }
  .identity-tag {
    display: inline-block;
    padding: 4px 8px;
    color: var(--lightDark);
    border-radius: 10px;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .group-level {
    font-size: 14px;
    color: var(--lightDark);
    margin-bottom: 10px;
  }
  .level-text {
    white-space:nowrap;
    min-width: 30px;
    text-align: center;
    color: var(--lightDark);
  }
  /* 更新进度条样式以适应两侧的等级文本 */
  .progress-container {
    justify-content: space-between;
  }
  .progress-bar-background{
    height: 6px;
    background-color: var(--light);
    width:100%;
    border-radius: 5px;
  }
  .progress-bar {
    height: 6px;
    background-color: var(--blue);
    border-radius: 5px;
    width: 70%; /* 示例进度，可以根据实际值调整 */
  }
  .join-time, .speech-count {
    font-size: 14px;
    color: var(--lightDark);
    margin-bottom: 5px;
  }
</style>