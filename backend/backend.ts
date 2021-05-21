import express from 'express';
import faker from 'faker';

// -------------
// Tune these:
const totalPosts = 300;
const postsOnHomepage = 3;
const latencyInSeconds = 1;

const app = express();

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (_, res) => res.json('Hello'));

app.get('/post/:id', async ({ params: { id } }, res) => res.json(await getPost(id)));

app.get('/posts', async (_, res) => {
  const posts = await Promise.all(getNumbers(postsOnHomepage).map((postId) => getPost(String(postId))));
  return res.json(posts);
});

app.get('/postIds', (_, res) => res.json(getNumbers(totalPosts)));

app.listen(5001, () => {
  console.log(`Backend is running at https://localhost:5001`);
});

async function getPost(id: string) {
  await sleep(latencyInSeconds);
  faker.seed(Number(id));
  return {
    frontmatter: {
      title: `Post ${id}`,
      date: new Intl.DateTimeFormat('cs-CZ').format(faker.date.past()),
      description: faker.lorem.sentence(),
    },
    fields: {
      slug: id,
    },
    html: faker.fake(`
      <p>{{lorem.paragraph}}</p>
      <p><img alt="Test image" src="https://picsum.photos/id/${100 + Number(id)}/600/400"></p>
      <p>{{lorem.paragraph}}</p>
      <p>{{lorem.paragraph}}</p>`),
  };
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function getNumbers(howMany: number) {
  return Array.from(new Array(howMany), (_, i) => i + 1);
}
