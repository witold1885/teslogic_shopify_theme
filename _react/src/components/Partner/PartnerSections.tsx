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
                <><b>Targeted Lead Generation:</b> We drive Tesla owners in your region directly to your shop via our "Where to Install" locator.</>,
                <><b>Premium Product:</b> Offer your clients the most advanced screen rotation and dashboard solutions for Tesla Model 3/Y and Highland.</>,
                <><b>Technical Support:</b> Gain access to exclusive step-by-step installation manuals, video tutorials, and direct engineering support.</>,
                <><b>Marketing Toolkit:</b> Receive high-quality photo and video assets to promote Screenmate on your social media channels.</>,
                <><b>Exclusive Wholesale Pricing:</b> Benefit from competitive B2B margins and priority shipping on all hardware.</>,
            ]
        }
    },
    {
        title: 'Who We Are Looking For',
        subtitle: 'To maintain our high standards of quality, we partner with studios that meet the following criteria:',
        list: {
            tag: 'ol',
            items: [
                <><b>Tesla Expertise:</b> Proven experience in EV interior disassembly and electronic installations.</>,
                <><b>Professional Facility:</b> A clean, well-lit workspace capable of handling premium vehicles.</>,
                <><b>Customer Excellence:</b> A strong reputation for quality work and positive customer reviews.</>,
                <><b>Brand Alignment:</b> Commitment to following Screenmate installation protocols to ensure hardware longevity.</>,
            ]
        }
    },
    {
        title: 'The Onboarding Process',
        list: {
            tag: 'ol',
            items: [
                <><b>Application:</b> Fill out the partner form below with your business details.</>,
                <><b>Verification:</b> Our team will review your application and portfolio (website/social media).</>,
                <><b>Training & First Order:</b> Access our technical documentation and place your initial stock order at partner rates.</>,
                <><b>Go Live:</b> Your business is added to our global interactive map, and you start receiving installation requests.</>,
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
                <div {...anime(`section_${index}`)} className="partner-content-list" key={index}>
                    <h2>{title}</h2>
                    <div className="partner-content-list-body">
                        {subtitle && <p>{subtitle}</p>}
                        <PartnerSectionList {...{tag, items}} />
                    </div>
                </div>
                <div className="partner-content-delimiter" />
            </Fragment>
        ))}
    </>)
}

export default PartnerSections
