import type { FC } from 'react'
import './powermate-order.scss'
import { useSelector } from 'react-redux'
import { fetchProducts } from '../../redux/selectors/products'

const PowermateOrder: FC = () => {
    const { products } = useSelector(fetchProducts)

    console.log({ products })
    
    return (
        <div className="order-container">
            <div className="order-wrap">
                <div id="pro-order" className="order">
                    <div className="order-top">
                        <div className="order-title">Ready to take your Model 3/Y <br />to the next level?</div>
                        <div className="order-subtitle">Order Powermate and start your journey towards<br />unmatched driving performance and satisfaction</div>
                    </div>
                    <div className="order-body">
                        <div className="order-products">
                            
                        </div>
                    </div>		
                </div>
            </div>
        </div>
    )
}

export default PowermateOrder
