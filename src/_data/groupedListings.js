// src/_data/groupedListings.cjs
const fetchListings = require("./sanityListings.cjs"); // same dir

module.exports = async function() {
  const listings = await fetchListings();
  const counts = {};

  return listings.map(item => {
    const base = item.address;
    counts[base] = (counts[base] || 0) + 1;
    return {
      ...item,
      slug: counts[base] === 1
        ? base
        : `${base}_${counts[base]}`
    };
  });
};
