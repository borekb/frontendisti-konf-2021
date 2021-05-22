// @ts-check
import * as React from 'react';
import Link from 'next/link';

import Layout from '../../components/layout';

const BlogPostTemplate = ({ post }) => {
  return (
    <Layout>
      <article className='blog-post' itemScope itemType='http://schema.org/Article'>
        <header>
          <h1 itemProp='headline'>{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} itemProp='articleBody' />
        <hr />
        <footer></footer>
      </article>
      <nav className='blog-post-nav'>
        <Link href={String(Number(post.fields.slug) - 1)}>
          <a className='plain-link'>←</a>
        </Link>{' '}
        <Link href={String(Number(post.fields.slug) + 1)}>
          <a className='plain-link'>→</a>
        </Link>
      </nav>
    </Layout>
  );
};

export default BlogPostTemplate;

async function getPost(id) {
  const res = await fetch(`${process.env.API_ROOT}/post/${id}`);
  return await res.json();
}
