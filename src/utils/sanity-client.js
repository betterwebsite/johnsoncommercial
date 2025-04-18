const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lgrua1a8',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

module.exports = client;