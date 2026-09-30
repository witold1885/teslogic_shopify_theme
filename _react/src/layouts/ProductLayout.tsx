import React from 'react'
import { getComponent } from './components'
import Layout, { type LayoutProps } from './Layout'
import LazySection from './LazySection'

const Reviews = getComponent('../components/Reviews/Reviews.tsx')

const ProductLayout: React.FC<LayoutProps> = ({ className, onOrder, children }) => (
    <Layout theme="dark" orderButton={true} onOrder={onOrder}>
        <div {...{className}}>
            {children}
            <LazySection>
                <Reviews />
            </LazySection>
        </div>
    </Layout>
)

export default ProductLayout
