<script setup>
import { ref } from 'vue';

const props = defineProps(['question'])

</script>
<template>

  <h3>我问 <el-text type="primary" tag="b">{{ props.question.username }}</el-text></h3>
  <el-card shadow="hover">
    <el-text class="preserve-line-breaks">{{ props.question.text }}</el-text>
  </el-card>
  <h3><el-text type="primary" tag="b">{{ props.question.username }}</el-text> 的回答</h3>
  <el-card shadow="hover">
    <el-text type="warning" v-if="props.question.answered==false">
      <el-text type="primary" tag="b">{{ props.question.username }}</el-text> 还没回答
    </el-text>
    <el-text class="preserve-line-breaks" v-if="props.question.answered==true">
      {{ props.question.answer }}
    </el-text>
  </el-card>
</template>

<style>
  .preserve-line-breaks {
    white-space: pre-line;
  }
</style>
