import React from 'react'
import { preconnect } from 'react-dom'
import ScreenmateOne from './pages/ScreenmateOne'
import ScreenmateDash from './pages/ScreenmateDash'
import Powermate from './pages/Powermate'
import Installers from './pages/Installers'
import Partners from './pages/Partners'

const apiUrl: string | undefined = import.meta.env.VITE_API_URL

const routesMap: Record<string, React.FC> = {
  '/screenmate': ScreenmateOne,
  '/dash': ScreenmateDash,
  '/pro': Powermate,

  '/installers': Installers,
  '/partners': Partners,
}

function App() {
  if (apiUrl) {
    preconnect(apiUrl)
  }

  const path = typeof window !== 'undefined' ? window.location.pathname : null

  const Page = path ? routesMap[path] : null

  return Page ? <Page /> : <></>
}

export default App
