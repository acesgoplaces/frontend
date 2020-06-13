import React from 'react'
import PhoneContainer from '../../components/PhoneContainer'
import PhoneInput from '../../components/PhoneInput'

import Api from '../../utils/Api'

import './Home.scss'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      phone: `86662940`,
      smsSent: false,
    }
  }

  updatePhone = v => this.setState({ phone: v })

  simulateCall = async () => {
    const { phone } = this.state
    await Api.call995({ phone })

    this.setState({ smsSent: true })
  }

  render() {
    const { phone, smsSent } = this.state
    return (
      <PhoneContainer>
        <div className="home-page container">
          <h1>ACES Go Places</h1>
          <p>
            &lt;name&gt; provides richer information to 995 operators to help with sense-making and triage.
            It does this by allowing callers to share their location, photos, and live video with the operator,
            saving valuable time when trying to help first responders navigate to the incident site as quickly
            as possible.
          </p>

          <div className="demo">
            <h1>Live Demo</h1>
            {
              smsSent ? (
                <p>Please check your phone. The message should arrive shortly.</p>
              ) : (
                  <>
                    <p>Key in your mobile phone number below to simulate calling 995.</p>
                    <PhoneInput
                      value={phone}
                      onChange={this.updatePhone}
                    />
                    <button type="button" onClick={this.simulateCall}>CALL 995</button>
                  </>
                )
            }
          </div>
        </div >
      </PhoneContainer >
    )
  }
}

export default Home