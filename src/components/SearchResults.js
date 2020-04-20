import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { slugify } from '../utils/slugify';

import ReadMoreLink from './ReadMoreLink';

// Articles List
import searchData from '../../static/search-data.json'; // eslint-disable-line

const search = (edges, needle) => {
  // we escape special characters in needle
  const rx = new RegExp('\\b' + needle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'ig');
  return edges
    .filter(({ node: { html, frontmatter: { title, shortDescription } } }) => {
      if (title.match(rx) || shortDescription.match(rx) || html.match(rx)) {
        return true;
      }
      return false;
    })
    .map(({ node: { html, frontmatter: { title, path, tags, shortDescription } } }) => ({
      html,
      title,
      path,
      tags,
      shortDescription,
    }));
  // TODO highlight cleverly, probably use the markdown
  // source instead
};

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: search(searchData, this.props.searchValue.toLowerCase()),
    };
  }

  componentDidUpdate(prevProps) {
    const { searchValue } = this.props;
    if (searchValue !== prevProps.searchValue) {
      // eslint-disable-next-line
      this.setState({
        results: search(searchData, searchValue.toLowerCase()),
      });
    }
  }

  render() {
    const { results } = this.state;
    const { searchValue, clearSearch } = this.props;

    if (results.length <= 0) {
      return (
        <div className="container mt-4">
          <p>
            We couldn&#39;t find any articles for: &nbsp;
            {searchValue}
          </p>
        </div>
      );
    }
    return (
      <div className="container mt-4">
        <div className="mb-4">
          <strong className="text-muted">
            Results for:&nbsp;
            {searchValue}
          </strong>
        </div>
        {results.map(item => (
          <div key={item.path} className="card mb-4">
            <div className="card-block">
              <h2 className="h2 title">
                <Link to={item.path} onClick={clearSearch}>
                  {item.title}
                </Link>
              </h2>
              <p>{item.shortDescription}</p>
              <div style={{ marginBottom: '20px' }}>
                {item.tags.map(tag => (
                  <Link className="article-tag" key={tag} to={`/tags/${slugify(tag)}/`} onClick={clearSearch}>
                    {tag}
                  </Link>
                ))}
              </div>
              <ReadMoreLink to={item.path} onClick={clearSearch}>
                Go to Article
              </ReadMoreLink>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

SearchResults.propTypes = {
  searchValue: PropTypes.string.isRequired,
  clearSearch: PropTypes.func.isRequired,
};

export default SearchResults;
