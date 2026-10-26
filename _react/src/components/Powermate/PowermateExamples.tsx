import { useMemo, Fragment, type FC, type ReactNode } from 'react'
import './powermate-examples.scss'
import { convertReactNodeToString } from '../../utils/helpers'
import Image from '../Common/Image'
import videoIcon from '../../assets/icons/powermate/examples/pro-video-icon.svg'
import Icon from '../Common/Icon'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    item: { yFrom: '20px', duration: 333 },
}

const modelImageModules: Record<string, any> = import.meta.glob('@/assets/images/powermate/examples/pro-model-*.svg', { eager: true })
const modelImages: Record<string, any> = Object.entries(modelImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/powermate/examples/pro-model-', '').replace('.svg', '')]: mod.default
}), {})

interface ExamplesVariant {
    slug: string
    model: string | ReactNode
    image: string
    data: { value: string; texts: string[]; video?: string }[]
}

const variants: ExamplesVariant[] = [
    {
        slug: '3-long',
        model: <>Model 3 <br />Long Range</>,
        data: [
            { value: '4.4 sec', texts: ['Factory', '0 - 60 mp/h'] },
            { value: '3.9 sec', texts: ['Boost', '0 - 60 mp/h'] },
            { value: '3.5 sec*', texts: ['Performance', '0 - 60 mp/h'] },
        ]
    },
    {
        slug: 'y-long',
        model: <>Model Y <br />Long Range</>,
        data: [
            { value: '5.0 sec', texts: ['Factory', '0 - 60 mp/h'] },
            { value: '4.2 sec', texts: ['Boost', '0 - 60 mp/h'], video: 'https://youtu.be/TAmVV-gZYYM' },
            { value: '3.7 sec*', texts: ['Performance', '0 - 60 mp/h'] },
        ]
    },
    {
        slug: '3-standard',
        model: <>Model 3 <br />Standard Range+</>,
        data: [
            { value: '5.5 sec', texts: ['Factory', '0 - 60 mp/h'] },
            { value: '4.9 sec', texts: ['Boost', '0 - 60 mp/h'] },
            { value: '', texts: ['', ''] },
        ]
    },
].map(item => ({ ...item, image: modelImages[item.slug] }))

const note: string = '*980 motor'

const PowermateExamples: FC = () => {
    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...variants.reduce((acc, _, index) => ({
            ...acc, [`item-${index}`]: animatedObjects.item
        }), {})
    }), [])

    const { anime } = useAnime(animationConfigs)
    
    return (
        <div className="examples-wrap">
            <div className="examples" id="acceleration_examples">
                <div {...anime('title')} className="examples-title">
                    Be the First: <br className="mobile" />Powermate <br className="desktop" />vs Factory <br className="mobile" />Acceleration <br className="mobile" />Examples
                </div>
                <div className="examples-variants">
                    {variants.map(({ slug, model, image, data }, index) => (
                        <Fragment key={slug}>
                            <div {...anime(`item-${index}`)} className="examples-variants-item">
                                {/* <div className="examples-variants-item-model-mobile">Model 3 Long Range</div> */}
                                <div className="examples-variants-item-car">
                                    <div className="examples-variants-item-model">{model}</div>
                                    <Image className={`examples-variants-item-${slug}-image`} src={image} alt={convertReactNodeToString(model)} />
                                </div>
                                <div className="examples-variants-item-data">
                                    {data.map(({ value, texts, video }, di) => (
                                        <div className="examples-variants-item-data-item" key={`${slug}-data-${di}`}>
                                            <div className="examples-variants-item-data-item-value">{value}</div>
                                            <div className="examples-variants-item-data-item-texts">
                                                {texts.map((text, ti) => <div key={`${slug}-data-${di}-text-${ti}`}>{text}</div>)}
                                                {video && (
                                                    <div className="examples-variants-item-data-item-video">
                                                        <Icon className="examples-variants-item-data-item-video-icon" icon={videoIcon} />
                                                        <a
                                                            className="examples-variants-item-data-item-video-link"
                                                            href={video}
                                                            target="_blank"
                                                        >
                                                            <span>watch </span>video
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {index < variants.length - 1 && <div className="examples-variants-item-delimiter" />}
                        </Fragment>
                    ))}
                    <div className="examples-variants-note">{note}</div>		
                </div>
            </div>
        </div>
    )
}

export default PowermateExamples
