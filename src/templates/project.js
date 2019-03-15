import React from 'react'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import { Layout, ProjectHeader, ProjectPagination, SEO } from '../components'
import config from '../../config/site'

const BG = styled.div`
  background-color: ${props => props.theme.colors.bg};
  position: relative;
  padding: 2rem 0 0 0;
  z-index: -1;
`
const OuterWrapper = styled.div`
  padding: 0 ${props => props.theme.contentPadding};
  margin: -10rem auto 0 auto;
  z-index: -1;
`

const InnerWrapper = styled.div`
  position: relative;
  max-width: ${props => `${props.theme.maxWidths.project}px`};
  margin: 0 auto;
  z-index: -1;
`

const Project = ({ pageContext: { slug, prev, next }, data: { project: postNode, images: imgs } }) => {
  const images = imgs.edges
  const project = postNode.frontmatter

  // console.log('images=', images)
  // const randomList = t(images, '[0].node.childImageSharp.fluid.src')
  // // const testRandom = images[0]
  // console.log('testRandom=', randomList)

  return (
    <Layout customSEO>
      <SEO postPath={slug} postNode={postNode} postSEO />
      <ProjectHeader avatar={config.avatar} title={project.title} areas={project.areas} text={postNode.code.body} />
      <BG>
        <OuterWrapper>
          <InnerWrapper>
            {images.map(image => (
              <Img
                key={image.node.childImageSharp.fluid.src}
                fluid={image.node.childImageSharp.fluid}
                style={{ margin: '3rem 0' }}
              />
            ))}
          </InnerWrapper>
          <ProjectPagination next={next} prev={prev} />
        </OuterWrapper>
      </BG>
    </Layout>
  )
}

export default Project

Project.propTypes = {
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    next: PropTypes.object,
    prev: PropTypes.object,
  }),
  data: PropTypes.shape({
    project: PropTypes.object.isRequired,
    images: PropTypes.object.isRequired,
  }).isRequired,
}

Project.defaultProps = {
  pageContext: PropTypes.shape({
    next: null,
    prev: null,
  }),
}

export const pageQuery = graphql`
  query($slug: String!, $absolutePathRegex: String!) {
    images: allFile(
      filter: {
        absolutePath: { regex: $absolutePathRegex }
        extension: { regex: "/(jpg)|(png)|(tif)|(tiff)|(webp)|(jpeg)/" }
      }
      sort: { fields: name, order: ASC }
    ) {
      edges {
        node {
          childImageSharp {
            fluid(maxWidth: 1600, quality: 90) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
    project: mdx(fields: { slug: { eq: $slug } }) {
      code {
        body
      }
      excerpt
      parent {
        ... on File {
          mtime
          birthtime
        }
      }
      frontmatter {
        cover {
          childImageSharp {
            resize(width: 800) {
              src
            }
          }
        }
        title
        areas
      }
    }
  }
`
