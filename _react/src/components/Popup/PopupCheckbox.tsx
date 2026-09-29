import React from 'react'

interface PopupCheckboxProps {
    id: string
    checked: boolean
    onChange: (e: any) => void
    error: string | null
}

const PopupCheckbox: React.FC<PopupCheckboxProps> = ({ id, checked, onChange, error }) => (
    <div className={`subscription-popup-checkbox ${error ? 'subscription-popup-checkbox-error' : ''}`}>
        <input type="checkbox" {...{id, checked, onChange}} />
        <label htmlFor={id}>
            I have read and agree to the <a href="/pages/privacy" target="_blank">Privacy Policy</a>
        </label>
    </div>
)

export default PopupCheckbox
