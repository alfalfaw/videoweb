<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped color="#34C4D7">
      <v-list dense>
        <!-- :to="item.link" -->
        <v-list-item v-for="item in items" :key="item.text" @click="checkLogin(item)">
          <v-list-item-action>
            <v-icon color="white darken-1">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text text--lighten-1">{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item class="mt-4" link>
          <v-list-item-action>
            <v-icon color="grey darken-1">mdi-plus-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Browse Channels</v-list-item-title>
        </v-list-item>-->
        <v-list-item @click="drawer = !drawer;sheet=!sheet">
          <v-list-item-action>
            <v-icon color="white light-1">lock</v-icon>
          </v-list-item-action>
          <v-list-item-title class="white--text text--lighten-1">登陆/注册</v-list-item-title>
        </v-list-item>
        <v-list-item v-show="isAdmin" :to="{name: 'Login'}">
          <v-list-item-action>
            <v-icon color="white light-1">widgets</v-icon>
          </v-list-item-action>
          <v-list-item-title class="white--text text--lighten-1">后台</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white" />
      <!-- <v-icon class="mx-4">home</v-icon> -->
      <v-toolbar-title class="mr-12 align-center">
        <span class="title white--text text--lighten-1">
       
          伢伢粉丝后援团</span>
      </v-toolbar-title>
      <v-spacer />
      <v-row align="center" style="max-width: 650px">
        <v-text-field
          color="white"
          @click:append="search()"
          placeholder="搜索..."
          single-line
          clearable
          append-icon="search"
          hide-details
          @keyup.enter="search()"
          v-model="keyword"
        />
      </v-row>
    </v-app-bar>

    <v-content>
      <router-view :key="$route.path"></router-view>
      <v-row>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>伢伢粉丝后援团</strong>
        </v-col>
      </v-row>
    </v-content>
    <v-bottom-sheet v-model="sheet" inset>
      <div class="pa-4" id="login-wrapper">
        <v-form ref="form" @submit.prevent="login">
          <v-text-field v-model="loginModel.username" label="用户名"></v-text-field>

          <v-text-field
            v-model="loginModel.password"
            label="密码"
            type="password"
            autocomplete="new-password"
          ></v-text-field>

          <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
          <v-btn color="success" class="mr-4" type="submit">登陆</v-btn>
          <v-btn color="info" class="mr-4" @click="register">注册</v-btn>
        </v-form>
      </div>
    </v-bottom-sheet>
  </v-app>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop() private source!: string;
  name = "Home";
  drawer = null;
  keyword = "";
  //菜单
  items = [
    { icon: "home", text: "主页", link: "/", isPrivate: false },
    { icon: "favorite", text: "收藏", link: "/user/favorite", isPrivate: true },
    { icon: "history", text: "历史", link: "/user/history", isPrivate: true },
    { icon: "archive", text: "归档", link: "/archive", isPrivate: false },
    { icon: "folder", text: "文件", link: "/file", isPrivate: false }
  ];
  //表单
  sheet = false;
  loginModel = { username: "", password: "" };
  //是否注册
  isRegister = false;
  //是否管理员
  isAdmin = false;
  //是否登陆
  isLogin = false;
  //登陆
  async login() {
    try {
      const res = await this.$http.post("/auth/login", this.loginModel);
      if (res.data.access_token) {
        //保存token,nestjs规定token值必须前面加上"Bearer "
        window.sessionStorage.setItem(
          "token",
          "Bearer " + res.data.access_token
        );

        //导航至首页
        let msg = this.isRegister ? "注册成功" : "登陆成功";
        // this.showDialog("success", msg);
        this.$message.success(msg);
        this.sheet = false;
        this.isLogin = true;
        // this.isAdmin = res.data.admin;
        if (res.data.admin) {
          this.isAdmin = true;
          //保存是否为管理员
          window.sessionStorage.setItem("admin", "true");
        }
      }
    } catch (error) {
      // this.showDialog("error", "密码不对哦");
      this.$message.warning("密码不对哦");
      this.loginModel["password"] = "";
    }
  }
  //检查用户是否登陆
  checkLogin({ isPrivate, link }) {
    //非检查项
    if (!isPrivate) {
      this.$router.push(link);
      return;
    }
    if (!this.isLogin) {
      // this.showDialog("info", "请先登陆");
      this.$message.warning("请先登陆");
    } else {
      this.$router.push(link);
    }
  }
  reset() {
    this.loginModel.username = "";
    this.loginModel.password = "";
  }
  search() {
    this.$router.push({ path: "/", query: { keyword: this.keyword } });
  }
  //注册
  async register() {
    if (this.loginModel.username == "" || this.loginModel.password == "") {
      this.$message.warning("请填写用户必要信息");
      return;
    }
    //用户在注册
    this.isRegister = true;
    //解构赋值
    let registerModel = { ...this.loginModel };
    registerModel["admin"] = false;
    const res = await this.$http.post("users/create", registerModel);
    if (!res.data.success) {
      // this.showDialog("error", res.data.msg);
      this.$message.warning(res.data.msg);
      return;
    }
    this.login();
  }
  created() {
    // this.$vuetify.theme.dark = false;
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword.toString();
    }
    //检查用户是否登陆
    const token = window.sessionStorage.getItem("token");
    if (token) this.isLogin = true;
    else this.isLogin = false;
    //检查用户是否为admin
    const admin = window.sessionStorage.getItem("admin");
    if (admin == "true") this.isAdmin = true;
    else this.isAdmin = false;
  }
}
</script>
<style lang="less" scoped>
.v-toolbar {
  background: #34c4d7 !important;
}
#app {
  text-align: left !important;
}
#login-wrapper {
  background: #fff !important;
}
</style>