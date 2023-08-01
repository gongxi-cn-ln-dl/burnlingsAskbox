<script setup>
import axios from "axios";
import cookies from "vue-cookies";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { getUserNameByUserId, decodeString } from "@/api/getdata.js";

import answerQuestions from "@/components/answerQuestions.vue";
import askOthersVue from "@/components/askOthers.vue";
import myAskedQuestions from "@/components/myAskedQuestions.vue";
import othersQuestion from "@/components/othersQuestion.vue";
import tieQuestion from "@/components/tieQuestion.vue";

const route = useRoute();

const toUser = route.params.id;

const host = "https://api.burnling.asia";
const userId = cookies.get("userId") ? cookies.get("userId") : "-1";

const questionList = ref([]);
const myQuestionList = ref([]);
const activeTabName = ref("firstTab");

const isFirst = ref(true);
const isSecond = ref(false);
const drawer = ref(false);

const clickedCardId = ref(-1);

const isMyAskbox = ref(userId === route.params.id);
const prep = ref(isMyAskbox.value ? "我" : "Ta");

const toUserName = ref("");

async function getAskedQuestions() {
  let result = [];
  await axios({
    method: "post",
    url: `${host}/vue-project/getAskedQuestions`,
    data: {
      userId: userId,
      token: cookies.get("token"),
    },
    withCredentials: false,
  }).then((res) => {
    if (res.data.success) {
      result = res.data.others.texts;

      // questionList.value = toRaw(questionList.value)
    }
  });
  return result;
}

async function getQuestions() {
  let result = [];
  await axios({
    method: "post",
    url: `${host}/vue-project/getQuestions`,
    data: {
      userId: userId,
      token: cookies.get("token"),
      toUser: toUser
    },
    withCredentials: false,
  }).then((res) => {
    result = res.data.others.texts;
  });

  return result;
}

function convert() {
  activeTabName.value =
    activeTabName.value === "firstTab" ? "secondTab" : "firstTab";
  isFirst.value = !isFirst.value;
  isSecond.value = !isSecond.value;

  if (isSecond.value) {
    getAskedQuestions().then((res) => {
      questionList.value = [];
      var id_ = 0;
      res.forEach(async (element) => {
        const userName = await getUserNameByUserId(element["toUser"]);
        element["username"] = userName;
        element["_id"] = id_++;
        element["text"] = decodeString(element["text"]);
        element["answer"] = decodeString(element["answer"]);
        questionList.value.push(element);
      });
    });
  } else {
    myQuestionList.value = [];
    getQuestions().then((res) => {
      var id_ = 0;
      res.forEach((element) => {
        element["_id"] = id_++;
        element["text"] = decodeString(element["text"]);
        element["answer"] = decodeString(element["answer"]);

        myQuestionList.value.push(element);
      });
    });
  }
}

function clickCard(cardId) {
  drawer.value = true;
  clickedCardId.value = cardId;
}

onMounted(() => {
  getQuestions().then((res) => {
    var id_ = 0;
    res.forEach((element) => {
      element["_id"] = id_++;
      element["text"] = decodeString(element["text"]);
      element["answer"] = decodeString(element["answer"]);

      myQuestionList.value.push(element);
    });
  });
  getUserNameByUserId(toUser).then((res) => {
    toUserName.value = res;
    document.title = `${res} 的提问箱！`;
  });
});

const handleClose = () => {
  drawer.value = false;
  clickedCardId.value = -1;
};

const isMobile = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
    ? true
    : false
);
const isMobileV = isMobile.value;

const drawerOpenDirection = ref(isMobileV ? "btt" : "rtl");
const drawerSize = ref(isMobileV ? "70%" : "30%");
const colLength = ref(isMobileV ? 22 : 4);
const colOffset = ref(isMobileV ? 1 : 0);
const tabPosition = ref(isMobileV ? "top" : "left");
const tabPaneClassName = ref(isMobileV ? "tabPane_Mobile" : "tabPane_PC");
</script>
<template>
  <el-container style="margin-top: 10px">
    <el-tabs
      v-model="activeTabName"
      @tab-click="convert"
      :tab-position="tabPosition"
      :class="tabPaneClassName"
      stretch
    >
      <el-tab-pane :label="`问${prep}的问题`" name="firstTab">
        <el-row v-if="isFirst" :gutter="8" class="card-row">
          <el-col
            :span="colLength"
            :offset="colOffset"
            v-if="userId !== toUser"
          >
            <el-card
              style="margin-top: 5px"
              shadow="hover"
              @click.native="clickCard(-1)"
            >
              <el-text type="warning">发起新的提问！</el-text>
            </el-card>
          </el-col>
          <el-col
            :span="colLength"
            :offset="colOffset"
            v-for="item in myQuestionList"
            :key="item._id"
          >
            <el-card
              :class="{ stB: userId == toUser && item.answered == false }"
              shadow="hover"
              @click.native="clickCard(item._id)"
            >
              <el-text class="h-30px card-text" truncated>
                {{ item.text }}
              </el-text>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="我问的问题" name="secondTab" v-if="isMyAskbox">
        <el-row v-if="isSecond" :gutter="20">
          <el-col
            :span="colLength"
            :offset="colOffset"
            v-if="userId === toUser"
          >
            <el-card
              style="margin-top: 5px"
              shadow="hover"
              @click.native="clickCard(-1)"
            >
              <template #header><el-text>「」</el-text></template>
              <el-text type="warning">绑定问题！</el-text>
            </el-card>
          </el-col>
          <el-col
            :span="colLength"
            :offset="colOffset"
            v-for="item in questionList"
            :key="item._id"
          >
            <el-card
              style="margin-top: 5px"
              shadow="hover"
              @click.native="clickCard(item._id)"
            >
              <template #header>
                <span
                  >To: <el-text tag="b">{{ item.username }}</el-text></span
                >
              </template>
              <el-text truncated>
                {{ item.text }}
              </el-text>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      v-model="drawer"
      :size="drawerSize"
      title="I am the title"
      :with-header="false"
      :before-close="handleClose"
      :direction="drawerOpenDirection"
    >
      <askOthersVue
        v-if="toUser !== userId && clickedCardId == -1"
        :to-user="toUser"
      ></askOthersVue>
      <answerQuestions
        v-else-if="
          clickedCardId !== -1 &&
          toUser === userId &&
          activeTabName == 'firstTab'
        "
        :question="myQuestionList[clickedCardId]"
      ></answerQuestions>
      <othersQuestion
        v-else-if="clickedCardId !== -1 && toUser !== userId"
        :question="myQuestionList[clickedCardId]"
      ></othersQuestion>
      <myAskedQuestions
        v-else-if="
          toUser === userId &&
          activeTabName == 'secondTab' &&
          clickedCardId !== -1
        "
        :question="questionList[clickedCardId]"
      ></myAskedQuestions>
      <tieQuestion
        v-else-if="
          toUser === userId &&
          activeTabName == 'secondTab' &&
          clickedCardId == -1
        "
      ></tieQuestion>
    </el-drawer>
  </el-container>
</template>

<style scoped>
.tabPane_PC {
  width: 100%;
}

.tabPane_Mobile {
  width: 100%;
}

.el-card {
  width: 100%;
  margin-top: 5px;
  border: 1px solid black;
}

.stB {
  background-color: #fbfbfb;
}

.card-row {
  display: flex;
}

.card-text {
  flex-grow: 1;
}
</style>
