import React from 'react'
import ScreenmateOne from './pages/ScreenmateOne'
import ScreenmateDash from './pages/ScreenmateDash'
import Powermate from './pages/Powermate'
import Installers from './pages/Installers'

const routesMap: Record<string, React.FC> = {
  '/screenmate': ScreenmateOne,
  '/dash': ScreenmateDash,
  '/pro': Powermate,

  '/installers': Installers,
}

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : null

  const Page = path ? routesMap[path] : null

  return Page ? <Page /> : <></>
}

export default App
