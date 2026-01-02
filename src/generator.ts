import type { AnalysisResult } from "./types";

// 大文字タイトルをTitle Case（The Night Architect）に変換
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// 日付のハイフンをスラッシュに変換（2025-12-03 → 2025/12/03）
function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '/');
}

// 短い日付のハイフンをスラッシュに変換（12-03 → 12/03）
function formatShortDate(dateStr: string): string {
  return dateStr.replace(/-/g, '/');
}

export function generateHtml(result: AnalysisResult, titleMap: Record<string, string>): string {
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const maxWeekly = Math.max(...Object.values(result.weeklyDistribution), 1);

  // Rankings HTML (max 5)
  const projectRows = result.projectBreakdown
    .slice(0, 5)
    .map((p, i) => `<div class="rank-row" style="--delay: ${i * 0.08}s"><span class="rank-idx">${i + 1}</span><span class="rank-name">${p.name}</span><span class="rank-val">${p.sessions}</span></div>`)
    .join("");

  const langRows = result.languageRanking
    .slice(0, 5)
    .map((l, i) => `<div class="rank-row" style="--delay: ${i * 0.08}s"><span class="rank-idx">${i + 1}</span><span class="rank-name">${l.name}</span><span class="rank-val">${l.count}x</span></div>`)
    .join("");

  const modelRows = result.modelBreakdown
    .slice(0, 5)
    .map((m, i) => {
      // "Claude " プレフィックスを削除してシンプルに
      const shortName = m.name.replace(/^Claude\s+/i, '');
      return `<div class="rank-row" style="--delay: ${i * 0.08}s"><span class="rank-idx">${i + 1}</span><span class="rank-name">${shortName}</span><span class="rank-val">${formatLargeNumber(m.tokens)}</span></div>`;
    })
    .join("");

  // Weekly bars - vertical bars with stagger
  const weeklyBars = weekdays
    .map((day, i) => {
      const pct = (result.weeklyDistribution[i.toString()] / maxWeekly) * 100;
      return `<div class="week-col" style="--delay: ${i * 0.06}s"><div class="week-bar-area"><div class="week-bar-v" style="--height:${pct}%"></div></div><span class="week-day">${day}</span></div>`;
    })
    .join("");

  // Roast/Hype with stagger
  const roastItems = result.persona.roast.map((r, i) => `<li style="--delay: ${i * 0.1}s">${r}</li>`).join("");
  const hypeItems = result.persona.hype.map((h, i) => `<li style="--delay: ${i * 0.1}s">${h}</li>`).join("");

  // Traits
  const traits = result.persona.traits.map((t, i) => `<span class="trait" style="--delay: ${i * 0.08}s">${t}</span>`).join("");

  // Comments
  const comments = result.mondayFeedback.comments
    .slice(0, 3)
    .map((c, i) => `<li style="--delay: ${i * 0.1}s">${c}</li>`)
    .join("");

  // Stats array for staggered animation
  const statsRow1 = [
    { val: formatLargeNumber(result.totalTokens), lbl: "tokens", warn: false },
    { val: formatNumber(result.totalMessages), lbl: "msgs", warn: false },
    { val: result.totalSessions.toString(), lbl: "sessions", warn: false },
    { val: result.daysActive.toString(), lbl: "days", warn: false },
    { val: `$${result.estimatedCost.toFixed(0)}`, lbl: "cost", warn: true },
  ];
  const statsRow2 = [
    { val: `${result.longestStreak.days}d`, lbl: "streak", warn: false },
    { val: `${result.powerHour.hour}:00`, lbl: "power hr", warn: false },
    { val: formatShortDate(result.mostActiveDay.date.slice(5)), lbl: "peak", warn: false },
    { val: Math.round(result.mondayFeedback.averagePromptLength).toString(), lbl: "avg len", warn: false },
    { val: result.mondayFeedback.commandCount.toString(), lbl: "cmds", warn: false },
  ];

  const statsHtml1 = statsRow1.map((s, i) =>
    `<div class="stat" style="--delay: ${i * 0.05}s"><span class="stat-val${s.warn ? ' warn' : ''}">${s.val}</span><span class="stat-lbl">${s.lbl}</span></div>`
  ).join("");

  const statsHtml2 = statsRow2.map((s, i) =>
    `<div class="stat" style="--delay: ${(i + 5) * 0.05}s"><span class="stat-val${s.warn ? ' warn' : ''}">${s.val}</span><span class="stat-lbl">${s.lbl}</span></div>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Code Wrapped - ${formatDate(result.startDate)} ~ ${formatDate(result.endDate)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=Tangerine:wght@700&family=Noto+Serif+JP:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Deep mahogany palette */
      --bg-deep: #1a1410;
      --bg-surface: #2a2018;
      --bg-card: #352a20;
      --bg-card-hover: #3d3025;

      /* Text hierarchy */
      --text-primary: #f8f4ef;
      --text-secondary: #d4c4b0;
      --text-muted: #9a8a78;

      /* Brass/copper accents */
      --accent-brass: #c9a227;
      --accent-copper: #b87333;
      --accent-gold: #ffd700;
      --accent-warm: #ff8c42;
      --accent-glow: rgba(201, 162, 39, 0.4);

      /* Typography */
      --font-display: 'Cinzel', 'Times New Roman', serif;
      --font-body: 'DM Sans', system-ui, sans-serif;

      /* Spacing */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    @keyframes grainShift {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-1px, 1px); }
      50% { transform: translate(1px, -1px); }
      75% { transform: translate(-1px, -1px); }
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes barGrow {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(3deg); }
    }

    body {
      font-family: var(--font-body);
      color: var(--text-primary);
      min-height: 100vh;
      padding: var(--space-md);
      overflow-x: hidden;

      /* Layered wood grain background */
      background: var(--bg-deep);
      background-image:
        /* Noise overlay */
        url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"),
        /* Primary wood grain - horizontal */
        repeating-linear-gradient(
          87deg,
          transparent 0px,
          rgba(139, 90, 43, 0.03) 1px,
          transparent 2px,
          transparent 8px
        ),
        /* Secondary grain - slight angle */
        repeating-linear-gradient(
          93deg,
          transparent 0px,
          rgba(101, 67, 33, 0.04) 2px,
          transparent 4px,
          transparent 12px
        ),
        /* Knot simulation */
        radial-gradient(ellipse 120px 80px at 15% 30%, rgba(60, 40, 20, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse 100px 60px at 85% 70%, rgba(50, 35, 18, 0.12) 0%, transparent 70%),
        /* Base gradient */
        linear-gradient(165deg, #1a1410 0%, #2a1f15 40%, #1f1812 100%);
    }

    /* Animated grain overlay */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.025'/%3E%3C/svg%3E");
      pointer-events: none;
      animation: grainShift 8s steps(4) infinite;
    }

    /* Vignette effect */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(10, 8, 5, 0.5) 100%);
      pointer-events: none;
    }

    .dashboard {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    /* ========== HEADER ========== */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg) var(--space-xl);
      background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-card) 100%);
      border-radius: 16px;
      border: 1px solid rgba(201, 162, 39, 0.15);
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
      animation: fadeSlideUp 0.6s ease-out;
    }

    /* Brass corner accents */
    .header::before,
    .header::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border: 2px solid var(--accent-brass);
      opacity: 0.3;
    }
    .header::before {
      top: 12px;
      left: 12px;
      border-right: none;
      border-bottom: none;
    }
    .header::after {
      bottom: 12px;
      right: 12px;
      border-left: none;
      border-top: none;
    }

    .brand-section {
      position: relative;
    }

    .brand {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-brass) 50%, var(--accent-copper) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
      text-shadow: 0 0 30px var(--accent-glow);
    }

    .period {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: var(--space-xs);
      letter-spacing: 2px;
      font-weight: 500;
    }

    .stats-block {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .stats-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .stat {
      display: flex;
      align-items: baseline;
      gap: 4px;
      opacity: 0;
      animation: fadeSlideIn 0.4s ease-out forwards;
      animation-delay: var(--delay);
      white-space: nowrap;
    }

    .stat-val {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 600;
      color: var(--accent-brass);
      text-shadow: 0 0 20px var(--accent-glow);
      white-space: nowrap;
    }

    .stat-val.warn {
      color: var(--accent-warm);
      text-shadow: 0 0 20px rgba(255, 140, 66, 0.5);
    }

    .stat-lbl {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    /* ========== RANKINGS ROW ========== */
    .rankings-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }

    .mini-card {
      background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%);
      border-radius: 12px;
      padding: var(--space-md);
      border: 1px solid rgba(201, 162, 39, 0.1);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.02);
      position: relative;
      opacity: 0;
      animation: fadeSlideUp 0.5s ease-out forwards;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .mini-card:nth-child(1) { animation-delay: 0.1s; }
    .mini-card:nth-child(2) { animation-delay: 0.2s; }
    .mini-card:nth-child(3) { animation-delay: 0.3s; }
    .mini-card:nth-child(4) { animation-delay: 0.4s; }

    .mini-card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.4),
        0 0 20px var(--accent-glow),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    /* Embossed top edge */
    .mini-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 16px;
      right: 16px;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--accent-brass) 50%, transparent 100%);
      opacity: 0.3;
      border-radius: 0 0 2px 2px;
    }

    .mini-title {
      font-family: var(--font-display);
      font-size: 11px;
      color: var(--accent-brass);
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: var(--space-sm);
      padding-bottom: var(--space-xs);
      border-bottom: 1px solid rgba(201, 162, 39, 0.15);
    }

    .rank-row {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 3px 0;
      font-size: 12px;
      opacity: 0;
      animation: fadeSlideIn 0.3s ease-out forwards;
      animation-delay: var(--delay);
      transition: background 0.2s ease;
      border-radius: 4px;
      padding-left: var(--space-xs);
      margin: 0 -4px;
    }

    .rank-row:hover {
      background: rgba(201, 162, 39, 0.05);
    }

    .rank-idx {
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, var(--accent-brass) 0%, var(--accent-copper) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      color: var(--bg-deep);
      box-shadow: 0 2px 8px rgba(201, 162, 39, 0.3);
    }

    .rank-name {
      flex: 1;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }

    .rank-val {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-display);
    }

    /* Weekly Chart */
    .weekly-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex: 1;
      min-height: 60px;
    }

    .week-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      height: 100%;
      justify-content: flex-end;
    }

    .week-bar-area {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      width: 100%;
    }

    .week-bar-v {
      width: 14px;
      min-height: 4px;
      height: var(--height);
      background: linear-gradient(180deg, var(--accent-gold) 0%, var(--accent-brass) 50%, var(--accent-copper) 100%);
      border-radius: 3px 3px 0 0;
      box-shadow: 0 0 10px var(--accent-glow);
      transform: scaleY(0);
      transform-origin: bottom;
      animation: barGrow 0.8s ease-out forwards;
      animation-delay: calc(0.5s + var(--delay));
      position: relative;
    }

    .week-bar-v::after {
      content: '';
      position: absolute;
      top: 0;
      left: 2px;
      right: 50%;
      bottom: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);
      border-radius: 3px 0 0 0;
    }

    .week-day {
      font-size: 8px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-top: 4px;
    }

    /* ========== MAIN SUMMARY ========== */
    .main-summary {
      background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 50%, var(--bg-card) 100%);
      border-radius: 20px;
      padding: var(--space-xl) var(--space-xl);
      border: 1px solid rgba(201, 162, 39, 0.12);
      box-shadow:
        0 16px 64px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.02),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: var(--space-xl);
      position: relative;
      opacity: 0;
      animation: fadeSlideUp 0.6s ease-out 0.5s forwards;
    }

    /* Decorative corner flourishes */
    .main-summary::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 60px;
      height: 60px;
      border-left: 2px solid var(--accent-brass);
      border-top: 2px solid var(--accent-brass);
      opacity: 0.2;
    }

    .main-summary::after {
      content: '';
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-right: 2px solid var(--accent-brass);
      border-bottom: 2px solid var(--accent-brass);
      opacity: 0.2;
    }

    /* Divider line */
    .main-summary > .persona-left::after {
      content: '';
      position: absolute;
      top: 10%;
      right: 0;
      bottom: 10%;
      width: 1px;
      background: linear-gradient(180deg, transparent 0%, var(--accent-brass) 50%, transparent 100%);
      opacity: 0.2;
    }

    .persona-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-md);
      position: relative;
      padding-right: var(--space-xl);
    }

    .persona-icon {
      font-size: 72px;
      filter: drop-shadow(0 0 30px var(--accent-glow));
      animation: iconFloat 4s ease-in-out infinite;
    }

    .persona-title-en {
      font-family: 'Tangerine', cursive;
      font-size: 56px;
      font-weight: 700;
      line-height: 1.1;
      background: linear-gradient(90deg, #f0d080 0%, #fff8e0 25%, #ffffff 50%, #fff8e0 75%, #f0d080 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 6s linear infinite;
      filter: drop-shadow(0 0 20px rgba(240, 208, 128, 0.4));
    }

    .persona-title-ja {
      font-family: 'Noto Serif JP', serif;
      font-size: 15px;
      font-weight: 500;
      color: var(--text-secondary);
      letter-spacing: 3px;
      margin-top: 2px;
    }

    .persona-sub {
      font-size: 14px;
      color: var(--text-secondary);
      font-style: italic;
      max-width: 280px;
      line-height: 1.6;
    }

    .traits {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-sm);
      margin-top: var(--space-sm);
    }

    .trait {
      background: linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(184, 115, 51, 0.1) 100%);
      color: var(--accent-brass);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.5px;
      border: 1px solid rgba(201, 162, 39, 0.2);
      opacity: 0;
      animation: fadeSlideUp 0.4s ease-out forwards;
      animation-delay: calc(0.6s + var(--delay));
      transition: all 0.2s ease;
    }

    .trait:hover {
      background: linear-gradient(135deg, rgba(201, 162, 39, 0.25) 0%, rgba(184, 115, 51, 0.2) 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(201, 162, 39, 0.2);
    }

    .persona-stats {
      display: flex;
      justify-content: center;
      gap: var(--space-xl);
      margin-top: var(--space-md);
      padding-top: var(--space-md);
      border-top: 1px solid rgba(201, 162, 39, 0.1);
    }

    .p-stat {
      text-align: center;
    }

    .p-stat-val {
      font-family: var(--font-display);
      font-size: 32px;
      font-weight: 600;
      color: var(--accent-brass);
      text-shadow: 0 0 20px var(--accent-glow);
      line-height: 1;
    }

    .p-stat-lbl {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: var(--space-xs);
    }

    /* Feedback boxes */
    .feedback-right {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .fb-box {
      background: rgba(0, 0, 0, 0.25);
      border-radius: 12px;
      padding: var(--space-md) var(--space-lg);
      border-left: 3px solid var(--accent-brass);
      flex: 1;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .fb-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, rgba(201, 162, 39, 0.05) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .fb-box:hover::before {
      opacity: 1;
    }

    .fb-box.roast {
      border-left-color: var(--accent-warm);
    }
    .fb-box.roast::before {
      background: linear-gradient(90deg, rgba(255, 140, 66, 0.05) 0%, transparent 50%);
    }

    .fb-box.hype {
      border-left-color: var(--accent-gold);
    }
    .fb-box.hype::before {
      background: linear-gradient(90deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    }

    .fb-box.comments {
      border-left-color: var(--text-muted);
    }

    .fb-label {
      font-family: var(--font-display);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: var(--space-sm);
      font-weight: 600;
    }

    .fb-label.roast { color: var(--accent-warm); }
    .fb-label.hype { color: var(--accent-gold); }
    .fb-label.comments { color: var(--text-muted); }

    .fb-box ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .fb-box li {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.7;
      padding-left: 16px;
      position: relative;
      margin-bottom: 6px;
      opacity: 0;
      animation: fadeSlideIn 0.4s ease-out forwards;
      animation-delay: calc(0.7s + var(--delay));
    }

    .fb-box li::before {
      content: "◆";
      position: absolute;
      left: 0;
      font-size: 6px;
      color: var(--accent-brass);
      top: 6px;
    }

    .fb-box.roast li::before { color: var(--accent-warm); }
    .fb-box.hype li::before { color: var(--accent-gold); }
    .fb-box.comments li::before { color: var(--text-muted); }

    /* ========== FOOTER ========== */
    .footer {
      text-align: center;
      font-size: 10px;
      color: var(--text-muted);
      padding: var(--space-md);
      opacity: 0;
      animation: fadeSlideUp 0.4s ease-out 1s forwards;
      letter-spacing: 2px;
    }

    .footer::before {
      content: '— ';
    }
    .footer::after {
      content: ' —';
    }

    /* ========== RESPONSIVE ========== */
    /* Stats縮小 - 中程度の幅 */
    @media (max-width: 1200px) {
      .stat-val { font-size: 16px; }
      .stat-lbl { font-size: 9px; }
      .stats-row { gap: var(--space-md); }
    }

    /* Stats縮小 - さらに狭い */
    @media (max-width: 1000px) {
      .stat-val { font-size: 14px; }
      .stat-lbl { font-size: 8px; letter-spacing: 0; }
      .stats-row { gap: 12px; }
      .stat { gap: 3px; }
    }

    /* Stats縮小 - 狭い */
    @media (max-width: 850px) {
      .stat-val { font-size: 12px; }
      .stat-lbl { font-size: 7px; }
      .stats-row { gap: 8px; }
      .stat { gap: 2px; }
      .brand { font-size: 22px; letter-spacing: 2px; }
    }

    @media (max-width: 600px) {
      .rankings-row { grid-template-columns: repeat(2, 1fr); }
      .main-summary { grid-template-columns: 1fr; }
      .persona-left {
        padding-right: 0;
        padding-bottom: var(--space-xl);
        border-bottom: 1px solid rgba(201, 162, 39, 0.1);
      }
      .persona-left::after { display: none; }
    }

    @media (max-width: 400px) {
      body { padding: var(--space-sm); }
      .header {
        flex-direction: column;
        gap: var(--space-md);
        text-align: center;
        padding: var(--space-md);
      }
      .stats-row {
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-md);
      }
      .stat-val { font-size: 14px; }
      .stat-lbl { font-size: 8px; }
      .rankings-row { grid-template-columns: 1fr; }
      .brand { font-size: 20px; letter-spacing: 2px; }
      .persona-title-en { font-size: 40px; }
      .persona-title-ja { font-size: 13px; }
      .main-summary { padding: var(--space-md); }
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <header class="header">
      <div class="brand-section">
        <div class="brand">Claude Code Wrapped</div>
        <div class="period">${formatDate(result.startDate)} — ${formatDate(result.endDate)}</div>
      </div>
      <div class="stats-block">
        <div class="stats-row">${statsHtml1}</div>
        <div class="stats-row">${statsHtml2}</div>
      </div>
    </header>

    <div class="rankings-row">
      <div class="mini-card">
        <div class="mini-title">Projects</div>
        ${projectRows || '<div class="rank-row"><span class="rank-name" style="color:var(--text-muted)">No data</span></div>'}
      </div>
      <div class="mini-card">
        <div class="mini-title">Languages</div>
        ${langRows || '<div class="rank-row"><span class="rank-name" style="color:var(--text-muted)">No data</span></div>'}
      </div>
      <div class="mini-card">
        <div class="mini-title">Models</div>
        ${modelRows}
      </div>
      <div class="mini-card">
        <div class="mini-title">Weekly</div>
        <div class="weekly-chart">${weeklyBars}</div>
      </div>
    </div>

    <section class="main-summary">
      <div class="persona-left">
        <div class="persona-icon">${result.persona.icon}</div>
        <div class="persona-title-en">${toTitleCase(result.persona.title)}</div>
        <div class="persona-title-ja">${titleMap[result.persona.title] || ""}</div>
        <div class="persona-sub">${result.persona.subtitle}</div>
        ${traits ? `<div class="traits">${traits}</div>` : ''}
        <div class="persona-stats">
          <div class="p-stat"><div class="p-stat-val">${result.mondayFeedback.thanksCount}</div><div class="p-stat-lbl">thanks</div></div>
          <div class="p-stat"><div class="p-stat-val">${result.mondayFeedback.retryCount}</div><div class="p-stat-lbl">retries</div></div>
        </div>
      </div>
      <div class="feedback-right">
        <div class="fb-box roast">
          <div class="fb-label roast">Roast</div>
          <ul>${roastItems}</ul>
        </div>
        <div class="fb-box hype">
          <div class="fb-label hype">Hype</div>
          <ul>${hypeItems}</ul>
        </div>
        <div class="fb-box comments">
          <div class="fb-label comments">Summary</div>
          <ul>${comments}</ul>
        </div>
      </div>
    </section>

    <footer class="footer">generated ${new Date().toISOString().split("T")[0]}</footer>
  </div>
</body>
</html>`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
