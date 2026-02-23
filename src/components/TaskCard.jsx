import { useState } from 'preact/hooks'

const PRIORITY_LABELS = { high: 'H', medium: 'M', low: 'L' }
const PRIORITY_COLORS = {
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
}

export function TaskCard({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [isDragging, setIsDragging] = useState(false)

  const handleSave = () => {
    if (!editTitle.trim()) return
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditPriority(task.priority)
    setEditing(false)
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      taskId: task.id,
      sourceCategory: task.category,
    }))
    e.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  if (editing) {
    return (
      <div
        className="card"
        style={{
          padding: '12px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={editTitle}
          onInput={(e) => setEditTitle(e.target.value)}
          style={{
            padding: '6px 8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '14px',
          }}
        />
        <input
          type="text"
          value={editDescription}
          onInput={(e) => setEditDescription(e.target.value)}
          placeholder="メモ..."
          style={{
            padding: '6px 8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '13px',
          }}
        />
        <select
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
          style={{
            padding: '6px 8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '13px',
          }}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-text)',
              color: 'var(--color-bg)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            取消
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="card"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-task-id={task.id}
      style={{
        padding: '10px 12px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        opacity: isDragging ? 0.4 : task.isCompleted ? 0.55 : 1,
        cursor: 'grab',
        transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task.id)}
        style={{
          width: '16px',
          height: '16px',
          marginTop: '2px',
          cursor: 'pointer',
          accentColor: 'var(--color-text)',
          flexShrink: 0,
        }}
        aria-label={`${task.title} を完了にする`}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: task.isCompleted ? 'var(--color-completed)' : 'var(--color-text)',
              textDecoration: task.isCompleted ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: PRIORITY_COLORS[task.priority],
              border: `1px solid ${PRIORITY_COLORS[task.priority]}`,
              padding: '1px 5px',
              borderRadius: 'var(--radius-sm)',
              flexShrink: 0,
              lineHeight: '16px',
            }}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {task.description && (
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '3px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setEditing(true)}
          style={{
            padding: '2px 8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          aria-label={`${task.title} を編集`}
        >
          編集
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            padding: '2px 8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-accent-must)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          aria-label={`${task.title} を削除`}
        >
          削除
        </button>
      </div>
    </div>
  )
}
