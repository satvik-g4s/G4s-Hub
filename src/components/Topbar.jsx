import { useState } from 'react'
import styles from './Topbar.module.css'

export default function Topbar({
  user,
  adminMode,
  onToggleAdmin,
  onOpenModal,
  onLogout,
  search,
  onSearch,
  theme,
  toggleTheme
}) {
  const [menuOpen, setMenu] = useState(false)

  const name = user?.user_metadata?.full_name || user?.email || 'User'
  const avatar = user?.user_metadata?.avatar_url
  const initials = name.charAt(0).toUpperCase()

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <img
          src={theme === 'dark'
            ? "/G4S-Logo-dark.wine.png"
            : "/G4S-Logo-light.wine.png"
          }
          alt="G4S"
          style={{ height: 26 }}
        />
      </div>

      <div className={styles.search}>
        <i className="fas fa-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--tm)', fontSize: 12 }} />
        <input
          type="text"
          placeholder="Search tools…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      

      <div className={styles.right}>

        <label className={styles.switch}>
          <span className={styles.sun}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" fill="#ffd43b" />
            </svg>
          </span>

          <span className={styles.moon}>
            <svg viewBox="0 0 24 24">
              <path fill="#73C0FC" d="M12 2a10 10 0 1 0 10 10A8 8 0 1 1 12 2z"/>
            </svg>
          </span>

          <input
            type="checkbox"
            className={styles.input}
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />

          <span className={styles.slider}></span>
        </label>
        

        <div className={styles.pill} onClick={() => setMenu(v => !v)}>
          <div className={styles.avatar}>
            {avatar ? <img src={avatar} alt={name} /> : initials}
          </div>
          <span className={styles.uname}>{name.split(' ')[0]}</span>
          <i className="fas fa-chevron-down" style={{ fontSize: 9, color: 'var(--tm)', marginLeft: 3 }} />

          {menuOpen && (
            <div className={styles.menu} onClick={e => e.stopPropagation()}>
              <div className={styles.mi} onClick={() => { onOpenModal(); setMenu(false) }}>
                <i className="fas fa-plus-circle" /> Add Tool
              </div>
              <div className={styles.mi} onClick={() => { onToggleAdmin(); setMenu(false) }}>
                <i className="fas fa-shield-alt" /> Toggle Admin
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
