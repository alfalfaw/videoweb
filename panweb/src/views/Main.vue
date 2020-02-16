<template>
  <el-container>
    <el-aside width="200px">
      <el-menu mode="vertical" :default-active="$route.path" router
      style="height=100vh;">
        <el-menu-item
          v-for="(item, index) in menu.items"
          :index="item.path"
          :key="`item-${index}`"
        >{{item.title}}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="50px">
        <h2 class="center">伢伢后援会</h2>
        <!-- Header content -->
      </el-header>
      <el-main>
        <!-- vue复用基于path更新数据 -->
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Main extends Vue {
  menu = {
    items: [
      { title: "视频管理", path: "/admin/videos/list" },
      { title: "用户管理", path: "/admin/users/list" },
      { title: "记录管理", path: "/admin/records/list" },
    ]
  };
}
</script>

<style>

</style>