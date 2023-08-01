<script setup>
import { ref } from 'vue';

const props = defineProps(['question'])

</script>

<template>
  <h3>有人问Ta</h3>
  <el-card shadow="hover">
    <el-text class="preserve-line-breaks">{{ props.question.text }}</el-text>
  </el-card>
  <h3>Ta 的回答</h3>
  <el-card shadow="hover">
    <el-text type="warning" v-if="props.question.answered==false">
      Ta 还没回答
    </el-text>
    <el-text v-if="props.question.answered==true" class="preserve-line-breaks">
      {{ props.question.answer }}
    </el-text>
  </el-card>
</template>

<style>
  .preserve-line-breaks {
    white-space: pre-line;
  }
</style>
