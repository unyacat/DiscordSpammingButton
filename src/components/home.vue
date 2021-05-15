<template>
  <v-container>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex
          v-for="messageCard in messageCards"
          :key="messageCard.id"
          xs12
          sm6
          md6
          lg4
        >
          <sendButton :messageCard="messageCard" :snackbar-handler="snackbarHandler"/>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
            v-model="snackbar.isValid"
            :timeout="snackbar.timeout"
            color="error"
    >
      <div>
        <v-icon dark left> mdi-close </v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          はじめてですか？
        </v-card-title>
        <v-card-text>Discord の Webhook URL を登録してください．登録したら右上から送信先を選択しましょう．</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              link
              href="/settings"
             >
            設定する
          </v-btn>
          <v-btn
            color="blue"
            text
            @click="dialog = false"
          >
          閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import sendButton from "../components/sendButton";

export default {
  name: "home",
  components: {
    sendButton
  },
  data() {
    return {
      messageCards: [],
      snackbar: {
        isValid: false,
        timeout: 3000,
        text: ""
      },
      dialog: false
    };
  },
  created() {
    if (localStorage.getItem("selectedDiscordUri") === null) {
      this.dialog = true
      let datalist =[]
      datalist.push({
        "name": "default",
        "url": process.env.VUE_APP_DEFAULT_URI
      })
      localStorage.discordUris = JSON.stringify(datalist)
    }
    this.$db.collection("messages").orderBy("timestamp").onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          let data = {
            id: change.doc.id,
            content: change.doc.data().content,
            name: change.doc.data().disp_name,
            avatar_url: change.doc.data().avatar_url,
          };
          this.messageCards.push(data);
        }
        if (change.type === "removed") {
          let removedCardId = change.doc.id;
          this.messageCards = this.messageCards.filter(function (messageCard) {
            return messageCard.id !== removedCardId;
          });
        }
        if (change.type === "modified") {
          let modifiedCardId = change.doc.id;
          this.messageCards = this.messageCards.filter(function (messageCard) {
            if (messageCard.id === modifiedCardId) {
              messageCard.content = change.doc.data().content;
              messageCard.name = change.doc.data().disp_name;
              messageCard.avatar_url = change.doc.data().avatar_url;
            }
            return messageCard;
          });
        }
      });
    });
  },
  methods: {
    snackbarHandler: function (res) {
      this.snackbar.isValid = true;
      this.snackbar.text = res.status + ": " + res.statusText;
    }
  }
};
</script>

<style scoped></style>
