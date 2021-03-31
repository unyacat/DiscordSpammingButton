import Vue from "vue";
import VueRouter from "vue-router";
import add from "@/components/add";
import home from "@/components/home";
import edit from "@/components/edit"
import settings from '@/components/settings'
// ルート用のコンポーネントを読み込む
// import Home from '@/views/Home'
// import Product from '@/views/Product'
// Vuexと同様で最初にプラグインとして登録
Vue.use(VueRouter);
// VueRouterインスタンスを生成する
const router = new VueRouter({
  mode: "history",
  // URLのパスと紐づくコンポーネントをマッピング
  routes: [
    {
      path: '/',
      component: home,
    },
    {
      path: '/add',
      component: add
    },
    {
      path: '/edit/:id',
      component: edit
    },
    {
      path: '/settings',
      component: settings
    }
  ]
});
// 生成したVueRouterインスタンスをエクスポート
export default router;
