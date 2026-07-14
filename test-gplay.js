const gplay = require('google-play-scraper');

async function test() {
  const list = await gplay.list({
    collection: gplay.collection.TOP_FREE,
    category: gplay.category.GAME,
    num: 2
  });
  console.log(list);
}
test();
