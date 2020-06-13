import React from 'react'
import Map from '../Map'
import { Circle, Polygon } from 'react-leaflet'

import MapUtils from '../../utils/MapUtils'

const LiveMap = ({ lat, lng, z = null }) => {
  return (
    <Map lat={lat} lng={lng} zoom={20}>
      {
        (lat && lng) ? (
          z !== null ? (
            <Polygon positions={
              MapUtils.getTriangleCoords({
                coords: [lat, lng],
                z,
              })
            } />
          ) : <Circle center={[lat, lng]} radius={10} />
        ) : null
      }
    </Map>
  )
}

export default LiveMap