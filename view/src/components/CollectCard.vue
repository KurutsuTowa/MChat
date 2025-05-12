<template>
    <div class="collect_card">
        <header class="collect_header">
            <div style="display:flex;">
                <div class="collect_header_desc">
                    <slot name="header">
                        <span class="iconfont">{{ card_icon || '&#xe633;' }}</span>
                        <span class="name">{{ card_title || '收藏品' }}</span>
                    </slot>
                </div>
                <!-- <div class="collect_header_desc" style="line-height: 1.5;margin-left: 0px;">
                    <span style="font-size: .8rem;">未使用</span>
                </div> -->
            </div>
            <span @click="close" class="iconfont close">&#xe867;</span>
        </header>
        <div class="collect_content">
            <div class="collect_rare" :style="{color:getRarityStyle(content_rare)}">
                {{ content_rare }}
            </div>
            <div class="collect_content_face">
                <slot name="face">
                    
                </slot>
            </div>
            <div class="collect_content_title">
                {{ content_title }}<span style="font-size: 0.8rem;vertical-align: 1px;margin-left: 2px;">#{{ id }}</span>
            </div>
            <div v-if="content_status" class="collect_content_status" style="line-height: 1;">
                {{ content_status }}
            </div>
            <div class="collect_content_desc">
                {{ content_desc }}
            </div>
            <div v-if="get_time"  class="collect_content_status">
                {{ parseAllDate(get_time) }}
            </div>
        </div>
        <!-- 获得方式 -->
        <div class="get_method">
            <header class="get_method_header">
                <span class="iconfont">&#xe632;</span>
                <span>获得方式</span>
            </header>
            <div class="get_method_content">
                {{ get_method || '无' }}
            </div>
        </div>
        <footer v-if="used" class="collect_footer">
            <span class="collect_used">
                使用中
            </span>
        </footer>
    </div>
</template>

<script setup>
import { parseAllDate } from '@/utils/datetime'
const { card_title,card_icon,modelValue,content_title,content_status,content_desc,get_time,id,content_rare,used,get_method } = defineProps(['modelValue','get_method','used','content_rare','id','card_title','card_icon','content_title','content_status','content_desc','get_time']);
const emit = defineEmits(['update:modelValue']);
const close = () => {
    emit('update:modelValue', false);
}
const getRarityStyle = (rarity) => {
    const map = {
        '传说':'red',
        '史诗':'#bdc900',
        '稀有':'#ce11fd',
        '普通':'#5e9db1',
    }
    return map[rarity]
}
</script>

<style lang="scss" scoped>
.iconfont{
    margin-left:0px;
    margin-right: 3px;
}
.get_method{
    width: 90%;
    min-height: 85px;
    background-color: var(--someWhite);
    margin: 0 auto;
    border: 1px solid var(--light);
    box-shadow: 0 0 6px var(--light);
    border-radius: 6px;
    margin-bottom: 20px;
    filter: brightness(1.1);
    padding: 10px 20px;
    text-align: center;
    >*{
        filter: brightness(0.9090);
    }
    .get_method_header{
        color: var(--dark);
        font-size:.9rem;
        font-weight: bold;
        .iconfont{
            vertical-align: -1px;
        }
    }
    .get_method_content{
        color: var(--dark);
        font-size:.9rem;
        margin-top:5px;
    }
}
.collect_card{
    position:relative;
    border-radius: 4px;
    padding-bottom: 20px;
    background-color: var(--someWhite);
    width:100%;
    display: flex;
    flex-direction: column;
    min-height:300px;
    .collect_header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name{
            font-size: 0.8rem;
        }
        .collect_header_desc{
            margin: 10px;
            background-color: var(--mostLight);
            border-radius: 6px;
            padding: 1px 6px;
            color:var(--lightDark);
        }
        .close{
            cursor: pointer;
            font-size: 1.3rem;
            color:var(--lightDark);
            margin:10px;
            line-height: 1;
        }
    }
    .collect_content{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .collect_rare{
        font-family: 'YuFanZhenSu';
        font-size:1.2rem;
        margin-bottom: 8px;
        font-weight:bold;
    }
    .collect_content{
        font-weight: bold;
    }
    .collect_content_title{
        font-size: 1.1rem;
        color:var(--black);
        margin-top:12px;
    }
    .collect_content_status{
        font-size:.8rem;
        color:var(--mostLightDark);
    }
    .collect_content_desc{
        margin-bottom: 5px;
        margin-top:8px;
        font-size:.8rem;
        color:var(--dark);
        padding: 0 30px;
        text-align: center;
    }
    .collect_footer{
        display: flex;
        justify-content: center;
    }
    .collect_used{
        background-color: var(--white);
        border-radius: 40px;
        font-size: 1rem;
        font-weight: normal;
        padding: 0px 12px;
        color: var(--lightDark);
        font-weight:bold;
        box-shadow: 0 0 4px var(--light);
    }
}

</style>