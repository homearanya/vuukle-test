const _ = require('lodash');
const Promise = require('bluebird'); // eslint-disable-line
const path = require('path');
const fs = require('fs');
const slug = require('slug');
const { createFilePath } = require('gatsby-source-filesystem'); // to check relative path
const { fmImagesToRelative } = require('gatsby-remark-relative-images'); // frontmatter netlify cms image paths

let numberPages = 0;

exports.onCreateNode = ({ node, actions, getNode }) => {
  fmImagesToRelative(node); // convert image paths for gatsby images
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    let value = createFilePath({ node, getNode });
    value = value.replace('/articles/', '/');
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  // [START] NEW Articles Promise
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          articlesQuery: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/src/content/articles/" } }) {
            edges {
              node {
                fields {
                  slug
                }
                id
                html
                frontmatter {
                  path
                  category
                  tags
                  title
                  shortDescription
                }
              }
            }
          }
          categoriesQuery: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/src/content/categories/" } }) {
            edges {
              node {
                frontmatter {
                  title
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          /* eslint no-console: "off" */
          console.log(result.errors);
          reject(result.errors);
        }

        // No errors -> go thought articles and categories
        const { edges: articles } = result.data.articlesQuery;
        const { edges: categories } = result.data.categoriesQuery;
        // Create search file
        // filter articles html from code, preformatted text, hmlt tags, $...; and urls
        // let searchData = JSON.stringify(articles);
        let searchData = JSON.stringify(articles)
          .replace(/<code.*?>.*?<\/code>/gi, '')
          .replace(/<pre.*?>.*?<\/pre>/gi, '')
          .replace(/<.*?>/gi, '')
          .replace(/\\n/gi, ' ')
          .replace(/\&\S*?\;/gi, '')
          .replace(/(https|http)?:\/\/(www\.|\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi, '');
        fs.writeFile('./static/search-data.json', searchData, err => {
          if (err) return console.log('Creating searchData.js error: ', err);
          return console.log('searchData.js creating successful');
        });
        // Create Articles Pages
        articles.forEach(edge => {
          const { id, fields, frontmatter } = edge.node;
          createPage({
            path: frontmatter.path || fields.slug, // if article path inform I will use that. Otherwise generated slug from title
            tags: frontmatter.tags,
            component: path.resolve('./src/templates/blog-post.js'),
            // additional data can be passed via context
            context: {
              id,
            },
          });
        });
        // Create Categories Pages
        categories.forEach(edge => {
          const { frontmatter } = edge.node;
          const categoryPath = `/categories/${slug(frontmatter.title.toLowerCase())}/`;
          createPage({
            path: categoryPath,
            component: path.resolve('./src/templates/category.js'),
            // additional data can be passed via context
            context: {
              category: frontmatter.title,
            },
          });
        });
        // Create Category list Page - Home Page

        createPage({
          path: '/',
          component: path.resolve('./src/templates/categories-list.js'),
          context: {},
        });
        // Create Tags Pages

        // Tag pages:
        let tags = [];
        // Iterate through each post, putting all found tags into `tags`
        articles.forEach(edge => {
          if (_.get(edge, `node.frontmatter.tags`)) {
            tags = tags.concat(edge.node.frontmatter.tags);
          }
        });
        // Eliminate duplicate tags
        tags = _.uniq(tags);

        // Make tag pages
        tags.forEach(tag => {
          const tagPath = `/tags/${slug(tag.toLowerCase())}/`;

          createPage({
            path: tagPath,
            component: path.resolve(`src/templates/tag.js`),
            context: {
              tag,
            },
          });
        });
      })
    );
    // [END] NEW Articles Promise
  });
};

// Add slashes to pages if needed
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  const formatURL = url => {
    if (typeof url !== 'string') return url;
    if (url.lastIndexOf('/') === url.length - 1) return url;
    return `${url}/`;
  };
  return new Promise(resolve => {
    // Remove trailing slash
    const newPage = Object.assign({}, page, {
      path: page.path === '/' ? page.path : formatURL(page.path),
    });

    if (newPage.path !== page.path) {
      // Remove the old page
      deletePage(page);
      // Add the new page
      createPage(newPage);
    }

    resolve();
  });
};
