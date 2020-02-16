<template>
  <v-container>
    <v-row dense>
      <v-col>
        <v-parallax height="300" dark :src="require('@/assets/images/banner.png')">
          <v-row align="center" justify="center">
            <v-col class="text-center" cols="12">
              <h1 class="display-1 font-weight-thin mb-4">{{ resource==='history'?'浏览历史':'收藏' }}</h1>
              <!-- <h4 class="subheading"></h4> -->
            </v-col>
          </v-row>
        </v-parallax>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="(card,index) in cards" :key="index" cols="12" :lg="4" :md="4" :sm="6">
        <v-card>
          <router-link :to="'/play/'+card._id">
            <v-img
              :src="card.cover"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.2)"
              height="180px"
            >
              <!-- <v-card-title v-text="card.title"></v-card-title> -->
            </v-img>
          </router-link>

          <v-card-text class="text--primary align-end">
            <router-link :to="'/play/'+card._id">
              <div class="headline">{{card.title}}</div>
            </router-link>
            <div>{{card.createdAt|formatTime}}</div>
          </v-card-text>

          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->

            <v-btn icon>
              <!-- :color=" card.type === 'favorite'?'red':'' " -->
              <v-icon
                :style="{color:card.type === 'favorite'?'red':'grey'}"
                @click="changeColor($event,card)"
              >mdi-heart</v-icon>
            </v-btn>
            <span class="card-meta">{{card.favorite_num}}</span>

            <!-- <v-btn icon>
              <v-icon>mdi-bookmark</v-icon>
            </v-btn>-->

            <v-icon>mdi-eye</v-icon>
            <span class="card-meta ml-2">{{card.click_num}}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <div class="text-center" v-show="pages_count>1">
          <v-pagination
            v-model="query.page"
            :length="pages_count"
            circle
            @next="next()"
            @previous="prev()"
            @input="changePage()"
            :value="page"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { deleteProperties, setProperties } from "../assets/js/utils";
@Component({})
export default class Record extends Vue {
  @Prop(String) resource!: string;
  pages_count = 0;

  cards = null;
  query = { limit: 5, page: 1, where: {} };

  created() {
    // alert(this.resource);
    //路由变化自动加载
    // this.fetchVideos();
    if (this.$route.query.keyword) {
      let where = {};
      where["title"] = { $regex: this.$route.query.keyword };
      // this.query["where"] = where;
      setProperties(this.query.where, where);
    }
  }
  // 监听路由
  @Watch("$route", { immediate: true, deep: true })
  refresh(newVal: any) {
    // console.log(newVal.query.keyword)
    if (newVal.query.keyword) {
      let where = {};
      where["title"] = { $regex: newVal.query.keyword };
      // this.query["where"] = where;
      setProperties(this.query.where, where);
    } else {
      //关键字为空,查询所有
      deleteProperties(this.query.where);
    }
    this.fetchVideos();
  }
  async changeColor({ target }, card) {
    //原本red，点击后是grey，like为false
    // alert(id);
    let like = target.style.color === "red" ? false : true;
    if (!like) {
      target.style.color = "grey";
      card.favorite_num--;
    } else {
      target.style.color = "red";
      card.favorite_num++;
    }
    const token = window.sessionStorage.getItem("token");
    await this.$http.get("records/favorite", {
      params: { video: card._id, like: like },
      headers: { Authorization: token }
    });
  }

  async fetchVideos() {
    const token = window.sessionStorage.getItem("token");
    try {
      const res = await this.$http.get(`records/collection/${this.resource}`, {
        params: this.query,
        headers: { Authorization: token }
      });
      // console.log(res.data.total);
      this.pages_count =
        res.data.total % this.query.limit == 0
          ? res.data.total / this.query.limit
          : Math.floor(res.data.total / this.query.limit) + 1;
      this.cards = res.data.data;
    } catch (error) {
      console.log("Unauthorized");
    }

    // console.log(this.cards.length);
  }
  next() {
    this.fetchVideos();
  }
  prev() {
    this.fetchVideos();
  }
  changePage(number) {
    this.fetchVideos();
  }
}
</script>
<style lang="less" scoped>
.card-meta {
  margin-right: 10px;
  // min-width: 25px;
}
</style>