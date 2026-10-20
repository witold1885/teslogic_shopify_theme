import type { FC } from 'react'
import Layout, { type LayoutProps } from './Layout'

const InfoLayout: FC<LayoutProps> = ({ className, children }) => (
    <Layout theme="light" orderButton={false}>
        <div {...{className}}>
            {children}
        </div>
    </Layout>
)

export default InfoLayout
