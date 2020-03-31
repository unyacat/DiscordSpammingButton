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

          <v-divider />

          <v-list-group prepend-icon="mdi-hammer" no-action>
            <template v-slot:activator>
              <v-list-item-title>開発</v-list-item-title>
            </template>

            <v-list-item link href="https://hackmd.io/Fbc7-9EMR62QoAEGdSmHBQ">
              <v-list-item-content>
                <v-list-item-title>リリースノート</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-notebook-outline</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item link href="https://hackmd.io/oiK0albfT6yfXSkxCTbkiQ">
              <v-list-item-content>
                <v-list-item-title>ロードマップ</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-chart-line</v-icon>
              </v-list-item-action>
            </v-list-item>

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
      drawer: false
    };
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
