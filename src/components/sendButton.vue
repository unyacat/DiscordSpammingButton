<template>
  <v-card
    class="text-no-wrap text-truncate"
    @click.stop="sendMessage(messageCard)"
  >
    <v-list-item class="my-n2">
      <v-list-item-avatar size="60" class="ml-1 mr-n1">
        <v-img :src="messageCard.avatar_url" />
      </v-list-item-avatar>
      <v-list-item-content class="ml-2">
        <v-card-title class="mb-n1" v-text="messageCard.name" />
        <v-card-subtitle v-text="messageCard.content" />
      </v-list-item-content>
      <v-list-item-action class="mr-n4 ml-n2 mt-n10">
        <v-menu bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              @click.stop=""
              @mousedown.stop=""
              @touchstart.stop=""
              v-on="on"
            >
              <v-icon small>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :href="/edit/ + messageCard.id">
              <v-icon class="mr-3">mdi-pencil</v-icon>  編集
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "sendButton",
  data() {
    return {};
  },
  props: {
    messageCard: Object,
    snackbarHandler: Function
  },
  methods: {
    sendMessage: function(messageCard) {
      if (!localStorage.getItem("selectedDiscordUri")) {
        this.$parent.snackbar.isValid = true;
        this.$parent.snackbar.text = "WebhookのURLを登録・指定してください"
      }
      const webhookURL = localStorage.selectedDiscordUri;
      
      axios
        .post(webhookURL, {
          content: messageCard.content
            .replace(/¥n/g, "\n")
            .replace(/\\n/g, "\n"),
          username: messageCard.name,
          avatar_url: messageCard.avatar_url
        })
        .catch(error => {
          this.$parent.snackbar.isValid = true;
          this.$parent.snackbar.text =
            error.response.status + ": " + error.response.data.message;
        });
    }
  }
};
</script>

<style scoped></style>
