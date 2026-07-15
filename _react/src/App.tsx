import React from 'react'
import { useExternalScripts, type ScriptConfig } from './hooks/external-scripts'
import ScreenmateOne from './pages/ScreenmateOne'
import ScreenmateDash from './pages/ScreenmateDash'
import Powermate from './pages/Powermate'

const EXTERNAL_SCRIPTS: ScriptConfig[] = [
  {
    src: 'https://static.leaddyno.com/js',
    onLoad: () => {
      // @ts-ignore
      if (window.LeadDyno) {
        // @ts-ignore
        window.LeadDyno.key = '5a811185091d34038e7c46e5466984addca95a9d'
        // @ts-ignore
        window.LeadDyno.recordVisit()
      }
    }
  },
  {
    src: 'https://www.redditstatic.com/ads/pixel.js',
    onLoad: () => {
      // @ts-ignore
      if (window.rdt) {
        // @ts-ignore
        window.rdt('init', 't2_lup6ap2m', {
          optOut: false,
          useDecimalCurrencyValues: true
        })
        // @ts-ignore
        window.rdt('track', 'PageVisit')
      }
    }
  }
]

const routesMap: Record<string, React.FC> = {
  '/screenmate': ScreenmateOne,
  '/dash': ScreenmateDash,
  '/pro': Powermate
}

function App() {
  console.log('TEST')

  useExternalScripts(EXTERNAL_SCRIPTS)

  const path = window.location.pathname

  const Page = routesMap[path] || null

  return Page ? <Page /> : <></>
}

export default App
