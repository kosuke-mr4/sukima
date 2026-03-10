import { createTask } from '../models/taskModel'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

/**
 * タスクを追加する（不変）
 */
export function addTask(tasks, params) {
  return [...tasks, createTask(params)]
}

/**
 * タスクを更新する（不変）
 */
export function updateTask(tasks, id, updates) {
  return tasks.map(task =>
    task.id === id
      ? { ...task, ...updates, updatedAt: Date.now() }
      : task
  )
}

/**
 * タスクを削除する（不変）
 */
export function deleteTask(tasks, id) {
  return tasks.filter(task => task.id !== id)
}

/**
 * 完了/未完了を切り替える（不変）
 */
export function toggleComplete(tasks, id) {
  return tasks.map(task =>
    task.id === id
      ? { ...task, isCompleted: !task.isCompleted, updatedAt: Date.now() }
      : task
  )
}

/**
 * カテゴリでフィルタリング
 */
export function filterByCategory(tasks, category) {
  return tasks.filter(task => task.category === category)
}

/**
 * 優先度でソート（high → medium → low）
 */
export function sortByPriority(tasks) {
  return [...tasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
}

/**
 * sortOrder でソート（昇順）。sortOrder がない既存タスクは createdAt にフォールバック
 */
export function sortByOrder(tasks) {
  return [...tasks].sort((a, b) => {
    const orderA = a.sortOrder ?? a.createdAt ?? 0
    const orderB = b.sortOrder ?? b.createdAt ?? 0
    return orderA - orderB
  })
}

/**
 * タスクを別カテゴリへ移動する（不変）
 */
export function moveToCategory(tasks, id, newCategory) {
  return tasks.map(task =>
    task.id === id
      ? { ...task, category: newCategory, updatedAt: Date.now() }
      : task
  )
}

/**
 * カラム内でタスクの表示順を変更する（不変）
 * @param {Array} tasks - 全タスク
 * @param {string} id - 移動するタスクのID
 * @param {number} newIndex - カラム内での新しいインデックス（0始まり）
 * @param {string} category - 対象カテゴリ
 */
export function reorderTask(tasks, id, newIndex, category) {
  // 対象カテゴリの未完了タスクを sortOrder 順で取得
  const categoryTasks = sortByOrder(tasks.filter(t => t.category === category && !t.isCompleted))
  
  // 移動対象を除外
  const without = categoryTasks.filter(t => t.id !== id)
  const target = categoryTasks.find(t => t.id === id)
  if (!target) return tasks

  // 新しい位置に挿入
  const clampedIndex = Math.max(0, Math.min(newIndex, without.length))
  without.splice(clampedIndex, 0, target)

  // sortOrder を振り直す
  const now = Date.now()
  const reordered = new Map()
  without.forEach((t, i) => {
    reordered.set(t.id, { sortOrder: i, updatedAt: now })
  })

  // 全タスク配列に反映
  return tasks.map(task => {
    const update = reordered.get(task.id)
    return update ? { ...task, ...update } : task
  })
}

/**
 * カテゴリ移動と並べ替えをアトミックに実行する（不変）
 * @param {Array} tasks - 全タスク
 * @param {string} id - 移動するタスクのID
 * @param {string} newCategory - 移動先カテゴリ
 * @param {number} newIndex - 移動先カテゴリ内での新しいインデックス（0始まり）
 */
export function moveAndReorderTask(tasks, id, newCategory, newIndex) {
  // まずカテゴリを変更
  const moved = moveToCategory(tasks, id, newCategory)
  // 変更後の状態で並べ替え
  return reorderTask(moved, id, newIndex, newCategory)
}
