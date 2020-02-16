<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row justify="space-between">
          <v-col cols="12">
            <v-btn rounded dark class="ml-4" id="btn-today">今天</v-btn>
          </v-col>
        </v-row>
        <v-timeline dense clipped>
          <div v-for="(archive,index) in archives" :key="index+''">
            <v-timeline-item fill-dot class="mb-1" middle :color="colors[index%colors.length]">
              <template v-slot:icon>
                <span
                  class="caption white--text text--lighten-1"
                >{{archive._id.month+'.'+archive._id.day}}</span>
              </template>
            </v-timeline-item>

            <v-timeline-item
              :color="colors[index%colors.length]"
              small
              v-for="(video,subIndex) in archive['videos']"
              :key="'sub-'+subIndex"
            >
              <!-- <v-row justify="space-between"> -->
              <!-- <v-col cols="7">{{video}}</v-col> -->
              <!-- <v-card class="elevation-2">
                <v-card-title class="headline">{{video.title}}</v-card-title>
                <v-card-text>
                  <v-chip class="ma-2" color="white" label text-color="grey" x-small>
                    <v-icon left small>mdi-eye</v-icon>
                    {{video.click_num}}
                  </v-chip>
                  <v-chip class="ma-2" color="white" label text-color="grey" x-small>
                    <v-icon left small color="red">mdi-heart</v-icon>
                    {{video.favorite_num}}
                  </v-chip>
                </v-card-text>

              </v-card>-->
              <v-card class="left" :color="colors[index%colors.length]" dark max-width="400">
                <v-card-title>
                  <!-- <v-icon large left>mdi-bili</v-icon> -->
                  <span class="title font-weight-light">{{video.title}}</span>
                </v-card-title>

                <v-card-text class="headline">{{video.title}}</v-card-text>

                <v-card-actions>
                  <v-list-item class="grow">
                    <v-list-item-content>
                      <v-list-item-title></v-list-item-title>
                    </v-list-item-content>

                    <v-row align="center" justify="end">
                      <v-icon class="mr-1">mdi-eye</v-icon>
                      <span class="subheading mr-2">{{video.click_num}}</span>
                      <span class="mr-1"></span>
                      <v-icon class="mr-1">mdi-heart</v-icon>
                      <span class="subheading">{{video.favorite_num}}</span>
                    </v-row>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </v-timeline-item>
          </div>
        </v-timeline>

        <v-row justify="space-between">
          <v-col cols="12">
            <v-btn rounded dark class="ml-4" id="btn-begin">开始</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Archive extends Vue {
  //   @Prop(String) id?: string;
  name = "Archive";
  archives = null;
  colors = ["#FFCC80", "#81C784"];

  mounted() {}

  created() {
    this.fetch();
  }
  async fetch() {
    const res = await this.$http.get("videos/archive");
    console.log(res.data);
    this.archives = res.data;
  }
}
</script>
<style scoped>
#btn-today {
  position: relative;
  top: 10px;
  left: 1px;
  background: #34c4d7;
}
#btn-begin {
  position: relative;
  left: 1px;
  bottom: 11px;
  color: #000;
  background: #fff;
}
</style>