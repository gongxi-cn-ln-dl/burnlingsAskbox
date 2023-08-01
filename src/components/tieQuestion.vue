<script setup>
import axios from 'axios';
import cookies from 'vue-cookies';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const text = ref('')
const host = "https://api.burnling.asia"
const userId = cookies.get('userId') ? cookies.get('userId') : '-1'

function BangDing() {
  axios({
    method: 'post',
    url: `${host}/vue-project/BangDing`,
    data: {
      'userId': userId,
      'bdCode': text.value,
      'token': cookies.get('token')
    },
    withCredentials: false
  }).then(res => {
    if (res.data.success) {
      ElMessage({
        type: 'success',
        message: '绑定成功！',
        center: true
      })
      text.value = ''
    }else{
      ElMessage({
        type: 'error',
        message: res.data.response,
        center: true
      })
      answerTextArea.value = ''
    }
  })
}

</script>

<template>
  <el-form id="input-area">
    <el-input
      v-model="text"
      maxlength="32"
      minlength="32"
      placeholder="请输入绑定码"
      show-word-limit
      type="text"
    />
    <el-button @click="BangDing" type="primary" plain style="margin-top: 10px;">提交</el-button>
  </el-form>
  
</template>

<style scoped>
.el-container {
  margin: 10px auto;
  width: 70%;
}

.el-button {
  margin-top: 10px;
  width: 33%;
}

.el-input {
  margin-top: 10px;
}

</style>