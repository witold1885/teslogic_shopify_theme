import React, { useMemo } from 'react'
import sketch from '../../assets/images/installers/sketch.png'
import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    h1: { yFrom: '40px', duration: 666 },
    p1: { yFrom: '20px', duration: 333 },
    h2: { yFrom: '20px', duration: 333 },
    p2: { yFrom: '20px', duration: 333 },
    button: { yFrom: '20px', duration: 333 },
}

const InstallersBanner: React.FC = () => {
    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(Object.entries(animationConfigs).reduce((acc, [key, config], index) => ({
        ...acc,
        [key]: { ...config, delay: (config.duration || 0) * index }
    }), {}))

    return (
        <div className="installers-banner">
            <div className="installers-banner-left">
                <div className="installers-banner-info">
                    <div>
                        <h1 {...anime('h1')}>Find a Certified Installer</h1>
                        <p {...anime('p1')}>Screenmate™ devices are designed for straightforward installation, but if you prefer professional help, you can contact one of our trusted installation partners.</p>
                    </div>
                    <div>
                        <h2 {...anime('h2')}>Become a Partner</h2>
                        <p {...anime('p2')}>We're expanding our installer network. <br />Join Screenmate™ as an installation partner.</p>
                    </div>
                </div>
                <a {...anime('button')} href="/pages/partner">Become a Partner</a>
            </div>
            <div className="installers-banner-right">
                <div className="installers-banner-sketch">
                    <img className="object-cover" src={sketch} alt="" />
                </div>
            </div>
        </div>
    )
}

export default InstallersBanner
