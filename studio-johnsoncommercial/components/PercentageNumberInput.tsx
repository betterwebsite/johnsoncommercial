import React, {useState} from 'react'
import {TextInput} from '@sanity/ui'
import type {StringInputProps} from 'sanity'
import {set, PatchEvent} from 'sanity'

export default function FormattedFloatInput({value, onChange}: StringInputProps) {
  const [localValue, setLocalValue] = useState<string>(value ?? '')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value

    // Remove commas so we can format cleanly
    const cleaned = input.replace(/,/g, '')

    // Find the first number (with optional decimal)
    const match = cleaned.match(/(\d+(\.\d+)?)/)

    if (match) {
      const original = match[1]
      const numeric = parseFloat(original)

      if (!isNaN(numeric)) {
        const formatted = numeric.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })

        input = cleaned.replace(original, formatted)
      }
    }

    setLocalValue(input)
    onChange(PatchEvent.from(set(input))) //  Save formatted string
  }

  return (
    <TextInput
      value={localValue}
      onChange={handleChange}
      placeholder="0.00"
    />
  )
}
