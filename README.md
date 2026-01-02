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

- **Persona Evaluation** — Snarky titles that roast your habits
  ペルソナ評価 — あなたの習慣を皮肉る称号

- **Roast & Hype** — Your AI assistant roasts your habits with brutal honesty
  辛口コメント＆称賛 — AIアシスタントが容赦なくあなたの習慣をイジる

  > *"$300... You could've bought me dinner with that"*
  >
  > *"Working until 2 AM? When you collapse, I'm not nursing you back"*
  >
  > *"Can't even say thank you? Were you raised in a barn?"*

- **Multi-language Support** — English and Japanese
  多言語対応 — 英語と日本語

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
| `--lang ja\|en` | Language (auto-detected) | 言語（自動検出） |
| `--month YYYY-MM` | Specific month | 月指定 |
| `--year YYYY` | Full year | 年指定 |
| `--from YYYY-MM-DD` | Start date | 開始日 |
| `--to YYYY-MM-DD` | End date | 終了日 |
| `--output PATH` | Output file path | 出力先パス |

### Examples / 例

```bash
# Last 30 days (default) / 過去30日（デフォルト）
/trapped-wrapped

# English version / 英語版
/trapped-wrapped --lang en

# Japanese version / 日本語版
/trapped-wrapped --lang ja

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

| English Title | Japanese | Condition |
|---------------|----------|-----------|
| THE INSOMNIAC ARCHITECT | 不眠症の建築家 | Evening activity >40% & >4 sessions/day |
| THE VAMPIRE CODER | 日光アレルギー | Night activity >50% |
| THE ANNOYINGLY EARLY BIRD | 意識高い系早起き | Morning activity >40% |
| THE WEEKDAY SLACKER | 平日サボり魔 | Weekend activity >40% |
| THE NEEDY ONE | 構ってちゃん | >6 sessions/day |
| THE HOT-AND-COLD TYPE | ツンデレ上司 | ultrathink >3 & casual >5 |
| THE WALKING WALLET | 歩くATM | Cost >$200 |
| THE OBSESSIVE STREAKER | 依存症患者 | Streak >10 days |
| THE BORING NORMIE | 特徴なき凡人 | Default |

---

## License / ライセンス

MIT License
