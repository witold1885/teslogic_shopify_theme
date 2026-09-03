import React from 'react'
import ScreenmateOne from './pages/ScreenmateOne'
import ScreenmateDash from './pages/ScreenmateDash'
import Powermate from './pages/Powermate'

const routesMap: Record<string, React.FC> = {
  '/screenmate': ScreenmateOne,
  '/dash': ScreenmateDash,
  '/pro': Powermate
}

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : null

  const Page = path ? routesMap[path] : null

  return Page ? <Page /> : <></>
}

export default App
