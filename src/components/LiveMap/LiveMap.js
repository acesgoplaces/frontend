import React from 'react'
import { Helmet } from 'react-helmet'
import { Map, TileLayer, Circle } from 'react-leaflet'

const LiveMap = ({ lat, lng }) => {
  const position = (lat && lng) ? { lat, lng } : { lat: "1.3521", lng: "103.8198" }
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
      <Map center={position} zoom={20} style={{ height: `100%`, width: `100%` }}>
        <TileLayer
          attribution={`<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;" />
              New OneMap | Map data &copy; contributors,
              <a href="http://SLA.gov.sg">Singapore Land Authority</a>
          `}
          url="https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png"
          detectRetina
        />
        {
          (lat && lng) ? (
            <Circle center={[lat, lng]} radius={10} />
          ) : null
        }
      </Map>
    </>
  )
}

export default LiveMap