<script setup>
import cookies from "vue-cookies"
import { useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
// import myAskbox from '../components/myAskBox.vue'
// import othersAskBox from "../components/othersAskBox.vue"
import Askbox from "@/components/Askbox.vue"

const userId = cookies.get('userId')
const route = useRoute()
// console.log(userId,route.params.id)

// const content = ref((userId == route.params.id) ? myAskbox : othersAskBox)
const content = ref(Askbox)

</script>

<template>
  <component :is="content"></component>
</template>

<style scoped>

</style>