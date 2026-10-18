# LOCKCOLE WORKS

ゲーム・漫画・アプリをジャンル別のコンパクトな縦リストで紹介する作品ポータルです。各行の画像・作品名・一言説明から、その作品へ移動できます。動作環境、漫画の公開話数・制作状況と、日付付きの更新履歴を掲載しています。

公開URL: **https://lockcole6.github.io/**

## 掲載作品

| ジャンル | 作品 | 公開先 |
| --- | --- | --- |
| ゲーム | カミサマ、いま起きてる？ | https://lockcole6.github.io/kamisama-ima-okiteru/ |
| ゲーム | もふもふ蹴球団 | https://lockcole6.github.io/Mofumofu_Shukyudan/ |
| ゲーム | 100m SPRINT | https://lockcole6.github.io/sprint100m/ |
| 漫画 | 賭けたら起きる。 | https://lockcole6.github.io/kaketara-okiru/ |
| 漫画 | まだ、速くなれる。 | https://lockcole6.github.io/mada-hayaku-nareru/ |
| 漫画 | 退屈のオッズ | https://lockcole6.github.io/taikutsu-no-odds/ |
| アプリ | スプリント記録 | https://sprint-record.vercel.app/ |

## 作品を追加・変更する

1. `works.json` の作品情報を編集します。カテゴリは `games`・`manga`・`apps` です。
2. 作品の画像は軽量な WebP を `assets/` に追加し、`image` と `imageAlt` を指定します。
3. Node.js で次のコマンドを実行し、HTMLを再生成します。パッケージのインストールは不要です。

```sh
node scripts/build.mjs
```

4. `works.json` と再生成された `index.html`、変更した `updates.json` や必要な画像をまとめてコミットし、`main` にpushします。

作品のリンク先が変わったときも、`works.json` の `url` を変更して同じ手順で反映できます。

ジャンルはゲーム・漫画・アプリの順です。ジャンル内の表示順は `works.json` の順序に従います。`description` は短い一言説明にします。各作品の `art` は `cover`（漫画画像）、`town`（町の画像）、`screenshot`（ゲーム画面）、`record`（アプリアイコン）から選べます。上部のジャンルリンクは各見出しへ移動します。

## 動作環境・漫画の話数・更新履歴

- ゲーム・アプリは `platforms` に確認済みの動作環境を指定します。例: `["ブラウザ"]`、`["Webアプリ"]`。PC・スマホなど個別端末への対応は、確認してから記載します。
- 漫画の `publishedEpisodes` は実際に読める話数です。予定話数や原稿のページ数ではありません。
- 漫画の `status` は `ongoing`（「続きは制作中」）または `completed`（「完結」）です。公開中の話数と制作状況を分けて表示します。
- `updates.json` の `date`（日本時間の `YYYY-MM-DD`）、`category`（サイト・ゲーム・漫画・アプリ）、`text` を記入します。作品や最新話へのリンクがある場合は `url` を追加します。生成時に日付の新しい順に並びます。
- 話数や履歴は静的な管理情報です。新しい話を公開したときは `publishedEpisodes` と `updates.json` を更新してからHTMLを再生成します。

2026年10月18日に公開ページで、賭けたら起きる。は1話、まだ、速くなれる。は7話、退屈のオッズは8話を確認しました。漫画の初期更新履歴の日付は、公開コミットを日本時間に換算しています。

- [まだ、速くなれる。第7話の公開コミット](https://github.com/lockcole6/mada-hayaku-nareru/commit/f38a1a5bb57b4ae1f126129415968b2506047f27)
- [退屈のオッズ 第8話の公開コミット](https://github.com/lockcole6/taikutsu-no-odds/commit/9bbe24380bd1591e4a0b47f42df27cc5c57dd718)

## 構成と公開

- `index.html`: 生成済みの公開ページ。全作品を表示し、各行を1つのリンクにしています。
- `styles.css`: PC・タブレット・スマートフォン向けレイアウト。
- `works.json`: 作品名・紹介文・ジャンル・URL・動作環境・漫画の公開状況。
- `updates.json`: 日付・分類・本文・リンクを持つ更新履歴。
- `scripts/build.mjs`: 外部依存のないHTML生成スクリプト。
- `assets/`: サムネイル画像とファビコン。

GitHub Pages は **main ブランチのルート (`/`)** を公開します。ページは静的HTML・CSSだけで動作し、JavaScript・外部フォント・追加ライブラリは読み込みません。キーボードのフォーカス表示と、作品一覧へのスキップリンクに対応しています。

## 素材の出典

漫画のサムネイルは、それぞれの公開リポジトリにある第1話の原稿を縮小・WebP化したものです。

- `kaketara-okiru`: `images/page-001.webp`
- `mada-hayaku-nareru`: `episodes/01/page-01.png`
- `taikutsu-no-odds`: `episodes/01/page-01.png`
- `kamisama-ima-okiteru`: `assets/sprites/town_bg.png`
- `track-record`: `assets/icon/icon.png`

もふもふ蹴球団（対戦準備画面）、100m SPRINT（スタートライン）の画像は、2026年10月13日にそれぞれの公開ゲームをブラウザで撮影し、余白のトリミングとWebP化を行ったものです。`assets/kamisama-game.webp` は同日に撮影した旧トップ用の画像で、現在の一覧では町のマップを使用しています。
