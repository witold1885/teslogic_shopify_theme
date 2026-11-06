import type { FC } from "react";
import ProductOrderSection, { type ProductOrderProps } from "./ProductOrderSection";

const ProductOrderStatic: FC<ProductOrderProps> = ({ productType }) => {
    return <ProductOrderSection
        {...{productType}}
        thumbs="__PRODUCT_THUMBS__"
        gallery="__PRODUCT_IMAGES__"
        slider="__PRODUCT_IMAGES__"
        price="__PRODUCT_PRICE__"
        oldPrice="__PRODUCT_OLD_PRICE__"
        currency="USD"
        title="__PRODUCT_TITLE__"
        description="__PRODUCT_DESCRIPTION__"
        models="__PRODUCT_MODELS__"
        additionals="__PRODUCT_ADDITIONALS__"
        details={productType === 'main' ? '__PRODUCT_DETAILS__' : ''}
        total="__PRODUCT_PRICE__"
        onSubmit={() => {}}
    />
}

export default ProductOrderStatic
