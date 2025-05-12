<template>
    <div class="custom_textarea_box">
      <a-textarea ref="textarea" class="custom_textarea" :model-value="modelValue" auto-size
        :style="{ '--minHeight': height || '80px','--lineHeight':rowIsOne ? height || '80px' : '1.5'  }" />
      <span class="placeholder" v-show="!modelValue">{{ placeholder }}</span>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  const textarea = ref();
  const props = defineProps({
    modelValue: String,
    placeholder: String,
    height: String,
  });
  const rowIsOne = ref(true);
  
  
  const calculateRowsOutOne = (text) => {
    const contentWidth = 210;
    // 创建一个临时的 span 元素来测量文本宽度
    const tempSpan = document.createElement('span');
    tempSpan.style.fontSize = '.85rem'; // 设置字体大小
    tempSpan.style.position = 'absolute'; // 防止影响布局
    // tempSpan.style.visibility = 'hidden'; // 隐藏元素
    tempSpan.style.whiteSpace = 'nowrap'; // 防止文本换行
    document.body.appendChild(tempSpan); // 添加到文档中
  
    // 使用一个单个字符来测量宽度
    tempSpan.textContent = text;
    const singleCharWidth = tempSpan.offsetWidth;
  
    
    rowIsOne.value = singleCharWidth < contentWidth;

    tempSpan.remove();
  }
  onMounted(() => {
    calculateRowsOutOne(textarea.value.$el.textContent)
  })
  </script>
  <style lang="scss" scoped>
  .custom_textarea_box {
    width: 100%;
  }
  
  .custom_textarea {
    background-color: var(--formColor);
    border: 1px solid var(--light);
    min-height: var(--minHeight);
    color: var(--dark);
    border-radius: 6px;
    text-align: center;
  
    &:deep(.arco-textarea) {
      font-size: .85rem;
      text-transform: uppercase;
      resize: none;
      min-height: var(--minHeight);
      line-height: var(--lineHeight);
      text-align: center;
    }
  }
  
  .placeholder {
    font-size: .8rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    color: var(--lightDark);
    white-space: nowrap;
  }
  </style>