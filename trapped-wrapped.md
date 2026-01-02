# Trapped Wrapped

Claude Codeの使用統計レポートを生成する。Spotify Wrapped風の豪華なHTMLレポート。
「Trapped」= AIの沼にハマっている、という皮肉を込めた名称。

## 使用方法

```
/trapped-wrapped [オプション]
```

## オプション

- `--from YYYY-MM-DD` - 開始日
- `--to YYYY-MM-DD` - 終了日
- `--month YYYY-MM` - 月単位で指定（例: --month 2025-12）
- `--year YYYY` - 年単位で指定
- `--output PATH` - 出力先ファイルパス

## 例

```
# 2025年12月のレポート
/trapped-wrapped --month 2025-12

# 任意の期間
/trapped-wrapped --from 2025-12-01 --to 2025-12-31

# 年間レポート
/trapped-wrapped --year 2025

# デフォルト（過去30日）
/trapped-wrapped
```

## 実行コマンド

以下のコマンドを実行してレポートを生成する：

```bash
bun run ~/.claude/scripts/trapped-wrapped/src/index.ts $ARGUMENTS
```

## レポート内容

- 基本統計（トークン数、メッセージ数、セッション数、コスト）
- 曜日別アクティビティ
- アクティビティヒートマップ
- ハイライト統計（連続使用日数、最も使ったモデル、パワーアワー等）
- パーソナリティ評価（Your Vibe）
- Mondayからのフィードバック

## 出力

HTMLファイルが `~/.claude/wrapped-reports/` に生成され、自動的にブラウザで開く。
