import styles from './Sidebar.module.css'

const CATS = [
  { key: 'all',        label: 'All',        icon: 'fa-th-large' },
  { key: 'Reports',   label: 'Reports',    icon: 'fa-chart-bar' },
  { key: 'Finance',   label: 'Finance',    icon: 'fa-dollar-sign' },
  { key: 'Operations',label: 'Operations', icon: 'fa-cogs' },
  { key: 'HR',        label: 'HR',         icon: 'fa-users' },
  { key: 'IT',        label: 'IT',         icon: 'fa-laptop-code' },
]

export default function Sidebar({ category, onSetCategory }) {
  return (
    <aside className={styles.sb}>
      <div className={styles.label}>Categories</div>
      {CATS.map(c => (
        <div
          key={c.key}
          className={`${styles.item} ${category === c.key ? styles.active : ''}`}
          onClick={() => onSetCategory(c.key)}
        >
          <i className={`fas ${c.icon}`} />
          {c.label}
        </div>
      ))}
    </aside>
  )
}
