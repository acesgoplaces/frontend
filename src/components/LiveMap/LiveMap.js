import React from 'react'
import Map from '../Map'
import { Circle, Polygon, Popup } from 'react-leaflet'

import MapUtils from '../../utils/MapUtils'

const LiveMap = ({
  viewport,
  lat,
  lng,
  z = null,
  popupContent = null,
  onViewportChanged
}) => {
  const popup = popupContent ? (
    <Popup>
      {popupContent}
    </Popup>
  ) : null
  return (
    <Map viewport={viewport} onViewportChanged={onViewportChanged}>
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