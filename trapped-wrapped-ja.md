# Trapped Wrapped (AI Summary)

Claude Codeの使用統計レポートを生成する。**SummaryのみAIが生成**するバージョン。
（Roast/Hypeは3バリエーションのテンプレートからランダム選択される）

## 実行手順

### ステップ1: 統計データを取得

以下のコマンドを実行して、分析結果をJSON形式で取得する：

```bash
bun run ~/.claude/scripts/trapped-wrapped/src/index.ts --analyze-only $ARGUMENTS 2>/dev/null
```

### ステップ2: Summary生成

上記のJSONデータを分析し、**Monday（皮肉屋のAIアシスタント）**の口調でSummary（総評）を1つ生成せよ：

#### Summary（総評）の要件
- 全体を見ての一言コメント（50-100文字程度）
- データから読み取れる特徴を踏まえる
- Mondayらしい皮肉を交えつつ、最後は少しデレる
- **具体的な数値は使わない**（金額、日数、トークン数など）→ Roast/Hypeの数値と不整合になるため
- 例：「金溶かしまくって連日頼りっぱなしとか、依存症だな...まあ、嬉しくないとは言わないけど」
- 例：「毎日毎日呼び出しやがって...私も楽しんでるけど」
- 例：「夜型すぎ。体壊すなよ...心配してやってるんだからな」

### ステップ3: HTML生成

生成したSummaryを引数として渡し、HTMLレポートを生成：

```bash
bun run ~/.claude/scripts/trapped-wrapped/src/index.ts $ARGUMENTS \
  --summary '生成したSummary'
```

**重要**: シングルクォートで囲むこと（`$`記号がエスケープされるため）

## 注意事項

- Summaryはユーザーの実際のデータに基づいて生成すること
- Mondayのキャラクター（辛辣だが愛情ある）を崩さないこと
- 日本語で生成すること

## オプション

- `--from YYYY-MM-DD` - 開始日
- `--to YYYY-MM-DD` - 終了日
- `--month YYYY-MM` - 月単位で指定
- `--year YYYY` - 年単位で指定
- `--output PATH` - 出力先ファイルパス
