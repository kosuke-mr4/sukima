export const CATEGORIES = ['must_do', 'nice_to_have']
export const PRIORITIES = ['high', 'medium', 'low']

/**
 * 新しいタスクオブジェクトを生成する
 * @param {Object} params - タスクパラメータ
 * @param {string} params.title - タスクタイトル（必須）
 * @param {string} [params.description=''] - 詳細メモ
 * @param {string} [params.category='must_do'] - 分類ラベル
 * @param {string} [params.priority='medium'] - 優先度
 * @returns {Object} タスクオブジェクト
 */
export function createTask({ title, description = '', category = 'must_do', priority = 'medium' }) {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    title,
    description,
    category,
    priority,
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * タスクオブジェクトのバリデーション
 * @param {Object} task - 検証対象のタスク
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateTask(task) {
  const errors = []

  if (!task.title || task.title.trim() === '') {
    errors.push('タイトルは必須です')
  }
  if (!CATEGORIES.includes(task.category)) {
    errors.push('無効なカテゴリです')
  }
  if (!PRIORITIES.includes(task.priority)) {
    errors.push('無効な優先度です')
  }

  return { valid: errors.length === 0, errors }
}
