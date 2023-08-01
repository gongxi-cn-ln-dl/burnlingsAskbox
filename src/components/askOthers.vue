<script setup>
import axios from 'axios';
import cookies from 'vue-cookies';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

import { encodeString } from "@/api/getdata.js"

const props = defineProps(['toUser'])
const text = ref('')
const host = "https://api.burnling.asia"
const userId = cookies.get('userId') ? cookies.get('userId') : '-1'

function BangDing(userId, bdCode) {
  axios({
    method: 'post',
    url: `${host}/vue-project/BangDing`,
    data: {
      'userId': userId,
      'bdCode': bdCode,
      'token': cookies.get('token')
    },
    withCredentials: false
  }).then(res => {
    if (res.data.success) {
      ElMessage({
        type: 'success',
        message: '发送成功！',
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

function submit() {

  axios({
    method: 'post',
    url: `${host}/vue-project/submitText`,
    data: {
      'text': encodeString(text.value),
      'userId': userId,
      'token': cookies.get('token'),
      'toUser': props.toUser
    },
    withCredentials: false
  }).then(res => {
    if(res.data.success){
      if (userId.value && userId.value != '-1') {
        BangDing(userId, res.data.others.bdCode)
      } else {
        ElMessage({
          type: 'success',
          message: `提交成功！绑定码为${userId, res.data.others.bdCode}`,
          center: true,
          showClose: true,
          duration: 0
        })
        text.value = ''
      }
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
  <h3>提问区</h3>
  <div style="width: 100%;">
    <el-form id="input-area">
      <el-input v-model="text" :autosize="{ minRows: 10, maxRows: 15 }" type="textarea" maxlength="1000" id="_textArea"
        show-word-limit />
      <el-button @click="submit" type="primary" plain>提交</el-button>
    </el-form>
  </div>
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