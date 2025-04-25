// Migration script to move property_type values to property_types array
// Run this script with: sanity exec <filename.js>

import { createClient } from '@sanity/client'

// Configure your Sanity client with the admin token
const client = createClient({
  projectId: 'lgrua1a8',
  dataset: 'production',
  token: 'skaCiwF5BcBz14h04jGaWhiYnUjMsDmFv6V78UBFtY9xEzXG5yaPB0K0KfGFQyc6oAL4WOQcLUJ9pL4niYgwzt3UaKnCkkKE0qjcOuUYswYKIc6D41jRFwXSsqltRIaOlaGaYfrIdL1uywRc3qzpPRpxbKrsuSdtJ75odlXZDVEJVA3KmskN',
  apiVersion: '2023-05-03', // Use a recent API version
  useCdn: false
})

// Main migration function
async function migratePropertyTypes() {
  // Fetch all listing documents that have a property_type field
  const documents = await client.fetch(
    `*[_type == "listing" && defined(property_type)]`
  )

  console.log(`Found ${documents.length} listings to migrate`)

  // Process each document
  const transaction = client.transaction()
  
  for (const doc of documents) {
    // Get current property_type value
    const propertyType = doc.property_type
    
    // Create or update property_types array
    // If property_types already exists, add the property_type if not already included
    const propertyTypes = Array.isArray(doc.property_types) 
      ? doc.property_types.includes(propertyType) 
        ? doc.property_types  // Don't modify if already includes the value
        : [...doc.property_types, propertyType]  // Add if not already included
      : [propertyType]  // Create a new array with just this value
    
    // Patch the document to update property_types
    transaction.patch(doc._id, {
      set: { property_types: propertyTypes }
    })
    
    console.log(`Migrating document ${doc._id}: ${doc.address || 'Unnamed listing'}`)
    console.log(`- Moving "${propertyType}" to property_types array`)
  }

  // Commit the transaction
  console.log('Committing transaction...')
  await transaction.commit()
  console.log('Migration completed successfully!')
}

// Execute the migration
migratePropertyTypes().catch(err => {
  console.error('Migration failed:')
  console.error(err)
  process.exit(1)
})