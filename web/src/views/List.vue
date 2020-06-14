<template>
  <v-container>
    <v-row dense v-show="!this.$route.query.keyword">
      <v-col>
        <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.cover" :to="'play/' + item._id"></v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row dense v-show="this.$route.query.keyword">
      <v-col>
        <v-parallax height="300" dark :src="require('@/assets/images/banner.jpg')">
          <v-row align="center" justify="center">
            <v-col class="text-center" cols="12">
              <h1 class="display-1 font-weight-thin mb-4">搜索 {{ this.$route.query.keyword }}</h1>
              <!-- <h4 class="subheading"></h4> -->
            </v-col>
          </v-row>
        </v-parallax>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="(card, index) in cards" :key="index" cols="12" :lg="4" :md="4" :sm="6">
        <v-card color="dark">
          <router-link :to="'play/' + card._id">
            <v-img :src="card.cover" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.2)" height="180px">
              <!-- <v-card-title v-text="card.title"></v-card-title> -->
            </v-img>
          </router-link>
          <v-card-text class="text--primary align-end">
            <router-link :to="'/play/' + card._id">
              <p class="font-weight-medium headline white--text">{{ card.title }}</p>
            </router-link>
            <div class="text--secondary subtitle-2">{{ card.createdAt | formatTime }}</div>
          </v-card-text>

          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->

            <v-btn icon>
              <v-icon :style="{ color: card.type === 'favorite' ? 'red' : 'grey' }" @click="changeColor($event, card)">mdi-heart</v-icon>
            </v-btn>
            <span class="card-meta">{{ card.favorite_num }}</span>

            <!-- <v-btn icon>
              <v-icon>mdi-bookmark</v-icon>
            </v-btn>-->

            <!-- <v-btn icon> -->
            <v-icon>mdi-eye</v-icon>
            <span class="card-meta ml-2">{{ card.click_num }}</span>
            <!-- </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <div class="text-center" v-show="pages_count > 1">
          <v-pagination
            v-model="query.page"
            :length="pages_count"
            circle
            @next="next()"
            @previous="prev()"
            @input="changePage()"
            :value="query.page"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { deleteProperties, setProperties } from '../assets/js/utils'
@Component({})
export default class List extends Vue {
  name = 'List'

  pages_count = 0

  cards = null
  items = null
  query = { limit: 5, page: 1, where: {} }

  created() {
    this.fetchTop()
    if (this.$route.query.keyword) {
      let where = {}
      where['title'] = { $regex: this.$route.query.keyword }
      setProperties(this.query.where, where)
      // this.query["where"] = where;
    }
  }
  // 监听路由
  @Watch('$route', { immediate: true, deep: true })
  refresh(newVal: any) {
    // console.log(newVal.query.keyword)
    if (newVal.query.keyword) {
      let where = {}
      where['title'] = { $regex: newVal.query.keyword }
      // this.query["where"] = where;
      setProperties(this.query.where, where)
    } else {
      //关键字为空,查询所有
      deleteProperties(this.query.where)
    }
    this.fetchVideos()
  }
  async changeColor({ target }, card) {
    //原本red，点击后是grey，like为false
    // alert(id);
    let like = card.type === 'favorite' ? false : true
    if (!like) {
      card.type = 'history'
      // target.style.color = "grey";
      card.favorite_num--
    } else {
      // target.style.color = "red";
      card.type = 'favorite'
      card.favorite_num++
    }

    await this.$http.get('records/favorite', {
      params: { video: card._id, like: like }
    })
  }
  async fetchTop() {
    const res = await this.$http.get('videos/top')
    this.items = res.data
  }
  async fetchVideos() {
    let headers = {}
    let req_url = 'videos'
    //获取token
    const token = window.localStorage.getItem('token')
    if (token) {
      req_url = 'videos/home'
    }
    const res = await this.$http.get(req_url, {
      params: this.query,
      headers: headers
    })
    this.pages_count =
      res.data.total % this.query.limit == 0 ? res.data.total / this.query.limit : Math.floor(res.data.total / this.query.limit) + 1
    this.cards = res.data.data
  }
  next() {
    this.fetchVideos()
  }
  prev() {
    this.fetchVideos()
  }
  changePage(number) {
    this.fetchVideos()
  }
}
</script>
<style lang="less" scoped>
.card-meta {
  margin-right: 10px;
  // min-width: 25px;
}
</style>
