import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Img from "gatsby-image"

const SCDFLogo = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "scdf.png" }) {
        childImageSharp {
          fluid(maxWidth: 200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return (
    <Img
      fluid={data.file.childImageSharp.fluid}
    />
  )

}

export default SCDFLogo