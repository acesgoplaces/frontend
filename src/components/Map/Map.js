import React from 'react'
import { Helmet } from 'react-helmet'
import { Map, TileLayer } from 'react-leaflet'

const isSSR = typeof window === "undefined"


class ACESMap extends React.Component {
  constructor(props) {
    super(props)
    const {
      lat = "1.3521",
      lng = "103.8198",
      zoom = 12,
    } = props
    const viewpoint = { center: [lat, lng], zoom }
    this.state = {
      viewpoint
    }
  }

  onViewportChanged = viewport => this.setState({ viewport })

  render() {
    const {
      viewpoint
    } = this.state
    const {
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
              viewport={viewpoint}
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