import { useState, useMemo, useEffect } from 'react'
import Topbar from './Topbar'
import ToolGrid from './ToolGrid'
import AddCardModal from './AddCardModal'
import Toast from './Toast'
import Sidebar from './Sidebar'
import styles from './Portal.module.css'
import { supabase } from '../supabaseClient'

export default function Portal({ user, onLogout, theme, toggleTheme }) {

  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')   // ✅ NEW
  const [adminMode, setAdmin] = useState(false)
  const [modalOpen, setModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [editCard, setEditCard] = useState(null)

  /* ===============================
     🔄 FETCH ITEMS
  =============================== */
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('position', { ascending: true })

    if (!error) setItems(data || [])
    else {
      console.error(error)
      setItems([])
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  /* ===============================
   🧠 FIX: BACK/FORWARD CACHE
=============================== */
useEffect(() => {
  const handlePageShow = (e) => {
    if (e.persisted) {
      window.location.reload()
    }
  }

  window.addEventListener("pageshow", handlePageShow)

  return () => {
    window.removeEventListener("pageshow", handlePageShow)
  }
}, [])

  /* ===============================
     🔔 TOAST
  =============================== */
  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ===============================
     🔍 FILTER (SEARCH + CATEGORY)
  =============================== */
  const visible = useMemo(() => {
    return items.filter(item => {

      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'all' || item.category === category

      return matchesSearch && matchesCategory
    })
  }, [items, search, category])

  /* ===============================
     ➕ ADD / ✏️ EDIT
  =============================== */
  const addItem = async (item) => {

    const payload = {
      name: item.name,
      url: item.redirect_url || item.url || '',
      category: item.category || 'General',
      icon: item.icon,
      target: '_blank',
      position: items.length,
    }

    if (item.id) {
      const { error } = await supabase
        .from('cards')
        .update(payload)
        .eq('id', item.id)

      if (!error) showToast('Updated!')
      else showToast(error.message, 'err')
    } else {
      const { error } = await supabase
        .from('cards')
        .insert([payload])

      if (error) showToast(error.message, 'err')
      else showToast('Added!')
    }

    fetchItems()
    setModal(false)
    setEditCard(null)
  }

  /* ===============================
     🗑 DELETE
  =============================== */
  const deleteItem = async (id) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)

    if (!error) showToast('Deleted!')
    else showToast(error.message, 'err')

    fetchItems()
  }

  /* ===============================
     🔄 REORDER (DRAG)
  =============================== */
  const handleReorder = async (newArr) => {
    setItems(newArr)

    for (let i = 0; i < newArr.length; i++) {
      await supabase
        .from('cards')
        .update({ position: i })
        .eq('id', newArr[i].id)
    }
  }

  /* ===============================
     🛠 ADMIN
  =============================== */
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

      {/* ✅ Sidebar back */}
      <Sidebar
        category={category}
        onSetCategory={setCategory}
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{category === 'all' ? 'All Tools' : category}</h1>
          <p>{visible.length} item{visible.length !== 1 ? 's' : ''}</p>
        </div>

        <ToolGrid
          cards={visible}
          adminMode={adminMode}
          onDelete={deleteItem}
          onEdit={(card) => {
            setEditCard(card)
            setModal(true)
          }}
          onNoUrl={() => showToast('No URL configured', 'err')}
          onReorder={handleReorder}
        />
      </main>

      {modalOpen && (
        <AddCardModal
          onAdd={addItem}
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
