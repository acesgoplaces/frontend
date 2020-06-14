import React from 'react'
import { Link } from "gatsby"
import PhoneContainer from '../../components/PhoneContainer'
import PhoneInput from '../../components/PhoneInput'

import Api from '../../utils/Api'

import './Home.scss'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      phone: ``,
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
          <div className="intro">
            <h1>PLACES</h1>
            <p>
              PLACES provides richer information to 995 operators to help with sense-making and triage.
              It allows callers to share their location, photos, and live video with the operator,
              saving valuable time when trying to help first responders navigate to the incident site as quickly
              as possible.
            </p>
          </div>


          <div className="demo">
            <h1>Live Demo</h1>
            <p>
              PLACES is meant to be activated by 995 operators at their discretion.
              However, for demo purposes, the form below will allow you to try out
              PLACES on your own phone.
            </p>
            {
              smsSent ? (
                <p>Please check your phone. The message should arrive shortly.</p>
              ) : (
                  <>
                    <p>Key in your mobile phone number below to receive an PLACES message.</p>
                    <PhoneInput
                      value={phone}
                      onChange={this.updatePhone}
                    />
                    <button type="button" onClick={this.simulateCall}>SEND</button>
                  </>
                )
            }
            <p>
              If you don't receive a SMS after a few minutes (possibly because my SMS plan has been exhausted), then open&nbsp;
              <Link to="/l/demo">
                this link
              </Link>
              &nbsp;on your phone instead.
            </p>
            {/* <p>
              After opening the message, you can also&nbsp;
              <Link to="/ops">demo PLACES from the operator's perspective</Link>.
              This page has many elements and is best viewed on a computer rather than a phone.
            </p> */}
          </div>
        </div >
      </PhoneContainer >
    )
  }
}

export default Home