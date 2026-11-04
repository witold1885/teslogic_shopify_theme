import type { FC } from 'react'
import { mountForShopify } from './mount'
import InfoLayout from '../layouts/InfoLayout'
import ProductOrder from '../components/Product/ProductOrder'

const Product: FC = () => {
    return (
        <InfoLayout>
            <ProductOrder productType="other" />
        </InfoLayout>
    )
}

mountForShopify('react-product-root', Product)

export default Product
