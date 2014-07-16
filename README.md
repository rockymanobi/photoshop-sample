# Spps Client

[photoshop-sv](https://github.com/rockymanobi/photoshop-sv)のクライアントです。Generator-coreのプラグインとして実装されています。サーバに画像をアップロードすると、photoshopの画面にペーストされます。

## Get started

### 前提

* photoshopのgenerator-coreを実行可能な状態
* photoshop側の設定も完了済み（generator-coreからの命令を受け付ける状態）
* generator-coreのディレクトリに居る


### 準備

```bash
# プラグインディレクトリに移動してgitから本プラグインを取得
cd test/plugins
git clone http://github.com/rockymanobi/photoshop-sample.git
# 依存ライブラリをインストール
cd photoshop-sample
npm install
```

### 実行

#### photoshopプラグインとして実行する場合

`photoshop-sample`ディレクトリを`Photoshopプラグインディレクトリ/Generator/`の下に配置した後にphotoshopを起動する。


#### Generator-coreから実行する場合（herokuに接続）

```bash
# generator-core のディレクトリに移動する
cd ../../../
# generator-core 経由で本プラグインを実行
node app -f test/plugins/photoshop-sample
```

#### Generator-coreから実行する場合（local環境に接続）

[photoshop-sv](https://github.com/rockymanobi/photoshop-sv)をlocalで起動した状態で、`NODE_ENV=development`で実行する。(`localhost:3000`にwebsocketで接続します)

```bash
# generator-core のディレクトリに移動する
cd ../../../
# generator-core 経由で本プラグインを実行
NODE_ENV=development node app -f test/plugins/photoshop-sample
```



