import { useMemo, type FC } from 'react'
import './screenmate-dash-significant.scss'
import { useAppSelector } from '../../redux/hooks'
import { fetchContent } from '../../redux/selectors/content'
import type { Feature } from '../../types/shopify'
import TrackSlider from '../Common/TrackSlider'
import Image from '../Common/Image'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
}

const ScreenmateDashSignificant: FC = () => {
    const { isMobile } = useInlineStyles()

    const { features } = useAppSelector(fetchContent)

    const items = useMemo(() => features?.['significant-dashboard-features']?.items || [], [features])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="significant" id="significant">
            <div {...anime('title')} className="significant__title">Significant <br />dashboard features</div>
            {items && items.length !== 0 && (
                <TrackSlider
                    key={`significant-slider-${items.length}`}
                    className="significant__features"
                    items={items.map(({ title, image, content }: Feature, index: number) => (
                        <div className="significant__features-item" key={index}>
                            <div className="significant__features-item-title">{title}</div>
                            <div className="significant__features-item-image">
                                <Image src={image} alt={title} />
                            </div>
                            <div
                                className="significant__features-item-content"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    ))}
                    slidesToShow={!isMobile ? 4 : 1.1438}
                />
            )}
        </div>
    )
}

export default ScreenmateDashSignificant
