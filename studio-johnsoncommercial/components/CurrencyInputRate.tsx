import React, {useState} from 'react'
import {TextInput} from '@sanity/ui'
import type {StringInputProps} from 'sanity'
import {set, PatchEvent} from 'sanity'

export default function CurrencyInputRate({value, onChange}: StringInputProps) {
    const [localValue, setLocalValue] = useState<string>(value ?? '')
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let input = event.target.value
  
      // Find the first valid number, including decimals
      const match = input.match(/(\d+(\.\d{0,2})?)/)
  
      if (match) {
        const original = match[1]
        const numeric = parseFloat(original)
  
        if (!isNaN(numeric)) {
          const formatted = `$${numeric.toLocaleString(undefined, {
            minimumFractionDigits: original.includes('.') ? 2 : 0,
            maximumFractionDigits: 2,
          })}`
  
          // Replace only the matched number with the formatted value
          input = input.replace(original, formatted)
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
