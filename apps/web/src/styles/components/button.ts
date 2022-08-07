import {
  darken,
  GlobalStyleProps,
  mode,
  transparentize,
} from '@chakra-ui/theme-tools'

const baseStyle = {
  ':focus:not(:focus-visible)': {
    boxShadow: 'none',
  },
  borderRadius: 'lg',
  fontWeight: 'medium',
}

const sizes = {
  lg: {
    fontSize: 'md',
  },
  xl: {
    fontSize: 'lg',
    h: '3.75rem',
    minW: '3.75rem',
    px: 7,
  },
}

const variants = {
  ghost: (
    props: GlobalStyleProps,
  ): {
    _active: { bg: string }
    _activeLink: { bg: string }
    _hover: { bg: string }
    color: string
  } => ({
    _active: {
      bg: mode(
        darken('gray.50', 1)(props.theme),
        darken('gray.700', 4)(props.theme),
      )(props),
    },
    _activeLink: {
      bg: mode('gray.100', 'gray.700')(props),
    },
    _hover: {
      bg: mode(
        darken('gray.100', 1)(props.theme),
        darken('gray.700', 4)(props.theme),
      )(props),
    },
    color: 'emphasized',
  }),
  'ghost-on-accent': (
    props: GlobalStyleProps,
  ): {
    _activeLink: { bg: string; color: string }
    _hover: { bg: string }
    color: string
  } => ({
    _activeLink: {
      bg: 'bg-accent-subtle',
      color: 'white',
    },
    _hover: {
      bg: transparentize('brand.500', 0.67)(props.theme),
    },
    color: 'brand.50',
  }),
  link: (
    props: GlobalStyleProps,
  ): {
    _active: { color: string }
    _hover: { color: string; textDecoration: string }
    color: string
  } => {
    if (props.colorScheme === 'gray') {
      return {
        _active: {
          color: 'default',
        },
        _hover: {
          color: 'default',
          textDecoration: 'none',
        },
        color: 'muted',
      }
    }
    return {
      _active: {
        color: mode(
          `${props.colorScheme}.700`,
          `${props.colorScheme}.300`,
        )(props),
      },
      _hover: {
        color: mode(
          `${props.colorScheme}.700`,
          `${props.colorScheme}.300`,
        )(props),
        textDecoration: 'none',
      },
      color: mode(
        `${props.colorScheme}.600`,
        `${props.colorScheme}.200`,
      )(props),
    }
  },
  'link-on-accent': (): any => {
    return {
      _active: {
        color: 'white',
      },
      _hover: {
        color: 'white',
      },
      color: 'brand.50',
      height: 'auto',
      lineHeight: 'normal',
      padding: 0,
      verticalAlign: 'baseline',
    }
  },
  outline: (
    props: GlobalStyleProps,
  ): {
    _active: { bg: string }
    _checked: { bg: string }
    _hover: { bg: string }
    bg: string
    color: string
  } => ({
    _active: {
      bg: mode('gray.100', 'gray.700')(props),
    },
    _checked: {
      bg: mode('gray.100', 'gray.700')(props),
    },
    _hover: {
      bg: mode(
        darken('gray.50', 1)(props.theme),
        transparentize('gray.700', 0.4)(props.theme),
      )(props),
    },
    bg: mode('white', 'gray.800')(props),
    color: 'emphasized',
  }),
  primary: (props: GlobalStyleProps): any =>
    props.theme.components.Button.variants.solid({
      ...props,
      colorScheme: 'brand',
      variant: 'solid',
    }),
  'primary-on-accent': (): any => ({
    _active: { bg: 'brand.100' },
    _hover: { bg: 'brand.100' },
    bg: 'brand.50',
    color: 'brand.600',
  }),
  secondary: (props: GlobalStyleProps): any =>
    props.theme.components.Button.variants.outline({
      ...props,
      colorScheme: 'gray',
      variant: 'outline',
    }),
  'secondary-on-accent': {
    _active: { bg: 'whiteAlpha.200' },
    _hover: { bg: 'whiteAlpha.200' },
    borderColor: 'brand.50',
    borderWidth: '1px',
    color: 'white',
  },
}

export const Button = {
  baseStyle,
  sizes,
  variants,
}
