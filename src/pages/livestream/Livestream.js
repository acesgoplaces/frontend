import React from 'react'
import "./Livestream.scss"

class LivestreamScreen extends React.Component {
  async componentDidMount() {
    if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            exact: `environment`
          }
        }
      })

      document.querySelector(`video`).srcObject = stream
    }
  }
  render() {
    return (
      <div className="livestream-screen">
        <video autoPlay />
      </div>
    )
  }
}

export default LivestreamScreen