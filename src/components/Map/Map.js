import React from 'react'
import { Helmet } from 'react-helmet'
import { Map, TileLayer } from 'react-leaflet'

const isSSR = typeof window === "undefined"

const defaults = {
  lat: "1.3521",
  lng: "103.8198",
  zoom: 12,
}

class ACESMap extends React.Component {
  constructor() {
    super()
    this.state = {
      viewport: null
    }
  }

  onViewportChanged = viewport => {
    const { lat, lng, } = viewport
    if (lat && lng && lat !== defaults.lat && lng !== defaults.lng) {
      this.setState({ viewport })
    }
  }

  render() {
    const { viewport } = this.state
    const {
      lat = defaults.lat,
      lng = defaults.lng,
      zoom = defaults.zoom,
      children,
      mode = `Default`
    } = this.props
    return (
      <>
        <Helmet>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
            integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
            crossorigin="" />
          <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
            integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
            crossorigin=""></script>
        </Helmet>
        {
          isSSR ? null : (
            <Map
              viewport={viewport ? viewport : {
                center: { lat, lng },
                zoom
              }}
              style={{ height: `100%`, width: `100%` }}
              onViewportChanged={this.onViewportChanged}
            >
              <TileLayer
                attribution={`<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;" />
                New OneMap | Map data &copy; contributors,
                <a href="http://SLA.gov.sg">Singapore Land Authority</a>
            `}
                url={`https://maps-{s}.onemap.sg/v3/${mode}/{z}/{x}/{y}.png`}
                detectRetina
              />
              {children}
            </Map>
          )
        }
      </>
    )
  }
}
export default ACESMap