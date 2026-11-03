import type { FC } from 'react'
import sketch from '../../assets/images/installers/installers_sketch.png'
import { useInlineStyles } from '../../hooks/inline-styles'

const InstallersBanner: FC = () => {
    const { isMobile } = useInlineStyles()

    return (
        <div className="installers-banner">
            <div className="installers-banner-left">
                <div className="installers-banner-info">
                    <div>
                        <h1 className={!isMobile ? 'animate animate-big' : ''}>Find a Certified <br/>Tesla Installer</h1>
                        <p className="animate animate-small">Screenmate™ devices are designed for straightforward installation, but if you prefer professional help, you can contact one of our trusted installation partners.</p>
                    </div>
                    <div>
                        <h2 className="animate animate-small">Become a Screenmate Partner</h2>
                        <p className="animate animate-small">We're expanding our installer network. <br />Join Screenmate™ as an installation partner.</p>
                    </div>
                </div>
                <a className="animate animate-small" href="/pages/partners">Become a Partner</a>
            </div>
            {!isMobile && (
                <div className="installers-banner-right">
                    <div className="installers-banner-sketch">
                        <img className="object-cover" src={sketch} alt="Tesla vehicle illustration" fetchPriority="high" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default InstallersBanner
