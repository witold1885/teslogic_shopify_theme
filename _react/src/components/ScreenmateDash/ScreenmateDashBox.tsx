import React from 'react'
import './screenmate-dash-box.scss'
import { useAppSelector } from '../../redux/hooks'

const ellipseModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/box/box-ellipse-*.png', { eager: true })
const ellipses: Record<string, any> = Object.entries(ellipseModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/box/box-ellipse-', '').replace('.png', '')]: mod.default
}), {})

const ScreenmateDashBox: React.FC = () => {
    const { product } = useAppSelector(state => state.products)

    console.log({ product })

    return (
        <div className="box_block" id="box_block">
            <div className="box_block-wrap">
                <div className="box_block-top">
                    <div className="box_block-info">
                        <div className="box_block-info-title">
                            <span className="box_block-info-title-what">What’s</span> in the box
                        </div>
                        <div className="box_block-info-description">
                            In the box, you will find a Screenmate Dash transmitter and everything you need to install it, as well as a holder for placing the phone where you are used to seeing the car dashboard.
                        </div>
                        <div className="box_block-info-description-mobile">
                            <div>
                                In the box, you will find a Screenmate Dash transmitter and everything you need to install it.
                            </div>
                            <div>
                                Also a holder for placing the phone where you are used to seeing the car dashboard is included
                            </div>
                        </div>
                    </div>
                    <div className="box_block-image">
                        <img src="{{ 'box-image-desktop.png' | asset_url }}" srcSet="{{ 'box-image-retina.png' | asset_url }} 2x" loading="lazy" />
                    </div>			
                </div>
                <div className="box_block-items">
                    <div className="box_block-item box_block-item-big">
                        <div className="box_block-item-top">
                            <img className="box_block-item-ellipse" src="{{ 'box-ellipse-234-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-234-retina.png' | asset_url }} 2x" loading="lazy" />
                            <img className="box_block-item-image" src="{{ 'box-item-1-desktop.png' | asset_url }}" srcSet="{{ 'box-item-1-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                        <div className="box_block-item-name">Screenmate Dash transmitter</div>
                    </div>
                    <div className="box_block-item">
                        <div className="box_block-item-top">
                            <img className="box_block-item-ellipse" src="{{ 'box-ellipse-170-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-170-retina.png' | asset_url }} 2x" loading="lazy" />
                            <img className="box_block-item-image" src="{{ 'box-item-2-desktop.png' | asset_url }}" srcSet="{{ 'box-item-2-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                        <div className="box_block-item-name">Magsafe Magnet</div>
                    </div>
                    <div className="box_block-item">
                        <div className="box_block-item-top">
                            <img className="box_block-item-ellipse" src="{{ 'box-ellipse-170-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-170-retina.png' | asset_url }} 2x" loading="lazy" />
                            <img className="box_block-item-image" src="{{ 'box-item-3-desktop.png' | asset_url }}" srcSet="{{ 'box-item-3-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                        <div className="box_block-item-name">Phone Holder</div>
                    </div>
                    <div className="box_block-item">
                        <div className="box_block-item-top">
                            <img className="box_block-item-ellipse" src="{{ 'box-ellipse-170-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-170-retina.png' | asset_url }} 2x" loading="lazy" />
                            <img className="box_block-item-image" src="{{ 'box-item-4-desktop.png' | asset_url }}" srcSet="{{ 'box-item-4-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                        <div className="box_block-item-name">Transmitter Wiring</div>
                    </div>
                    <div className="box_block-item">
                        <div className="box_block-item-top">
                            <img className="box_block-item-ellipse" src="{{ 'box-ellipse-170-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-170-retina.png' | asset_url }} 2x" loading="lazy" />
                            <img className="box_block-item-image" src="{{ 'box-item-5-desktop.png' | asset_url }}" srcSet="{{ 'box-item-5-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                        <div className="box_block-item-name">Plastic Tool</div>
                    </div>
                </div>
                <div className="box_block-charger">
                    <div className="box_block-charger-images">
                        <img className="box_block-charger-images-ellipse" src="{{ 'box-ellipse-355-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-355-retina.png' | asset_url }} 2x" loading="lazy" />
                        <div className="box_block-charger-images-image">
                            <img src="{{ 'box-charger-image-desktop.png' | asset_url }}" srcSet="{{ 'box-charger-image-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                        <div className="box_block-charger-images-photo">
                            <img src="{{ 'box-charger-photo-desktop.png' | asset_url }}" srcSet="{{ 'box-charger-photo-retina.png' | asset_url }} 2x" loading="lazy" />
                        </div>
                    </div>
                    <div className="box_block-charger-info">
                        <div className="box_block-charger-info-title">Additional Wireless Charger</div>
                        <div className="box_block-charger-info-description">
                            This magnetic charger installs on a phone holder instead of a magnet. It is compatible with the iPhone 12 and above, as well as any phone that supports wireless charging (when using the included magnetic ring).
                        </div>
                        <div className="box_block-charger-info-description-mobile">
                            <div>
                                This magnetic charger installs on a phone holder instead of a magnet. 
                            </div>
                            <div>
                                It is compatible with the iPhone 12 and above, as well as any phone that supports wireless charging (when using the included magnetic ring).
                            </div>
                        </div>
                        <div className="box_block-charger-images-mobile">
                            <div className="box_block-charger-images-mobile-item">
                                <img className="box_block-charger-images-mobile-ellipse" src="{{ 'box-ellipse-355-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-355-retina.png' | asset_url }} 2x" loading="lazy" />
                                <img className="box_block-charger-images-mobile-image" src="{{ 'box-charger-image-desktop.png' | asset_url }}" srcSet="{{ 'box-charger-image-retina.png' | asset_url }} 2x" loading="lazy" />
                            </div>
                            <div className="box_block-charger-images-mobile-item">
                                <img className="box_block-charger-images-mobile-photo" src="{{ 'box-charger-photo-desktop.png' | asset_url }}" srcSet="{{ 'box-charger-photo-retina.png' | asset_url }} 2x" loading="lazy" />
                            </div>
                        </div>
                        <div className="box_block-charger-items">
                            <div className="box_block-charger-item">
                                <div className="box_block-charger-item-image">
                                    <img className="box_block-charger-item-image-ellipse" src="{{ 'box-ellipse-86-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-86-retina.png' | asset_url }} 2x" loading="lazy" />
                                    <img className="box_block-charger-item-image-image box_block-charger-item-image-image-1" src="{{ 'box-charger-item-1-desktop.png' | asset_url }}" srcSet="{{ 'box-charger-item-1-retina.png' | asset_url }} 2x" loading="lazy" />
                                    <img className="box_block-charger-item-image-image-mobile" src="{{ 'box-charger-item-1-mobile.png' | asset_url }}" srcSet="{{ 'box-charger-item-1-mobile-retina.png' | asset_url }} 2x" loading="lazy" />
                                </div>
                                <div className="box_block-charger-item-description">
                                    90 Degree USB Type C to USB Type C Adapter for Convenient Charging Connection
                                </div>
                            </div>
                            <div className="box_block-charger-item">
                                <div className="box_block-charger-item-image">
                                    <img className="box_block-charger-item-image-ellipse" src="{{ 'box-ellipse-86-desktop.png' | asset_url }}" srcSet="{{ 'box-ellipse-86-retina.png' | asset_url }} 2x" loading="lazy" />
                                    <img className="box_block-charger-item-image-image box_block-charger-item-image-image-2" src="{{ 'box-charger-item-2-desktop.png' | asset_url }}" srcSet="{{ 'box-charger-item-2-retina.png' | asset_url }} 2x" loading="lazy" />
                                    <img className="box_block-charger-item-image-image-mobile" src="{{ 'box-charger-item-2-mobile.png' | asset_url }}" srcSet="{{ 'box-charger-item-2-mobile-retina.png' | asset_url }} 2x" loading="lazy" />
                                </div>
                                <div className="box_block-charger-item-description">
                                    USB Type C to USB Type A Adapter for Tesla Model 3 Cars
                                </div>
                            </div>					
                        </div>
                    </div>			
                </div>
            </div>
        </div>
    )
}

export default ScreenmateDashBox
