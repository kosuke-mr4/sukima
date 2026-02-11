import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadTasks, saveTasks, STORAGE_KEY } from '../services/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveTasks', () => {
    it('should save tasks to localStorage', () => {
      const tasks = [
        { id: '1', title: 'タスク1' },
        { id: '2', title: 'タスク2' },
      ]
      saveTasks(tasks)

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      expect(stored).toHaveLength(2)
      expect(stored[0].title).toBe('タスク1')
    })

    it('should save empty array', () => {
      saveTasks([])
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      expect(stored).toEqual([])
    })
  })

  describe('loadTasks', () => {
    it('should load tasks from localStorage', () => {
      const tasks = [{ id: '1', title: '保存済み' }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))

      const loaded = loadTasks()
      expect(loaded).toHaveLength(1)
      expect(loaded[0].title).toBe('保存済み')
    })

    it('should return empty array when no data', () => {
      const loaded = loadTasks()
      expect(loaded).toEqual([])
    })

    it('should return empty array for corrupted data', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json')
      const loaded = loadTasks()
      expect(loaded).toEqual([])
    })
  })
})
