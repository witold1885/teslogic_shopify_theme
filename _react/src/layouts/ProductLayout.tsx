import type { FC } from 'react'
import { getComponent } from './components'
import Layout, { type LayoutProps } from './Layout'
import LazySection from './LazySection'

const Reviews = getComponent(() => import('../components/Reviews/Reviews.tsx'), true)

const ProductLayout: FC<LayoutProps> = ({ className, onOrder, children }) => (
    <Layout theme="dark" orderButton={true} onOrder={onOrder}>
        <div {...{className}}>
            {children}
            {Reviews && (
                <LazySection>
                    <Reviews allSources={className === 'screenmate-dash' || className === 'powermate'} />
                </LazySection>
            )}
        </div>
    </Layout>
)

export default ProductLayout
