<script setup>
import cookies from "vue-cookies"
import { ref } from 'vue'
const userId = cookies.get('userId') ? cookies.get('userId') : "-1"
const myAskboxPath = `/askbox/${userId}`
const userName = cookies.get('userName')

const activeIndex = ref("1")
</script>

<template>
  <el-menu :default-active="activeIndex" mode="horizontal" router :ellipsis="false">
    <el-menu-item index="/">Home</el-menu-item>
    <el-menu-item index="/login">登录</el-menu-item>
    <el-menu-item :index=myAskboxPath>我的提问箱</el-menu-item>
    <div class="flex-grow"></div>
    <el-text type="primary" id="_userName" style="padding: 0 20px;" tag="b">{{ userName }}</el-text>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>