import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import { graphql } from 'gatsby';
import { slugify } from '../utils/slugify';

import ReadMoreLink from '../components/ReadMoreLink';
import Breadcrumbs from '../components/Breadcrumbs';

class TagTemplate extends React.PureComponent {
  render() {
    const {
      pageContext: { tag },
      data: {
        allMarkdownRemark: { edges },
      },
    } = this.props;

    return (
      <div className="container content-container">
        <Helmet title={`Posts in category "${tag}"`} />
        <Breadcrumbs
          breadcrumbs={[
            {
              name: (
                <span>
                  Tag: <span className="article-tag">{tag}</span>
                </span>
              ),
              link: '',
            },
          ]}
        />
        {edges.map(({ node: { id, fields, frontmatter } }) => (
          <div key={id} className="card mb-5">
            <div className="card-block">
              <h2 className="h2 title mb-3">
                <Link to={frontmatter.path || fields.slug}>{frontmatter.title}</Link>
              </h2>
              <p>{frontmatter.shortDescription}</p>
              <div style={{ marginBottom: '20px' }}>
                {frontmatter.tags.map(tag => (
                  <Link key={tag} to={`/tags/${slugify(tag)}/`} className="article-tag">
                    {tag}
                  </Link>
                ))}
              </div>
              <ReadMoreLink to={frontmatter.path || fields.slug}>Go to Article</ReadMoreLink>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default TagTemplate;

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(limit: 1000, sort: { fields: [frontmatter___date], order: DESC }, filter: { frontmatter: { tags: { in: [$tag] } } }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            path
            title
            tags
            date(formatString: "MMMM DD, YYYY")
            shortDescription
          }
        }
      }
    }
  }
`;
