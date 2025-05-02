// const sanityClient = require('../utils/sanity-client')
// const { sanityClient } = require('@sanity/client')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');
const client = require("../utils/sanity-client");
// const token = process.env.SANITY_READ_TOKEN;
// const client = createClient({
//   projectId: 'lgrua1a8',
//   dataset: 'production',
//   apiVersion: '2023-05-03',
//   useCdn: !token,
//   token,
// });

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source).url();

module.exports = async function() {
  const filter = `*[_type == "listing" && !(_id match "drafts.*")]`
  const projection = `{
  _id,
    address,
    gallery[] {
    "url": asset->url
  },
    listing_type,
    property_type,
    pdf_name,
    pdf {
    "url": asset->url
  },
  pdfs[] {
    name,
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
      price_per,
      nnn_rate,
      cam_fee
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
    },
    detailsTable{
      fields[]{
        id,
        value,
        displayName,
        customValue,
        isCustom
      }
    },
    "property_types": coalesce(property_types, []),
    social{
    "url": asset->url
    }
  }`
  
  return await client.fetch(filter+ projection)

}