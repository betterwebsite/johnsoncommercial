if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { createClient } = require('@sanity/client');

const token = process.env.SANITY_READ_TOKEN;
const client = createClient({
  projectId: 'lgrua1a8',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: !token,
  token,
});

module.exports = client;