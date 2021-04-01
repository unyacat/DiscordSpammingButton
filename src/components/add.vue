<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-spacer />
        <div class="headline font-weight-light">ボタンを追加してみましょう</div>
        <v-spacer />
        <v-form v-model="formValid" ref="form" lazy-validation>
          <v-text-field
            :counter="32"
            :rules="nameRules"
            label="名前"
            v-model="form.name"
            required
          />

          <v-text-field
            label="文章"
            :rules="contentRules"
            v-model="form.content"
            required
          />

          <v-text-field
            label="アイコン URL"
            :rules="urlRules"
            v-model="form.url"
            required
          />

          <v-row justify="end">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                        color="info"
                        class="mr-4"
                        @click.stop="sendMessage"
                        :disabled="!formValid"
                        v-on="on"
                >
                  テスト送信
                </v-btn>
              </template>
              <span
              >フォーム内容を Discord に送信します．<br />編集はされません．</span
              >
            </v-tooltip>
            <v-btn
                    color="success"
                    class="mr-4"
                    @click.stop="addDatabase"
                    :disabled="!formValid"
            >
              保存
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.isValid"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      <div>
        <v-icon dark left> {{ snackbar.icon }} </v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  name: "add",
  data() {
    return {
      formValid: true,
      nameRules: [
        v => !!v || "名前は必ず入力してください．",
        v => (v && v.length <= 33) || "名前は 32 文字以内です．"
      ],
      contentRules: [v => !!v || "文章は必ず入力してください．"],
      urlRules: [
        v => !!v || "画像 URL は必ず入力してください．",
        v => (v && this.httpReCheck(v)) || "URL が不正です"
      ],
      form: {
        name: "",
        content: "",
        url: ""
      },
      snackbar: {
        isValid: false,
        color: "",
        text: "",
        icon: "",
        timeout: 3000
      }
    };
  },
  methods: {
    httpReCheck: function(v) {
      const httpReObj = new RegExp(
        "http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?"
      );
      return httpReObj.test(v);
    },
    addDatabase: function() {
      if (this.$refs.form.validate()) {
        this.$db
          .collection("messages")
          .add({
            disp_name: this.form.name,
            content: this.form.content,
            avatar_url: this.form.url,
            timestamp: this.$fbts,
            count: 0
          })
          .then(() => {
            this.snackbar.isValid = true;
            this.$refs.form.reset();
            this.snackbar.text = "送信成功";
            this.snackbar.icon = "mdi-check";
            this.snackbar.color = "success";
          })
          .catch(() => {
            this.snackbar.isValid = true;
            this.snackbar.text = "なにかがおかしいよ";
            this.snackbar.icon = "mdi-close";
            this.snackbar.color = "error";
          });
      }
    },
    sendMessage: function() {
      const webhookURL = localStorage.selectedDiscordUri;
      axios
        .post(webhookURL, {
          content: this.form.content.replace(/¥n/g, "\n").replace(/\\n/g, "\n"),
          username: this.form.name,
          avatar_url: this.form.url
        })
        .catch(error => {
          this.snackbar.isValid = true;
          this.snackbar.text = error;
          this.snackbar.icon = "mdi-close";
          this.snackbar.color = "error";
        });
    }
  }
};
</script>

<style scoped></style>

