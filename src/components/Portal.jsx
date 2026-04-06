import { useState, useMemo } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import ToolGrid from './ToolGrid'
import AddCardModal from './AddCardModal'
import Toast from './Toast'
import styles from './Portal.module.css'

const DEFAULT_CARDS = [
  { id: 1, name: 'System Ageing',        category: 'Reports',    icon: 'fa-clock',                url: '#', target: '_blank' },
  { id: 2, name: 'Ageing mss',           category: 'Reports',    icon: 'fa-chart-bar',            url: '#', target: '_blank' },
  { id: 3, name: 'Pan India Cost Sheet', category: 'Finance',    icon: 'fa-file-invoice-dollar',  url: '#', target: '_blank' },
  { id: 4, name: 'Hour Recon I',         category: 'Operations', icon: 'fa-cogs',                 url: '#', target: '_blank' },
  { id: 5, name: 'Billing Sheet Status', category: 'Operations', icon: 'fa-table',                url: '#', target: '_blank' },
  { id: 6, name: 'NFH – Salary Register',category: 'Reports',    icon: 'fa-users',                url: '#', target: '_blank' },
]

function loadCards() {
  try { return JSON.parse(localStorage.getItem('g4s_cards')) || DEFAULT_CARDS }
  catch { return DEFAULT_CARDS }
}

export default function Portal({ user, onLogout, theme, toggleTheme }) {
  const [cards, setCards]       = useState(loadCards)
  const [category, setCategory] = useState('all')
  const [search, setSearch]     = useState('')
  const [adminMode, setAdmin]   = useState(false)
  const [modalOpen, setModal]   = useState(false)
  const [toast, setToast]       = useState(null)
  const [editCard, setEditCard] = useState(null)

  const saveCards = (next) => {
    setCards(next)
    localStorage.setItem('g4s_cards', JSON.stringify(next))
  }

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const visible = useMemo(() => cards.filter(c => {
    const mc = category === 'all' || c.category === category
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
    return mc && ms
  }), [cards, category, search])

  const addCard = (card) => {
    let next

    if (card.id) {
      // EDIT
      next = cards.map(c => c.id === card.id ? card : c)
      showToast('Tool updated!')
    } else {
      // ADD
      next = [...cards, { ...card, id: Date.now() }]
      showToast('Tool added!')
    }

    saveCards(next)
    setModal(false)
    setEditCard(null)
  }

  const deleteCard = (id) => {
    saveCards(cards.filter(c => c.id !== id))
    showToast('Card removed')
  }

  const toggleAdmin = () => {
    setAdmin(v => {
      showToast(!v ? 'Admin mode ON' : 'Admin mode OFF')
      return !v
    })
  }

  return (
    <div className={styles.layout}>
      <Topbar
        user={user}
        adminMode={adminMode}
        onToggleAdmin={toggleAdmin}
        onOpenModal={() => setModal(true)}
        onLogout={onLogout}
        search={search}
        onSearch={setSearch}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Sidebar category={category} onSetCategory={setCategory} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{category === 'all' ? 'All Tools' : category}</h1>
          <p>{visible.length} tool{visible.length !== 1 ? 's' : ''} available</p>
        </div>
        <ToolGrid
          cards={visible}
          adminMode={adminMode}
          onDelete={deleteCard}
          onEdit={(card) => {
            setEditCard(card)
            setModal(true)
          }}
          onNoUrl={() => showToast('No URL configured for this tool', 'err')}
        />
      </main>

      {modalOpen && (
        <AddCardModal
          onAdd={addCard}
          onClose={() => {
            setModal(false)
            setEditCard(null)
          }}
          existing={editCard}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}
