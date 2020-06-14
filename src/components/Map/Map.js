import React from 'react'
import { Helmet } from 'react-helmet'
import { Map, TileLayer } from 'react-leaflet'

const isSSR = typeof window === "undefined"
const defaultViewport = {
  center: ["1.352083", "103.819839"],
  zoom: 14,
}

const ACESMap = ({
  viewport = defaultViewport,
  children, mode = `Default`, onViewportChanged
}) => (
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
            viewport={viewport || defaultViewport}
            style={{ height: `100%`, width: `100%` }}
            onViewportChanged={onViewportChanged}
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

export default ACESMap