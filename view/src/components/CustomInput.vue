<template>
  <div class="custom_input_wrapper">
    <span v-if="name">{{ name }}：</span>
    <a-input
      class="custom_input"
      :model-value="modelValue"
      @update:modelValue="onUpdateModelValue"
      :style="style"
      :placeholder="placeholder"
      :max-length="maxLength"
    />
  </div>
  </template>
  
  <script setup>
  const props = defineProps(['modelValue','placeholder','style','name','maxLength'])
  const emit = defineEmits(['update:modelValue']);
  
  const onUpdateModelValue = (value) => {
    emit('update:modelValue', value);
  };
  </script>

<style lang="scss" scoped>
span{
  color:var(--dark);
  white-space: nowrap;
  font-size:.8rem;
}
.custom_input_wrapper{
  display: flex;
  width:100%;
  align-items: center;
}
.custom_input{
    background-color: var(--formColor);
    border: 1px solid var(--light);
    border-radius: 8px;
    color:var(--dark);
    &:deep(.arco-input){
        text-transform: uppercase;
        text-align: center;
        &::placeholder{
            color:var(--lightDark);
        }
    }
}
</style>