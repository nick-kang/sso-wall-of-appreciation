import { GlobalStyleProps, mode } from '@chakra-ui/theme-tools'

export const styles = {
  global: (props: GlobalStyleProps): any => ({
    body: {
      color: 'default',
      bg: 'bg-canvas',
    },
    '*::placeholder': {
      opacity: 1,
      color: 'muted',
    },
    '*, *::before, &::after': {
      borderColor: mode('gray.200', 'gray.700')(props),
    },
  }),
}
