<script setup>
import axios from 'axios';
import CryptoJS from "crypto-js";
import { ref } from 'vue';
import cookies from 'vue-cookies';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router'

const text = ref('')
const host = "https://api.burnling.asia"
const route = useRoute()

function BangDing(userId, bdCode){
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
    if(res.data.success){
      ElMessage({
        type: 'success',
        message: '发送成功！',
        center: true
      })
      text.value = ''
    }
  })
}

function submit(){
  const userId = cookies.get('userId') ? cookies.get('userId') : '-1'
  axios({
    method: 'post',
    url: `${host}/vue-project/submitText`,
    data: {
      'text': CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text.value)),
      'userId': userId,
      'token': cookies.get('token'),
      'toUser': route.params.id
    },
    withCredentials: false
  }).then(res => {
    // console.log(res.data)
    BangDing(userId,res.data.others.bdCode)
  })
}
</script>

<template>
  <el-container  direction="vertical">
    <el-form id="input-area"> 
      <el-input
        v-model="text"
        :autosize="{ minRows: 10, maxRows: 15 }"
        type="textarea"
        maxlength="1000"
        id="_textArea"
        show-word-limit
      />
      <el-button @click="submit" type="primary" plain>提交</el-button>
    </el-form>
  </el-container>
</template>

<style scoped>
.el-container{
  margin: 10px auto;
  width: 70%;
}
.el-button{
  margin-top: 10px;
  width: 33%;
}
.el-input{
  margin-top: 10px;
}
</style>