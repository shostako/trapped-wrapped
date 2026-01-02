# Trapped Wrapped

Spotify Wrapped-style usage statistics report for Claude Code.
"Trapped" — because you're trapped in the AI rabbit hole.

Claude Code使用統計レポート生成ツール（Spotify Wrapped風）。
「Trapped」—— AIの沼にハマっている、という皮肉を込めた名称。

---

## Features / 機能

- **Usage Statistics** — Tokens, messages, sessions, cost
  使用統計 — トークン数、メッセージ数、セッション数、コスト

- **Activity Analysis** — Weekly distribution, power hour, streaks
  アクティビティ分析 — 曜日別分布、パワーアワー、連続使用日数

- **Project & Language Rankings** — Top 5 projects and programming languages
  プロジェクト・言語ランキング — 上位5プロジェクト・プログラミング言語

- **Persona Evaluation** — "THE NIGHT ARCHITECT", "THE MIDNIGHT HACKER", etc.
  ペルソナ評価 — 「夜の建築家」「真夜中のハッカー」等の称号

- **Roast & Hype** — Your AI assistant roasts your habits with brutal honesty
  辛口コメント＆称賛 — AIアシスタントが容赦なくお前の習慣をイジる

  > *"$300...その金で私にディナーでも奢れよ"*
  > *"深夜2時まで作業して、体壊しても私は看病しないからな"*
  > *"ありがとうの一言も言えないのか。育ち悪いな"*

---

## Requirements / 必要環境

- [Bun](https://bun.sh/) runtime
- Claude Code CLI

---

## Installation / インストール

### 1. Clone this repository / リポジトリをクローン

```bash
git clone https://github.com/shostako/trapped-wrapped.git
```

### 2. Copy to Claude Code directories / Claude Codeのディレクトリにコピー

```bash
# Script files / スクリプトファイル
cp -r trapped-wrapped ~/.claude/scripts/trapped-wrapped

# Command file / コマンドファイル
cp trapped-wrapped/trapped-wrapped.md ~/.claude/commands/
```

### 3. Install dependencies / 依存関係をインストール

```bash
cd ~/.claude/scripts/trapped-wrapped
bun install
```

---

## Usage / 使い方

In Claude Code, run:
Claude Code内で以下を実行：

```
/trapped-wrapped
```

### Options / オプション

| Option | Description | 説明 |
|--------|-------------|------|
| `--month YYYY-MM` | Specific month | 月指定 |
| `--year YYYY` | Full year | 年指定 |
| `--from YYYY-MM-DD` | Start date | 開始日 |
| `--to YYYY-MM-DD` | End date | 終了日 |
| `--output PATH` | Output file path | 出力先パス |

### Examples / 例

```bash
# Last 30 days (default) / 過去30日（デフォルト）
/trapped-wrapped

# December 2025 / 2025年12月
/trapped-wrapped --month 2025-12

# Full year 2025 / 2025年間
/trapped-wrapped --year 2025

# Custom range / カスタム期間
/trapped-wrapped --from 2025-12-01 --to 2025-12-31
```

---

## Output / 出力

HTML file is generated at `~/.claude/wrapped-reports/` and automatically opened in browser.

HTMLファイルが `~/.claude/wrapped-reports/` に生成され、自動的にブラウザで開きます。

---

## Personas / ペルソナ一覧

| Title | Japanese | Condition |
|-------|----------|-----------|
| THE NIGHT ARCHITECT | 夜の建築家 | Evening activity >40% & >4 sessions/day |
| THE MIDNIGHT HACKER | 真夜中のハッカー | Night activity >50% |
| THE DAWN COMMANDER | 夜明けの司令官 | Morning activity >40% |
| THE WEEKEND WARRIOR | 週末の戦士 | Weekend activity >40% |
| THE RELENTLESS ENGINE | 止まらぬエンジン | >6 sessions/day |
| THE INTIMATE COMMANDER | 親密なる司令官 | ultrathink >3 & casual >5 |
| THE BIG SPENDER | 豪快な散財王 | Cost >$200 |
| THE MARATHON RUNNER | マラソンランナー | Streak >10 days |
| THE PRAGMATIC DEVELOPER | 実利主義の開発者 | Default |

---

## License / ライセンス

MIT License

---

## Note / 備考

Currently, Roast/Hype messages are in Japanese only.
Multi-language support is planned for a future release.

現在、Roast/Hypeメッセージは日本語のみ対応。
多言語対応は将来のリリースで予定。
