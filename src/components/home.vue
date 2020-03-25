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
    };
  },
  created() {
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
