# DiscordSpammingButton
![repository-open-graph-template_](https://user-images.githubusercontent.com/14951631/77506095-49351c80-6ea8-11ea-8d95-f87beff7f9ef.png)

[![Build Status](https://travis-ci.org/unyacat/DiscordSpammingButton.svg?branch=master)](https://travis-ci.org/unyacat/DiscordSpammingButton)

## これはなに
Webhook を利用して Discord に定型文を送ることができる Web アプリです．  
Cloud Firestore を利用しているのでリアルタイムで編集可能な上 Firebase Hosting によりサーバー不要で動きます．  
PWA 対応で Android ではアプリのような挙動が可能です．

## 動作
送信すること以外のサンプルは[こちら](https://dark-pub.web.app/)

## 動かし方
1. Clone する
    ```console
    $ git clone https://github.com/unyacat/DiscordSpammingButton.git
    ```
    ```console
    $ cd DiscordSpammingButton
    ```
1. パッケージインストール
    ```console
    $ npm install 
    ```
1. 諸設定
    .env_sample をコピーして .env として保存します．
    メモ帳などで開きます．
    Discord から Webhook URL を取得し貼り付けます．
    
1. Firebase の設定
    1. [Firebase](https://firebase.google.com/?hl=ja)を利用します．  
        使ってみる > プロジェクトの作成 > アナリティクスは適当に
        
    1. (左)開発 > Database > Cloud Firestore > 使ってみる
        全部デフォルトで次へ
        
    1. (左上)⚙ > Setting > マイアプリ > "</>"  
    適当な名前をつけて全部次へ
    
    1. Setting > Firebase SDK snippet > 構成
    .env に変数を適切な場所に貼り付けます．

1. firebase とプロジェクトを紐づける
    ```console
    $ npm install firebase-tools
    ```
    ```console
    $ firebase login
    ```
    Google 認証を行う
    ```console
    $ firebase init
   
    Which Firebase CLI...
    > Firestore
    > Hosting
   
    First, let's associate this project directory...
    > (さっき作ったプロジェクト名)
   
    What file should be used for Firebase Rules?
    > (そのまま Enter)
   
    File firestore.rules already...
    > No
   
    What file should be used for Firestore indexes?
    > (そのまま Enter)
   
    Configure as a single-page app
    > Yes
   
    File firestore.indexes.json already...
    > No
   
    What do you want to use as your public directory?
    > dist
    ```

1. Build & Deploy
    ```console
    $ npm run build
    ```
    ```console
    $ firebase deploy
    ```
    出力された URL に Deploy されます．