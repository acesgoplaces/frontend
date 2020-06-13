import React from 'react'
import { Router } from "@reach/router"
import LinkPage from './LinkPage'

const LinkRouter = ({ data }) => (
  <Router>
    <LinkPage path="l/:id" data={data} />
  </Router>
)

export default LinkRouter
