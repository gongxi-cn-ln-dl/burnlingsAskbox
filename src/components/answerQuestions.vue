<script setup>
import cookies from 'vue-cookies';
import { ElMessage } from 'element-plus';
import { ref } from 'vue'
import CryptoJS from "crypto-js";
import axios from 'axios';

// import { host, userId } from "@/api/global.js"

const props = defineProps(['question'])
const text = ref('')
const answerTextArea = ref('')
const host = "https://api.burnling.asia"
const userId = cookies.get('userId') ? cookies.get('userId') : '-1'

function submitAnswer(){
  axios({
    method: "post",
    url: `${host}/vue-project/submitAnswer`,
    data: {
      'userId':userId,
      'token':cookies.get('token'),
      'bdCode':props.question.bdCode,
      'answer': CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(answerTextArea.value))
    }
  }).then(res => {
    if(res.data.success){
      ElMessage({
        type: 'success',
        message: '发送成功！',
        center: true
      })
      answerTextArea.value = ''
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
  <h3>Ta 的问题</h3>
  <el-card shadow="hover">
    <el-text class="preserve-line-breaks">{{ props.question.text }}</el-text>
  </el-card>
  <h3>我的回答</h3>
  <template v-if="props.question.answered == true">
    <el-card shadow="hover">
      <el-text class="preserve-line-breaks">{{ props.question.answer }}</el-text>
    </el-card>
  </template>
  <template v-else>
    <div style="width: 100%;">
      <el-input v-model="answerTextArea" :autosize="{ minRows: 10, maxRows: 15 }" type="textarea" maxlength="1000" show-word-limit/>
      <el-button type="primary" plain style="margin-top: 10px;" @click="submitAnswer">提交</el-button>
    </div>
  </template>
  
</template>


<style>
  .preserve-line-breaks {
    white-space: pre-line;
  }
</style>
