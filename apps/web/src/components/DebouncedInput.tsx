import { Input, InputProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 250,
  ...props
}: {
  value: string
  onChange: (value: string) => void
  debounce?: number
} & Omit<InputProps, 'onChange'>): JSX.Element {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [debounce, onChange, value])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e): void => setValue(e.target.value)}
    />
  )
}

// https://github.com/chakra-ui/chakra-ui/issues/2269#issuecomment-712935052
DebouncedInput.id = 'Input'
