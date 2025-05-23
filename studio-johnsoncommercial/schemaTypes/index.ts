// schemas/index.js - Main schema file that imports and exports all the types
import {listingType} from './listings'
import {locationType} from './location'
import {contentSectionType} from './contentSection'

export const schemaTypes = [
  // Document types
  listingType,
  // Object types
  locationType,
  contentSectionType,
]