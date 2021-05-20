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

export async function getStaticProps({ params: { id } }) {
  return {
    props: {
      post: await getPost(id),
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  return {
    paths: [...Array(10).keys()].map((id) => ({ params: { id: String(id + 1) } })),
    fallback: 'blocking',
  };
}

async function getPost(id) {
  const res = await fetch(`http://localhost:5001/post/${id}`);
  const post = await res.json();
  return post;
}

async function getPostIds() {
  const res = await fetch('http://localhost:5001/postIds');
  const postIds = await res.json();
  return postIds;
}
