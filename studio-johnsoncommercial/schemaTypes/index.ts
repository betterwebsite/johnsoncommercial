// schemas/index.js - Main schema file that imports and exports all the types
import {listingType} from './listings'
import {buildingType} from './building'
import {priceType} from './price'
import {miscType} from './misc'
import {locationType} from './location'
import {contentSectionType} from './contentSection'

export const schemaTypes = [
  // Document types
  listingType,
  // Object types
  buildingType,
  priceType,
  miscType,
  locationType,
  contentSectionType,
]