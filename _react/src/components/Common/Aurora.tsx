import React from 'react'
import '../../assets/styles/aurora.scss'

const Aurora: React.FC = () => (
    <div className="aurora">
        {Array.from({ length: 4 }).map((_, index) => (
            <div className="aurora__item" key={index}></div>
        ))}
    </div>
)

export default Aurora
