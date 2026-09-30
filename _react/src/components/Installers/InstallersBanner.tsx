import React from 'react'
import sketch from '../../assets/images/installers/sketch.png'

const InstallersBanner: React.FC = () => (
    <div className="installers-banner">
        <div className="installers-banner-left">
            <div className="installers-banner-info">
                <div>
                    <h1>Find a Certified Installer</h1>
                    <p>Screenmate™ devices are designed for straightforward installation, but if you prefer professional help, you can contact one of our trusted installation partners.</p>
                </div>
                <div>
                    <h2>Become a Partner</h2>
                    <p>We're expanding our installer network. <br />Join Screenmate™ as an installation partner.</p>
                </div>
            </div>
            <button>Become a Partner</button>
        </div>
        <div className="installers-banner-right">
            <div className="installers-banner-sketch">
                <img className="object-cover" src={sketch} alt="" />
            </div>
        </div>
    </div>
)

export default InstallersBanner
