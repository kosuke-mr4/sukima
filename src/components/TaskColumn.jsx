import { useState } from 'preact/hooks'
import { TaskCard } from './TaskCard'
import { sortByOrder } from '../services/taskManager'

const CATEGORY_META = {
  must_do: {
    label: 'Must Do',
    accent: 'var(--color-accent-must)',
    bg: 'var(--color-accent-must-bg)',
  },
  nice_to_have: {
    label: 'Nice to Have',
    accent: 'var(--color-accent-nice)',
    bg: 'var(--color-accent-nice-bg)',
  },
}

export function TaskColumn({ category, tasks, onToggle, onDelete, onUpdate, onMoveCategory, onReorder }) {
  const [showCompleted, setShowCompleted] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dropIndex, setDropIndex] = useState(-1)
  const meta = CATEGORY_META[category]

  const incomplete = sortByOrder(tasks.filter(t => !t.isCompleted))
  const completed = sortByOrder(tasks.filter(t => t.isCompleted))

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)

    // Calculate drop index from mouse position
    const listEl = e.currentTarget.querySelector('[data-task-list]')
    if (!listEl) return

    const cards = Array.from(listEl.querySelectorAll('[data-task-id]'))
    let newIndex = cards.length

    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect()
      const midY = rect.top + rect.height / 2
      if (e.clientY < midY) {
        newIndex = i
        break
      }
    }
    setDropIndex(newIndex)
  }

  const handleDragLeave = (e) => {
    // Only handle if leaving the section (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false)
      setDropIndex(-1)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    setDropIndex(-1)

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { taskId, sourceCategory } = data

      if (sourceCategory !== category) {
        // Cross-column move
        onMoveCategory(taskId, category)
      }

      // Reorder within column (or place at drop position after move)
      // Use requestAnimationFrame to ensure category update is applied first
      if (sourceCategory !== category) {
        requestAnimationFrame(() => {
          onReorder(taskId, dropIndex >= 0 ? dropIndex : incomplete.length, category)
        })
      } else {
        onReorder(taskId, dropIndex >= 0 ? dropIndex : incomplete.length, category)
      }
    } catch {
      // ignore invalid data
    }
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: '1 1 400px',
        minWidth: '320px',
        transition: 'background-color 0.15s ease',
        backgroundColor: dragOver ? 'var(--color-accent-' + (category === 'must_do' ? 'must' : 'nice') + '-bg)' : 'transparent',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `2px solid ${meta.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: meta.accent,
              display: 'inline-block',
            }}
          />
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {meta.label}
          </h2>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
            }}
          >
            {incomplete.length}
          </span>
        </div>
        {completed.length > 0 && (
          <button
            onClick={() => setShowCompleted(prev => !prev)}
            style={{
              padding: '2px 8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            {showCompleted ? '完了を隠す' : `完了 ${completed.length}`}
          </button>
        )}
      </div>

      {/* Task list */}
      <div
        data-task-list
        style={{
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          minHeight: '60px',
        }}
      >
        {incomplete.length === 0 && !showCompleted && !dragOver && (
          <p
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
            }}
          >
            タスクがありません
          </p>
        )}
        {incomplete.map((task, index) => (
          <>
            {dropIndex === index && dragOver && (
              <div
                style={{
                  height: '3px',
                  backgroundColor: meta.accent,
                  borderRadius: '2px',
                  margin: '-3px 0',
                }}
              />
            )}
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </>
        ))}
        {dropIndex >= incomplete.length && dragOver && (
          <div
            style={{
              height: '3px',
              backgroundColor: meta.accent,
              borderRadius: '2px',
            }}
          />
        )}
        {showCompleted && completed.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  )
}
