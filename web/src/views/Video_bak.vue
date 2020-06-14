<template>
  <VideoPlayer v-if="url" :cover="cover" :url="url" :state="state" :id="id"></VideoPlayer>
</template>

<script>
import VideoPlayer from "../components/VideoPlayer";
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  name: "Video",
  components: {
    VideoPlayer
  },
  data() {
    return {
      state: false,
      url: "",
      cover: ""
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      //获取视频数据
      try {
        const { data } = await this.$http.get(`videos/detail/${this.id}`);
        this.url = data.url;
        // this.url = "http://static.smartisanos.cn/common/video/t1-ui.mp4";
        this.cover = data.cover;
      } catch (error) {
        console.log("retrieve video data error");
      }
      //获取用户喜欢状态
      const token = window.sessionStorage.getItem("token");
      if (token) {
        try {
          const res = await this.$http.get(`videos/favorite/${this.id}`, {
            headers: { Authorization: token },
            params: { id: this.id }
          });
          this.state = res.data.favorite;
        } catch (error) {
          console.log("retrieve favorite state err");
        }
        //写入用户浏览历史
        try {
          await this.$http.get("records/history", {
            headers: { Authorization: token },
            params: { video: this.id }
          });
        } catch (error) {
          console.log("add user history err");
        }
      }
    }
  }
};
</script>
<style scoped>
#btn-like {
  top: 50%;
  transform: translate(0, -28px);
}
.v-btn:before {
  background-color: transparent;
}
#player-wrapper {
  position: relative;
}
</style>