<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div id="player-wrapper">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
          <v-btn
            absolute
            dark
            fab
            right
            id="btn-like"
            :style="{backgroundColor:this.state === true?'transparent':'red',
            color:this.state === true?'red':'white'}"
            @click="changeColor($event)"
          >
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </div>
        <!-- @ready="playerIsReady" -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
//videoplayer
import VideoPlayer from "vue-video-player";
require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
// import "videojs-hotkeys";
// import "videojs-flash";
Vue.use(VideoPlayer);
//不能缺少{}
@Component({})
export default class Video extends Vue {
  @Prop(String) id?: string;
  name = "Video";
  state = false;
  playerOptions = {
    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
    autoplay: false, //如果true,浏览器准备好时开始回放。
    muted: false, // 默认情况下将会消除任何音频。
    loop: false, // 导致视频一结束就重新开始。
    preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: "zh-CN",
    aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    sources: [
      {
        type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
        src: null
        //url地址
      }
    ],
    poster: null, //你的封面地址
    // width: document.documentElement.clientWidth, //播放器宽度
    notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
    // techOrder: ["flash"],
    controlBar: {
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      fullscreenToggle: true //全屏按钮
    }
  };
  // mounted() {
  //   console.log('this is current player instance object', this.player)
  // }
  //ts中
  // get player(){
  //   return this.$refs.videoPlayer.player
  // }
  created() {
    this.fetch();
    // alert(this.state);
  }
  async fetch() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      try {
        const res = await this.$http.get(`videos/favorite/${this.id}`, {
          headers: { Authorization: token },
          params: { id: this.id }
        });
        this.state = res.data.favorite;
        // console.log(res.data)
      } catch (error) {
        console.log("get favorite state err");
      }
      //写入用户浏览历史
      try {
        await this.$http.get("records/history", {
          headers: { Authorization: token },
          params: { video: this.id }
        });
      } catch (error) {
        console.log("write user history err");
      }
    }

    const res = await this.$http.get(`videos/detail/${this.id}`);
    // this.options.video.pic = res.data.cover;
    // this.options.video.url = res.data.url;
    // this.playerOptions.sources[0].src = res.data.url;
    this.playerOptions.sources[0].src = res.data.url;
    this.playerOptions.poster = res.data.cover;
    // alert(res.data.url);

    // console.log(res);
  }

  async changeColor({ target }) {
    //原本red，点击后是grey，like为false
    this.state = !this.state;
    const token = window.sessionStorage.getItem("token");
    await this.$http.get("records/favorite", {
      params: { video: this.id, like: this.state },
      headers: { Authorization: token }
    });
  }

}
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