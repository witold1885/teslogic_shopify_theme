import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'

export const countReactNodeLines = (str: string | ReactNode, className: string | null | undefined = null): number => {
    const re = new RegExp(className ? `\<br class\=\"${className}\"\/\>` : `\<br\/\>`, 'gi')
    return renderToString(str).replace(re, '<br/>').split('<br/>').length
}

export const convertReactNodeToString = (str: string | ReactNode): string => {
    const re = new RegExp(`\<br\/\>`, 'gi')
    return renderToString(str).replace(re, '')
}

export const foundCommon = (str1: string, str2: string): string => {
    const words1: string[] = str1.match(/\b[\w]+\b/g) || []
    const words2: string[] = str2.match(/\b[\w]+\b/g) || []
    const common = [...new Set(words1.filter(word => words2.includes(word)))]
    return common.join(' ')
}
