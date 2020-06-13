import React from 'react'
import "./PhoneContainer.scss"

const PhoneContainer = ({ children }) => (
  <div className="phone-container">
    <div className="subcontainer">
      {children}
    </div>
  </div>
)

export default PhoneContainer