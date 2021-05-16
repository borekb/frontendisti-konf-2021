import { serve, ServerRequest } from 'https://deno.land/std@0.96.0/http/server.ts';
import { match as pathToRegexpMatch, MatchResult } from 'https://deno.land/x/path_to_regexp@v6.2.0/index.ts';
import { faker } from 'https://deno.land/x/deno_faker@v1.0.3/locale/en.ts';
import { sleep } from 'https://deno.land/x/sleep@v1.2.0/mod.ts';

const howManyPosts = 3;
const delayInSeconds = Math.random();

const PORT = 5001;
const server = serve({ port: PORT });
console.log(`🚀 Server is running on http://localhost:${PORT}`);

const routes: Route[] = [
  { name: 'post', path: '/posts/:id', handler: handlePost },
  { name: 'posts', path: '/posts', handler: handlePosts },
  { name: 'postIds', path: '/postIds', handler: handlePostIds },
];

async function handlePost(req: ServerRequest, match: MatchResult<{ id: string }>) {
  const post = await getPost(match.params.id);
  req.respond({
    body: JSON.stringify(post),
  });
}

async function handlePosts(req: ServerRequest) {
  // const posts = await Promise.all([...Array(howManyPosts).keys()].map((postId) => getPost(String(postId))));
  // Slow sequential resolution is intentional; no Promise.all!
  const ids = [...Array(howManyPosts).keys()];
  const posts = [];
  for (const id of ids) {
    posts.push(await getPost(String(id)));
  }
  req.respond({
    body: JSON.stringify(posts),
  });
}

async function handlePostIds(req: ServerRequest) {
  const posts = [...Array(howManyPosts).keys()].map((postId) => ({slug: String(postId)}));
  req.respond({
    body: JSON.stringify(posts),
  });
}

async function getPost(id: string) {
  await sleep(delayInSeconds);
  return {
    frontmatter: {
      title: `Post ${id}`,
      date: new Intl.DateTimeFormat('cs-CZ').format(faker.date.past()),
      description: faker.lorem.sentence(),
    },
    fields: {
      slug: id,
    },
  }
}

for await (const req of server) {
  router(req);
}

function router(req: ServerRequest) {
  for (let route of routes) {
    const match = pathToRegexpMatch(route.path)(req.url);
    if (match) {
      return route.handler(req, match);
    }
  }
  req.respond({ body: 'Route Not Found!' });
}

interface Route {
  name: string;
  path: string;
  handler: (req: ServerRequest, match: MatchResult<any>) => Promise<void>;
}
