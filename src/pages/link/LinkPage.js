import React from 'react'
import { Helmet } from "react-helmet"
import cc from 'classcat'
import SCDFLogo from '../../components/SCDFLogo'
import PhoneContainer from '../../components/PhoneContainer'
import Api from '../../utils/Api'

import './LinkPage.scss'


class LinkPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      trackingSuccess: false,
      orientation: [],
      location: {},
      battery: {},
    }
  }

  receivePosition = async ({ coords }) => {
    const { trackingSuccess } = this.state
    if (!trackingSuccess) {
      this.setState({ trackingSuccess: true })
    }
    const {
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed,
    } = coords
    this.setState({
      location: {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
      }
    })

    const { id: userId } = this.props
    await Api.sendLocation({ location, userId })
  }

  trackingError = ({ code, message }) => {
    if (code === `PERMISSION_DENIED`) {

    } else if (code === `POSITION_UNAVAILABLE` || code === `TIMEOUT`) {

    }
  }

  beginLocationTracking = () => {
    navigator.geolocation.watchPosition(
      this.receivePosition,
      this.trackingError
    )
  }

  beginOrientationTracking = async () => {
    // will only run on Chrome / Safari mobile

    const perms = await Promise.all([
      navigator.permissions.query({ name: "accelerometer" }),
      navigator.permissions.query({ name: "magnetometer" }),
      navigator.permissions.query({ name: "gyroscope" })
    ])

    if (!perms.every(r => r.state === `granted`)) {
      return null
    }

    const options = { frequency: 60, referenceFrame: 'device' }
    const sensor = new AbsoluteOrientationSensor(options)

    sensor.addEventListener('reading', data => {
      const { target: { quaternion } } = data
      this.setState({
        orientation: quaternion
      })
    })
    sensor.addEventListener('error', error => {
      if (event.error.name == 'NotReadableError') {
        console.log("Sensor is not available.")
      }
      console.error(error)
    })

    sensor.start()
  }

  beginBatteryTracking = async () => {
    const battery = await navigator.getBattery()
    const {
      charging,
      level,
      chargingTime,
      dischargingTime
    } = battery
    this.setState({
      battery: {
        charging,
        level,
        chargingTime,
        dischargingTime
      }
    })
  }

  componentDidMount() {
    const isSSR = typeof window === "undefined"
    if (!isSSR) {
      this.beginLocationTracking()
      // this.beginOrientationTracking()
      // this.beginBatteryTracking()
      // window.navigator.vibrate([100, 100])
    }
  }

  takePhoto = () => document.getElementById(`photo-input`).click()
  uploadPhoto = async ({ target: { files } }) => {
    const photo = files[0]
    const { userId } = this.props
    await Api.uploadPhoto({ photo, userId })
    window.alert(`Photo successfully sent`)
  }

  render() {
    const {
      trackingSuccess,
      location,
      orientation,
      battery
    } = this.state
    return (
      <PhoneContainer>
        <div className="link-page container">
          <Helmet title="995 Hotline">
            <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          </Helmet>
          <div className="header">
            <SCDFLogo />
            <h1>995 Hotline</h1>
          </div>
          <div className="main">
            <div className={cc(["tracking-status", trackingSuccess ? "success" : ""])}>
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
            <div style={{
              backgroundImage: "url('https://a.uguu.se/z0bwQQkZjU6M.png')",
              backgroundSize: `cover`,
            }} id="placeholder" />
            {/* <div className="debug-info">
            <pre>
              debug info
              
              {JSON.stringify(location, null, 2)}
              {JSON.stringify(orientation, null, 2)}
              {JSON.stringify(battery, null, 2)}
            </pre>
          </div> */}
          </div>
          <div className="hidden">
            <input
              type="file"
              accept="image/*;capture=camera"
              onChange={this.uploadPhoto}
              id="photo-input"
            />
          </div>
          <div className="footer">
            <div className="photo-button" onClick={this.takePhoto}>
              📷&nbsp;&nbsp;Photo
            </div>
            <div className="video-button">
              🎥&nbsp;&nbsp;Video
            </div>
          </div>
        </div >
      </PhoneContainer>
    )
  }
}

export default LinkPage
