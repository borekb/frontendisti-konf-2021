import * as React from 'react';
import Link from 'next/link';
import Layout from '../components/layout';

const BlogIndex = ({ siteTitle, posts }) => {
  if (posts.length === 0) {
    return (
      <div>
        <p>No blog posts...</p>
      </div>
    );
  }

  return (
    <Layout>
      <h1>{siteTitle}</h1>
      <ol style={{ listStyle: `none` }}>
        {posts.map((post) => {
          const title = post.frontmatter.title || post.fields.slug;

          return (
            <li key={post.fields.slug}>
              <article className='post-list-item' itemScope itemType='http://schema.org/Article'>
                <header>
                  <h2>
                    <Link href={`post/${post.fields.slug}`}>
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

export async function getStaticProps() {
  return {
    props: {
      siteTitle: '{F} konf demo',
      posts: await getBlogPosts(),
    },
  };
}

async function getBlogPosts() {
  const res = await fetch('http://localhost:5001/posts');
  const posts = await res.json();

  return posts;
}
