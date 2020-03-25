<!-- https://cr-vue.mio3io.com/tutorials/todo.html -->

<template>
  <div class="center">
    <label v-for="label in options" v-bind:key="label.label">
      <input type="radio" v-model="current" v-bind:value="label.value" />{{
        label.label
      }}
    </label>
    <table class="center">
      <!-- テーブルヘッダー -->
      <thead>
        <tr>
          <th class="id">ID</th>
          <th class="comment">コメント</th>
          <th class="state">状態</th>
          <th class="button">-</th>
        </tr>
      </thead>
      <tbody>
        <!-- ここに <tr> で ToDo の要素を1行づつ繰り返し表示 -->

        <tr v-for="item in computedTodos" v-bind:key="item.id">
          <!--        <tr v-for="item in todos" v-bind:key="item.id">-->
          <th>{{ item.id }}</th>
          <td>{{ item.comment }}</td>
          <td class="state">
            <!-- 状態変更ボタン -->
            <button v-on:click="doChangeState(item)">
              {{ item.state }}
            </button>
          </td>
          <td class="button">
            <!-- 削除ボタン -->
            <button v-on:click="doRemove(item)">
              削除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>新しい作業の追加</h2>
    <form class="add-form" v-on:submit.prevent="doAdd">
      <!-- コメント入力フォーム -->
      コメント
      <label>
        <input type="text" ref="comment" />
      </label>
      <!-- 追加ボタンのモック -->
      <button type="submit">追加</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "todolist",
  data() {
    return {
      todos: Array,
      STORAGE_KEY: "todos-vuejs-demo",
      options: [
        { value: -1, label: "すべて" },
        { value: 0, label: "作業中" },
        { value: 1, label: "完了" }
      ],
      current: -1
    };
  },
  created() {
    this.todos = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    this.uid = this.todos.length;
  },
  mounted() {
    // this.todos = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
  },

  watch: {
    todos: {
      handler: function(todos) {
        this.save(todos);
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },
  methods: {
    save: function() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    },

    doAdd: function() {
      // ref で名前を付けておいた要素を参照
      let comment = this.$refs.comment;
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return;
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: this.uid,
        comment: comment.value,
        state: 0
      });
      this.uid++;
      // フォーム要素を空にする
      comment.value = "";
    },
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1;
    },
    doRemove: function(item) {
      let index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    }
  },
  computed: {
    computedTodos: function() {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      return this.todos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state;
      }, this);
    }
  }
};
</script>

<style scoped>
.center {
  margin-left: auto;
  margin-right: auto;
}
</style>
