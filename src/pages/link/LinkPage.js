import React from 'react'
import { Helmet } from "react-helmet"
import SCDFLogo from '../../components/SCDFLogo'

import './LinkPage.scss'


class LinkPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      trackingSuccess: false,
    }
  }

  receivePosition = ({ coords, timestamp }) => {
    const { trackingSuccess } = this.state
    if (!trackingSuccess) {
      this.setState({ trackingSuccess: true })
    }
    console.log(coords, timestamp)
  }

  trackingError = ({ code, message }) => {
    if (code === `PERMISSION_DENIED`) {

    } else if (code === `POSITION_UNAVAILABLE` || code === `TIMEOUT`) {

    }
  }

  beginLocationTracking = () => {
    //watchPosition
    navigator.geolocation.getCurrentPosition(
      this.receivePosition,
      this.trackingError
    )
  }

  receiveOrientation = (data) => {
    console.log(data)
  }

  componentDidMount() {
    const isSSR = typeof window === "undefined"
    if (!isSSR) {
      this.beginLocationTracking()

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', this.receiveOrientation, false)
      }

    }
  }

  render() {
    const { trackingSuccess } = this.state
    return (
      <div className="container">
        <Helmet title="995 Hotline" />
        <div className="header">
          <SCDFLogo />
          <h1>995 Hotline</h1>
        </div>
        <div className="main">
          <div className="tracking-status">
            {
              trackingSuccess ? (
                <p>✅&nbsp;&nbsp;Sharing location with 995 operator</p>
              ) : (
                  <p>
                    Please share your GPS location with our 995 operators to help them better understand the ongoing incident.
                  </p>
                )
            }
          </div>
        </div>
      </div >
    )
  }
}

export default LinkPage
