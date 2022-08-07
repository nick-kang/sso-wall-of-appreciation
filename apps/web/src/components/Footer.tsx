import { Box, Link } from '@chakra-ui/react'

export function Footer(): JSX.Element {
  return (
    <Box textAlign="center" color="muted" fontSize="sm">
      <Link
        color="blue.500"
        href="https://github.com/nick-kang/sso-wall-of-appreciation"
        rel="noreferrer noopener"
      >
        sso-wall-of-appreciation
      </Link>{' '}
      is an open source project maintained by{' '}
      <Link
        color="blue.500"
        href="https://github.com/nick-kang"
        rel="noreferrer noopener"
      >
        nick-kang
      </Link>
    </Box>
  )
}
