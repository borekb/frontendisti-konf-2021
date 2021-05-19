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
      </article>
      <div>
        <Link href={String(Number(post.fields.slug) - 1)}>
          <a className='plain-link'>←</a>
        </Link>
        {' '}
        <Link href={String(Number(post.fields.slug) + 1)}>
          <a className='plain-link'>→</a>
        </Link>
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;

export async function getStaticProps({ params: { slug } }) {
  console.log(`pages/[slug].jsx: running getStaticProps({slug: ${slug}})`);
  return {
    props: {
      post: await getPost(slug),
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  console.log(`pages/[slug].jsx: running getStaticPaths`);
  const postIds = (await getPostIds()).slice(0, 10);
  return {
    paths: postIds.map((postId) => ({
      params: { slug: String(postId) },
    })),
    fallback: 'blocking',
  };
}

async function getPost(id) {
  const res = await fetch(`http://localhost:5001/posts/${id}`);
  const post = await res.json();
  return post;
}

async function getPostIds() {
  const res = await fetch('http://localhost:5001/postIds');
  const postIds = await res.json();
  return postIds;
}
