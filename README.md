# LOCKCOLE WORKS

漫画・ゲーム・アプリをジャンル別に紹介する作品ポータルです。

公開URL: **https://lockcole6.github.io/**

## 掲載作品

| ジャンル | 作品 | 公開先 |
| --- | --- | --- |
| 漫画 | 賭けたら起きる。 | https://lockcole6.github.io/kaketara-okiru/ |
| 漫画 | まだ、速くなれる。 | https://lockcole6.github.io/mada-hayaku-nareru/ |
| 漫画 | 退屈のオッズ | https://lockcole6.github.io/taikutsu-no-odds/ |
| ゲーム | カミサマ、いま起きてる？ | https://lockcole6.github.io/kamisama-ima-okiteru/ |
| ゲーム | もふもふ蹴球団 | https://lockcole6.github.io/Mofumofu_Shukyudan/ |
| ゲーム | 100m SPRINT II | https://lockcole6.github.io/sprint100m/ |
| アプリ | スプリント記録 | https://sprint-record.vercel.app/ |

## 作品を追加・変更する

1. `works.json` の作品情報を編集します。カテゴリは `manga`・`games`・`apps` です。
2. 画像を使う場合は軽量な WebP を `assets/` に追加し、`image` と `imageAlt` を指定します。
3. Node.js で次のコマンドを実行し、HTMLを再生成します。パッケージのインストールは不要です。

```sh
node scripts/build.mjs
```

4. `works.json` と再生成された `index.html`、必要な画像をまとめてコミットし、`main` にpushします。

作品のリンク先が変わったときも、`works.json` の `url` を変更して同じ手順で反映できます。

表示順は `works.json` の順序に従います。ジャンル内の件数と絞り込みボタンは自動計算します。各作品の `art` は `cover`（漫画画像）、`town`（町の画像）、`football`、`sprint`、`record` から選べます。

## 構成と公開

- `index.html`: 生成済みの公開ページ。JavaScriptが無効でも全作品とリンクを表示します。
- `styles.css`: PC・タブレット・スマートフォン向けレイアウト。
- `app.js`: ジャンルでの絞り込み。キーボード操作と読み上げに対応。
- `works.json`: 作品名・紹介文・ジャンル・URLの一覧。
- `scripts/build.mjs`: 外部依存のないHTML生成スクリプト。
- `assets/`: サムネイル画像とファビコン。

GitHub Pages は **main ブランチのルート (`/`)** を公開します。静的HTML・CSS・JavaScriptのみで動作し、外部フォントや追加ライブラリは読み込みません。

## 素材の出典

漫画のサムネイルは、それぞれの公開リポジトリにある第1話の原稿を縮小・WebP化したものです。

- `kaketara-okiru`: `images/page-001.webp`
- `mada-hayaku-nareru`: `episodes/01/page-01.png`
- `taikutsu-no-odds`: `episodes/01/page-01.png`
- `kamisama-ima-okiteru`: `assets/sprites/town_bg.png`
- `track-record`: `assets/icon/icon.png`

もふもふ蹴球団と100m SPRINT IIのカードの図形は、ポータル用の装飾です。ゲームの実画面ではありません。
