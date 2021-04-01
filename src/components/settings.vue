<template>
  <v-container>
    <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
                <v-spacer />
                <div class="headline font-weight-light">設定</div>
                <v-spacer />
                設定はローカルストレージに保存され，サーバーには送信されません．
                <v-form v-model="formValid" ref="form" lazy-validation>
                <v-text-field
                    :rules="nameRules"
                    label="略称"
                    v-model="form.name"
                    required
                />
                <v-text-field
                    label="Webhook URL"
                    :rules="urlRules"
                    v-model="form.url"
                    required
                />

                <v-row justify="end">
                    <v-btn
                        color="success"
                        class="mr-4"
                        @click.stop="addLocalStorage"
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

    <div v-for="item in discordUrisTmp" v-bind:key="item.url">
      <v-row>
        <v-col cols="12">
          <v-card
            elevation="2"
          >
            <v-card-text>
              <v-spacer />
              <div class="headline font-weight-light"> {{ item.name }}</div>
              <v-spacer />
              {{ item.url }}
              <v-row justify="end">
                <v-btn
                    color="error"
                    class="mr-4"
                    @click.stop="deleteLocalStorage(item.url)"
                >
                <v-icon class="pr-6" dark right>mdi-delete</v-icon>
                削除
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      top
    >
      登録が完了しました！トップに戻って右上から送信先を指定してみましょう．
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  name: "add",
  data() {
    return {
      formValid: true,
      nameRules: [
        v => (!!v||this.snackbar===true) || "名前は必ず入力してください．",
      ],
      urlRules: [
        v => (!!v||this.snackbar===true) || "Webhook URL は必ず入力してください．",
        v =>  (this.httpReCheck(v)||this.snackbar===true) || "URL が不正です"
      ],
      form: {
        name: "",
        url: ""
      },
      discordUrisTmp: JSON.parse(localStorage.discordUris || null),
      timeout: 3500,
      snackbar: false
    };
  },
  methods: {
    httpReCheck: function(v) {
      const httpReObj = new RegExp(
        "http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?"
      );
      return httpReObj.test(v);
    },
    addLocalStorage: function() {
      if (this.$refs.form.validate()) {
        let datalist = JSON.parse(localStorage.discordUris || null);
        if (!datalist) datalist = []
        datalist.push({
            "name": this.form.name,
            "url": this.form.url
        })
        localStorage.discordUris = JSON.stringify(datalist)
        this.discordUrisTmp = datalist
        this.form.name = ""
        this.form.url = ""
        this.snackbar = true
      }
    },
    deleteLocalStorage: function(value) {
        const res = this.discordUrisTmp.filter(content => content.url !== value)
        this.discordUrisTmp = res
        localStorage.discordUris = JSON.stringify(res)
    }
  }
};
</script>

<style scoped></style>
