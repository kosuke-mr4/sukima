import { useState } from 'preact/hooks'
import { TaskCard } from './TaskCard'
import { sortByPriority } from '../services/taskManager'

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

export function TaskColumn({ category, tasks, onToggle, onDelete, onUpdate }) {
  const [showCompleted, setShowCompleted] = useState(false)
  const meta = CATEGORY_META[category]

  const incomplete = sortByPriority(tasks.filter(t => !t.isCompleted))
  const completed = sortByPriority(tasks.filter(t => t.isCompleted))

  return (
    <section
      style={{
        flex: '1 1 400px',
        minWidth: '320px',
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
        style={{
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {incomplete.length === 0 && !showCompleted && (
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
        {incomplete.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
        {showCompleted && completed.map(task => (
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
