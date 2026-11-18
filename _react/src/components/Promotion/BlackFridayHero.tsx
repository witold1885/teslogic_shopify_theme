import type { FC } from 'react'
import type { PromotionBannerProps } from './types'
import './black-friday-hero.scss'

const BlackFridayHero: FC<PromotionBannerProps> = ({ onExpand }) => (
    <div className="bf-hero">
        <div className="bf-hero-bg">
            <video autoPlay muted loop className="object-cover">
                <source src="https://cdn.shopify.com/videos/c/o/v/fc26659e3e8f4009b89518b59bf703c5.mp4" type="video/mp4" />
            </video>
        </div>
        <div className="bf-hero-inner">
            <div className="bf-hero-inner-head">
                <h1>Black  Friday</h1>
                <p>Our biggest deals <br className="mobile" />of the year</p>
            </div>
            <div className="bf-hero-inner-info">
                <div className="bf-hero-inner-info-side">
                    <div>
                        <div className="bf-hero-inner-info-discount">15 % OFF</div>
                        <p>All Screenmate <br />products</p>
                    </div>
                </div>
                <div className="bf-hero-inner-info-delimiter"></div>
                <div className="bf-hero-inner-info-side">
                    <div>
                        <div className="bf-hero-inner-info-discount">25 % OFF</div>
                        <p>Screenmate ONE + <br />Powermate bundle</p>
                    </div>
                </div>
            </div>
            <div className="bf-hero-inner-date">
                <div>Nov 27–29</div>
                <div>3 days only</div>
            </div>
        </div>
        <div className="bf-hero-expand" onClick={onExpand}>
            <div>
                <svg width="47" height="25" viewBox="0 0 47 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.21009 0.567537L23.3351 20.1894L43.4601 0.567534C43.8371 0.190525 44.2772 0.00202063 44.7803 0.00202059C45.2834 0.00202055 45.7235 0.190525 46.1005 0.567533C46.4775 0.944542 46.666 1.38461 46.666 1.88773C46.666 2.39086 46.4983 2.81013 46.1629 3.14555L24.7177 24.0252C24.3407 24.4022 23.8791 24.5908 23.3331 24.5908C22.787 24.5908 22.3255 24.4022 21.9485 24.0252L0.503285 3.20794C0.16787 2.83093 0.000160425 2.38013 0.00016038 1.85554C0.000160334 1.33094 0.188664 0.890879 0.565674 0.535338C0.94268 0.179796 1.38274 0.00135274 1.88587 1.10261e-05C2.38899 -0.00133068 2.82906 0.187174 3.20607 0.565524L3.21009 0.567537Z" fill="white"/>
                </svg>
            </div>
        </div>
    </div>
)

export default BlackFridayHero
