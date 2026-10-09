import React, { useMemo, Fragment, type ReactNode } from 'react'
import { getAnimationConfig, useAnime, type AnimationConfig } from '../../hooks/anime'

interface PartnerSection {
    title: string
    subtitle?: string
    list: PartnerSectionListProps
}

interface PartnerSectionListProps {
    tag: keyof HTMLElementTagNameMap
    items: ReactNode[]
}

const PartnerSectionList: React.FC<PartnerSectionListProps> = ({ tag: Tag, items }) => (
    <Tag>{items.map((item, i) => <li key={i}>{item}</li>)}</Tag>
)

const sections: PartnerSection[] = [
    {
        title: 'Why Partner with Screenmate?',
        list: {
            tag: 'ul',
            items: [
                <><b>Partner pricing:</b> Commercial terms tailored to your business and cooperation model.</>,
                <><b>Technical support:</b> Installation guides, product documentation, and support from our team.</>,
                <><b>Marketing materials:</b> Product photos, videos, and content for your website and social media.</>,
                <><b>Flexible partnership options:</b> Sell our products, offer installation services, or develop local distribution.</>,
            ]
        }
    },
    {
        title: 'Who We’re Looking For',
        list: {
            tag: 'ul',
            items: [
                <><b>Installers & service centers:</b> Experience working with Tesla vehicles or automotive electronics and a suitable installation facility.</>,
                <><b>Retailers & online stores:</b> Established sales channels and reliable customer support.</>,
                <><b>Dealers & distributors:</b> Ability to manage inventory, support customers, and develop a local sales network.</>,
            ]
        }
    },
    {
        title: 'How to Get Started',
        list: {
            tag: 'ol',
            items: [
                <><b>Tell us about your business</b><br />Complete our partner application and tell us about your business and plans.</>,
                <><b>Explore the right fit</b><br />We'll review your application and share the relevant partnership details.</>,
                <><b>Start working together</b><br />Agree on the terms, complete onboarding, and place your first order.</>,
            ]
        }
    }
]

const PartnerSections: React.FC = () => {
    const animationConfigs = useMemo(() => sections.reduce<Record<string, AnimationConfig>>((acc, _, index) => ({
        ...acc, [`section_${index}`]: getAnimationConfig('20px', 333)
    }), {}), [])

    const { anime } = useAnime(animationConfigs)

    return (<>
        {sections.map(({ title, subtitle, list: { tag, items } }, index) => (
            <Fragment key={index}>
                <div {...anime(`section_${index}`)} className="partners-content-list" key={index}>
                    <h2>{title}</h2>
                    <div className="partners-content-list-body">
                        {subtitle && <p>{subtitle}</p>}
                        <PartnerSectionList {...{tag, items}} />
                    </div>
                </div>
                <div className="partners-content-delimiter" />
            </Fragment>
        ))}
    </>)
}

export default PartnerSections
