<template>
    <div class="chat_extra">
        <ul class="member_list">
            <header>群内成员({{ props.room_info?.group_status.members.length }}人)</header>
            <a-popover v-for="member in props.room_info?.group_status.members" position="left" trigger="click">
                <li class="member_item" >
                    <dd class="custom-content">
                        <CustomAvatar :src="member.avatar" size="2.5rem" :circle="true"></CustomAvatar>
                        <p class="username text-ellipsis" :style="{ color:parseColor?.contrast_color.color,margin:'10px' }">
                            <span>{{ member.nickname || member.username }}</span>
                        </p>
                    </dd>
                    <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--red)" v-if="member.position == '群主'">
                        群主
                    </a-tag>
                    <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--blue)" v-if="member.position == '管理员'">
                        管理员
                    </a-tag>
                    <a-tag size="min" class="tag" style="color:var(--white);background-color: var(--lightDark)" v-if="member.position == '成员'">
                        成员
                    </a-tag>
                </li>
                <template #content>
                    <UserInGroupCard :group_user_info="member"></UserInGroupCard>
                </template>
            </a-popover>
        </ul>
    </div>
</template>

<script setup>
import CustomAvatar from '@/components/CustomAvatar.vue';
import CustomInput from '@/components/CustomInput.vue';
import UserInGroupCard from '@/components/UserInGroupCard.vue';
import useAppStore from '@/stores/app';
const appStore = useAppStore();
const props = defineProps(['room_info']);

</script>

<style lang="scss" scoped>
.chat_extra{
    width:220px;
    flex-shrink:0;
    background-color: var(--white)
}
.member_list{
        padding:0 15px;
        display: flex;
        flex-direction: column;
        color:var(--dark);
        font-weight:bold;
        display: flex;
        flex-direction: column;
        min-height: 50vh;
        border-radius: 6px;
        header{
            font-size: 1rem;
            margin: 8px;
            margin-top:20px;
        }
        .member_item{
            display: flex;
            align-items: center;
            font-size: .9rem;
            justify-content: space-between;
            transition:all .3s;
            padding:4px;
            border-radius: 4px;
            padding-left:8px;
            &:hover{
                cursor: pointer;
                background-color: var(--blue);
                >*{
                    color:var(--white);
                    transition:all .1s;
                }
            }
            .tag{
                margin-right: 10px;
            }
            .custom-content{
                display: flex;
                align-items: center;
            }
        }
    }
</style>