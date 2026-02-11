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
