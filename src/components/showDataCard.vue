<script setup>
import { ref } from 'vue';
import cookies from 'vue-cookies';
import { inject } from 'vue'

const props = defineProps(['question','toUser'])
const userId = cookies.get('userId') ? cookies.get('userId') : '-1'
const question = props.question;

const clickedCardId = inject('clickedCardId')
const drawer = inject('drawerValue')
const clickCard = inject('clickCard')
// 情况A 不是自己的问题 或者 是自己的问题，且已经回答
const SituationA = ref((userId != props.toUser) || (userId == props.toUser && question.answered == true))

//情况B 是自己的问题，且还没回答
const SituationB = ref(userId == props.toUser && question.answered == false)

</script>

<template>
<el-card :class="{'stA':SituationA, 'stB':SituationB}" shadow="hover" @click.native="clickCard(props.question._id)">
  <el-text class="h-30px" truncated >
    {{ props.question.text }}
  </el-text>
</el-card>


</template>

<style scoped>
.tabPane{
  width: 100%;
}
.el-card{
  width: 100%;
  margin-top: 5px;
}
.stB{
  background-color: #fbfbfb;

}
</style>