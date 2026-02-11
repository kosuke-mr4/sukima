import { useState } from 'preact/hooks'

const defaultForm = {
  title: '',
  description: '',
  category: 'must_do',
  priority: 'medium',
}

export function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({ ...defaultForm })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('タイトルは必須です')
      return
    }
    onSubmit(form)
    setForm({ ...defaultForm })
    setError('')
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (field === 'title' && error) setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form"
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ flex: '1 1 200px', minWidth: '200px', position: 'relative', paddingBottom: '18px' }}>
        <label
          htmlFor="task-title"
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          タイトル*
        </label>
        <input
          id="task-title"
          type="text"
          value={form.title}
          onInput={handleChange('title')}
          placeholder="タスクを入力..."
          style={{
            width: '100%',
            padding: '8px 10px',
            border: error ? '2px solid var(--color-accent-must)' : '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '14px',
          }}
        />
        {error && (
          <span style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            fontSize: '12px',
            color: 'var(--color-accent-must)',
            lineHeight: '16px',
          }}>
            {error}
          </span>
        )}
      </div>

      <div style={{ flex: '1 1 160px', minWidth: '160px', paddingBottom: '18px' }}>
        <label
          htmlFor="task-description"
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          メモ
        </label>
        <input
          id="task-description"
          type="text"
          value={form.description}
          onInput={handleChange('description')}
          placeholder="詳細..."
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ paddingBottom: '18px' }}>
        <label
          htmlFor="task-category"
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          カテゴリ
        </label>
        <select
          id="task-category"
          value={form.category}
          onChange={handleChange('category')}
          style={{
            padding: '8px 10px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '14px',
          }}
        >
          <option value="must_do">Must Do</option>
          <option value="nice_to_have">Nice to Have</option>
        </select>
      </div>

      <div style={{ paddingBottom: '18px' }}>
        <label
          htmlFor="task-priority"
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          優先度
        </label>
        <select
          id="task-priority"
          value={form.priority}
          onChange={handleChange('priority')}
          style={{
            padding: '8px 10px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '14px',
          }}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <button
        type="submit"
        id="task-submit"
        style={{
          padding: '8px 20px',
          marginBottom: '18px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-text)',
          color: 'var(--color-bg)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'opacity 0.15s ease',
        }}
      >
        追加
      </button>
    </form>
  )
}
