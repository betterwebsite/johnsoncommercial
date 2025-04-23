import React, {useState} from 'react'
import {TextInput} from '@sanity/ui'
import type {NumberInputProps} from 'sanity'
import {set, PatchEvent} from 'sanity'

export default function FlexibleNumberInput({value, onChange}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(value?.toString() ?? '')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    setLocalValue(input)

    const parsed = Number(input)
    if (!isNaN(parsed)) {
      onChange(PatchEvent.from(set(parsed)))
    }
  }

  return (
    <TextInput
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder="Enter any number"
    />
  )
}
