import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as VueFire from 'vuefire';
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import Vuetify from "./vuetify";
import "vuetify/dist/vuetify.min.css";
import './registerServiceWorker'


Vue.config.productionTip = false;
Vue.use(VueFire);


const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMEIN,
  databaseURL: process.env.VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID
};


firebase.initializeApp(firebaseConfig);

Vue.prototype.$db = firebase.firestore();
Vue.prototype.$fbts = firebase.firestore.FieldValue.serverTimestamp();

new Vue({
  vuetify: Vuetify,
  router: router,
  render: h => h(App),
}).$mount('#app');

