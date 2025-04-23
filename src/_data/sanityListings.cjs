// const sanityClient = require('../utils/sanity-client')
// const { sanityClient } = require('@sanity/client')
const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');

const client = createClient({
  projectId: 'lgrua1a8',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source).url();

module.exports = async function() {
  const filter = `*[_type == "listing"]`
  const projection = `{
    address,
    gallery[] {
    "url": asset->url
  },
    listing_type,
    property_type,
    pdf {
    "url": asset->url
  },
    image,
    "buildings": buildings[]{
      square_feet,
      lot_size,
      year_built
    },
    price {
      sale_price,
      lease_rate,
      price_per
    },
    misc {
      traffic,
      caprate,
      zoning,
      parcelid
    },
    location {
      city,
      state,
      zipcode,
      lat,
      lng
    },
    description,
    agent_name,
    "additional_images": additional_images[].asset->url,
    sections[] {
      section_name,
      section_description 
    }
  }`

  // const query = `${filter} ${projection}`
  // const query = `${filter}`
  return await client.fetch(filter+ projection)
  // try {
  //   const listings = await client.fetch(query)
  //   return {
  //     listings: listings
  //   }
  // } catch (err) {
  //   console.error('Failed to fetch listings:', err)
  //   return { listings: [] }
  // }
}