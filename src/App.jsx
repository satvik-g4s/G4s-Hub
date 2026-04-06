import { useEffect, useState } from 'react'
import Portal from './components/Portal'

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  const user = {
    email: 'user@g4s.com',
    user_metadata: { full_name: 'G4S User', avatar_url: '' }
  }

  return (
    <Portal
      user={user}
      onLogout={() => {}}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  )
}