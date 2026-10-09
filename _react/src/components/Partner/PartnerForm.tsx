import { forwardRef } from 'react'

const PartnerForm = forwardRef<HTMLDivElement>(({}, ref) => (
    <div ref={ref} className="partners-content-form">
        <div className="partners-content-form-caption">
            <h2>Let’s Work Together</h2>
            <p>
                Tell us a little about your business, 
                and we'll get back to you with more 
                information about our partnership options.
            </p>
        </div>
        <div className="partners-content-form-submit">
            <a href="https://tally.so/r/2EWeNp" target="_blank">Apply to Become a Partner</a>
            <span className="partners-content-form-note">No purchase commitment when you apply.</span>
        </div>
    </div>
))

export default PartnerForm
