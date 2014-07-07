## 前提

* photoshopのgenerator-coreを実行可能な状態
* photoshop側の設定も完了済み（generator-coreからの命令を受け付ける状態）
* generator-coreのディレクトリに居る


## 準備

```bash
# プラグインディレクトリに移動してgitから本プラグインを取得
cd test/plugins
git clone http://github.com/rockymanobi/photoshop-sample.git
# 依存ライブラリをインストール
cd photoshop-sample
npm install
```

## 実行

```bash
# generator-core のディレクトリに移動する
cd ../../
# generator-core 経由で本プラグインを実行
node app -f test/plugins/photoshop-saple
```

表示されたIPにiPhoneブラウザでアクセスし、ファイルをアップロードしてみる。
iPhoneとPCが同じネットワークに居る事を確認してください！


