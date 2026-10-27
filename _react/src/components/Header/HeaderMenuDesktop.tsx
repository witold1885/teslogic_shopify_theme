import { useState, type FC } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { fetchProducts } from '../../redux/selectors/products'
import type { MenuItem } from '../../types/shopify'
import Button from '../Common/Button'
import Icon from '../Common/Icon'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'
import cartWhiteIcon from '../../assets/icons/cart-white.svg'
import cartBlackIcon from '../../assets/icons/cart-black.svg'

interface HeaderMenuProps {
    theme?: 'dark' | 'light'
    menu: MenuItem[]
    orderButton: boolean
    onOrder?: () => void
}

const HeaderMenuDesktop: FC<HeaderMenuProps> = ({
    theme = 'dark',
    menu,
    orderButton,
    onOrder
}) => {
    const { cartItemCount } = useAppSelector(fetchProducts)

    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

    return (
        <div className="header-menu header-menu-desktop">
            <div>
                {menu.map(({ title, children }, index) => {
                    const isOpen = openMenuIndex === index
                    const isVisible = isOpen

                    return (
                        <div
                            key={index}
                            className={`header-menu-item ${isOpen ? 'active' : ''}`}
                            onMouseEnter={() => setOpenMenuIndex(index)}
                            onMouseLeave={() => setOpenMenuIndex(null)}
                        >
                            <span className="header-menu-item-title">
                                {title}
                                {index === 0 && <span className="header-menu-item-new">NEW</span>}
                            </span>
                            <div className="header-menu-item-chevron">
                                <Icon svg={<ChevronDownIcon color="#FFF" />} />
                            </div>
                            {children?.length !== 0 && (
                                <ul
                                    id={`header-menu-item-dropdown-${index}`}
                                    className={`header-menu-item-dropdown ${!isVisible ? 'hidden' : ''}`}
                                >
                                    {children?.map((child, i) => (
                                        <li key={i}>
                                            <a href={child.url}>{child.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </div>
            {cartItemCount === 0 ? (<>
                {orderButton && (
                    <Button className="header-menu-button" onClick={onOrder}>
                        <span>ORDER NOW</span>
                    </Button>
                )}
            </>) : (
                <a className="header-menu-cart" href="/cart" target="_blank">
                    <div>
                        <Icon icon={theme === 'dark' ? cartWhiteIcon : cartBlackIcon} />
                        <span>{cartItemCount}</span>
                    </div>
                    <span>Cart</span>
                </a>
            )}
        </div>
    )
}

export default HeaderMenuDesktop
