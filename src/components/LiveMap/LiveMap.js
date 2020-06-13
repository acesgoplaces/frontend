import React from 'react'
import Map from '../Map'
import { Circle } from 'react-leaflet'


const LiveMap = ({ lat, lng }) => {
  return (
    <Map lat={lat} lng={lng} zoom={20}>
      {
        (lat && lng) ? (
          <Circle center={[lat, lng]} radius={10} />
        ) : null
      }
    </Map>
  )
}

export default LiveMap