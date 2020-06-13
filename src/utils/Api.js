import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.scdf.tech'
})

const call995 = async ({ phone, fake = false }) => {
  const result = await api.post(`/call`, { number: phone, fake })
  return result.data
}

const sendLocation = async ({ location, userId }) => {
  const result = await api.post(`/location`, { location }, {
    headers: {
      'User-Id': userId
    }
  })
  return result.data
}

const uploadPhoto = async ({ photo, userId }) => {
  const formData = new FormData()
  formData.append('photo', photo)

  const result = await api.post(`/photo`, formData, {
    headers: {
      'User-Id': userId
    }
  })
  return result.data
}

export default {
  call995,
  sendLocation,
  uploadPhoto
}