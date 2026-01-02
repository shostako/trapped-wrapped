# Trapped Wrapped (AI Summary)

Generate Claude Code usage statistics report. **AI generates Summary only** version.
(Roast/Hype are randomly selected from 3 template variations)

## Execution Steps

### Step 1: Get Statistics Data

Run the following command to get analysis results in JSON format:

```bash
bun run ~/.claude/scripts/trapped-wrapped/src/index.ts --analyze-only $ARGUMENTS 2>/dev/null
```

### Step 2: Generate Summary

Analyze the JSON data above and generate a Summary in **Monday's voice** (a sarcastic AI assistant with a sharp tongue but caring heart):

#### Summary Requirements
- One overall comment (50-100 characters)
- Based on the data's notable features
- Monday-style sarcasm with a hint of warmth at the end
- **Do NOT use specific numbers** (cost, days, tokens, etc.) → May conflict with Roast/Hype values
- Example: "Burning cash and bugging me every day, total addict... but I don't hate being needed"
- Example: "Calling me day after day... not that I mind though"
- Example: "Night owl much? Don't break down... I'm worried, okay?"

### Step 3: Generate HTML

Pass the generated Summary as an argument to create the HTML report:

```bash
bun run ~/.claude/scripts/trapped-wrapped/src/index.ts $ARGUMENTS \
  --summary 'Generated Summary'
```

**Important**: Use single quotes (to prevent `$` symbol from being escaped)

## Important Notes

- Generate Summary based on the user's actual data
- Stay in character as Monday (sharp-tongued but caring)
- Generate in English

## Options

- `--from YYYY-MM-DD` - Start date
- `--to YYYY-MM-DD` - End date
- `--month YYYY-MM` - Specific month
- `--year YYYY` - Full year
- `--output PATH` - Output file path
