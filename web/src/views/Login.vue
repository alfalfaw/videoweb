<template>
  <div class="login_container">
    <div class="login_box">
      <!-- <div class="avater_box">
            <img src="../assets/logo.png" alt=" ">
      </div>-->
      <h3 class="title">管理员登陆</h3>
      <form action="post" class="login_form" :model="loginForm" @submit.prevent="login">
        <label for="name" class="sr-only">用户名</label>
        <input type="text" placeholder="用户名" id="name" v-model="loginForm.username" />
        <br />
        <label for="password" class="sr-only">密码</label>
        <input type="text" placeholder="密码" id="password" v-model="loginForm.password" />
        <br />
        <div class="check">
          <button id="submit" type="submit">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Login extends Vue {
  loginForm = {
    username: '',
    password: ''
  }
  async login() {
    if (this.loginForm.username === '' || this.loginForm.password === '') {
      this.$message.warning('用户名或密码不能为空')
      return
    }
    try {
      const res = await this.$http.post('auth/login', this.loginForm)

      if (res.data.access_token) {
        //保存token,nestjs规定token值必须前面加上"Bearer "
        window.localStorage.setItem('token', 'Bearer ' + res.data.access_token)
        if (res.data.admin) {
          this.$message.success('登陆成功')
          //保存admin
          window.localStorage.setItem('admin', 'true')
          this.$router.push('/admin/videos/list')
        } else {
          this.$message.error('系统出错,暂时无法处理请求')
        }
      }
    } catch (error) {
      this.$message.error('登陆失败')
      this.loginForm.password = ''
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  //   background-color: rgba(196, 238, 119, 0.37);
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  z-index: 1;
}
.login_container::before {
  content: '';
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: transparent url(../assets/images/banner.jpg);
  // filter: blur(8px);
  z-index: -1;
  background-size: cover;
}
.title {
  margin-top: 2em;
  text-align: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  //   .avater_box{
  //       height: 130px;
  //       width: 130px;
  //       border: 1px solid #eee;
  //       border-radius: 50%;
  //       padding: 10px;
  //       box-shadow: 0 0 10px #ddd;
  //       position: absolute;
  //       left: 50%;
  //       transform: translate(-50%,-45%);
  //       background-color: #fff;
  //       img{
  //           width: 100%;
  //           height: 100%;
  //           border-radius: 50%;
  //           background-color: #fff;
  //       }
  //   }
}
.login_form {
  position: absolute;
  top: 50%;
  transform: translate(0, -40%);
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  text-align: center;
}
.check {
  width: 96.5%;
  text-align: center;
  display: flex;
  flex-direction: row-reverse;
  // justify-content: space-around;
}
input[type='text'] {
  width: 93%;
  outline: none;
  border: none;
  border-bottom: 1px solid #bfbfbf;
  background: transparent;
  padding: 10px 0 10px 0;
  margin: 0 0 10px 0;
  transition: 2s;
}
input[type='text']:focus {
  border-bottom: 1px solid #00b3ff;
}
#submit {
  padding: 5px 8px 5px 8px;
  text-align: center;
  background: #2a2a2a;
  border: none;
  transition: 0.6s;
  color: rgba(255, 255, 255, 0.9);
  // margin-right: 3.5%;
}
#submit:focus {
  outline: none;
  // background: #00b3ff;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
