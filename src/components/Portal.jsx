import { useState, useMemo, useEffect } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import ToolGrid from './ToolGrid'
import AddCardModal from './AddCardModal'
import Toast from './Toast'
import styles from './Portal.module.css'
import { supabase } from '../supabaseClient'

export default function Portal({ user, onLogout, theme, toggleTheme }) {

  const [cards, setCards]       = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch]     = useState('')
  const [adminMode, setAdmin]   = useState(false)
  const [modalOpen, setModal]   = useState(false)
  const [toast, setToast]       = useState(null)
  const [editCard, setEditCard] = useState(null)

  // ✅ FETCH CARDS
  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')

    if (!error) setCards(data)
    else console.error(error)
  }

  // ✅ LOAD ON START
  useEffect(() => {
    fetchCards()
  }, [])

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const visible = useMemo(() => cards.filter(c => {
    const mc = category === 'all' || c.category === category
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
    return mc && ms
  }), [cards, category, search])

  // ✅ ADD / EDIT
  const addCard = async (card) => {
    if (card.id) {
      // UPDATE
      const { error } = await supabase
        .from('cards')
        .update({
          name: card.name,
          url: card.url,
          category: card.category,
          icon: card.icon,
          target: card.target
        })
        .eq('id', card.id)

      if (!error) showToast('Updated!')
    } else {
      // INSERT (remove id if exists)
      const { id, ...rest } = card

      const { error } = await supabase
        .from('cards')
        .insert([rest])

      if (!error) showToast('Added!')
    }

    fetchCards()
    setModal(false)
    setEditCard(null)
  }

  // ✅ DELETE
  const deleteCard = async (id) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)

    if (!error) showToast('Deleted!')
    fetchCards()
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
          onNoUrl={() => showToast('No URL configured', 'err')}
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