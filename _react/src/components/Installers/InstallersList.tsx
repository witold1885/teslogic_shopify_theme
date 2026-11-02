import { useMemo, useState, type FC } from 'react'
import type { Installer } from './types.ts'
import { getComponent } from '../../layouts/components'
import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
// import tom from '../../assets/images/installers/tom.png'
import eas from '../../assets/images/installers/eas.png'
import LazySection from '../../layouts/LazySection'

const InstallerItem = getComponent(() => import('./InstallerItem.tsx'))

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '20px', duration: 333 },
    tabs: { yFrom: '20px', duration: 333 },
    grid: { yFrom: '20px', duration: 333 },
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
        logo: { src: eas, width: 128, height: 33 },
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

const InstallersList: FC = () => {
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

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="installers-list container">
            <div className="installers-list-head">
                <h2 {...anime('title')}>Screenmate™ Certified Installers</h2>
                <div {...anime('tabs')} className="installers-list-tabs">
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
            <div {...anime('grid')} className={`installers-list-items ${items.length === 0 ? 'empty' : ''}`}>
                {items.length !== 0 ? (
                    <LazySection rootMargin='0px'>
                        {items.map((item, index) => (
                            <InstallerItem {...item} key={index} />
                        ))}
                    </LazySection>
                ) : (
                    <div className="installers-list-item">No Installers Found</div>
                )}
            </div>
        </div>
    )
}

export default InstallersList
