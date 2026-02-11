import { describe, it, expect } from 'vitest'
import { createTask } from '../models/taskModel'
import {
  addTask,
  updateTask,
  deleteTask,
  toggleComplete,
  filterByCategory,
  sortByPriority,
} from '../services/taskManager'

function makeTasks() {
  return [
    { ...createTask({ title: '高優先度Must', category: 'must_do', priority: 'high' }), id: '1' },
    { ...createTask({ title: '低優先度Must', category: 'must_do', priority: 'low' }), id: '2' },
    { ...createTask({ title: '中優先度Nice', category: 'nice_to_have', priority: 'medium' }), id: '3' },
  ]
}

describe('addTask', () => {
  it('should add a new task to the list', () => {
    const tasks = []
    const result = addTask(tasks, { title: '新しいタスク' })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('新しいタスク')
  })

  it('should not mutate the original array', () => {
    const tasks = []
    const result = addTask(tasks, { title: 'テスト' })
    expect(tasks).toHaveLength(0)
    expect(result).toHaveLength(1)
  })
})

describe('updateTask', () => {
  it('should update task fields', () => {
    const tasks = makeTasks()
    const result = updateTask(tasks, '1', { title: '更新済み', priority: 'low' })
    const updated = result.find(t => t.id === '1')
    expect(updated.title).toBe('更新済み')
    expect(updated.priority).toBe('low')
  })

  it('should update the updatedAt timestamp', () => {
    const tasks = makeTasks()
    const original = tasks.find(t => t.id === '1').updatedAt
    const result = updateTask(tasks, '1', { title: '更新' })
    expect(result.find(t => t.id === '1').updatedAt).toBeGreaterThanOrEqual(original)
  })

  it('should not mutate original array', () => {
    const tasks = makeTasks()
    const result = updateTask(tasks, '1', { title: '更新' })
    expect(tasks[0].title).toBe('高優先度Must')
    expect(result[0].title).toBe('更新')
  })
})

describe('deleteTask', () => {
  it('should remove a task by id', () => {
    const tasks = makeTasks()
    const result = deleteTask(tasks, '2')
    expect(result).toHaveLength(2)
    expect(result.find(t => t.id === '2')).toBeUndefined()
  })

  it('should not mutate original array', () => {
    const tasks = makeTasks()
    deleteTask(tasks, '1')
    expect(tasks).toHaveLength(3)
  })
})

describe('toggleComplete', () => {
  it('should toggle isCompleted from false to true', () => {
    const tasks = makeTasks()
    const result = toggleComplete(tasks, '1')
    expect(result.find(t => t.id === '1').isCompleted).toBe(true)
  })

  it('should toggle isCompleted from true to false', () => {
    const tasks = makeTasks()
    const toggled = toggleComplete(tasks, '1')
    const result = toggleComplete(toggled, '1')
    expect(result.find(t => t.id === '1').isCompleted).toBe(false)
  })
})

describe('filterByCategory', () => {
  it('should filter tasks by must_do', () => {
    const tasks = makeTasks()
    const result = filterByCategory(tasks, 'must_do')
    expect(result).toHaveLength(2)
    result.forEach(t => expect(t.category).toBe('must_do'))
  })

  it('should filter tasks by nice_to_have', () => {
    const tasks = makeTasks()
    const result = filterByCategory(tasks, 'nice_to_have')
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('nice_to_have')
  })
})

describe('sortByPriority', () => {
  it('should sort tasks by priority: high > medium > low', () => {
    const tasks = [
      { ...createTask({ title: '低', priority: 'low' }), id: 'a' },
      { ...createTask({ title: '高', priority: 'high' }), id: 'b' },
      { ...createTask({ title: '中', priority: 'medium' }), id: 'c' },
    ]
    const result = sortByPriority(tasks)
    expect(result[0].priority).toBe('high')
    expect(result[1].priority).toBe('medium')
    expect(result[2].priority).toBe('low')
  })

  it('should not mutate original array', () => {
    const tasks = [
      { ...createTask({ title: '低', priority: 'low' }), id: 'a' },
      { ...createTask({ title: '高', priority: 'high' }), id: 'b' },
    ]
    sortByPriority(tasks)
    expect(tasks[0].priority).toBe('low')
  })
})
