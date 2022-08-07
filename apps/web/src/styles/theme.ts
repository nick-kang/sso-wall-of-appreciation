import 'focus-visible/dist/focus-visible'

import { extendTheme, theme as baseTheme } from '@chakra-ui/react'

import * as components from './components'
import * as foundations from './foundations'

const theme: any = extendTheme({
  ...foundations,
  colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
  components: { ...components },
  space: {
    '4.5': '1.125rem',
  },
})

export default theme
