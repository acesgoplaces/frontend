const getTriangleCoords = ({
  coords: [x, y],
  z,
  distance = 0.005,
  fovDegree = 5,
}) => {
  let angle = 0
  if (z >= 0 && z <= 0.5) {
    angle = Math.PI / 2 - (z / 0.5 * Math.PI / 2)
  } else if (z >= 0 && z > 0.5) {
    angle = 3 / 2 * Math.PI + (1 - z) / 0.5 * Math.PI / 2
  } else if (z < 0) {
    angle = Math.PI / 2 + (z / -1 * Math.PI)
  }

  let fovRad = (fovDegree / 180 * Math.PI)
  let left = angle - fovRad
  if (left < 0) {
    left = 2 * Math.PI + left
  } else if (left > 2 * Math.PI) {
    left -= 2 * Math.PI
  }
  let right = angle + fovRad
  if (right < 0) {
    right = 2 * Math.PI + right
  } else if (right > 2 * Math.PI) {
    right -= 2 * Math.PI
  }

  return [
    [x, y],
    [
      x + distance * Math.cos(left),
      y + distance * Math.sin(left)
    ],
    [
      x + distance * Math.cos(right),
      y + distance * Math.sin(right)
    ]
  ]
}

export default {
  getTriangleCoords
}