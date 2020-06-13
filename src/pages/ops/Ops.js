import React from 'react'
import Map from '../../components/Map'
import Api from '../../utils/Api'

import "./Ops.scss"
const isSSR = typeof window === "undefined"

class Ops extends React.Component {
  timer = null

  constructor() {
    super()
    this.state = {
      users: [],
    }
  }

  componentDidMount() {
    if (!isSSR) {
      this.timer = window.setInterval(this.fetchUsers, 3000)
    }
  }

  fetchUsers = async () => {
    const users = await Api.getUsers()
    this.setState({ users })
  }

  render() {
    return (
      <div className="ops-page container">
        <Map mode="Night">
        </Map>
      </div>
    )
  }
}

export default Ops