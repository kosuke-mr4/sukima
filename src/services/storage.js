export const STORAGE_KEY = 'sukima-tasks'

/**
 * LocalStorageからタスク配列を読み込む
 * @returns {Object[]} タスク配列（データがない/破損時は空配列）
 */
export function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * タスク配列をLocalStorageに保存する
 * @param {Object[]} tasks - 保存するタスク配列
 */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
