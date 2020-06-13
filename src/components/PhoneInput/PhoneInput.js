import React from 'react'
import './PhoneInput.scss'

const PhoneInput = ({ value, onChange }) => {

  const onPhoneChange = ({ target: { value: v } }) => {
    const isValid = v.length === 0 || /^[89][0-9]{0,7}$/.test(v)

    if (isValid) {
      onChange(v)
    }
  }

  return (
    <div className="phone-input">
      <div className="prepend">+65</div>
      <input type="text" value={value} onChange={onPhoneChange} />
    </div>
  )
}

export default PhoneInput
