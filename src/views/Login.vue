<script setup>
  import { ref, inject } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import CryptoJS from "crypto-js";
  import cookies from "vue-cookies"
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()

  const host = "https://burnlingsapi.vercel.app"
  const username = ref('')
  const password = ref('')

  const reloadApp = inject('reload')

  function login(){
    axios({
      method:'post',
      url: `${host}/vue-project/login`,
      data: {
        'username':username.value,
        'password':CryptoJS.MD5(password.value).toString()
      },
      withCredentials: false
    }).then(res => {
      if(res.data.success){
        ElMessage({
          showClose: true,
          message: "登录成功！",
          type: 'success'
        })
        cookies.set('userId',res.data.others.userId)
        cookies.set('userName',username.value)
        cookies.set('token',res.data.others.token)
        reloadApp()
        // router.push('/askbox/'+res.data.others.userId)
        // router.go(1)
      }else{
        ElMessage({
          showClose: true,
          message: res.data.response,
          type: 'error',
        })
      }
    }).catch(function (error) {
      // // console.log(error);
    });
  }
  function register(){
    axios({
      method:'post',
      url: `${host}/vue-project/register`,
      data: {
        'username':username.value,
        'password':CryptoJS.MD5(password.value).toString()
      },
      withCredentials: false
    }).then(res => {
      if(res.data.success){
        ElMessage({
          showClose: true,
          message: "注册成功！",
          type: 'success'
        })
        cookies.set('userId',res.data.others.userId)
        cookies.set('userName',username.value)
        cookies.set('token',res.data.others.token)
        router.push('/askbox/'+res.data.others.userId)
        router.go(1)
      }else{
        ElMessage({
          showClose: true,
          message: res.data.response,
          type: 'error',
        })
      }
    }).catch(function (error) {
      // // console.log(error);
    });
  }
</script>

<template>
  <el-container direction="vertical">
    <el-main>
      <h2>登录</h2>
      <el-form id="input-area">        
        <el-input class="input-box" v-model="username" placeholder="User Name" clearable @keyup.enter.native="login" />
        <el-input class="input-box" v-model="password" placeholder="Password" clearable show-password @keyup.enter.native="login" />
        <el-button @click="login" type="primary" plain>登录</el-button>
        <el-button @click="register" type="primary" plain>注册并登录</el-button>
      </el-form>
    </el-main>
  </el-container>
    
</template>

<style scoped>
#input-area *{
  margin-top: 12px;
}
.el-main{
  width: 30%;
  margin: 0 auto;
}

</style>