import type { FC } from 'react'
import type { ProductOrderProps } from './ProductOrderSection'
import './product-order.scss'
import ProductOrderStatic from './ProductOrderStatic'
import ProductOrderDynamic from './ProductOrderDynamic'

const Component = import.meta.env.SSR ? ProductOrderStatic : ProductOrderDynamic

const ProductOrder: FC<ProductOrderProps> = ({ productType }) => <Component {...{productType}} />

export default ProductOrder
