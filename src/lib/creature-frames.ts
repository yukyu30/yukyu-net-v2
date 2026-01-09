/**
 * チャットのステータスに応じた生命体のアニメーションフレームを管理するモジュール
 */

export type ChatStatus = 'idle' | 'searching' | 'thinking' | 'reading' | 'found' | 'not_found'

/**
 * ステータスに応じたアニメーションフレームの定義
 */
const STATUS_FRAMES: Record<ChatStatus, string[]> = {
  // 通常時：四隅が回転（ゆっくり）
  idle: ['▘', '▝', '▗', '▖'],
  // 検索中：キョロキョロ
  searching: ['◠', '◡'],
  // 思考中：ぐるぐる
  thinking: ['▚', '▞'],
  // 読込中：パクパク
  reading: ['▁', '▃', '▅', '▇'],
  // 発見時：ワクワク
  found: ['▛', '▜', '▟', '▙'],
  // 見つからなかった：しょぼん
  not_found: ['▖', '▗'],
}

/**
 * ステータスに応じたアニメーション速度（ms）の定義
 */
const STATUS_SPEEDS: Record<ChatStatus, number> = {
  idle: 500,      // ゆっくり
  searching: 200, // キョロキョロ
  thinking: 150,  // 速め
  reading: 250,   // パクパク
  found: 100,     // 喜び（速い）
  not_found: 400, // ゆっくり
}

/**
 * ステータスに応じたアニメーションフレームを取得する
 */
export function getFramesForStatus(status: ChatStatus): string[] {
  return STATUS_FRAMES[status] || STATUS_FRAMES.idle
}

/**
 * ステータスに応じたアニメーション速度を取得する
 */
export function getAnimationSpeed(status: ChatStatus): number {
  return STATUS_SPEEDS[status] || STATUS_SPEEDS.idle
}
