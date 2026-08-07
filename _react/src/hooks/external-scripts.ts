import { useState, useEffect } from 'react'

export interface ScriptConfig {
  src: string
  defer?: boolean
  onLoad?: () => void
}

export const EXTERNAL_SCRIPTS: ScriptConfig[] = [
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

export function useExternalScripts(scripts: ScriptConfig[]): string {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!scripts.length) {
      setStatus('ready')
      return
    }

    let loadedCount = 0
    let hasError = false

    const handleScriptLoad = (callback?: () => void) => {
      loadedCount++
      if (callback) callback()
      
      if (loadedCount === scripts.length && !hasError) {
        setStatus('ready')
      }
    }

    const handleScriptError = () => {
      hasError = true
      setStatus('error')
    }

    scripts.forEach(({ src, defer, onLoad }) => {
      let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement

      if (!script) {
        script = document.createElement('script')
        script.src = src
        script.async = true
        if (defer) script.defer = true
        
        document.body.appendChild(script)

        script.addEventListener('load', () => handleScriptLoad(onLoad))
        script.addEventListener('error', handleScriptError)
      } else {
        handleScriptLoad(onLoad)
      }
    })
  }, [scripts])

  return status
}
