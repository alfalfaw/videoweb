<template>
  <!-- <v-container fluid>
  <v-row>
    <v-col>
      <div id="upload-form-wrapper">
        <v-form ref="form" @submit.prevent="upload">
          <v-text-field v-model="videoModel.title" label="标题"></v-text-field>
          <v-text-field v-model="videoModel.desc" label="描述"></v-text-field>
          <v-text-field v-model="videoModel.author" label="作者"></v-text-field>
          <v-file-input
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="选择一张封面"
            prepend-icon="mdi-camera"
            show-size
            label="封面"
          ></v-file-input>
          <v-file-input show-size label="视频"></v-file-input>
          <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
          <v-btn color="success" class="mr-4" type="submit">上传</v-btn>
        </v-form>
      </div>
    </v-col>
  </v-row>
  </v-container>-->
  <v-container>
    <v-row no-gutters>
      <v-col>
        <div id="upload-form-wrapper">
          <v-form ref="form" @submit.prevent="submit">
            <v-text-field v-model="videoModel.title" label="标题"></v-text-field>
            <v-text-field v-model="videoModel.desc" label="描述"></v-text-field>
            <v-text-field v-model="videoModel.author" label="作者"></v-text-field>
            <div id="media-wrapper">
              <v-file-input
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                show-size
                label="封面"
                v-model="image"
              ></v-file-input>

              <v-file-input show-size label="视频" v-model="video"></v-file-input>
            </div>
            <v-checkbox v-model="videoModel.publish">
              <template v-slot:label>
                <div>发布</div>
              </template>
            </v-checkbox>
            <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
            <v-btn color="success" class="mr-4" type="submit" :disabled="!enable">上传</v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { deleteProperties, resetProperties } from "../assets/js/utils";

@Component({})
export default class File extends Vue {
  //   @Prop(String) id?: string;
  name = "File";
  videoModel: any = {
    title: "",
    desc: "",
    author: "",
    cover: null,
    url: null,
    publish: false
  };
  image: any = null;
  video: any = null;
  rules = [value => !value || value.size < 2000000 || "封面图不超过 2 MB!"];
  enable = false;
  mounted() {}

  created() {
    const admin = window.sessionStorage.getItem("admin");
    if (admin == "true") {
      this.enable = true;
    }
  }
  async submit() {
    let formData = new FormData();
    if (this.video) {
      formData.append("video", this.video);
    }
    if (this.image) {
      formData.append("image", this.image);
    }
    // const { data } = await this.$http.post("uploadmany", formData);
    try {
      await this.$http
        .post("uploadmany", formData)
        .then(data => {
          this.videoModel.cover = data.data.cover;
          this.videoModel.url = data.data.url;
        })
        .then(async () => {
          const { data } = await this.$http.post(
            "videos/create",
            this.videoModel
          );
          if (data.success) {
            this.$message.success("上传成功");
            this.reset();
          }
        });
    } catch (error) {
      this.$message.warning("上传失败");
    }

  }
  reset() {
    this.videoModel.title = "";
    this.videoModel.desc = "";
    this.videoModel.author = "";
    this.videoModel.cover = "";
    this.videoModel.url = "";
    this.videoModel.publish = false;
    this.video = null;
    this.image = null;
  }
}
</script>
<style scoped>
#upload-form-wrapper {
  width: 450px;
  margin: auto;
}
</style>