import { useState } from 'react'
import styles from './AddCardModal.module.css'

const ICONS = [
  'fa-clock', 'fa-chart-bar', 'fa-file-invoice-dollar', 'fa-cogs',
  'fa-users', 'fa-database', 'fa-table', 'fa-dollar-sign',
  'fa-laptop-code', 'fa-file-alt', 'fa-tachometer-alt', 'fa-map-marker-alt',
  'fa-calendar-alt', 'fa-handshake', 'fa-bell', 'fa-shield-alt',
]

const CATEGORIES = ['Reports', 'Finance', 'Operations', 'HR', 'IT']

export default function AddCardModal({ onAdd, onClose, existing }) {
  const [name, setName] = useState(existing?.name || '')
  const [category, setCat] = useState(existing?.category || 'Reports')
  const [url, setUrl] = useState(existing?.url || '')
  const [target, setTarget] = useState(existing?.target || '_blank')
  const [icon, setIcon] = useState(existing?.icon || 'fa-clock')

  const handleSubmit = () => {
    if (!name.trim()) return alert('Please enter a tool name')
    if (!url.trim())  return alert('Please enter a URL')
    onAdd({
      ...existing,
      name: name.trim(),
      category,
      url: url.trim(),
      target,
      icon
    })
  }

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Tool</h2>
          <button className={styles.xbtn} onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className={styles.body}>
          <label className={styles.label}>Tool Name</label>
          <input
            className={styles.input}
            placeholder="e.g. System Ageing"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={category} onChange={e => setCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={styles.label}>Open In</label>
              <select className={styles.select} value={target} onChange={e => setTarget(e.target.value)}>
                <option value="_blank">New Tab</option>
                <option value="_self">Same Tab</option>
              </select>
            </div>
          </div>

          <label className={styles.label}>Link URL</label>
          <input
            className={styles.input}
            placeholder="https://your-tool.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />

          <label className={styles.label}>Icon</label>
          <div className={styles.iconGrid}>
            {ICONS.map(ic => (
              <div
                key={ic}
                className={`${styles.ico} ${icon === ic ? styles.icoSel : ''}`}
                onClick={() => setIcon(ic)}
                title={ic}
              >
                <i className={`fas ${ic}`} />
              </div>
            ))}
          </div>

          <button className={styles.submit} onClick={handleSubmit}>
            <i className="fas fa-plus" style={{ marginRight: 7 }} />
            Add Tool Card
          </button>
        </div>
      </div>
    </div>
  )
}
