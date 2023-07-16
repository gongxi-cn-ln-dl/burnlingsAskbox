<script setup>
import axios from 'axios';
import CryptoJS from "crypto-js";
import { ref, reactive, toRaw, onMounted  } from 'vue';
import cookies from 'vue-cookies';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router'

const host = "https://api.burnling.asia"
const userId = cookies.get('userId') ? cookies.get('userId') : '-1'

const questionList = ref([])
const myQuestionList = ref([])
const usersDict = ref({})
const activeTabName = ref('firstTab')

const isFirst = ref(true)
const isSecond = ref(false)
const drawer = ref(false)

const clickedCardId = ref(0)
const answerTextArea = ref('')

const text1 = ref(false)
const text2 = ref(false)
const text3 = ref('')
const text4 = ref('')
const text5 = ref('')
const text6 = ref('')

async function getUserNameByUserId(userid){
  // console.log(userid)
  if(usersDict.value.userid){
    // console.log("A,",usersDict.value.userid)
    return usersDict.value.userid
  }else{
    await axios({
      method: 'get',
      url: `${host}/vue-project/getUserNameFromUserId`,
      params: {
        'userId': userid
      },
      withCredentials: false
    }).then(res => {
      if(res.data.success){
        usersDict.value[userid] = res.data.others.username
        // console.log("B",usersDict.value[userid])
      }
      return usersDict.value[userid]
    })
  }
  return usersDict.value[userid]
}

async function getAskedQuestions(){
  await axios({
    method: 'post',
    url: `${host}/vue-project/getAskedQuestions`,
    data: {
      'userId': userId,
      'token': cookies.get('token')
    },
    withCredentials: false
  }).then(res => {
    if(res.data.success){
      // console.log(res.data.others.texts)
      questionList.value = []
      var id_ = 0;
      res.data.others.texts.forEach(async element => {
        const userName = await getUserNameByUserId(element['toUser'])
        element['username'] = userName
        element['_id'] = id_++
        element['text'] = CryptoJS.enc.Base64.parse(element['text']).toString(CryptoJS.enc.Utf8);
        element['answer'] = CryptoJS.enc.Base64.parse(element['answer']).toString(CryptoJS.enc.Utf8);
        questionList.value.push(element)
      });
      // questionList.value = toRaw(questionList.value)
    }
  })
}

async function getMyQuestions(){
  await axios({
    method: "post",
    url:  `${host}/vue-project/getMyQuestions`,
    data: {
      'userId': userId,
      'token': cookies.get('token')
    },
    withCredentials: false
  }).then(res => {
    // console.log(res.data.others.texts)
    myQuestionList.value = []
    var id_ = 0;
    res.data.others.texts.forEach(element => {
      element['_id'] = id_++
      element['text'] = CryptoJS.enc.Base64.parse(element['text']).toString(CryptoJS.enc.Utf8);
      element['answer'] = CryptoJS.enc.Base64.parse(element['answer']).toString(CryptoJS.enc.Utf8);
      myQuestionList.value.push(element)
    });
    // myQuestionList.value = toRaw(myQuestionList.value)

    // console.log(myQuestionList.value)
  })
}

function convert(){
  activeTabName.value = activeTabName.value === 'firstTab' ? 'secondTab' : 'firstTab'
  isFirst.value = !isFirst.value
  isSecond.value = !isSecond.value

  if(isSecond.value){
    // console.log("SEC")
    getAskedQuestions()
  }else{
    // console.log("FIS")
    getMyQuestions()
  }
  // console.log(isFirst.value,isSecond.value)
}

function clickCard(cardId){
  drawer.value = true
  clickedCardId.value = cardId
  if(isFirst.value){
    // console.log("FIS",myQuestionList.value[cardId])
    text1.value = myQuestionList.value[cardId].answered
    text3.value = myQuestionList.value[cardId].answer
    text5.value = myQuestionList.value[cardId].text
  }else{
    // console.log("SEC",questionList.value[cardId])
    text2.value = questionList.value[cardId].answered
    text4.value = questionList.value[cardId].answer
    text6.value = questionList.value[cardId].text
  }
  // console.log(cardId)
}

function submitAnswer(){
  axios({
    method: "post",
    url: `${host}/vue-project/submitAnswer`,
    data: {
      'userId':userId,
      'token':cookies.get('token'),
      'bdCode':myQuestionList.value[clickedCardId.value].bdCode,
      'answer': CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(answerTextArea.value))
    }
  }).then(res => {
    // console.log(res.data)
    if(res.data.success){
      ElMessage({
        type: 'success',
        message: '发送成功！',
        center: true
      })
      myQuestionList.value[clickedCardId.value].answered = true
      myQuestionList.value[clickedCardId.value].answer = answerTextArea.value
      answerTextArea.value = ''
    }
  })
}

onMounted(() => {  
  getMyQuestions()
})

</script>

<template>
  <el-container style="margin-top: 10px;">
    <el-tabs v-model="activeTabName" @tab-click="convert" tab-position="left" class="tabPane">
      <el-tab-pane label="问我的问题" name="firstTab" >
        <el-row v-if="isFirst" :gutter="20">
          <el-col :span="6" v-for="item in myQuestionList" :key="item._id">
            <el-card style="margin-top: 5px;" shadow="hover" class="h-100px" @click.native="clickCard(item._id)">
              <el-text truncated>
                {{ item.text }}
              </el-text>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="我问的问题" name="secondTab">
        <el-row v-if="isSecond" :gutter="20">
          <el-col :span="6" v-for="item in questionList" :key="item._id">
            <el-card style="margin-top: 5px;" shadow="hover" @click.native="clickCard(item._id)">
              <template #header>
                <span>To: <el-text tag="b">{{ item.username }}</el-text></span>
              </template>
              <el-text truncated>
                {{ item.text }}
              </el-text>
              
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <template v-if="isFirst" wrap>
        <el-space direction="vertical" alignment="flex-start" fill>
          <el-text tag="b">Ta 的问题：</el-text>
          <div style="box-shadow: var(--el-box-shadow-lighter);padding: 10px;border-radius: 3px;">
            <el-text style="white-space: pre-wrap;">
              {{ text5 }}
            </el-text>
          </div>
          <el-text tag="b">我的回复：</el-text>
          <template v-if="text1">
            <div style="box-shadow: var(--el-box-shadow-lighter);padding: 10px;border-radius: 3px;">
              <el-text style="white-space: pre-wrap;">
                {{ text3 }}
              </el-text>
            </div>
          </template>
          <template v-else>
            <div style="width: 100%;">
              <el-input v-model="answerTextArea" :autosize="{ minRows: 10, maxRows: 15 }" type="textarea" maxlength="1000" show-word-limit/>
              <el-button type="primary" plain style="margin-top: 10px;" @click="submitAnswer">提交</el-button>
            </div>
          </template>
        </el-space>        
      </template>
      <template v-if="isSecond" wrap>
        <el-space direction="vertical" alignment="flex-start" fill>
          <el-text tag="b">我的问题：</el-text>
          <div style="box-shadow: var(--el-box-shadow-lighter);padding: 10px;border-radius: 3px;">
            <el-text style="white-space: pre-wrap;">
              {{ text6 }}
            </el-text>
          </div>
          <el-text tag="b">Ta 的回复：</el-text>
          <div style="box-shadow: var(--el-box-shadow-lighter);padding: 10px;border-radius: 3px;">
            <el-text style="white-space: pre-wrap;">
              {{ text2 ? text4 : "尚未回复" }}
            </el-text>
          </div>
        </el-space>        
      </template>
      
    </el-drawer>
  </el-container>
</template>

<style scoped>
.tabPane{
  width: 100%;
}
.el-space__item{
  width: 100%;
}
</style>