import { useState, useEffect } from 'react'

export interface ScriptConfig {
  src: string
  defer?: boolean
  onLoad?: () => void
}

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
