import type { FC, ReactNode } from 'react'
import './powermate-info.scss'
import Icon from '../Common/Icon'
import warning from '../../assets/icons/powermate/info/pro_info_warning.svg'

interface InfoBlock {
    title: string | ReactNode
    icon?: string
    texts: string[]
}

const infoBlocks: InfoBlock[] = [
    {
        title: 'Precautions',
        texts: [
            'There is a possibility that future Tesla software updates may cause some Powermate functions to be disabled. Screenmate will release updates to our application to address this.',
            'The Drift mode and Track mode functions should only be used off public roads.'
        ]
    },
    {
        title: 'IMPACT ON THE MANUFACTURER\'S WARRANTY',
        icon: warning,
        texts: [
            'When Powermate is installed, you may encounter a denial of warranty service for your vehicle, so before making a warranty claim, we recommend uninstalling Powermate. ',
            'Screenmate is not liable for any warranty service denial or any issues arising during the warranty service of your vehicle.'
        ]
    },
]

const PowermateInfo: FC = () => {
    return (
        <div className="info-wrap">
            <div className="info">
                {infoBlocks.map(({ title, icon, texts }, index) => (
                    <div className="info-block">
                        <div className="info-block-title">
                            {icon && <Icon className="info-block-title-icon" icon={icon} />}
                            <div className="info-block-title-text">{title}</div>				
                        </div>
                        <div className="info-block-delimiter"></div>
                        <div className="info-block-texts">
                            {texts.map((text, ti) => <div className="info-block-text" key={`info-text-${index}-${ti}`}>{text}</div>)}
                        </div>
                    </div>
                ))}
            </div>	
        </div>
    )
}

export default PowermateInfo
