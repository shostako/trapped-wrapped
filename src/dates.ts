// 日付は日本時間で切る。PC の時刻設定（WSL は UTC のことがある）に左右されないよう、
// 起動時に TZ を固定し、日付の文字列は現地時間で作る・読む
export const TIME_ZONE = "Asia/Tokyo";

export function useJapanTime(): void {
  process.env.TZ = TIME_ZONE;
}

// Date → "YYYY-MM-DD"（現地時間）
export function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// "YYYY-MM-DD" → その日の 0 時（現地時間）。new Date("YYYY-MM-DD") は UTC の 0 時になるので使わない
export function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "YYYY-MM-DD" → その日の終わり（現地時間）
export function endOfLocalDate(s: string): Date {
  const d = parseLocalDate(s);
  d.setHours(23, 59, 59, 999);
  return d;
}
