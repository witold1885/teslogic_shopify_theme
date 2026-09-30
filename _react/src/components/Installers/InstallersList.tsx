import React, { useMemo, useState, type ReactNode } from 'react'
// import tom from '../../assets/images/installers/tom.png'
import eas from '../../assets/images/installers/eas.png'
import phoneIcon from '../../assets/icons/installers/phone.svg'
import earthIcon from '../../assets/icons/installers/earth.svg'

interface Installer {
    name: string
    logo?: string
    phone: string
    website?: string
    address: ReactNode
    coordinates: number[]
    tab: string
}

const installers: Installer[] = [
    // {
    //     name: 'Tom\'s Automotive Service Center',
    //     logo: tom,
    //     phone: '+1 562 424 04 04',
    //     website: 'tomstire.com',
    //     address: <>4401 E Anaheim St, <br />Long Beach, CA 90804, USA</>,
    //     coordinates: [33.7829121,-118.1412878],
    //     tab: 'usa'
    // },
    {
        name: 'European Auto Source',
        logo: eas,
        phone: '+1 866 669 07 05',
        website: 'europeanautosource.com',
        address: <>4015 E Leaverton Ct, <br />Anaheim, CA 92807, USA</>,
        coordinates: [33.8619657,-117.8330565],
        tab: 'usa'
    },
    {
        name: 'Plug & Plaid',
        phone: '+1 562 424 04 04',
        address: <>3rd Levin st., <br />Petah Tikva, 4937972, Israel</>,
        coordinates: [32.0755392,34.881673],
        tab: 'middle-east'
    },
]

const InstallersList: React.FC = () => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0)

    const tabs = [
        { text: 'All', code: 'all' },
        { text: 'USA', code: 'usa' },
        { text: 'Europe', code: 'europe' },
        { text: 'Middle East', code: 'middle-east' },
    ]

    const items = useMemo(() => {
        const tab = tabs[activeTabIndex || 0]
        if (tab.code === 'all') {
            return installers
        } else {
            return installers.filter(({ tab: tabCode }) => tabCode === tab.code)
        }
    }, [activeTabIndex])

    return (
        <div className="installers-list container">
            <div className="installers-list-head">
                <h2>Screenmate™ Certified Installers List</h2>
                <div className="installers-list-tabs">
                    {tabs.map(({ text }, index) => (
                        <div 
                            key={index}
                            className={`installers-list-tabs-item ${index === activeTabIndex ? 'active' : ''}`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {text}
                        </div>
                    ))}
                </div>
            </div>  
            <div className={`installers-list-items ${items.length === 0 ? 'empty' : ''}`}>
                {items.length !== 0 ? (<>
                    {items.map(({ name, logo, phone, website, address, coordinates }, index) => (
                        <div className="installers-list-item" key={index}>
                            <div className="installers-list-item-block">
                                <h3>{name}</h3>
                                {logo && <img src={logo} alt={name} loading="lazy" />}
                            </div>
                            <div className="installers-list-item-block">
                                <div className="installers-list-item-block-label">CONTACTS</div>
                                <div className="installers-list-item-contacts">
                                    {phone && <div><img src={phoneIcon} alt="" /><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></div>}
                                    {website && <div><img src={earthIcon} alt="" /><a href={`https://${website}`} target="_blank">{website}</a></div>}
                                </div>                            
                            </div>
                            <div className="installers-list-item-block">
                                <div className="installers-list-item-address">
                                    <div className="installers-list-item-block-label">ADDRESS</div>
                                    <div>{address}</div>
                                </div>
                                {coordinates?.length !== 0 && (
                                    <div className="installers-list-item-map">
                                        <iframe
                                            width="352"
                                            height="152"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            allowFullScreen
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAqbo5rx2oVhWCW_pSzNrWnywQSRSdlnQ4&q=${coordinates.join(',')}&zoom=15`}>
                                        </iframe>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </>) : (
                    <div className="installers-list-item">No Installers Found</div>
                )}
            </div>
        </div>
    )
}

export default InstallersList
