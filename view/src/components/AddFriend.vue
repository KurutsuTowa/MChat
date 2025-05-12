<template>

</template>

<script setup>
  const showAddUserDialog = ref(false);
  const showGroupManagerDialog = ref(false);
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
</script>

<style lang="scss" scoped>


</style>