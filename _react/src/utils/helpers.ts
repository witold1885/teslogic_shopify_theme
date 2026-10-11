import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'

export const countReactNodeLines = (str: string | ReactNode, className: string | null | undefined = null): number => {
    const re = new RegExp(className ? `\<br class\=\"${className}\"\/\>` : `\<br\/\>`, 'gi')
    return renderToString(str).replace(re, '<br/>').split('<br/>').length
}
