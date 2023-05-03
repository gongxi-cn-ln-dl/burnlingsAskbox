<script setup>
import { RouterView, RouterLink } from 'vue-router'
import cookies from "vue-cookies"
import { ref, reactive, provide, nextTick } from 'vue'
import myMenu from './components/myMenu.vue'

const userId = ref('-1')

const routerState = ref(true)
function reload(){
  userId.value = cookies.get('userId') ? cookies.get('userId') : "-1"
  routerState.value = false
  routerState.value = true
}

reload()
provide('reload', reload)
</script>

<template>
  <el-container direction="vertical">
    <myMenu :key="userId"></myMenu>
    <RouterView v-if="routerState" />
  </el-container>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>