import type { FC } from 'react'
import type { Installer } from './types'
import phoneIcon from '../../assets/icons/installers/phone.svg'
import earthIcon from '../../assets/icons/installers/earth.svg'


const InstallerItem: FC<Installer> = ({ name, logo, phone, website, address, coordinates }) => {
    return (
        <div className="installers-list-item">
            <div className="installers-list-item-block">
                <h3>{name}</h3>
                {logo && <img {...logo} alt={name} loading="lazy" />}
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
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAqbo5rx2oVhWCW_pSzNrWnywQSRSdlnQ4&q=${coordinates.join(',')}&zoom=15`}
                            title="Location of Screenmate certified installer"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default InstallerItem
