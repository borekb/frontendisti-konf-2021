import express from 'express';
import faker from 'faker';

// ---------------------
// "CMS" 😄

async function getPost(id: string) {
  await sleep(latencyInSeconds);

  switch (id) {
    case '1':
      return {
        frontmatter: {
          title: 'Post 1',
          date: '12/20/2020',
          description: 'Quisquam recusandae alias consequuntur corporis repellat ratione ut sunt qui.',
        },
        fields: {
          slug: '1',
        },
        html: '<p>Ut libero qui recusandae ut nulla. Ipsam nobis cupiditate sed dignissimos debitis. Accusantium sed libero repudiandae.</p>\n<p><img alt="Test image" src="https://picsum.photos/id/101/600/400"></p>\n<p>Natus et eos itaque velit omnis. Porro ut et ipsam explicabo eligendi occaecati debitis et. Eum dicta eum eaque enim ipsum inventore debitis libero aspernatur. Quam tempore a velit provident velit eligendi.</p>\n<p>Qui nobis repellendus fugiat velit. Aperiam placeat fuga. Distinctio placeat ullam minima ducimus temporibus modi aut architecto ducimus. Voluptates explicabo exercitationem ut quis sed.</p>',
      };

    case '2':
      return {
        frontmatter: {
          title: 'Post 2',
          date: '12/13/2020',
          description: 'Accusantium non unde rerum.',
        },
        fields: {
          slug: '2',
        },
        html: '<p>Quam voluptatem sit sequi sed cumque. Sed ullam atque ut harum dolorum illum. Nobis dolores et excepturi officia sit quisquam. Quaerat at unde dolores voluptate nulla dolor beatae ut.</p>\n<p><img alt="Test image" src="https://picsum.photos/id/102/600/400"></p>\n<p>Et quis molestiae fugit aspernatur. Consequuntur dolores mollitia error. Modi odit assumenda eius. Aliquid dolorem totam consequatur sed totam rerum. Atque autem quas nam iure laborum autem doloribus.</p>\n<p>Neque ratione cumque. Delectus molestias et eius necessitatibus asperiores nisi ipsam similique. Molestiae consequatur iusto ex omnis. Sed ad tenetur quibusdam perspiciatis vel. Hic consequatur qui.</p>',
      };

    default:
      faker.seed(Number(id));

      return {
        frontmatter: {
          title: `Post ${id}`,
          date: new Intl.DateTimeFormat('en-US').format(faker.date.past()),
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
}

// ---------------------
// Express server

const latencyInSeconds = 1;

const app = express();

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (_, res) => res.json('Hello'));

app.get('/post/:id', async ({ params: { id } }, res) => res.json(await getPost(id)));

app.get('/posts', async (req, res) => {
  const posts = await Promise.all(getNumbers(Number(req.query.limit ?? 10)).map(postId => getPost(String(postId))));
  return res.json(posts);
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Backend is running at https://localhost:${port}`);
});

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function getNumbers(howMany: number) {
  return Array.from(new Array(howMany), (_, i) => i + 1);
}
