import React, { lazy, useEffect, type ReactNode } from 'react'
import '@/assets/styles/common.scss'
// import '@/assets/styles/cookies-banner.scss'
// import { EXTERNAL_SCRIPTS, useExternalScripts } from '../hooks/external-scripts'
import Header from '../components/Header/Header'
import LazySection from './LazySection'

const ssrComponents = import.meta.env.SSR
  ? import.meta.glob<any>('../components/**/*.tsx', { eager: true })
  : {}

const clientComponents = !import.meta.env.SSR
  ? import.meta.glob<any>('../components/**/*.tsx')
  : {}

function getComponent(relativePath: string) {
  if (import.meta.env.SSR) {
    const mod = ssrComponents[relativePath]
    return mod?.default || mod
  }

  return lazy(clientComponents[relativePath] as () => Promise<any>)
}

const Reviews = getComponent('../components/Reviews/Reviews.tsx')
const Footer = getComponent('../components/Footer/Footer.tsx')

interface ProductLayoutProps {
    className?: string
    onOrder?: () => void
    children?: ReactNode
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, onOrder, children }) => {   
    // useExternalScripts(EXTERNAL_SCRIPTS)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.history && 'scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'
            }

            window.scrollTo(0, 0)
        }
    }, [])

    return (<>
        <Header onOrder={onOrder} />
        <div {...{className}}>
            {children}
            <LazySection>
                <Reviews />
            </LazySection>
        </div>
        <LazySection>
            <Footer />
        </LazySection>
    </>)
}

export default ProductLayout
