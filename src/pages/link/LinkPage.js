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
const isApple = !isSSR && navigator.userAgent.match(/iPhone|iPad|iPod/i)
const isiOS11 = isApple && navigator.userAgent.match(/OS 11/i)
const isMobile = !isSSR && navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)

class LinkPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      trackingSuccess: false,
      orientation: [],
      location: {},
      battery: {},
      viewport: undefined,
    }
  }

  viewportChanged = viewport => this.setState({ viewport })

  setInitialLocate = () => this.setState({ setInitialLocate: true })

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

    const { viewport } = this.state
    if (!viewport) {
      this.setState({
        viewport: {
          center: [latitude, longitude],
          zoom: 20
        }
      })
    }

    const { id: userId } = this.props
    await Api.sendLocation({ location, userId })
  }

  trackingError = ({ code, message }) => {
    if (code === `PERMISSION_DENIED`) {

    } else if (code === `POSITION_UNAVAILABLE` || code === `TIMEOUT`) {

    }
  }

  beginLocationTracking = () => {
    if (navigator && navigator.geolocation && typeof navigator.geolocation.watchPosition === `function`) {
      navigator.geolocation.watchPosition(
        this.receivePosition,
        this.trackingError
      )
    }
  }

  beginOrientationTracking = async () => {
    if (navigator && navigator.permissions && typeof navigator.permissions.query === `function`) {
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
    } else if (isiOS11) {
      window.addEventListener(`deviceorientation`, this.receiveiOSGyroscope)
    }
  }

  beginBatteryTracking = async () => {
    if (navigator && typeof navigator.getBattery === `function`) {
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
  }

  async componentDidMount() {
    if (!isSSR) {
      try {
        await document.querySelector(`body`).requestFullscreen()
      } catch (error) {
        console.error(error)
      }

      if (isMobile && !(isApple && !isiOS11)) {
        this.beginLocationTracking()
        this.beginOrientationTracking()
        this.beginBatteryTracking()
      }
    }
  }

  takePhoto = () => document.getElementById(`photo-input`).click()
  uploadPhoto = async ({ target: { files } }) => {
    const photo = files[0]
    const { userId } = this.props
    await Api.uploadPhoto({ photo, userId })
    window.alert(`Photo successfully sent`)
  }

  iosPerms = () => {
    this.beginLocationTracking()
    this.iosGyroscopePerms()
  }

  iosGyroscopePerms = async () => {
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === `function`) {
      const perms = await DeviceMotionEvent.requestPermission()
      if (perms === `granted`) {
        window.addEventListener(`deviceorientation`, this.receiveiOSGyroscope)
      }
    }
  }

  receiveiOSGyroscope = (event) => {
    const { alpha: z, gamma: x, beta: y } = event

    const scale = (num, in_min, in_max, out_min, out_max) => {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    }

    const convert = (z) => {
      let result = 0
      if (z >= 0 && z <= 90) {
        result = scale(z, 0, 90, 0.5, 1)
      } else if (z >= 90 && z <= 180) {
        result = scale(z, 90, 180, -1, -0.5)
      } else if (z >= 180 && z <= 270) {
        result = scale(z, 180, 270, -0.5, 0)
      } else {
        result = scale(z, 270, 360, 0, 0.5)
      }
      return result < -0.5 ? (1.5 + result) : result - 0.5
    }

    let convertedZ = convert(z)
    convertedZ = (isApple && !isiOS11)
      ? (convertedZ < 0) ? (convertedZ + 1) : (convertedZ - 1)
      : convertedZ

    this.setState({
      orientation: [
        x,
        y,
        convertedZ,
        0
      ]
    })
  }

  liveStream = () => window.location.href = "/livestream"

  render() {
    const {
      trackingSuccess,
      location,
      orientation,
      viewport
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
            {
              (isApple && !isiOS11) ? (
                <div className="tracking-status" onClick={this.iosPerms}>
                  {
                    (orientation.length === 0 || !trackingSuccess) ? (
                      <p>Please press here to share your GPS location with our 995 operators</p>
                    ) : (
                        <p>✅&nbsp;&nbsp;Sharing location with 995 operator</p>
                      )
                  }
                </div>
              ) : (
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
                )
            }
            <LiveMap
              viewport={viewport}
              onViewportChanged={this.viewportChanged}
              lat={latitude}
              lng={longitude}
              z={orientation[2]}
              popupContent={
                <>
                  <span>Your location</span>
                </>
              }
            />
          </div>
          <div className="hidden">
            <input
              type="file"
              accept="image/*;video/*;capture=camera"
              onChange={this.uploadPhoto}
              id="photo-input"
            />
          </div>
          <div className="footer">
            <div className="photo-button" onClick={this.takePhoto}>
              <div>📷</div>
              <div>Submit Photo/Video</div>
            </div>
            <div className="video-button" onClick={this.liveStream}>
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
