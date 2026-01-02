# Trapped Wrapped

Generate Claude Code usage statistics report. Spotify Wrapped-style HTML report.
"Trapped" — because you're trapped in the AI rabbit hole.

## Usage

```
/trapped-wrapped [options]
```

## Options

- `--lang ja|en` - Language (auto-detected by default)
- `--from YYYY-MM-DD` - Start date
- `--to YYYY-MM-DD` - End date
- `--month YYYY-MM` - Specific month (e.g., --month 2025-12)
- `--year YYYY` - Full year
- `--output PATH` - Output file path

## Examples

```
# December 2025 report
/trapped-wrapped --month 2025-12

# Custom date range
/trapped-wrapped --from 2025-12-01 --to 2025-12-31

# Full year report
/trapped-wrapped --year 2025

# Default (last 30 days)
/trapped-wrapped

# Force English
/trapped-wrapped --lang en
```

## Run Command

Execute the following to generate the report:

```bash
bun run ~/.claude/scripts/trapped-wrapped/src/index.ts $ARGUMENTS
```

## Report Contents

- Basic statistics (tokens, messages, sessions, cost)
- Weekly activity distribution
- Highlights (streaks, top model, power hour, etc.)
- Persona evaluation with snarky titles
- Roast & Hype feedback

## Output

HTML file is generated at `~/.claude/wrapped-reports/` and automatically opened in browser.
