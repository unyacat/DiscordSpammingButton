<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-spacer />
            <div class="headline">ボタンを編集してみましょう</div>
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
                @click.stop="updateDatabase"
                :disabled="!formValid"
              >
                保存
              </v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
          <v-spacer />
          <div class="headline">ボタンを削除する</div>
          <v-spacer />
            <v-row justify="end">
            <v-btn color="error" class="mr-4" @click.stop="dialog.isValid = true">
              <v-icon class="pr-6" dark right>mdi-delete</v-icon>
              削除
            </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
    <v-dialog
            v-model="dialog.isValid"
            max-width="580"
    >
      <v-card>
        <v-card-title class="headline">本当に削除しますか？</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog.isValid = false"
          >
            削除しない
          </v-btn>

          <v-btn
                  color="red darken-1"
                  text
                  @click="deleteCard($route.params.id)"
          >
            削除する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  name: "edit",
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
      },
      dialog: {
        isValid: false,
      }
    };
  },
  created() {
    this.$db
      .collection("messages")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.form.name = doc.data().disp_name;
          this.form.content = doc.data().content;
          this.form.url = doc.data().avatar_url;
        } else {
          this.$router.replace("/");
        }
      })
      .catch(function(error) {
        alert(error);
      });
  },
  methods: {
    httpReCheck: function(v) {
      const httpReObj = new RegExp(
        "http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?"
      );
      return httpReObj.test(v);
    },
    updateDatabase: function() {
      if (this.$refs.form.validate()) {
        this.$db
          .collection("messages")
          .doc(this.$route.params.id)
          .update({
            disp_name: this.form.name,
            content: this.form.content,
            avatar_url: this.form.url
          })
          .then(() => {
            this.snackbar.isValid = true;
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
      const webhookURL = process.env.VUE_APP_WEBHOOK_URL;
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
    },
    deleteCard: function (id) {
      this.dialog.isValid = false;
      this.$db.collection("messages").doc(id).delete()
      .then(() => {
        this.$router.replace("/");
      })
      .catch(() => {
        this.alert("なにかがおかしいよ")
      });
    }
  }
};
</script>

<style scoped></style>
