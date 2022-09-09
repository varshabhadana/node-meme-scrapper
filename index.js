import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';

// importing data from the url
async function getData() {
  const result = await axios.get(
    'https://memegen-link-examples-upleveled.netlify.app/',
  );
  return result.data;
}
// storing the data in a variable
const data = await getData();

// extracting image tag using regular expression
const img = data.match(/<img([\w\W]+?)>/g);

// using map on array of img tag to extract url and creating a new array with first 10 url

const imgUrls = img
  .map((el) => {
    const firsIndex = el.indexOf('"');
    const lastIndex = el.lastIndexOf('"');
    return el.slice(firsIndex + 1, lastIndex);
  })
  .splice(0, 10);

// create new directory
fs.mkdir(path.join(path.resolve(), 'memes'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});
// extracting image data from array and write data into file
async function downloadImage(url, index) {
  const writer = fs.createWriteStream(`memes/0${index + 1}.jpg`);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

imgUrls.forEach(async (element, index) => {
  await downloadImage(element, index);
});
