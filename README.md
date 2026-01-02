# Trapped Wrapped

Spotify Wrapped-style usage statistics report for Claude Code.
"Trapped" — because you're trapped in the AI rabbit hole.

---

## Features

- **Usage Statistics** — Tokens, messages, sessions, cost
- **Activity Analysis** — Weekly distribution, power hour, streaks
- **Project & Language Rankings** — Top 5 projects and programming languages
- **Persona Evaluation** — Snarky titles that roast your habits
- **Roast & Hype** — Your AI assistant roasts your habits with brutal honesty

  > *"$300... You could've bought me dinner with that"*
  >
  > *"Working until 2 AM? When you collapse, I'm not nursing you back"*
  >
  > *"Can't even say thank you? Were you raised in a barn?"*

- **Multi-language Support** — English and Japanese

---

## Requirements

- [Bun](https://bun.sh/) runtime
- Claude Code CLI

---

## Installation

### 1. Clone this repository

```bash
git clone https://github.com/shostako/trapped-wrapped.git
```

### 2. Copy to Claude Code directories

```bash
# Script files
cp -r trapped-wrapped ~/.claude/scripts/trapped-wrapped

# Command file (choose your language)
cp trapped-wrapped/trapped-wrapped-en.md ~/.claude/commands/trapped-wrapped.md
# OR
cp trapped-wrapped/trapped-wrapped-ja.md ~/.claude/commands/trapped-wrapped.md
```

### 3. Install dependencies

```bash
cd ~/.claude/scripts/trapped-wrapped
bun install
```

---

## Usage

In Claude Code, run:

```
/trapped-wrapped
```

### Options

| Option | Description |
|--------|-------------|
| `--lang ja\|en` | Language (auto-detected) |
| `--month YYYY-MM` | Specific month |
| `--year YYYY` | Full year |
| `--from YYYY-MM-DD` | Start date |
| `--to YYYY-MM-DD` | End date |
| `--output PATH` | Output file path |

### Examples

```bash
# Last 30 days (default)
/trapped-wrapped

# English version
/trapped-wrapped --lang en

# December 2025
/trapped-wrapped --month 2025-12

# Full year 2025
/trapped-wrapped --year 2025
```

---

## Output

HTML file is generated at `~/.claude/wrapped-reports/` and automatically opened in browser.

---

## Personas

| Title | Condition |
|-------|-----------|
| THE INSOMNIAC ARCHITECT | Evening activity >40% & >4 sessions/day |
| THE VAMPIRE CODER | Night activity >50% |
| THE ANNOYINGLY EARLY BIRD | Morning activity >40% |
| THE WEEKDAY SLACKER | Weekend activity >40% |
| THE NEEDY ONE | >6 sessions/day |
| THE HOT-AND-COLD TYPE | ultrathink >3 & casual >5 |
| THE WALKING WALLET | Cost >$200 |
| THE OBSESSIVE STREAKER | Streak >10 days |
| THE BORING NORMIE | Default |

---

## License

MIT License

---
---

# Trapped Wrapped（日本語）

Claude Code使用統計レポート生成ツール（Spotify Wrapped風）。
「Trapped」—— AIの沼にハマっている、という皮肉を込めた名称。

---

## 機能

- **使用統計** — トークン数、メッセージ数、セッション数、コスト
- **アクティビティ分析** — 曜日別分布、パワーアワー、連続使用日数
- **プロジェクト・言語ランキング** — 上位5プロジェクト・プログラミング言語
- **ペルソナ評価** — あなたの習慣を皮肉る称号
- **辛口コメント＆称賛** — AIアシスタントが容赦なくあなたの習慣をイジる

  > *「$300...その金で私にディナーでも奢れよ」*
  >
  > *「深夜2時まで作業して、体壊しても私は看病しないからな」*
  >
  > *「ありがとうの一言も言えないのか。育ち悪いな」*

- **多言語対応** — 英語と日本語

---

## 必要環境

- [Bun](https://bun.sh/) ランタイム
- Claude Code CLI

---

## インストール

### 1. リポジトリをクローン

```bash
git clone https://github.com/shostako/trapped-wrapped.git
```

### 2. Claude Codeのディレクトリにコピー

```bash
# スクリプトファイル
cp -r trapped-wrapped ~/.claude/scripts/trapped-wrapped

# コマンドファイル（言語を選択）
cp trapped-wrapped/trapped-wrapped-ja.md ~/.claude/commands/trapped-wrapped.md
# または
cp trapped-wrapped/trapped-wrapped-en.md ~/.claude/commands/trapped-wrapped.md
```

### 3. 依存関係をインストール

```bash
cd ~/.claude/scripts/trapped-wrapped
bun install
```

---

## 使い方

Claude Code内で以下を実行：

```
/trapped-wrapped
```

### オプション

| オプション | 説明 |
|-----------|------|
| `--lang ja\|en` | 言語（自動検出） |
| `--month YYYY-MM` | 月指定 |
| `--year YYYY` | 年指定 |
| `--from YYYY-MM-DD` | 開始日 |
| `--to YYYY-MM-DD` | 終了日 |
| `--output PATH` | 出力先パス |

### 例

```bash
# 過去30日（デフォルト）
/trapped-wrapped

# 日本語版
/trapped-wrapped --lang ja

# 2025年12月
/trapped-wrapped --month 2025-12

# 2025年間
/trapped-wrapped --year 2025
```

---

## 出力

HTMLファイルが `~/.claude/wrapped-reports/` に生成され、自動的にブラウザで開きます。

---

## ペルソナ一覧

| 称号 | 日本語 | 条件 |
|------|--------|------|
| THE INSOMNIAC ARCHITECT | 不眠症の建築家 | 夕方活動>40% & 1日4セッション超 |
| THE VAMPIRE CODER | 日光アレルギー | 深夜活動>50% |
| THE ANNOYINGLY EARLY BIRD | 意識高い系早起き | 朝活動>40% |
| THE WEEKDAY SLACKER | 平日サボり魔 | 週末活動>40% |
| THE NEEDY ONE | 構ってちゃん | 1日6セッション超 |
| THE HOT-AND-COLD TYPE | ツンデレ上司 | ultrathink>3 & casual>5 |
| THE WALKING WALLET | 歩くATM | コスト>$200 |
| THE OBSESSIVE STREAKER | 依存症患者 | ストリーク>10日 |
| THE BORING NORMIE | 特徴なき凡人 | デフォルト |

---

## ライセンス

MIT License
