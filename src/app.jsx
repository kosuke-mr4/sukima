import { useState, useEffect } from 'preact/hooks'
import { useTheme } from './hooks/useTheme'
import { Header } from './components/Header'
import { TaskForm } from './components/TaskForm'
import { TaskColumn } from './components/TaskColumn'
import { loadTasks, saveTasks } from './services/storage'
import { addTask, updateTask, deleteTask, toggleComplete, filterByCategory } from './services/taskManager'

export function App() {
  const { theme, toggleTheme } = useTheme()
  const [tasks, setTasks] = useState(() => loadTasks())

  // Persist to localStorage on every change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const handleAdd = (params) => {
    setTasks(prev => addTask(prev, params))
  }

  const handleToggle = (id) => {
    setTasks(prev => toggleComplete(prev, id))
  }

  const handleDelete = (id) => {
    setTasks(prev => deleteTask(prev, id))
  }

  const handleUpdate = (id, updates) => {
    setTasks(prev => updateTask(prev, id, updates))
  }

  const mustDoTasks = filterByCategory(tasks, 'must_do')
  const niceToHaveTasks = filterByCategory(tasks, 'nice_to_have')

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        transition: 'background-color 0.2s ease',
      }}
    >
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <TaskForm onSubmit={handleAdd} />

      <main
        className="app-main"
        style={{
          display: 'flex',
          gap: '1px',
          backgroundColor: 'var(--color-border)',
          minHeight: 'calc(100vh - 130px)',
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <TaskColumn
            category="must_do"
            tasks={mustDoTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <TaskColumn
            category="nice_to_have"
            tasks={niceToHaveTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      </main>
    </div>
  )
}
