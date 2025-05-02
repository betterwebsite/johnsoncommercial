if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lgrua1a8',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  token: process.env.SANITY_READ_TOKEN
});

module.exports = client;