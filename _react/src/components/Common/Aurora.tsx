import type { FC } from 'react'
import '../../assets/styles/aurora.scss'

const Aurora: FC = () => (
    <div className="aurora">
        {[...Array(4).keys()].map((_, index) => (
            <div className="aurora__item" key={index}></div>
        ))}
    </div>
)

export default Aurora
