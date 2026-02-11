export function Header({ theme, onToggleTheme }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
        }}
      >
        sukima
      </h1>
      <button
        id="theme-toggle"
        onClick={onToggleTheme}
        style={{
          padding: '6px 12px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'background-color 0.15s ease',
        }}
        aria-label="テーマ切り替え"
      >
        {theme === 'dark' ? '☀ Light' : '● Dark'}
      </button>
    </header>
  )
}
