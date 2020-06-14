<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div id="player-wrapper">
          <d-player ref="player" :options="options"></d-player>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "../../node_modules/dplayer/dist/DPlayer.min.css";
export default {
  name: "VideoPlayer",
  props: {
    cover: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    state: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      player: null,
      options: {
        video: {
          url: this.url,
          pic: this.cover
        },
        screenshot: true,
        lang: "zh-cn",
        autoplay: false
      }
    };
  },
  created() {
  },

  mounted() {
    this.player = this.$refs.player.dp;
  },
  components: {
    "d-player": VueDPlayer
  },
  methods: {
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
};
</script>

<style scoped>
#btn-like {
  top: 50%;
  transform: translate(0, -33px);
}
.v-btn:before {
  background-color: transparent;
}
#player-wrapper {
  position: relative;
}
</style>