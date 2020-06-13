import React from 'react'
import { Helmet } from "react-helmet"
import cc from 'classcat'
import SCDFLogo from '../../components/SCDFLogo'
import PhoneContainer from '../../components/PhoneContainer'
import Api from '../../utils/Api'
import LiveMap from '../../components/LiveMap'
import { AbsoluteOrientationSensor } from 'motion-sensors-polyfill'

import './LinkPage.scss'

const isSSR = typeof window === "undefined"
const isApple = navigator.userAgent.match(/iPhone|iPad|iPod/i)
const isMobile = !isSSR && navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)

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
    const location = {
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed,
    }
    this.setState({ location })

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
      if (error.name === 'NotReadableError') {
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

    if (!isSSR) {
      // document.querySelector(`html`).requestFullscreen()
      this.beginLocationTracking()
      if (isMobile) {
        if (isApple) {
          document.getElementById(`ios-gyroscope`).click()
        } else {
          this.beginOrientationTracking()
          this.beginBatteryTracking()
        }
      }
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

  iosGyroscopePerms = async () => {
    const perms = await window.DeviceMotionEvent.requestPermission()
    if (perms === `granted`) {
      window.addEventListener(`devicemotion`, this.receiveiOSGyroscope)
    }
  }

  receiveiOSGyroscope = ({ accelerationIncludingGravity: { x, y, z } }) => {
    this.setState({ orientation: [x, y, z, 0] })
  }

  render() {
    const {
      trackingSuccess,
      location,
      orientation,
      battery
    } = this.state

    const { latitude, longitude } = location
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
            <LiveMap
              lat={latitude}
              lng={longitude}
              z={orientation[3]}
            />
          </div>
          <div className="hidden">
            <input
              type="file"
              accept="image/*;video/*;capture=camera"
              onChange={this.uploadPhoto}
              id="photo-input"
            />
            <button
              onClick={this.iosGyroscopePerms}
              style={{ display: 'none' }}
              id="ios-gyroscope" />
          </div>
          <div className="footer">
            <div className="photo-button" onClick={this.takePhoto}>
              <div>📷</div>
              <div>Submit Photo/Video</div>
            </div>
            <div className="video-button">
              <div>🎥</div>
              <div>Share Live Video</div>
            </div>
          </div>
        </div >
      </PhoneContainer>
    )
  }
}

export default LinkPage
