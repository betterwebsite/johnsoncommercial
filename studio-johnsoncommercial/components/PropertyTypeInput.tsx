import {Stack, Select} from '@sanity/ui'
import {set, unset, PatchEvent, useFormValue} from 'sanity'
import React from 'react'
import type {StringInputProps} from 'sanity'

const options = [
  'Industrial', 'Land', 'Medical', 'Office', 'Retail', 'Special Purpose', 'Residential'
]

export default function PropertyTypeInput(props: StringInputProps) {
  const {value, onChange} = props
  const currentTypes = (useFormValue(['property_types']) as string[]) || []

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value

    // Create patches
    const patches = []

    // Patch for the current string field
    patches.push(newValue ? set(newValue) : unset())

    // Patch sibling field if needed
    if (newValue && !currentTypes.includes(newValue)) {
      patches.push(set([...currentTypes, newValue], ['property_types']))
    }

    // Send all patches at once
    onChange(PatchEvent.from(patches))
  }

  return (
    <Stack space={2}>
      <Select value={value} onChange={handleChange}>
        <option value="">Select a property type</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
    </Stack>
  )
}
