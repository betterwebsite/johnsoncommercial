import React, {useState} from 'react'
import {TextInput} from '@sanity/ui'
import type {StringInputProps} from 'sanity'
import {set, PatchEvent} from 'sanity'

export default function CurrencyInputRate({value, onChange}: StringInputProps) {
  const [localValue, setLocalValue] = useState<string>(value ?? '')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value

    // Remove existing $ and commas for reformatting
    const cleaned = input.replace(/\$/g, '').replace(/,/g, '')

    // Find the first numeric group (allows decimals)
    const match = cleaned.match(/(\d+(\.\d+)?)/)

    if (match) {
      const original = match[1]
      const numeric = parseFloat(original)

      if (!isNaN(numeric)) {
        const formatted = `$${numeric.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`

        // Replace original number with formatted version
        input = cleaned.replace(original, formatted)
      }
    }

    setLocalValue(input)
    onChange(PatchEvent.from(set(input)))
  }

  return (
    <TextInput
      value={localValue}
      onChange={handleChange}
      placeholder="$0.00 Per SF/Mo"
    />
  )
}
