<template>
  <v-app>
    <div id="app">
      <v-navigation-drawer v-model="drawer" app>
        <v-list dense>
          <v-list-item link href="/">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>ホーム</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link href="/add">
            <v-list-item-action>
              <v-icon>add</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>追加</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link href="/settings">
            <v-list-item-action>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>設定</v-list-item-title>
            </v-list-item-content>
          </v-list-item>


          <v-divider />

          <v-list-group prepend-icon="mdi-hammer" no-action>
            <template v-slot:activator>
              <v-list-item-title>開発</v-list-item-title>
            </template>

            <v-list-item @click.stop="deleteCache">
              <v-list-item-content>
                <v-list-item-title>強制更新</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-refresh</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="#7289DA" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Discord Spamming Button</v-toolbar-title>
        <v-spacer />
        <div style="width: 10em">
          <v-select
            :hide-details="true"
            :items="discordUris"
            item-text="name"
            item-value="url"
            dense
            :value="selectedDiscordUri"
            @change="changeDiscordUris"
          />
        </div>
      </v-app-bar>

      <v-content>
        <router-view />
      </v-content>
    </div>
  </v-app>
</template>

<script>

export default {
  name: "app",
  data() {
    return {
      drawer: false,
      discordUriIdx: ""
    };
  },
  computed: {
    discordUris: function() {
      return JSON.parse(localStorage.discordUris || null)
    },
    selectedDiscordUri: function() {
      return localStorage.selectedDiscordUri
    }
  },
  methods: {
    deleteCache: function() {
      navigator.serviceWorker.getRegistration().then(registration => {
        registration.unregister().then(() => {
          this.$router.go({
            path: this.$router.currentRoute.path,
            force: true
          });
        });
      });
    },
    changeDiscordUris: function(value) {
      localStorage.selectedDiscordUri = value
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
