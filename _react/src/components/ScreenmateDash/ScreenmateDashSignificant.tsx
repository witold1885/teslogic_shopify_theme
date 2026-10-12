import React from 'react'
import './screenmate-dash-significant.scss'
import { useAppSelector } from '../../redux/hooks'
import type { Feature } from '../../types/shopify'
import TrackSlider from '../Common/TrackSlider'
import { Image } from '../Common'

const ScreenmateDashSignificant: React.FC = () => {
    const { features } = useAppSelector(state => state.content)

    console.log({ features })

    return (
        <div className="significant" id="significant">
            <div className="significant__title">Significant <br />dashboard features</div>
            <div className="significant__features">
                {/* <div className="significant__features-scroller">
                    {% assign articles = blogs['significant-dashboard-features'].articles | sort: "title" %}
                    {% for article in articles %}
                        <div className="significant__features-item">
                            {% assign title_array = article.title | split: " " %}
                            {% assign number = title_array.first %}
                            {% assign title = article.title | replace: number, "" %}
                            <div className="significant__features-item-title">{{ title }}</div>
                            <div className="significant__features-item-image">
                                <img draggable="false" src="{{ article.image | img_url: '848x848' }}">
                            </div>
                            <div className="significant__features-item-content">{{ article.content }}</div>
                        </div>
                    {% endfor %}
                    <div><div style="margin-left: -20px"></div></div>
                </div>
                <div className="significant__features-scrollbar">
                    <div className="significant__features-scrollbar-thumb"></div>
                </div> */}
                <TrackSlider
                    className="significant__features-scroller"
                    items={features?.significant_features?.map(({ title, image, content }: Feature, index: number) => (
                        <div className="significant__features-item" key={index}>
                            <div className="significant__features-item-title">{title}</div>
                            <div className="significant__features-item-image">
                                <Image src={image} alt={title} />
                            </div>
                            <div
                                className="significant__features-item-content"
                                dangerouslySetInnerHTML={{ __html: content as TrustedHTML }}
                            />
                        </div>
                    )) || []}
                    slidesToShow={5}
                />
            </div>
        </div>
    )
}

export default ScreenmateDashSignificant
