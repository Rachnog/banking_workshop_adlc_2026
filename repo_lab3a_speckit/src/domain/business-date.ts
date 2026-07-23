/** Business-date derivation per MB-COMP-7 §3: Asia/Ho_Chi_Minh (ICT, UTC+7, no DST). */

const ICT_OFFSET_MS = 7 * 60 * 60 * 1000;

/** ISO UTC timestamp → ICT business date (YYYY-MM-DD). */
export function businessDateICT(tsIso: string): string {
  return new Date(new Date(tsIso).getTime() + ICT_OFFSET_MS).toISOString().slice(0, 10);
}

/** YYYY-MM-DD → YYYYMMDD (report compact form). */
export function compactDate(businessDate: string): string {
  return businessDate.replaceAll("-", "");
}
