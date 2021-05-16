// @ts-check

import * as React from 'react';

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
    </Layout>
  );
};

export default BlogPostTemplate;

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      post: await getPost(slug),
    },
  };
}

export async function getStaticPaths() {
  const postIds = await getPostIds();
  return {
    paths: postIds.map((postId) => ({
      params: postId,
    })),
    fallback: false,
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
