import { describe, it, expect } from 'vitest'
import { createTask, validateTask, CATEGORIES, PRIORITIES } from '../models/taskModel'

describe('createTask', () => {
  it('should create a task with required title', () => {
    const task = createTask({ title: 'テスト用タスク' })

    expect(task.title).toBe('テスト用タスク')
    expect(task.id).toBeDefined()
    expect(task.description).toBe('')
    expect(task.category).toBe('must_do')
    expect(task.priority).toBe('medium')
    expect(task.isCompleted).toBe(false)
    expect(task.createdAt).toBeTypeOf('number')
    expect(task.updatedAt).toBeTypeOf('number')
  })

  it('should create a task with all fields', () => {
    const task = createTask({
      title: 'フルタスク',
      description: '詳細メモ',
      category: 'nice_to_have',
      priority: 'high',
    })

    expect(task.title).toBe('フルタスク')
    expect(task.description).toBe('詳細メモ')
    expect(task.category).toBe('nice_to_have')
    expect(task.priority).toBe('high')
  })

  it('should generate unique IDs', () => {
    const task1 = createTask({ title: 'タスク1' })
    const task2 = createTask({ title: 'タスク2' })
    expect(task1.id).not.toBe(task2.id)
  })
})

describe('validateTask', () => {
  it('should return valid for a correct task', () => {
    const task = createTask({ title: '有効なタスク' })
    const result = validateTask(task)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should return invalid for empty title', () => {
    const task = createTask({ title: '' })
    const result = validateTask(task)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('タイトルは必須です')
  })

  it('should return invalid for whitespace-only title', () => {
    const task = createTask({ title: '   ' })
    const result = validateTask(task)
    expect(result.valid).toBe(false)
  })

  it('should return invalid for unknown category', () => {
    const task = { ...createTask({ title: '不正' }), category: 'unknown' }
    const result = validateTask(task)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('無効なカテゴリです')
  })

  it('should return invalid for unknown priority', () => {
    const task = { ...createTask({ title: '不正' }), priority: 'urgent' }
    const result = validateTask(task)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('無効な優先度です')
  })
})

describe('Constants', () => {
  it('should export valid CATEGORIES', () => {
    expect(CATEGORIES).toContain('must_do')
    expect(CATEGORIES).toContain('nice_to_have')
  })

  it('should export valid PRIORITIES', () => {
    expect(PRIORITIES).toContain('high')
    expect(PRIORITIES).toContain('medium')
    expect(PRIORITIES).toContain('low')
  })
})
