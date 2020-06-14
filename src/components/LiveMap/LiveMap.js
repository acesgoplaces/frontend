import React from 'react'
import Map from '../Map'
import { Circle, Polygon, Popup } from 'react-leaflet'

import MapUtils from '../../utils/MapUtils'

const LiveMap = ({ lat, lng, z = null, popupContent = null }) => {
  const popup = popupContent ? (
    <Popup>
      {popupContent}
      {z}
    </Popup>
  ) : null
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
            }>
              {popup}
            </Polygon>
          ) : <Circle center={[lat, lng]} radius={10}>{popup}</Circle>
        ) : null
      }
    </Map>
  )
}

export default LiveMap