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

const execAsync = promisify(exec);

async function main() {
  console.log("🪤 Trapped Wrapped - Generating report...\n");

  // CLI引数をパース
  const args = parseCliArgs(process.argv.slice(2));
  const { from, to } = parseDateRange(args);

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

    // 分析
    console.log("🔍 Analyzing...");
    const result = analyze(stats, costs, history, toolUses, from, to);

    console.log(`  - Messages: ${result.totalMessages}`);
    console.log(`  - Sessions: ${result.totalSessions}`);
    console.log(`  - Cost: $${result.estimatedCost.toFixed(2)}`);
    console.log(`  - Persona: ${result.persona.title}`);

    // HTML生成
    console.log("🎨 Generating HTML...");
    const html = generateHtml(result);

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
