// @ts-check
import * as React from 'react';
import Link from 'next/link';

import Layout from '../components/layout';

const BlogIndex = ({ posts = [] }) => {
  if (posts.length === 0) {
    return (
      <Layout>
        <p>No blog posts found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug;

          return (
            <li key={post.fields.slug}>
              <article className='post-list-item' itemScope itemType='http://schema.org/Article'>
                <header>
                  <h2>
                    <Link href={'post/' + post.fields.slug}>
                      <a>
                        <span itemProp='headline'>{title}</span>
                      </a>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp='description'
                  />
                </section>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default BlogIndex;

async function getPosts() {
  const res = await fetch(`${process.env.API_ROOT}/posts?limit=3`);
  return await res.json();
}
