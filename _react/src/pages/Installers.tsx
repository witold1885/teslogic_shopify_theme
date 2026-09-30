import React from 'react'
import '../assets/styles/installers.scss'
import InfoLayout from '../layouts/InfoLayout'
import InstallersBanner from '../components/Installers/InstallersBanner'
import InstallersList from '../components/Installers/InstallersList'

const Installers: React.FC = () => {
    return (
        <InfoLayout className="installers">
            <InstallersBanner />
            <div className="installers-delimiter" />
            <InstallersList />
        </InfoLayout>
    )
}

export default Installers
