<script setup>
import { ref, reactive , onMounted } from 'vue'
import axios from 'axios';
import cookies from 'vue-cookies';
import { useRoute } from "vue-router";

const isMobile = ref(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) ? true : false)

const colLength = ref(isMobile.value ? 22 : 8)
const colOffset = ref(isMobile.value ? 1 : 8)

const switchValues = ref({})
const host = "https://api.burnling.asia"
const userId = cookies.get('userId') ? cookies.get('userId') : '-1'
const settings = ref({})

const translate = {
  'showUnansweredQuestionsToGuests' : "允许未登录用户查看我未回答的问题",
  'showUnansweredQuestionsToUsers' : "允许已登录用户查看我未回答的问题",

  'allowGuestsToAskQuestions' : "允许未登录用户向我提问",
  'allowUsersToAskQuestions' : "允许已登录用户向我提问"
}

const switchValueChanged = ref(false)

function switchValueChangedHandle() {
  switchValueChanged.value = true
  return true
}

function getSettings(){
  axios({
    method: 'post',
    url: `${host}/vue-project/getUserSettings`,
    data: {
      'userId': userId,
      'token': cookies.get('token'),
      'toUser': userId
    },
    withCredentials: false
  }).then(res => {
    console.log("switch",res)
    console.log("SWs",res.data)

    switchValues.value = res.data
    console.log("SW",switchValues.value)
  })
}

function modifySettings(){
  axios({
    method: 'post',
    url: `${host}/vue-project/modifyUserSettings`,
    data: {
      'userId': userId,
      'token': cookies.get('token'),
      'settings': JSON.stringify(switchValues.value)
    },
    withCredentials: false
  })
}

onMounted(() => {
  getSettings()
})

</script>

<template>
  <el-row style="margin-top:5px;">
    <el-col :span="colLength" :offset="colOffset">
      <el-card>
        <el-text v-for="(value,key,index) in switchValues" >
        {{ translate[key] }}
        <el-switch v-model="switchValues[key]" :before-change="switchValueChangedHandle"></el-switch>
        <br/>
      </el-text>
      <el-button v-if="switchValueChanged" @click.default="modifySettings">保存更改</el-button>
      </el-card>
    </el-col>
  </el-row>
  
</template>

<style>
.el-card{
  width: 100%;
  margin-top: 8px;
}

</style>