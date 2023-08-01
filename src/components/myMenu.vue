<script setup>
import cookies from "vue-cookies";
import { ref } from "vue";
import { useRoute } from "vue-router";

const userId = cookies.get("userId") ? cookies.get("userId") : "-1";
const myAskboxPath = `/askbox/${userId}`;
const userName = userId == "-1" ? "未登录" : cookies.get("userName");

const route = useRoute();
const activeIndex = ref("1");
const navDisabled = ref(userId == "-1");

const showSettings = ref(userId !== "-1")
const showLogout = ref(userId !== "-1")
const showMyAskbox = ref(userId !== "-1")

console.log(userId,userName)
function logout(){
  cookies.remove('userName')
  cookies.remove('userId')
  cookies.remove('token')

  userId.value = "-1"
  userName.value = "未登录"

  console.log('Logout!')
}

</script>

<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    router
    :ellipsis="false"
  >
    <div class="flex-grow"></div>
    <el-sub-menu index="1">
      <template #title>
        <el-text
          :type="userId == '-1' ? 'default' : 'primary'"
          id="_userName"
          style="padding: 0 20px"
          tag="b"
          >{{ userName }}</el-text
        >
      </template>
      <el-menu-item :index="myAskboxPath" v-if="showMyAskbox" 
        >我的提问箱</el-menu-item
      >
      <el-menu-item index="/settings" v-if="showSettings">设置</el-menu-item>
      <el-menu-item index="/login">登录 / 注册</el-menu-item>
      <el-menu-item index="/login" v-if="showLogout" @click="logout()">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
