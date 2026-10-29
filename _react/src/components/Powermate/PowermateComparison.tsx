import { useMemo, type FC, type ReactNode } from 'react'
import './powermate-comparison.scss'

import logo from '../../assets/images/powermate/comparison/powermate-logo-small.svg'
import checkboxActive from '../../assets/icons/powermate/comparison/pro_comparison_checkbox_active.svg'
import checkboxInactive from '../../assets/icons/powermate/comparison/pro_comparison_checkbox_inactive.svg'
import { useInlineStyles } from '../../hooks/inline-styles'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    top: { yFrom: '40px', duration: 666 },
    table: { yFrom: '40px', duration: 666 },
}

type ComparisonFeatureParam = string | boolean | null

interface ComparisonFeature {
    feature: string | ReactNode
    v2: ComparisonFeatureParam
    boost: ComparisonFeatureParam
    performance: ComparisonFeatureParam
}

const comparisonFeatures: ComparisonFeature[] = [
    { feature: <>Mobile App Screenmate Dash<br />+ Magnet Phone Holder</>, v2: true, boost: true, performance: true},
    { feature: <>Drift Mode</>, v2: true, boost: true, performance: true},
    { feature: <>Traffic Fines Avoidance</>, v2: true, boost: true, performance: true},
    { feature: <>Chill Kickdown Mode</>, v2: true, boost: true, performance: true},
    { feature: <>Winter Package</>, v2: true, boost: true, performance: true},
    { feature: <>Activation Amber<br />Taillights Retrofit</>, v2: false, boost: true, performance: true},
    // { feature: <>Activation Rear<br />Seat Heating</>, v2: false, boost: true, performance: true},
    // { feature: <>Activation Steering<br />Wheel Heating</>, v2: false, boost: true, performance: true},
    { feature: <>Activation Adaptive<br />Matrix Headlights</>, v2: false, boost: true, performance: true},
    { feature: <>Adjustable Track Mode</>, v2: false, boost: false, performance: true},
    { feature: <>Increases the power of the<br />cars equipped with the Tesla<br />Acceleration Boost option</>, v2: false, boost: false, performance: true},
    { feature: <>Power Increase</>, v2: '', boost: '+50 HP', performance: '+150 HP'},
]

const getValue = (value: ComparisonFeatureParam): string | ReactNode => {
    if (typeof value === 'boolean') {
        return <img className="comparison-table-checkbox" src={value ? checkboxActive : checkboxInactive} width="24" height="24" alt="" />
    }
    return value
}

const PowermateComparison: FC = () => {
    const { isMobile } = useInlineStyles()

    const headers: { text: string; hasLogo?: boolean }[] = useMemo(() => [
        { text: 'Features' },
        { text: 'DASH' },
        { text: 'Boost', hasLogo: !isMobile },
        { text: 'Performance', hasLogo: !isMobile },
    ], [isMobile])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="comparison-wrap">
            <div className="comparison" id="comparison">
                <div {...anime('top')} className="comparison-top">
                    <div className="comparison-title">Comparison of Powermate Features and Specs</div>
                    <div className="comparison-subtitle">Each delivering increased horsepower and access to exclusive features</div>			
                </div>
                <div {...anime('table')} className="comparison-table-wrap">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                {headers.map(({ text, hasLogo }, index) => (
                                    <th key={index}>
                                        {hasLogo && (<>
                                            <img src={logo} width="167" height="12" alt="Powermate" />
                                            <br />
                                        </>)}
                                        {text}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonFeatures.map(({ feature, ...item }, index) => (
                                <tr key={index}>
                                    <td>{feature}</td>
                                    {Object.entries(item).map(([param, value]) => (
                                        <td key={`${param}-${index}`}>{getValue(value)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PowermateComparison
