#!/usr/bin/env bun

import { mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";
import { exec } from "child_process";
import { promisify } from "util";

import {
  loadStatsCache,
  loadCostCache,
  loadHistory,
  loadAllSessionEntries,
  extractToolUses,
  parseCliArgs,
  parseDateRange,
} from "./collector";
import { analyze } from "./analyzer";
import { generateHtml } from "./generator";
import { detectLocale, getTitleMap } from "./locales";
import type { AnalysisResult } from "./types";

const execAsync = promisify(exec);

async function main() {
  // CLI引数をパース
  const args = parseCliArgs(process.argv.slice(2));
  const { from, to } = parseDateRange(args);

  // 言語検出
  const locale = detectLocale(args.lang);

  // --analyze-only モード: JSON出力のみ
  if (args.analyzeOnly) {
    console.error("🪤 Trapped Wrapped - Analyze Only Mode\n");
    console.error(`🌐 Language: ${locale}`);
    console.error(`📅 Period: ${from} ~ ${to}`);

    try {
      console.error("📊 Loading data...");
      const [stats, costs, history, sessionEntries] = await Promise.all([
        loadStatsCache(),
        loadCostCache(),
        loadHistory(),
        loadAllSessionEntries(from, to),
      ]);

      const toolUses = extractToolUses(sessionEntries);
      console.error("🔍 Analyzing...");
      const result = analyze(stats, costs, history, toolUses, from, to, locale);

      // roast/hype/commentsを空にしてJSON出力（AI生成用）
      const outputData = {
        ...result,
        locale,
        persona: {
          ...result.persona,
          roast: [],  // AIに生成させる
          hype: [],   // AIに生成させる
        },
        mondayFeedback: {
          ...result.mondayFeedback,
          comments: [],  // AIに生成させる
        },
      };

      // 標準出力にJSON
      console.log(JSON.stringify(outputData, null, 2));
      console.error("\n✅ Analysis complete. Feed this to Claude for comment generation.");
    } catch (error) {
      console.error("❌ Error:", error);
      process.exit(1);
    }
    return;
  }

  // 通常モード
  console.log("🪤 Trapped Wrapped - Generating report...\n");
  console.log(`🌐 Language: ${locale}`);
  console.log(`📅 Period: ${from} ~ ${to}`);

  try {
    // データ読み込み
    console.log("📊 Loading data...");
    const [stats, costs, history, sessionEntries] = await Promise.all([
      loadStatsCache(),
      loadCostCache(),
      loadHistory(),
      loadAllSessionEntries(from, to),
    ]);

    // ツール使用情報を抽出
    const toolUses = extractToolUses(sessionEntries);

    console.log(`  - Stats: ${stats.totalSessions} sessions`);
    console.log(`  - History: ${history.length} entries`);
    console.log(`  - Tool uses: ${toolUses.length} operations`);

    // 分析（ロケールを渡す）
    console.log("🔍 Analyzing...");
    let result = analyze(stats, costs, history, toolUses, from, to, locale);

    // 外部からコメントが渡された場合は上書き
    if (args.roast && args.roast.length > 0) {
      result = {
        ...result,
        persona: {
          ...result.persona,
          roast: args.roast,
        },
      };
    }
    if (args.hype && args.hype.length > 0) {
      result = {
        ...result,
        persona: {
          ...result.persona,
          hype: args.hype,
        },
      };
    }
    if (args.summary) {
      result = {
        ...result,
        mondayFeedback: {
          ...result.mondayFeedback,
          comments: [args.summary],
        },
      };
    }

    console.log(`  - Messages: ${result.totalMessages}`);
    console.log(`  - Sessions: ${result.totalSessions}`);
    console.log(`  - Cost: $${result.estimatedCost.toFixed(2)}`);
    console.log(`  - Persona: ${result.persona.title}`);

    // HTML生成（タイトルマップを渡す）
    console.log("🎨 Generating HTML...");
    const titleMap = getTitleMap(locale);
    const html = generateHtml(result, titleMap);

    // 出力先ディレクトリ
    const outputDir = join(homedir(), ".claude", "wrapped-reports");
    await mkdir(outputDir, { recursive: true });

    // ファイル名
    const filename = `trapped-wrapped-${from}-to-${to}.html`;
    const outputPath = args.output || join(outputDir, filename);

    // 書き出し（UTF-8バイト列で確実に）
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(html);
    await Bun.write(outputPath, utf8Bytes);
    console.log(`\n✅ Report saved: ${outputPath}`);

    // ブラウザで開く（Windows）
    try {
      const platform = process.platform;
      if (platform === "win32") {
        await execAsync(`start "" "${outputPath}"`);
      } else if (platform === "darwin") {
        await execAsync(`open "${outputPath}"`);
      } else {
        await execAsync(`xdg-open "${outputPath}"`);
      }
      console.log("🌐 Opening in browser...");
    } catch {
      console.log("💡 Open the file manually in your browser.");
    }

    console.log("\n🎉 Done! Enjoy your Trapped Wrapped.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
