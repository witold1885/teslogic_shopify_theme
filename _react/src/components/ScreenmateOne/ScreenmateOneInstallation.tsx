import React, { useMemo } from 'react'
import { Icon, Image } from '../Common'

import installationImage from '../../assets/images/screenmate-one/installation.png'
import ArrowTopRightBlueIcon from '../../assets/icons/ArrowTopRightBlueIcon'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    body: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    texts: { yFrom: '20px', duration: 333 },
    links: { yFrom: '20px', duration: 333 },
}

const ScreenmateOneInstallation: React.FC = () => {
    const installation: Record<string, any[]> = {
        texts: [
            <>
                Screenmate ONE installs in about 10 minutes with a <br />
                simple, non-invasive setup. The unit fits neatly into the <br />
                compartment under the center console, keeping the <br />
                installation clean and fully integrated.
            </>,
            <>
                The setup process is straightforward, but if you need <br />
                assistance, you can contact one of our trusted installers <br />
                or visit a local service center that works with Tesla <br />
                accessories.
            </>
        ],
        links: [
            { text: 'Where to install', url: '/pages/where-to-install' },
            { text: 'Manuals', url: '/pages/one-manuals' },
        ]
    }

    const animationConfigs = useMemo(() => {
        let configs = { ...animatedObjects }
        for (const [key, items] of Object.entries(installation)) {
            for (const index of Object.keys(items)) {
                configs[`${key}-${index}`] = animatedObjects[key]
            }
        }
        return mapSimpleConfigs(configs)
    }, [])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <div {...anime('body')} className="screenmate-one__specifications-installation">
            <div className="screenmate-one__specifications-installation-info">
                <div className="flex-column gap-24 mob:gap-12">
                    <div {...anime('title')} className="font-manrope-52 mob:font-manrope-32 font-600">Effortless <br />Installation</div>
                    <div className="flex-column gap-20 mob:gap-12 font-manrope-20 mob:font-manrope-16">
                        {installation.texts.map((text, index) => <div {...anime(`texts-${index}`)} key={index}>{text}</div>)}
                    </div>
                </div>
                <div className="flex gap-32 mob:gap-20 font-manrope-24 mob:font-manrope-16 font-500">
                    {installation.links.map(({ text, url }, index) => (
                        <a {...anime(`links-${index}`)} className="flex gap-12 mob:gap-8" href={url} target="_blank" key={index}>
                            <span>{text}</span>
                            <Icon className="flex-center" svg={<ArrowTopRightBlueIcon />} />
                        </a>
                    ))}
                </div>
            </div>
            <Image className="screenmate-one__specifications-installation-image" src={installationImage} />
        </div>
    )
}

export default ScreenmateOneInstallation
