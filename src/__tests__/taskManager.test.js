import { describe, it, expect } from 'vitest'
import { createTask } from '../models/taskModel'
import {
  addTask,
  updateTask,
  deleteTask,
  toggleComplete,
  filterByCategory,
  sortByPriority,
  sortByOrder,
  moveToCategory,
  reorderTask,
} from '../services/taskManager'

function makeTasks() {
  return [
    { ...createTask({ title: '高優先度Must', category: 'must_do', priority: 'high' }), id: '1', sortOrder: 0 },
    { ...createTask({ title: '低優先度Must', category: 'must_do', priority: 'low' }), id: '2', sortOrder: 1 },
    { ...createTask({ title: '中優先度Nice', category: 'nice_to_have', priority: 'medium' }), id: '3', sortOrder: 0 },
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

  it('should include sortOrder in new tasks', () => {
    const result = addTask([], { title: 'テスト' })
    expect(result[0].sortOrder).toBeTypeOf('number')
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

describe('sortByOrder', () => {
  it('should sort tasks by sortOrder ascending', () => {
    const tasks = [
      { id: 'a', sortOrder: 3 },
      { id: 'b', sortOrder: 1 },
      { id: 'c', sortOrder: 2 },
    ]
    const result = sortByOrder(tasks)
    expect(result[0].id).toBe('b')
    expect(result[1].id).toBe('c')
    expect(result[2].id).toBe('a')
  })

  it('should fallback to createdAt if sortOrder is undefined', () => {
    const tasks = [
      { id: 'a', createdAt: 300 },
      { id: 'b', createdAt: 100 },
      { id: 'c', sortOrder: 200 },
    ]
    const result = sortByOrder(tasks)
    expect(result[0].id).toBe('b')
    expect(result[1].id).toBe('c')
    expect(result[2].id).toBe('a')
  })

  it('should not mutate original array', () => {
    const tasks = [
      { id: 'a', sortOrder: 2 },
      { id: 'b', sortOrder: 1 },
    ]
    sortByOrder(tasks)
    expect(tasks[0].id).toBe('a')
  })
})

describe('moveToCategory', () => {
  it('should change a task category', () => {
    const tasks = makeTasks()
    const result = moveToCategory(tasks, '1', 'nice_to_have')
    const moved = result.find(t => t.id === '1')
    expect(moved.category).toBe('nice_to_have')
  })

  it('should update updatedAt', () => {
    const tasks = makeTasks()
    const before = tasks.find(t => t.id === '1').updatedAt
    const result = moveToCategory(tasks, '1', 'nice_to_have')
    expect(result.find(t => t.id === '1').updatedAt).toBeGreaterThanOrEqual(before)
  })

  it('should not mutate original array', () => {
    const tasks = makeTasks()
    moveToCategory(tasks, '1', 'nice_to_have')
    expect(tasks.find(t => t.id === '1').category).toBe('must_do')
  })

  it('should not affect other tasks', () => {
    const tasks = makeTasks()
    const result = moveToCategory(tasks, '1', 'nice_to_have')
    expect(result.find(t => t.id === '2').category).toBe('must_do')
    expect(result.find(t => t.id === '3').category).toBe('nice_to_have')
  })
})

describe('reorderTask', () => {
  it('should move task to a new position within same category', () => {
    const tasks = [
      { id: 'a', category: 'must_do', sortOrder: 0 },
      { id: 'b', category: 'must_do', sortOrder: 1 },
      { id: 'c', category: 'must_do', sortOrder: 2 },
    ]
    // Move 'a' (index 0) to index 2
    const result = reorderTask(tasks, 'a', 2, 'must_do')
    const reordered = result.filter(t => t.category === 'must_do').sort((a, b) => a.sortOrder - b.sortOrder)
    expect(reordered[0].id).toBe('b')
    expect(reordered[1].id).toBe('c')
    expect(reordered[2].id).toBe('a')
  })

  it('should move task to the first position', () => {
    const tasks = [
      { id: 'a', category: 'must_do', sortOrder: 0 },
      { id: 'b', category: 'must_do', sortOrder: 1 },
      { id: 'c', category: 'must_do', sortOrder: 2 },
    ]
    const result = reorderTask(tasks, 'c', 0, 'must_do')
    const reordered = result.filter(t => t.category === 'must_do').sort((a, b) => a.sortOrder - b.sortOrder)
    expect(reordered[0].id).toBe('c')
    expect(reordered[1].id).toBe('a')
    expect(reordered[2].id).toBe('b')
  })

  it('should not affect tasks in other categories', () => {
    const tasks = [
      { id: 'a', category: 'must_do', sortOrder: 0 },
      { id: 'b', category: 'must_do', sortOrder: 1 },
      { id: 'x', category: 'nice_to_have', sortOrder: 0 },
    ]
    const result = reorderTask(tasks, 'b', 0, 'must_do')
    const nice = result.find(t => t.id === 'x')
    expect(nice.sortOrder).toBe(0) // unchanged
  })

  it('should not mutate original array', () => {
    const tasks = [
      { id: 'a', category: 'must_do', sortOrder: 0 },
      { id: 'b', category: 'must_do', sortOrder: 1 },
    ]
    const original = [...tasks.map(t => ({ ...t }))]
    reorderTask(tasks, 'b', 0, 'must_do')
    expect(tasks[0].sortOrder).toBe(original[0].sortOrder)
    expect(tasks[1].sortOrder).toBe(original[1].sortOrder)
  })

  it('should clamp index to valid range', () => {
    const tasks = [
      { id: 'a', category: 'must_do', sortOrder: 0 },
      { id: 'b', category: 'must_do', sortOrder: 1 },
    ]
    // newIndex = 100 (out of range) should clamp to end
    const result = reorderTask(tasks, 'a', 100, 'must_do')
    const reordered = result.filter(t => t.category === 'must_do').sort((a, b) => a.sortOrder - b.sortOrder)
    expect(reordered[0].id).toBe('b')
    expect(reordered[1].id).toBe('a')
  })

  it('should return unchanged if task id not found', () => {
    const tasks = [
      { id: 'a', category: 'must_do', sortOrder: 0 },
    ]
    const result = reorderTask(tasks, 'nonexistent', 0, 'must_do')
    expect(result).toEqual(tasks)
  })
})
