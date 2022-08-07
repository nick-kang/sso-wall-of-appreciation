import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react'

export interface BaseFormItemProps {
  children: React.ReactNode
  label?: string | React.ReactNode
  validateStatus?: 'error'
  className?: string
  help?: string
  name?: string
  isRequired?: boolean
  error?: string
}

export function BaseFormItem({
  children,
  className,
  error,
  help,
  isRequired,
  label,
  name,
  validateStatus,
}: BaseFormItemProps): JSX.Element {
  return (
    <FormControl
      isRequired={isRequired}
      className={className}
      isInvalid={validateStatus === 'error'}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {children}
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : help ? (
        <FormHelperText>{help}</FormHelperText>
      ) : (
        <></>
      )}
    </FormControl>
  )
}
